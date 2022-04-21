import { Body, Controller, Get, Param, ParseIntPipe, Post,  Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionData } from 'src/types/types';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  
  constructor(
    private readonly commentService: CommentsService
  ) {
  }

  @Post('/save')
  async save(
    @Req() request: Request,
    @Res() response: Response,
    @Body() body: { imageId: string, content: string, _csrf: string },
    @Session() session: SessionData
  ) {

    const data = {
      userId: session.user.id,
      user: session.user,
      imageId: body.imageId,
      content: body.content,
    };

    try {

      const message = await this.commentService.save( data );
      
      request.flash('errors', JSON.stringify( message ));

    } catch ( errors ) {
      
      request.flash('errors', JSON.stringify( errors ));
    }

    response.redirect('/image/detail/' + body.imageId );
  }

  @Get('/delete/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionData,
    @Req() request: Request,
    @Res() response: Response
  ) {

    const comment = await this.commentService.getComment( id );
    
    try {
     
      if ( comment && ( comment.user.id === session.user.id ) ) {  
            
        await this.commentService.deleteComment( comment );
        
        request.flash('errors', JSON.stringify({ success: 'Comentario eliminado correctamente' }));      
      }

    } catch (error) {
      
      console.error( error );

      request.flash('errors', JSON.stringify({ general: error.message }))
    }
    
    response.redirect('/image/detail/' + comment.image.id );
  }
}
