import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities';
import { NoLoggedMiddleware } from './middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [ 
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([ Users ]),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure( consumer: MiddlewareConsumer ) {
    
    // register middlewares
    consumer
      .apply(NoLoggedMiddleware)  
      .forRoutes(
        { path: '/', method: RequestMethod.GET },
        { path: '/register', method: RequestMethod.GET }
      )
  }
}
