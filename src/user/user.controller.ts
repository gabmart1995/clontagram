import { Body, Controller, Get, Post, Redirect, Render, Req, Res, Session } from '@nestjs/common';
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
  config( @Session() session: SessionData, @Req() request: Request ) {
    
    const [ errors ] = request.flash('errors');
    
    // console.log( session.user );

    return {
      title: 'Configuration',
      userLogged: session.user,
      csrfToken: request.csrfToken(),
      errors: errors ? JSON.parse(errors) : undefined
    };
  }

  @Post('/update')
  async update( 
    @Body() form: Partial<UsersType>, 
    @Req() request: Request, 
    @Res() response: Response, 
    @Session() session: SessionData  
  ) {
    
    // partial permite pasar partes de las propiedades de una interface o tipo
    // sin saltar el compilador 

    const { default: dateTime } = getDateTime();
    const data = Object.freeze({ 
      name: form.name.trim(),
      surname: form.surname.trim(),
      email: form.email.trim(),
      nick: form.nick.trim(),
      updatedAt: dateTime.trim(),
      id: session.user.id as number
     });

    try {
      const message = await this.userService.update( data );

      request.flash('errors', JSON.stringify( message ));

      session.user = data; 

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
