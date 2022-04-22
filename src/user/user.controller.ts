import { Body, Controller, Get, Post, Query, Render, Req, Res, Session, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { getDateTime } from 'src/helpers';
import { ImageService } from 'src/image/image.service';
import { LikeService } from 'src/like/like.service';
import { app } from 'src/main';
import { Image as ImageType, SessionData, Users as UsersType } from 'src/types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  
  constructor( 
    private userService: UserService, 
    private imageService: ImageService,
    private likeService: LikeService  
  ) {}

  @Get()
  @Render('user')
  async index( 
    @Session() session: SessionData, 
    @Req() request: Request, 
    @Query() pagination: { skip: number, page: number } 
  ) {
    
    const [ errors ] = request.flash('errors');
    let images: ImageType[] = [];
    let totalImages: number = 0;

    pagination = pagination.page && pagination.skip ? { 
      skip: Number( pagination.skip),
      page: Number( pagination.page ) 
    } : { 
      skip: 0, 
      page: 1 
    };

    // consultamos las imagenes 
    try {
      const baseUrl = await app.getUrl();
      
      [ images, totalImages ] = await this.imageService.getImagesUser(pagination);

      // iterable asincrono para mapear las imagenes
      for await ( const image of images ) {
        
        // image
        if ( !image.user.image ) {
          image.user.image = new URL('/image/no-image-icon.png', baseUrl ).toString();
        }
        
        image.likes = await this.likeService.getLikes( image.id ); 
      }

    } catch ( error ) {
      console.error( error );
    }

    images.forEach(( image ) => console.log( image ));

  
    // to show variable in ejs return a object with props what you need
    return {
      title: 'User',
      userLogged: session.user,
      errors: errors ? JSON.parse(errors) : undefined,
      images,
      totalImages,
      pagination
    };
  }

  @Get('/config')
  @Render('config')
  async config( @Session() session: SessionData, @Req() request: Request ) {
    
    const [ errors ] = request.flash('errors');
    const userLogged = { ...session.user as UsersType };

    // get image in path in db user if not exists
    if ( !userLogged.image ) {
      
      try {
        const image = await this.userService.getUserAvatar( session.user.id as number );        
        userLogged.image = image;
        
        // console.log(image)
  
      } catch ( error ) {
        
        userLogged.image = new URL('/image/no-image-icon.png', ( await app.getUrl() )).toString();
        console.error( error );
      }
    }

    // console.log( userLogged );

    return {
      title: 'Configuration',
      userLogged,
      csrfToken: request.csrfToken(),
      errors: errors ? JSON.parse(errors) : undefined
    };
  }


  // partial permite pasar partes de las propiedades de una interface o tipo
  // sin saltar el compilador 
  @Post('/update')
  @UseInterceptors(FileInterceptor('image_path'))
  async update( 
    @UploadedFile() file: Express.Multer.File,
    @Body() form: Partial<UsersType>, 
    @Req() request: Request, 
    @Res() response: Response, 
    @Session() session: SessionData  
  ) {
  
    // console.log({ form, file });
    
    const { default: dateTime } = getDateTime();
    const data = Object.freeze({ 
      name: form.name.trim(),
      surname: form.surname.trim(),
      email: form.email.trim(),
      nick: form.nick.trim(),
      updatedAt: dateTime.trim(),
      id: session.user.id as number,
      image: session.user.image 
     });

    try {
      
      const { success, user } = await this.userService.update( data, file );

      request.flash('errors', JSON.stringify({ success }));

      session.user = user;
      session.save(( error ) => {

        if ( error ) {
          console.error( error );
        }

        response.redirect('/user/config');
      });

    } catch (errors) {

      request.flash('errors', JSON.stringify( errors ));

      response.redirect('/user/config');
    }
  }
}
