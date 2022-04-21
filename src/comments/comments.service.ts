import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments, Images, Users } from 'src/entities';
import { ERROR_MESSAGES, regex } from 'src/helpers';
import { ImageService } from 'src/image/image.service';
import { Repository } from 'typeorm';

type CommentType = { content: string, imageId: string, userId: number, user: Users };


@Injectable()
export class CommentsService {
  
  constructor(
    @InjectRepository( Comments )
    private readonly commentRepository: Repository<Comments>,

  ) {}

  save( comment: CommentType ): Promise<{ success: string }> {
    
    return new Promise( async ( resolve, reject ) => {
      
      const errors: {[key: string]: string} = {};
      const errorsComments = this.validateComment( comment );

      if ( errorsComments.size > 0 ) {

        errorsComments.forEach(( value, key ) => {
          errors[key] = value;
        });

        reject( errors );

        return;
      }

      try {
        
        const commentEntity = this.commentRepository.create({ 
          ...comment, 
          image: { id: +comment.imageId },
          user: { id: comment.user.id }
        });
        
        console.log( commentEntity );

        await this.commentRepository.save( commentEntity );

        resolve({ success: 'el comentario ha sido guardado con exito' });
        
      } catch (error) {
        
        errorsComments.set('general', error.message);
        
        errorsComments.forEach(( value, key ) => {
          errors[key] = value;
        });

        reject( errors );
      }
    });
  }

  validateComment( comment: CommentType) {

    const errors = new Map<string, string>();

    if ( Number.isNaN( comment.userId ) ) {
      errors.set('userId', ERROR_MESSAGES.required);
    }

    
    if ( !regex.onlyNumbers.test( comment.imageId ) ) {
      errors.set('imageId', ERROR_MESSAGES.required);
    }

    if ( !regex.descriptionString.test( comment.content ) ) {
      errors.set('content', ERROR_MESSAGES.pattern);
    }

    return errors;
  }
}
