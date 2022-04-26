import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { CommentsService } from 'src/comments/comments.service';
import { ERROR_MESSAGES, getFileName, regex, saveImages } from 'src/helpers';
import { LikeService } from 'src/like/like.service';
import { app } from 'src/main';
import { Image, Image as ImageType } from 'src/types';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Images } from '../entities'

@Injectable()
export class ImageService {

  private storagePath = join( process.cwd(), 'public', 'static', 'uploads', 'images' );
  
  constructor( 
    @InjectRepository(Images)
    private readonly imageRepository: Repository<Images>
  ) {}

  save( idUser: number,  form: Partial<ImageType>, file: Express.Multer.File ): Promise<{ success: string }> {
        
    return new Promise( async ( resolve, reject ) => {
      
      const errors: { [key: string]: string } = {};
      const errorsForm = this.validateForm( form );
      const errorsFile = this.validateImage( file );
      
      if (
        (errorsForm.size > 0 && errorsFile.size > 0) || 
        (errorsForm.size > 0 || errorsFile.size > 0) 
      ) {
          
          errorsForm.forEach(( value, key ) => {
            errors[key] = value;
          });
          
          errorsFile.forEach(( value, key ) => {
            errors[key] = value;
          });
          
          // console.log( errors );
          
          reject( errors );
          
          return;
      }

      // create the url to image
      const fileName = getFileName( file );
      const url = new URL('/uploads/images/' + fileName, ( await app.getUrl() ));

      form.imagePath = url.toString();

      try {
      
        await this.imageRepository.save( this.imageRepository.create({ 
          ...form, 
          user: { id: idUser } 
          }) 
        );
        await saveImages( file.buffer, join( this.storagePath, fileName ) );

        resolve({ success: 'Imagen subida con exito' });

      } catch ( error ) {

        errorsForm.set('general', error.message);

        errorsForm.forEach(( value, key ) => {
          errors[key] = value;
        });

        reject( errors );
      }
    });
  }

  getImagesUser( pagination: { skip: number } ): Promise<[Images[], number]> {
    
    return new Promise( async ( resolve, reject ) => {

      try {
        
        let [ images, imagesCount ] = await this.imageRepository.findAndCount({
          order: { id: 'DESC' },
          skip: pagination.skip,
          take: 5,
          relations: ['user', 'likes', 'likes.user', 'comments']
        }); 
        

        // iterable asincrono para mapear las imagenes
        for await ( const image of images ) {
          
          // image
          if ( !image.user.image ) {
            image.user.image = new URL('/image/no-image-icon.png', await app.getUrl() ).toString();
          } 
        }

        // console.log( images );
        
        resolve([ images, imagesCount ]);

      } catch (error) {
        reject( error ); 
      
      }
    });  
  } 

  getImage( id: number ): Promise<Images> {

    return new Promise( async ( resolve, reject ) => {

      try {

        const image = await this.imageRepository.findOneOrFail({
          where: { id },
          relations: ['user', 'comments', 'likes', 'likes.user', 'comments.user']
        });

        // console.log( image );

        resolve( image )

      } catch ( error ) {
        
        reject( error );
      }
    });
  }

  getImagesByUser( idUser: number ): Promise<Images[]> {

    return new Promise( async ( resolve, reject ) => {

      try {

        const images = await this.imageRepository.find({
          where: { user: { id: idUser } },
          relations: ['user', 'comments', 'likes', 'likes.user', 'comments.user'],
          order: {
            id: 'DESC'
          }
        });

        // console.log( image );

        resolve( images )

      } catch ( error ) {
        
        reject( error );
      }
    });
  }
  
  validateForm( form: Partial<ImageType> ) {
    
    const errors = new Map<string, string>();

    if ( !regex.descriptionString.test( form.description ) ) {
      errors.set('description', ERROR_MESSAGES.pattern );
    }

    return errors;
  }

  validateImage( file: Express.Multer.File ) {
    
    const errors = new Map<string, string>();
    const extensions = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    // const limit = 1e6; // notacion cientifica 1000000 = 1e6 = 1mb
 
    if ( !file ) {
      errors.set('image_path', ERROR_MESSAGES.fileRequired );
    
    } else {

      if ( !extensions.includes( file.mimetype ) ) {
        errors.set('image_path', ERROR_MESSAGES.notExtentionValid );
      }

      /*if ( file.size > limit ) {
        errorsMap.set('image_path', 'Maximo 1mb')
      }*/
    }

    return errors;
  }
}
