import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Users } from './entities';
import { Users as UsersType, Login as LoginType } from './types';
import { regex, ERROR_MESSAGES } from './helpers';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  insertUser( user: UsersType ): Promise<{success: string}> {
    
    return new Promise( async ( 
      resolve, 
      reject: ( reason: { [key: string]: string } ) => void 
    ) => {
      
      const errors: { [key: string]: string } = {};
      const errorsMap = this.validatorUsers( user );

      if ( errorsMap.size > 0 ) {
        errorsMap.forEach(( value, key ) => { 
          errors[key] = value;
        });

        reject( errors );

        return;
      }

      try {
        
        // encrypted the pass ...
        const salt = genSaltSync(4);
        user.password = hashSync( user.password, salt );

        // create a copy userEntity to store in db.
        const userEntity = this.userRepository.create( user );
        await this.userRepository.save( userEntity );

        // resolve the promise.
        resolve({ success: 'Usuario registrado con exito' });

      } catch ( error ) {

        errorsMap.set('general', error.message);

        errorsMap.forEach(( value, key ) => { 
          errors[key] = value;
        });

        reject( errors );
      }
    });
  }


  login( form: LoginType ): Promise<Users> {
    
    return new Promise( async ( resolve, reject: ( reason: {[key:string]: string} ) => void ) => {
      
      const errors: {[key: string]: string} = {};
      const errorsMap = this.validatorLogin(form);

      if ( errorsMap.size > 0 ) {
       
        errorsMap.forEach(( value, key ) => {
          errors[key] = value
        });

        reject( errors );

        return;
      }

      try {
        
        const user = await this.userRepository.findOneOrFail({
          select: [ 'id', 'name', 'surname', 'email', 'createdAt', 'updatedAt', 'role', 'rememberToken' ],
          where: { email: form.email }
        });

        // console.log( user );

        resolve( user );
        
      } catch ( error ) {
        
        errorsMap.set('general', error.message);

        errorsMap.forEach(( value, key ) => {
          errors[key] = value
        });

        reject( errors );
      }
    });
  }


  validatorUsers( user: UsersType ): Map<string, string> {

    const errorsMap = new Map<string, string>();

    if ( !regex.string.test(user.name) ) {
      errorsMap.set('name', ERROR_MESSAGES.pattern);
    }

    if ( !regex.string.test(user.surname) ) {
      errorsMap.set('surname', ERROR_MESSAGES.pattern);
    }
    
    if ( !regex.emailString.test(user.email) ) {
      errorsMap.set('email', ERROR_MESSAGES.email);
    }

    if ( user.password.length < 8 ) {
      errorsMap.set('password', ERROR_MESSAGES.min(8));
    }

    if ( !regex.string.test(user.role) ) {
      errorsMap.set('password', ERROR_MESSAGES.patternPass);
    }

    if ( !regex.string.test(user.nick) ) {
      errorsMap.set('nick', ERROR_MESSAGES.pattern);
    }

    return errorsMap;
  }

  validatorLogin( form: LoginType ): Map<string, string> {
    
    const errorsMap = new Map<string, string>();

    if ( !regex.emailString.test(form.email) ) {
      errorsMap.set('email', ERROR_MESSAGES.email);
    }

    if ( form.password.length < 8 ) {
      errorsMap.set('password', ERROR_MESSAGES.min(8))
    }

    return errorsMap;
  }
}
