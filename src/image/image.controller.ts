import { Controller, UploadedFile,  Get, Post, Render, Req, Session, UseInterceptors, Body, Res, Param, ParseIntPipe, Redirect } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { join } from 'path';
import { deleteImages } from 'src/helpers/helpers';
import { SessionData, Image as ImageType } from 'src/types';
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
    @Session() session: SessionData,
    @Req() request: Request 
  ) {
    
    const [ errors ] = request.flash('errors');
    let image: Partial<ImageType>;

    try {

      image = await this.imageService.getImage( id );
      // console.log( image );

    } catch (error) {
      console.error( error );
    
    }

    return {
      title: 'Image Detail',
      userLogged: session.user,
      image,
      csrfToken: request.csrfToken(),
      errors: errors ? JSON.parse( errors ) : undefined
    };
  }

  @Get('/delete/:id')
  @Redirect('/user')
  async delete(
    @Param('id', ParseIntPipe) imageId: number,
    @Session() session: SessionData,
    @Req() request: Request
  ) {
    const user = session.user;

    try {
      const image = await this.imageService.getImage(imageId);
      
      // console.log(image);
      
      if ( user && ( user.id === image.user.id )) {
        // eliminar la imagen en db y el archivo asociado a la imagen

        const urlSplit = image.imagePath.slice( image.imagePath.indexOf('uploads') ).split('/');
        const path =  join( process.cwd(), 'public', 'static', ...urlSplit );
        
        // console.log({ imagePath: image.imagePath, path });

        await this.imageService.deleteImage( image );
        await deleteImages( path );

        request.flash('errors', JSON.stringify({ success: 'La publicacion ha sido borrada con exito' }));
      }

    } catch (error) {

      console.error( error );
      
      request.flash('errors', JSON.stringify({ general: error.message }));
    }
  }
}
