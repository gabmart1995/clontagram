import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities';
import { Users as UsersType } from '../types'
import { regex, ERROR_MESSAGES } from 'src/helpers';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>
  ) {}

  /** update the user logged */
  update( form: Partial<Users>, file?: Express.Multer.File ): Promise<{ success: string }>  {

    return new Promise( async ( resolve, reject: (reason: {[key:string]: string}) => void ) => {

      const errors: {[key:string]: string} = {};
      const errorsMap = this.validatorUsers(form);
      
      if ( file ) {
        
        const errorsFile = this.validateImage(file);
        
        if (
            (errorsMap.size > 0 && errorsFile.size > 0) || 
            (errorsMap.size > 0 || errorsFile.size > 0) 
          ) {
  
          errorsMap.forEach(( value, key ) => {
            errors[key] = value;
          });
  
          errorsFile.forEach(( value, key ) => {
            errors[key] = value;
          });
          
          console.log( errors );

          reject( errors );
  
          return;
        }
      
      } else {

        if ( errorsMap.size > 0 ) {

          errorsMap.forEach(( value, key ) => {
            errors[key] = value;
          });

    
          reject( errors );

          return;
        }
      } 

      /*try {
        
        // console.log( form );

        await this.userRepository.update(form.id, form);

        resolve({ success: 'Usuario actualizado con exito' });

      } catch (error) {
        
        errorsMap.set('general', error.message);

        errorsMap.forEach(( value, key ) => {
          errors[key] = value;
        });

        reject( errors );
      }*/
    });

  }

  /** function of validation of partial users */
  validatorUsers( user: Partial<UsersType> ): Map<string, string> {

    const errorsMap = new Map<string, string>();

    if ( !regex.string.test(user.name) ) {
      errorsMap.set('name', ERROR_MESSAGES.pattern);
    }

    if ( !regex.string.test(user.surname) ) {
      errorsMap.set('surname', ERROR_MESSAGES.pattern);
    }
  
    if ( !regex.string.test(user.role) ) {
      errorsMap.set('password', ERROR_MESSAGES.patternPass);
    }

    if ( !regex.string.test(user.nick) ) {
      errorsMap.set('nick', ERROR_MESSAGES.pattern);
    }
    
    if ( !regex.emailString.test(user.email) ) {
      errorsMap.set('email', ERROR_MESSAGES.email);
    }

    return errorsMap;
  }

  validateImage( file: Express.Multer.File ): Map<string, string> {

    const errorsMap = new Map<string, string>();
    const extensions = ['image/png', 'image/jpeg', 'image/jpg'];
    const limit = 1e6; // notacion cientifica 1000000 = 1e6

    if ( !extensions.includes( file.mimetype ) ) {
      errorsMap.set('image_path', 'Extension de archivo no valido');
    }

    if ( file.size > limit ) {
      errorsMap.set('image_path', 'Maximo 1mb')
    }

    return errorsMap;
  }
}
