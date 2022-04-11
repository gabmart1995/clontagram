import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities';
import { Users as UsersType, Login as LoginType } from './types';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class AppService {

  private regex = Object.freeze({
    string: (/^[\w\s]{1,25}$/),
    descriptionString: (/^[\w\.\,\s]{1,1000}$/),
    emailString: (/^[a-z\_0-9]+@[a-z]{4,}\.[a-z]{3,}$/),
    onlyNumbers: (/^[0-9]+$/),
    password:  new RegExp( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ ) 
  });

  private ERROR_MESSAGES = Object.freeze({
    required: 'campo requerido',
    email: 'correo inválido',
    min: ( min: number ) => 'minimo ' + min + ' caracteres',
    max: ( max: number ) => 'máximo ' + max + ' caracteres',
    pattern: 'Patrón de datos inválido',
    notMatch: 'La contraseña no coincide',
    patternPass: 'La contrasena debe incluir mayuscula, minusculas y numeros'
  });

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  insertUser( user: UsersType ): Promise<{success: string}> {
    
    return new Promise( async ( 
      resolve, 
      reject: ( reason: { [key: string]: string } ) => void 
    ) => {
      
      const errors: {[key: string]: string} = {};
      
      const errorsMap = new Map<string, string>();

      if ( !this.regex.string.test(user.name) ) {
        errorsMap.set('name', this.ERROR_MESSAGES.pattern);
      }

      if ( !this.regex.string.test(user.surname) ) {
        errorsMap.set('surname', this.ERROR_MESSAGES.pattern);
      }
      
      if ( !this.regex.emailString.test(user.email) ) {
        errorsMap.set('email', this.ERROR_MESSAGES.email);
      }

      if ( user.password.length < 8 ) {
        errorsMap.set('password', this.ERROR_MESSAGES.min(8));
      }

      if ( !this.regex.string.test(user.role) ) {
        errorsMap.set('password', this.ERROR_MESSAGES.patternPass);
      }

      if ( !this.regex.string.test(user.nick) ) {
        errorsMap.set('nick', this.ERROR_MESSAGES.pattern);
      }

      if ( errorsMap.size > 0 ) {

        errorsMap.forEach(( value, key ) => { 
          errors[key] = value;
        })

        reject( errors );

        return;
      }

      try {
        
        // ecripted the pass ...
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
      const errorsMap: Map<string, string> = new Map();

      if ( !this.regex.emailString.test(form.email) ) {
        errorsMap.set('email', this.ERROR_MESSAGES.email);
      }

      if ( form.password.length < 8 ) {
        errorsMap.set('password', this.ERROR_MESSAGES.min(8))
      }

      if ( errorsMap.size > 0 ) {
       
        // console.log( errorsMap );

        errorsMap.forEach(( value, key ) => {
          errors[key] = value
        });

        reject( errors );

        return
      }

      try {
        
        const user = await this.userRepository.findOneOrFail({
          select: [ 'id', 'name', 'surname', 'email', 'createdAt', 'updatedAt', 'role', 'rememberToken' ],
          where: { email: form.email }
        });

        // console.log( user );

        resolve( user );
        
      } catch (error) {
        
        errorsMap.set('general', error.message);

        errorsMap.forEach(( value, key ) => {
          errors[key] = value
        });

        reject( errors );
      }
    });
  }
}
