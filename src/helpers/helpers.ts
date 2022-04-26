import { writeFile, unlink } from "fs/promises";

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
    notExtentionValid: 'Extension de archivo no valido',
    onlyNumbers: 'Solo numeros'
});

const DATE_DIFFERENCES = Object.freeze({

    inSeconds: ( date1: Date, date2 = new Date() ) => {
    
    /** milisegundos en segundos: ( 1 * 1000 ) = 1000 => 1e4 */
    const MILISECONDS_FOR_SECOND = 1 * 1000;
  
    let time1 = date1.getTime();
    let time2 = date2.getTime();

    return ( time2 - time1 ) / MILISECONDS_FOR_SECOND;
  },

    inMinutes: ( date1: Date, date2 = new Date() ) => {
    
    /** milisegundos en un minuto: ( 60 * 1000 ) = 60000 => 6e4 */
    const MILISECONDS_FOR_MINUTE = 60 * 1000;
  
    let time1 = date1.getTime();
    let time2 = date2.getTime();

    return ( time2 - time1 ) / MILISECONDS_FOR_MINUTE;
  },

  inHours: ( date1: Date, date2 = new Date() ) => {
    
    /** milisegundos en una hora: ( 3600 * 1000 ) = 3600000 => 36e5 */
    const MILISECONDS_FOR_HOUR = 3600 * 1000;
  
    let time1 = date1.getTime();
    let time2 = date2.getTime();

    return ( time2 - time1 ) / MILISECONDS_FOR_HOUR;
  },

  inDays: ( date1: Date, date2 = new Date() ) => {   
    
    /** milisegundos en un dia: ( 24 * 3600 * 1000 ) = 86,400,000 => 864e5 */ 
    const MILISECONDS_FOR_DAY = 24 * 3600 * 1000;
    
    let time1 = date1.getTime();
    let time2 = date2.getTime();

    return ( time2 - time1 ) / MILISECONDS_FOR_DAY;
  },

  inWeeks: ( date1, date2 = new Date() ) => {

    /** milisegundos en una semana: ( 24 * 3600 * 1000 ) * 7 = 604,800,000 => 6048e5 */ 
    const MILISECONDS_FOR_WEEK = (24 * 3600 * 1000) * 7;

    let time1 = date1.getTime();
    let time2 = date2.getTime();

    return ( time2 - time1 ) / MILISECONDS_FOR_WEEK;
  },
  
  /**
   * Funcion que calcula la differencia en meses
   * @param {Date} date1 fecha obtenida en BD
   * @param {Date} date2 fecha actual
   * @returns {number}  retorna la cantidad de meses transcurridos
   */
  inMonths: ( date1: Date, date2 = new Date() ) => {
    
    const months = 12;
    
    let date1Year = date1.getFullYear();
    let date2Year = date2.getFullYear();

    let date1Month = date1.getMonth();
    let date2Month = date2.getMonth();

    return ( date2Month + ( months * date2Year )) - ( date1Month + ( months * date1Year ));
  },
  
  inYears: ( date1: Date, date2 = new Date() ) => ( date2.getFullYear() - date1.getFullYear() )
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

function deleteImages( path: string ) {
  return unlink( path );
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
  getFileName,
  DATE_DIFFERENCES,
  deleteImages
}