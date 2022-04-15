import { Body, Controller, Get, Post, Redirect, Render, Req, Res, Session, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { getDateTime } from 'src/helpers';
import { SessionData, Users as UsersType } from 'src/types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  
  constructor( private userService: UserService ) {}

  @Get()
  @Render('user')
  index( @Session() session: SessionData ) {
  

    // to show variable in ejs return a object with props what you need
    return {
      title: 'User',
      userLogged: session.user
    };
  }

  @Get('/config')
  @Render('user-config')
  async config( @Session() session: SessionData, @Req() request: Request ) {
    
    const [ errors ] = request.flash('errors');
    const userLogged = { ...session.user };

    // get image user
    try {
      const image = await this.userService.getUserAvatar( session.user.id as number );
      userLogged.image = image;

    } catch ( error ) {
      
      userLogged.image = null;
      console.error( error );
    }

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
      
      const { success } = await this.userService.update( data, file );

      request.flash('errors', JSON.stringify({ success }));

    } catch (errors) {

      request.flash('errors', JSON.stringify( errors ));

      response.redirect('/user/config');
    }
  }
}
