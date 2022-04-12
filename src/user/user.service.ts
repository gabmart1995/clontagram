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

  update( form: Partial<Users> ): Promise<{ success: string }>  {

    return new Promise( async ( resolve, reject: (reason: {[key:string]: string}) => void ) => {

      const errors: {[key:string]: string} = {};
      const errorsMap = this.validatorUsers(form);

      if ( errorsMap.size > 0 ) {

        errorsMap.forEach(( value, key ) => {
          errors[key] = value;
        });

        reject( errors );

        return;
      }

      try {
        
        // console.log( form );

        await this.userRepository.update(form.id, form);

        resolve({ success: 'Usuario actualizado con exito' });

      } catch (error) {
        
        errorsMap.set('general', error.message);

        errorsMap.forEach(( value, key ) => {
          errors[key] = value;
        });

        reject( errors );
      }
    });

  }

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
}
