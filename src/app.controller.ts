import { Controller, Get, Render, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { AppService } from './app.service';
import { Images, Users } from './entities'

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
  index() {
    // to show variable in ejs return a object with props what you need
    return {
      title: 'Login'
    };
  }

  @Get('/register')
  @Render('register')
  register() {
    return {
      title: 'Register'
    };
  }

  /*@Get('/test')
  async testOrm() {
    
    console.log('test de controller');

    try {
      // locate all users
      const users = await this.userRepository.find({
        order: {
          id: 'DESC'
        }
      });

      const images = await this.imageRepository.find({
        order: {
          id: 'DESC'
        }
      });

      console.log( users );
      console.log( images );
      
    } catch (error) {

        console.error(error);
    }
  }*/
}
