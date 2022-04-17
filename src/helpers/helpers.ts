import { writeFile } from "fs/promises";

const regex = Object.freeze({
    string: (/^[\w\s]{1,25}$/),
    descriptionString: (/^[\w\.\,\s]{1,1000}$/),
    emailString: (/^[a-z\_0-9]+@[a-z]{4,}\.[a-z]{3,}$/),
    onlyNumbers: (/^[0-9]+$/),
    password:  new RegExp( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ ) 
});

const ERROR_MESSAGES = Object.freeze({
    required: 'campo requerido',
    email: 'correo inválido',
    min: ( min: number ) => 'minimo ' + min + ' caracteres',
    max: ( max: number ) => 'máximo ' + max + ' caracteres',
    pattern: 'Patrón de datos inválido',
    notMatch: 'La contraseña no coincide',
    patternPass: 'La contrasena debe incluir mayuscula, minusculas y numeros',
    fileRequired: 'archivo requerido',
    notExtentionValid: 'Extension de archivo no valido'
});

function getDateTime() {
    
  const date = new Date();
  let dateTime = "" + date.getFullYear()
  dateTime += "-" + ( date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1) );
  dateTime += "-" + ( date.getDate() > 9 ? date.getDate() : '0' + date.getDate() );
  dateTime += " " + ( date.getHours() > 9 ? date.getHours() : '0' + date.getHours()); 
  dateTime += ":" + ( date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds());
  
  return { default: dateTime };
}

function saveImages( data: Buffer, destination: string ) {
  return writeFile( destination, data );
}

function getFileName( file: Express.Multer.File ): string {
      
  const uniqueSuffix = Date.now() + '-' + Math.round( Math.random() * 1e9 )
  let name = file.fieldname + '-' + uniqueSuffix;

  switch ( file.mimetype ) {
      
      case 'image/png':
          name += '.png';
          break;

      case 'image/jpeg':
          name += '.jpeg';
          break;

      default:
          name += '.jpg';
          break;
  }

  return name;
}

export {
  regex,
  ERROR_MESSAGES,
  getDateTime,
  saveImages,
  getFileName
}