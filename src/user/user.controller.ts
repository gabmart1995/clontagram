import { Body, Controller, Get, Post, Render, Req, Res, Session, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { getDateTime } from 'src/helpers';
import { app } from 'src/main';
import { SessionData, Users as UsersType } from 'src/types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  
  constructor( private userService: UserService ) {}

  @Get()
  @Render('home')
  index( @Session() session: SessionData ) {
  

    // to show variable in ejs return a object with props what you need
    return {
      title: 'User',
      userLogged: session.user
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
