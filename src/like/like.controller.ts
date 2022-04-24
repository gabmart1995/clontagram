import { Controller, Get, Param, ParseIntPipe, Query, Render, Res,  Session } from '@nestjs/common';
import { Response } from 'express';
import { Likes } from 'src/entities';
import { Like, SessionData } from 'src/types';
import { LikeService } from './like.service';

/** controller de peticiones http desde el frontend  */
@Controller('like')
export class LikeController {
    
    constructor(
        private readonly likeService: LikeService
    ) {}
    
  @Get()
  @Render('likes/index')
  async index(
    @Session() session: SessionData,
    @Query() pagination: { skip: number, page: number }
  ) {
    
    let likes: Like[];
    let totalLikes: number = 0;

    if ( pagination.page && pagination.skip ) {
      pagination = { skip: Number( pagination.skip ), page: Number( pagination.page ) };
    
    } else {
      pagination = { skip: 0, page: 1 };
    
    }

    try {
      [ likes, totalLikes ] = await this.likeService.getLikesPaginate( session.user.id as number, pagination.skip );

    } catch ( error ) {
      console.error( error );

    }

    // likes.forEach( (like) => console.log( like.image.likes ));
    
    return {
      title: 'likes',
      userLogged: session.user,
      likes,
      pagination,
      totalLikes
    };
  }


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
