import { Controller, Get, Param, ParseIntPipe, Res,  Session } from '@nestjs/common';
import { Response } from 'express';
import { Likes } from 'src/entities';
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
      let like: Likes;

      try {

        like = await this.likeService.getLike( imageId, id );

        // console.log( like );

        if ( !like ) {

          // devuelve el like guardado
          like = await this.likeService.sendLike( id, imageId );
          
          response.status(201).json({
            like,
            message: 'like actualizado'
          });

            return;
        }
        
      } catch (error) {
        
        console.error( error );

        response.status(500).json({
          error: error.message,
          like
        });

        return;
      }

      response.status(400).json({
        message: 'el like ya existe'
      });
    }

    @Get('/dislike/:image_id')
    async disLike(
      @Session() session: SessionData,
      @Param('image_id', ParseIntPipe) imageId: number,
      @Res() response: Response
    ) {
      
      let like: Likes;
      const { id } = session.user;

      try {

        like = await this.likeService.getLike( imageId, id );

        // console.log( like );
        
        if ( like ) {

          await this.likeService.sendDislike( like.id );
          
          response.status(200).json({
            like,
            message: 'like actualizado'
          });
          
          return;
        }
        
      } catch (error) {
        
        console.error( error );

        response.status(500).json({
          error: error.message
        });

        return;
      }

      response.status(400).json({
        like,
        message: 'el like no existe'
      });
    }
}
