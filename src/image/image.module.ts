import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggedMiddleware } from 'src/middleware';
import { ImageController } from './image.controller';

@Module({
  controllers: [ImageController]
})
export class ImageModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(LoggedMiddleware)
          .forRoutes(ImageController)
  }
}
