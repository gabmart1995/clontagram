import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  
  constructor(
    @InjectRepository(Likes)
    private readonly likeRepository: Repository<Likes>
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
      .where('i.id = :id', { id: imageId })
      .andWhere('u.id = :id', { id: userId })
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
}
