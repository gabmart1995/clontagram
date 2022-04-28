import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Render, Req, Res, Session, UploadedFile, UseInterceptors } from '@nestjs/common';
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
  ) {}

  @Get()
  @Render('user/user')
  async index( 
    @Session() session: SessionData, 
    @Req() request: Request, 
    @Query() pagination: { skip: number, page: number } 
  ) {
    
    const [ errors ] = request.flash('errors');
    let images: ImageType[] = [];
    let totalImages: number = 0;

    if ( pagination.page && pagination.skip ) {
      pagination = { skip: Number( pagination.skip ), page: Number( pagination.page ) };
    
    } else {
      pagination = { skip: 0, page: 1 };
    
    }

    // consultamos las imagenes 
    try {      
      [ images, totalImages ] = await this.imageService.getImagesUser(pagination);

    } catch ( error ) {
      console.error( error );
    
    }

    // images.forEach(( image ) => console.log( image ));

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

  // optional params
  @Get('/people/:search?')
  @Render('user/index')
  async people(
    @Session() session: SessionData,
    @Query() pagination: { skip: number, page: number }, 
    @Param('search') search?: string
  ) {

    let users: UsersType[];
    let totalUsers: number;

    // console.log( search );
    
    if ( pagination.page && pagination.skip ) {
      pagination = { skip: Number( pagination.skip ), page: Number( pagination.page ) };
    
    } else {
      pagination = { skip: 0, page: 1 };
    
    }

    try {
      
      [ users, totalUsers ] = await this.userService.getUsers({ skip: pagination.skip, search });

      for await ( const user of users ) {

        delete user.password;
        delete user.role;
        delete user.rememberToken;
        
        if  ( !user.image ) {
          
          const url = new URL( '/image/no-image-icon.png', await app.getUrl() ).toString();
          
          // console.log( url );
          
          user.image = url;
        }
      }

      // console.log({ users, totalUsers });

    } catch (error) {
      
      console.error( error );
    }

    return {
      title: 'people',
      userLogged: session.user,
      users,
      pagination,
      totalUsers
    };
  }

  @Get('/:id')
  @Render('profile')
  async profile(
    @Param('id', ParseIntPipe) idUser: number,
    @Session() session: SessionData
  ) {

    let images: ImageType[];
    let user: UsersType

    try {
      images = await this.imageService.getImagesByUser( idUser );
      user = await this.userService.getUser( idUser );

      delete user.password;
      delete user.role;
      delete user.rememberToken;

      if  ( !user.image ) {
        
        const url = new URL( '/image/no-image-icon.png', await app.getUrl() ).toString();
        
        // console.log( url );
        
        user.image = url;
      }
      
    } catch (error) {
      console.error( error );
    }

    // console.log( user );

    return {
      title: 'profile',
      images,
      userLogged: session.user,
      user
    }
  }
}
