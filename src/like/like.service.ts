import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments, Images, Likes } from 'src/entities';
import { ImageService } from 'src/image/image.service';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  
  constructor(
    @InjectRepository(Likes)
    private readonly likeRepository: Repository<Likes>,    
  ) {

  }

  sendLike( idUser: number, imageId: number ) {
    const like = this.likeRepository.create({ user: { id: idUser }, image: { id: imageId } });
    return this.likeRepository.save( like );
  }

  sendDislike( idLike: number ) {
    const like = this.likeRepository.create({ id: idLike });
    return this.likeRepository.remove( like );
  }

  getLike( imageId: number, userId: number ) {
    return this.likeRepository.createQueryBuilder('l')
      .leftJoinAndSelect('l.user', 'u')
      .leftJoinAndSelect('l.image', 'i')
      .where('i.id = :imageId', { imageId })
      .andWhere('u.id = :userId', { userId })
      .getOne();
  }

  getLikes( imageId: number ) {

    return this.likeRepository.createQueryBuilder('l')
      .leftJoinAndSelect('l.user', 'u')
      .leftJoinAndSelect('l.image', 'i')
      .select(['l.id', 'l.createdAt', 'u.id'])
      .where('i.id = :id', { id: imageId })
      .getMany();
  }

  getLikesPaginate( userId: number, skip: number = 0 ): Promise<[ Likes[], number ]> {
    
    return new Promise( async ( resolve, reject ) => {
      
      try {
        
          const likes = this.likeRepository.findAndCount({
            where: { user: { id: userId } },
            order: { id: 'DESC' },
            relations: [
              'image', 
              'image.likes', 
              'image.comments', 
              'image.user', 
              'image.likes.user'
            ],
            skip,
            take: 5
          });

        resolve( likes );

      } catch (error) {
        console.error( error );

        reject( error );
      }
    });
  }
}
