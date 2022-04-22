import { Controller, Get, Param, ParseIntPipe, Res,  Session } from '@nestjs/common';
import { Response } from 'express';
import { SessionData } from 'src/types';
import { LikeService } from './like.service';

/** controller de peticiones http desde el frontend  */
@Controller('like')
export class LikeController {
    
    constructor(
        private readonly likeService: LikeService
    ) {}
    
    @Get('/:image_id')
    async like(
        @Session() session: SessionData,
        @Param('image_id', ParseIntPipe) imageId: number,
        @Res() response: Response
    ) {
      
      const { id } = session.user;
  
      try {

        const like = await this.likeService.getLike( imageId );

        if ( !like ) {
          await this.likeService.sendLike( id, imageId );
          
          response
            .status(201)
            .json({
              like: true,
              message: 'like actualizado'
            });

            return;
        }
        
      } catch (error) {
        console.error( error );

        response
          .status(500)
          .json({
            error: error.message,
            like: false
          });

        return;
      }

      response
        .status(400)
        .json({
          like: false,
          message: 'el like ya existe'
        });
    }

    @Get('/dislike/:image_id')
    async disLike(
      @Param('image_id', ParseIntPipe) imageId: number,
      @Res() response: Response
    ) {
      
      try {

        const like = await this.likeService.getLike( imageId );

        if ( like ) {

          await this.likeService.sendDislike( like.id );
          
          response
            .status(200)
            .json({
              like: false,
              message: 'like actualizado'
            })
          
          return;
        }
        
      } catch (error) {
        
        console.error( error );

        response
          .status(500)
          .json({
            error: error.message,
            like: true
          });

        return;
      }

      response
        .status(400)
        .json({
          like: true,
          message: 'el like no existe'
        });
    }
}
