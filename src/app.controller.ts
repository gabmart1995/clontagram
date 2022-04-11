import { Body, Controller, Get, Post, Redirect, Render, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { Users as UsersType, Login as LoginType, SessionData } from './types'

@Controller()
export class AppController {

  constructor( 
    private readonly appService: AppService, 
  ) {}


  @Get()
  @Render('index')
  index( 
    @Req() request: Request, 
    @Session() session: SessionData  
  ) {

    const [ errors ] = request.flash('errors');

    // console.log( session );

    // to show variable in ejs return a object with props what you need
    return {
      title: 'Login',
      csrfToken: request.csrfToken(), // csrf token send to view
      errors: errors ? JSON.parse(errors) : undefined,
      userLogged: session.user || undefined
    };
  }


  @Get('/register')
  @Render('register')
  register( 
    @Req() request: Request, 
    @Session() session: SessionData  
  ) {

    const [ errors ] = request.flash('errors');

    // console.log( errors );

    return {
      title: 'Register',
      csrfToken: request.csrfToken(),
      errors: errors ? JSON.parse(errors) : undefined,
      userLogged: session.user || undefined
    };
  }

  @Post('/save')
  async save( 
    @Body() form: UsersType & { _csrf: string },
    @Req() request: Request, 
    @Res() response: Response 
  ) {
    
    try {
      
      const message = await this.appService.insertUser( form );
      request.flash('errors', JSON.stringify(message));
      
      response.redirect('/');

    } catch ( errors ) {
      
      request.flash('errors', JSON.stringify(errors));
      response.redirect('/register');
    }
  }

  @Post('/login')
  async login( 
    @Body() form: LoginType & { _csrf: string }, 
    @Req() request: Request, 
    @Res() response: Response, 
    @Session() session: SessionData 
  ) {
      
    try {
      
      const user = await this.appService.login( form );
      session.isAuth = true;
      session.user = user;

      session.save(( error ) => {

        if ( error ) {
          console.error( error );
        }

        response.redirect('/')
      });

    } catch (errors) {

      request.flash('errors', JSON.stringify(errors))
      response.redirect('/')
    }
  }

  @Get('/logout')
  logout( 
    @Session() session: SessionData, 
    @Res() response: Response 
  ) {

    if ( session.user ) {
      
      session.destroy(( error ) => {
        
        if ( error ) {
          console.error( error );
        }

        response.redirect('/');
      });
    }
  }
}
