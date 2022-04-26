/**
 * @author gabmart1995
 * @link http://ditio.net/2010/05/02/javascript-date-difference-calculation/
 * helper para calcular diferencias de tiempo con JS en el frontend, mejorado
 */
document.addEventListener('DOMContentLoaded', () => {

  const DATE_DIFFERENCES = Object.freeze({

    /**
     * Funcion que calcula la differencia en segundos
     * @param {Date} date1 fecha obtenida en BD
     * @param {Date} date2 fecha actual
     * @returns {number}  retorna la cantidad de segundos transcurridos
     */
      inSeconds: ( date1, date2 = new Date() ) => {
      
      /** milisegundos en segundos: ( 1 * 1000 ) = 1000 => 1e4 */
      const MILISECONDS_FOR_SECOND = 1 * 1000;
    
      let time1 = date1.getTime();
      let time2 = date2.getTime();

      return Number.parseInt( ( time2 - time1 ) / MILISECONDS_FOR_SECOND );
    },


    /**
     * Funcion que calcula la differencia en minutos
     * @param {Date} date1 fecha obtenida en BD
     * @param {Date} date2 fecha actual
     * @returns {number}  retorna la cantidad de minutos transcurridos
     */
      inMinutes: ( date1, date2 = new Date() ) => {
      
      /** milisegundos en un minuto: ( 60 * 1000 ) = 60000 => 6e4 */
      const MILISECONDS_FOR_MINUTE = 60 * 1000;
    
      let time1 = date1.getTime();
      let time2 = date2.getTime();

      return Number.parseInt( ( time2 - time1 ) / MILISECONDS_FOR_MINUTE );
    },

    /**
     * Funcion que calcula la differencia en horas
     * @param {Date} date1 fecha obtenida en BD
     * @param {Date} date2 fecha actual
     * @returns {number}  retorna la cantidad de horas transcurridas
     */
    inHours: ( date1, date2 = new Date() ) => {
      
      /** milisegundos en una hora: ( 3600 * 1000 ) = 3600000 => 36e5 */
      const MILISECONDS_FOR_HOUR = 3600 * 1000;
    
      let time1 = date1.getTime();
      let time2 = date2.getTime();

      return Number.parseInt( ( time2 - time1 ) / MILISECONDS_FOR_HOUR );
    },

    /**
     * Funcion que calcula la differencia en dias
     * @param {Date} date1 fecha obtenida en BD
     * @param {Date} date2 fecha actual
     * @returns {number}  retorna la cantidad de dias transcurridos
     */
    inDays: ( date1, date2 = new Date() ) => {   
      
      /** milisegundos en un dia: ( 24 * 3600 * 1000 ) = 86,400,000 => 864e5 */ 
      const MILISECONDS_FOR_DAY = 24 * 3600 * 1000;
      
      let time1 = date1.getTime();
      let time2 = date2.getTime();

      return Number.parseInt( ( time2 - time1 ) / MILISECONDS_FOR_DAY );
    },

    /**
     * Funcion que calcula la differencia en semanas
     * @param {Date} date1 fecha obtenida en BD
     * @param {Date} date2 fecha actual
     * @returns {number}  retorna la cantidad de semanas transcurridas
     */
    inWeeks: ( date1, date2 = new Date() ) => {

      /** milisegundos en una semana: ( 24 * 3600 * 1000 ) * 7 = 604,800,000 => 6048e5 */ 
      const MILISECONDS_FOR_WEEK = (24 * 3600 * 1000) * 7;

      let time1 = date1.getTime();
      let time2 = date2.getTime();

      return Number.parseInt( ( time2 - time1 ) / MILISECONDS_FOR_WEEK );
    },
    
    /**
     * Funcion que calcula la differencia en meses
     * @param {Date} date1 fecha obtenida en BD
     * @param {Date} date2 fecha actual
     * @returns {number}  retorna la cantidad de meses transcurridos
     */
    inMonths: ( date1, date2 = new Date() ) => {
      
      const months = 12;
      
      let date1Year = date1.getFullYear();
      let date2Year = date2.getFullYear();

      let date1Month = date1.getMonth();
      let date2Month = date2.getMonth();

      return ( date2Month + ( months * date2Year )) - ( date1Month + ( months * date1Year ));
    },
    
    /**
     * Funcion que calcula la differencia en anios
     * @param {Date} date1 fecha obtenida en BD
     * @param {Date} date2 fecha actual
     * @returns {number}  retorna la cantidad de anios transcurridos
     */
    inYears: ( date1, date2 = new Date() ) => ( date2.getFullYear() - date1.getFullYear() )
  });
    
  /**
   * establece la diferencia en el elemento DOM
   * @param {Date} date 
   * @param {number} index 
   */
  const setDate = ( date, index ) => {

    let seconds = DATE_DIFFERENCES.inSeconds( date );
    
    if ( seconds > 59 ) {

      let minutes = DATE_DIFFERENCES.inMinutes( date );

      if ( minutes > 59 ) {

        let hours = DATE_DIFFERENCES.inHours( date );

        if ( hours > 24 ) {

          let days = DATE_DIFFERENCES.inDays( date );

          if ( days > 7 ) {

            let weeks = DATE_DIFFERENCES.inWeeks( date );

            if ( weeks > 4 ) {

              let months = DATE_DIFFERENCES.inMonths( date );

              if ( months > 12 ) {

                let years = DATE_DIFFERENCES.inYears( date );

                elementDates[index].innerText = months === 1 ? 
                  `Hace ${years} anio` : `Hace ${years} anios`;

              } else {

                elementDates[index].innerText = months === 1 ? 
                  `Hace ${months} mes` : `Hace ${months} meses`;   
              }

            } else {

              elementDates[index].innerText = weeks === 1 ? 
                `Hace ${weeks} semana` : `Hace ${weeks} semanas`;
            }

          } else {

            elementDates[index].innerText = days === 1 ? 
              `Hace ${days} dia` : `Hace ${days} dias`; 
          }

        } else {
          
          elementDates[index].innerText = hours === 1 ? 
            `Hace ${hours} hora` : `Hace ${hours} horas`; 
        }


      } else {

        elementDates[index].innerText = minutes === 1 ? 
          `Hace ${minutes} minuto` : `Hace ${minutes} minutos`; 
      }

    } else {

      elementDates[index].innerText = seconds === 1 ? 
        `Hace ${seconds} segundo` : `Hace ${seconds} segundos`;        
    }
  }

  const elementDates = Array.from( document.querySelectorAll('.date')); 
  
  // console.log( elementDates );
  
  if ( elementDates.length > 0 ) {


    const dates = elementDates.map( element => {
      
      console.log( element.innerText );
      
      return new Date( element.innerText );
    });
    
    dates.forEach( setDate );
  }
});