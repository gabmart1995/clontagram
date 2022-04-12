import { Controller, Get, Render, Req, Session } from '@nestjs/common';
import { Request } from 'express';
import { SessionData } from 'src/types';

@Controller('user')
export class UserController {
    
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
      
      return {
        title: 'Configuration',
        userLogged: session.user,
        csrfToken: request.csrfToken(),
        errors: errors ? JSON.parse(errors) : undefined
      };
    }
}
