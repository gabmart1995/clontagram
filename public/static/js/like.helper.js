/**
 * @author gabmart1995
 * helper para controlar los likes de cada publicacion
 */

document.addEventListener('DOMContentLoaded', () => {
  
  const url = 'http://localhost:3000';

  /** funcion que asigna los eventos like a sus elementos DOM */
  const like = () => {
    
    const buttonsLike = document.querySelectorAll('.btn-like');

    const handleClick = async ( $event ) => {
      
      const element = $event.target;      
      const numberLikesSpan = element.parentNode.querySelector('.number-likes');
      const imageId = element.getAttribute('data-id');
     
      // console.log({ numberLikes });
      
      try {
        
        const response = await fetch(`${url}/like/dislike/${imageId}`);
        const json = await response.json();
        
        console.log( json );
        
        element.classList.replace('btn-like', 'btn-dislike');

        // remueve el listener anclado para evitar acumular eventos
        // element.removeEventListener('click', handleClick );
        let value = Number(numberLikesSpan.innerText);
        value--;

        numberLikesSpan.innerText = value;

        // vuelve a actualizar los elementos dom por cada cambio de estado
        dislike();

      } catch (error) {
        console.error( error );

      }
      
    };

    // boton like
    buttonsLike.forEach(( element ) => {
      
      // se deben volver a clonar los elementos y reemplazarlos en el DOM  
      // en cada llamada para desvincular los eventos
      // cloneNode: crea una copia del elemento sin los event listeners vinculados al elemento

      const cloneElement = element.cloneNode( false );
      element.parentNode.replaceChild( cloneElement, element );

      cloneElement.addEventListener('click', handleClick );
    });
   }
  
  /** funcion que asigna los eventos dislike a sus elementos DOM */
  const dislike = () => {

    const buttonsDislike = document.querySelectorAll('.btn-dislike');  
    const handleClick = async ( $event ) => {

      const element = $event.target;
      const numberLikesSpan = element.parentNode.querySelector('.number-likes');
      const imageId = element.getAttribute('data-id');

      // console.log({ state: 'like', imageId });
      
      try {

        const response = await fetch(`${url}/like/${imageId}`);
        const json = await response.json();

        console.log( json );

        element.classList.replace('btn-dislike', 'btn-like');
        
        let value = Number(numberLikesSpan.innerText);
        value++;

        console.log( value );

        numberLikesSpan.innerText = value;
        // remueve el listener anclado para evitar acumular eventos
        // element.removeEventListener('click', handleClick );
      
        // vuelve a actualizar los elementos dom por cada cambio de estado
        like();

      } catch (error) {
        console.error( error );  
      
      }
    };

    // boton dislike
    buttonsDislike.forEach(( element ) => {

      // se deben volver a clonar los elementos y reemplazarlos en el DOM  
      // en cada llamada para desvincular los eventos
      // cloneNode: crea una copia del elemento sin los event listeners vinculados al elemento

      const cloneElement = element.cloneNode( false );
      element.parentNode.replaceChild( cloneElement, element );

      cloneElement.addEventListener('click', handleClick );
    });
  }

  like();
  dislike();
});