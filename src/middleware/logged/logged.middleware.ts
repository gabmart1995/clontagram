import { Injectable, NestMiddleware, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionData } from 'src/types';

@Injectable()
export class LoggedMiddleware implements NestMiddleware {
  use( req: Request, res: Response, next: () => void) {

    const session: SessionData = req.session;

    if ( !session.isAuth ) {
      
      res.redirect('/');
      
      return;
    }

    next();
  }
}
