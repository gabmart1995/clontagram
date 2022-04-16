import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities';
import { Users as UsersType } from '../types'
import { regex, ERROR_MESSAGES, getFileName, saveImages } from '../helpers';
import { app } from 'src/main';
import { join } from 'path';

@Injectable()
export class UserService {

  private storagePath = join( 
    process.cwd(), 
    'public', 
    'static', 
    'uploads', 
    'users'  
  );

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>
  ) {}

  /** update the user logged */
  update( form: Partial<Users>, file?: Express.Multer.File ): Promise<{ success: string, user: Partial<Users> }>  {

    return new Promise( async ( resolve, reject: (reason: {[key:string]: string}) => void ) => {

      const errors: {[key:string]: string} = {};
      const errorsMap = this.validatorUsers(form);
    
      // create url of store in db format ipv6
      let url: URL;
      let payload = { ...form };

      if ( file ) {
        
        const errorsFile = this.validateImage(file);

        if (
            (errorsMap.size > 0 && errorsFile.size > 0) || 
            (errorsMap.size > 0 || errorsFile.size > 0) 
          ) {
  
          errorsMap.forEach(( value, key ) => {
            errors[key] = value;
          });
  
          errorsFile.forEach(( value, key ) => {
            errors[key] = value;
          });
          
          // console.log( errors );

          reject( errors );
  
          return;
        }
        
        // create the url
        const fileName = getFileName( file );

        url = new URL('/uploads/users/' + fileName, ( await app.getUrl() ));
        payload.image = url.toString();

        // save to image
        saveImages( file.buffer, join( this.storagePath, fileName ) );

      } else {

        if ( errorsMap.size > 0 ) {

          errorsMap.forEach(( value, key ) => {
            errors[key] = value;
          });

    
          reject( errors );

          return;
        }
      } 

      try {
        
        // console.log( url );

        await this.userRepository.update( payload.id, payload );
      
        resolve({ 
          success: 'Usuario actualizado con exito',
          user: payload
        });

      } catch (error) {
        
        errorsMap.set('general', error.message);

        errorsMap.forEach(( value, key ) => {
          errors[key] = value;
        });

        reject( errors );
      }
    });

  }

  getUserAvatar( id: number ): Promise<string> {
    
    return new Promise( async ( resolve, reject ) => {

      try {
        
        const user = await this.userRepository.findOneOrFail({
          select: ['image'],
          where: { id }
        });
        
        if ( user.image.length === 0 ) {
          resolve( new URL('/image/no-image-icon.png', (await app.getUrl())).toString() )
          return;
        }
        
        resolve( user.image );

      } catch (error) {
        
        console.log( error );

        reject( error );
      }
    });
  }

  /** function of validation of partial users */
  validatorUsers( user: Partial<UsersType> ): Map<string, string> {

    const errorsMap = new Map<string, string>();

    if ( !regex.string.test(user.name) ) {
      errorsMap.set('name', ERROR_MESSAGES.pattern);
    }

    if ( !regex.string.test(user.surname) ) {
      errorsMap.set('surname', ERROR_MESSAGES.pattern);
    }
  
    if ( !regex.string.test(user.role) ) {
      errorsMap.set('password', ERROR_MESSAGES.patternPass);
    }

    if ( !regex.string.test(user.nick) ) {
      errorsMap.set('nick', ERROR_MESSAGES.pattern);
    }
    
    if ( !regex.emailString.test(user.email) ) {
      errorsMap.set('email', ERROR_MESSAGES.email);
    }

    return errorsMap;
  }

  validateImage( file: Express.Multer.File ): Map<string, string> {

    const errorsMap = new Map<string, string>();
    const extensions = ['image/png', 'image/jpeg', 'image/jpg'];
    const limit = 1e6; // notacion cientifica 1000000 = 1e6

    if ( !extensions.includes( file.mimetype ) ) {
      errorsMap.set('image_path', 'Extension de archivo no valido');
    }

    if ( file.size > limit ) {
      errorsMap.set('image_path', 'Maximo 1mb')
    }

    return errorsMap;
  }
}
