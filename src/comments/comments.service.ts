import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments, Users } from 'src/entities';
import { ERROR_MESSAGES, regex } from 'src/helpers';
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

  getCommentsByImage( imageId: number ) {
    return this.commentRepository.createQueryBuilder('c')
      .innerJoinAndSelect('c.user', 'u')
      .innerJoinAndSelect('c.image', 'i')
      .select([
        'c.id',
        'c.content',
        'c.createdAt',
        'u.nick',
        'u.id',
        'i.id'
      ])
      .where('i.id = :id', { id: imageId })
      .orderBy('c.id', 'DESC')
      .getMany()
  }

  getComment( id: number ) {
    return this.commentRepository.createQueryBuilder('c')
      .innerJoinAndSelect('c.user', 'u')
      .innerJoinAndSelect('c.image', 'i')
      .select([
        'c.id',
        'c.content',
        'c.createdAt',
        'u.nick',
        'u.id',
        'i.id'
      ])
      .where('c.id = :id', { id })
      .getOneOrFail()
  }

  deleteComment( comment: Comments ) {
    return this.commentRepository.remove( comment );
  }

  validateComment( comment: CommentType ) {

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
