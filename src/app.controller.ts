import { Controller, Get, Post, Redirect, Render, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { AppService } from './app.service';
import { Images, Users } from './entities'
import { Users as UsersType, Login as LoginType } from './types'

@Controller()
export class AppController {

  constructor( 
    // @InjectRepository(Users)
    //  private readonly userRepository: Repository<Users>,
    
    // @InjectRepository(Images)
    //  private readonly imageRepository: Repository<Images>,
    
    private readonly appService: AppService, 
  ) {
  }

  @Get()
  @Render('index')
  index( @Req() request: Request ) {

    const [ errors ] = request.flash('errors');

    // to show variable in ejs return a object with props what you need
    return {
      title: 'Login',
      csrfToken: request.csrfToken(), // csrf token send to view
      errors
    };
  }


  @Get('/register')
  @Render('register')
  register( @Req() request: Request ) {

    const [ errors ] = request.flash('errors');

    // console.log( errors );

    return {
      title: 'Register',
      csrfToken: request.csrfToken(),
      errors
    };
  }

  @Post('/save')
  async save( @Req() request: Request, @Res() response: Response ) {
    
    const form: UsersType & { _csrf: string } = request.body;
    
    try {
      
      const errors: any = await this.appService.insertUser( form );
      request.flash('errors', errors);
      
      response.redirect('/');

    } catch (errors) {
      
      request.flash('errors', errors);
      response.redirect('/register');
    }
  }

  @Post('/login')
  @Redirect('/', 302)
  login( @Req() request: Request, @Res() response: Response ) {
    
    const form: LoginType & { _csrf: string } = request.body;
    // validate from service
    console.log( form );
  }
}
