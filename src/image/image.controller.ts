import { Controller, UploadedFile,  Get, Post, Render, Req, Session, UseInterceptors, Body, Res, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { Images } from 'src/entities';
import { SessionData, Image as ImageType, Users } from 'src/types';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor( private imageService: ImageService ) {}

  @Get('/create')
  @Render('image/create')
  create( @Session() session: SessionData, @Req() request: Request ) {
    
    const [ errors ] = request.flash('errors');

    return {
      userLogged: session.user,
      title: 'Subir imagen',
      csrfToken: request.csrfToken(),
      errors: errors ? JSON.parse(errors) : undefined
    };
  }

  @Post('/save')
  @UseInterceptors(FileInterceptor('image_path'))
  async save(
      @Body() form: Partial<ImageType>,
      @Session() session: SessionData,
      @UploadedFile() file: Express.Multer.File,
      @Req() request: Request,
      @Res() response: Response  
    ) {

    try {
      
      const message = await this.imageService.save( session.user.id as number, form,  file );

      request.flash('errors', JSON.stringify(message));
      response.redirect('/user');

    } catch ( error ) {

      // console.log( error );

      request.flash('errors', JSON.stringify( error ));
      response.redirect('/image/create');
    }

  }

  @Get('/detail/:id')
  @Render('image/detail')
  async getImageDetail( 
    @Param('id', ParseIntPipe ) id: number, 
    @Session() session: SessionData 
  ) {
    
    let image: Images;

    try {

      image = await this.imageService.getImage( id );
      // console.log( image );

    } catch (error) {
      console.error( error );
    
    }

    return {
      title: 'Image Detail',
      userLogged: session.user,
      image
    };
  }
}
