import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities';
import { Users as UsersType } from './types';

@Injectable()
export class AppService {

  private regex = Object.freeze({
    string: (/^[\w\s]{1,25}$/),
    descriptionString: (/^[\w\.\,\s]{1,1000}$/),
    emailString: (/^[a-z\_0-9]+@[a-z]{4,}\.[a-z]{3,}$/),
    onlyNumbers: (/^[0-9]+$/),
    password:  new RegExp( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ ) 
  });

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    
    // @InjectRepository(Images)
    // private readonly imageRepository: Repository<Images>,
  ) {

  }

  insertUser( user: UsersType ) {
    
    return new Promise( async ( resolve, reject ) => {
      
      const ERROR_MESSAGES = Object.freeze({
        required: 'campo requerido',
        email: 'correo inválido',
        min: ( min ) => 'minimo ' + min + ' caracteres',
        max: ( max ) => 'máximo ' + max + ' caracteres',
        pattern: 'Patrón de datos inválido',
        notMatch: 'La contraseña no coincide',
        patternPass: 'La contrasena debe incluir mayuscula, minusculas y numeros'
      });

      const errors = {};

      const errorsMap = new Map<string, string>();

      if ( !this.regex.string.test(user.name) ) {
        errorsMap.set('name', ERROR_MESSAGES.pattern);
      }

      if ( !this.regex.string.test(user.surname) ) {
        errorsMap.set('surname', ERROR_MESSAGES.pattern);
      }
      
      if ( !this.regex.emailString.test(user.email) ) {
        errorsMap.set('email', ERROR_MESSAGES.email);
      }

      if ( user.password.length < 8 ) {
        errorsMap.set('password', ERROR_MESSAGES.min(8));
      }

      if ( !this.regex.string.test(user.role) ) {
        errorsMap.set('password', ERROR_MESSAGES.patternPass);
      }

      if ( !this.regex.string.test(user.nick) ) {
        errorsMap.set('nick', ERROR_MESSAGES.pattern);
      }

      if ( errorsMap.size > 0 ) {

        errorsMap.forEach(( value, key ) => { 
          errors[key] = value;
        })

        reject( errors );

        return;
      }

      try {
        
        // create a copy userEntity to store in db.
        const userEntity = this.userRepository.create( user );

        await this.userRepository.save( userEntity );

        errorsMap.set('success', 'Usuario registrado con exito');

        errorsMap.forEach(( value, key ) => { 
          errors[key] = value;
        });

        resolve( errors );

      } catch ( error ) {

        errorsMap.set('general', error.message);

        errorsMap.forEach(( value, key ) => { 
          errors[key] = value;
        });

        reject( errors );
      }
    });
  }


  getHello(): string {
    return 'Hello World!';
  }
}
