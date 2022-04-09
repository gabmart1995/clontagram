import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images, Users } from './entities';

@Module({
  imports: [ 
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([ Users, Images ]) 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
