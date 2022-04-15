import { Controller, Get, Render, Session } from '@nestjs/common';
import { SessionData } from 'src/types';

@Controller('image')
export class ImageController {
  
  @Get('/create')
  @Render('image/create')
  create( @Session() session: SessionData ) {
    return {
      userLogged: session.user,
      title: 'subir imagen'
    }
  }
}
