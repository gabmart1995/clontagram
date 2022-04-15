import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { SessionData } from "src/types";

export class FileExceptionFilter implements ExceptionFilter {
    
    catch(exception: HttpException, host: ArgumentsHost) {

        const context = host.switchToHttp();
        const response: Response = context.getResponse();   
        const request: Request = context.getRequest();
        // const status: number = exception.getStatus(); 

        console.log( response );
        // const errorJSON = JSON.parse( request.body );
        
        /*request.flash('errors', JSON.stringify({
            image_path: errorJSON
        }));*/

        response.redirect('/user/config');
    }
}