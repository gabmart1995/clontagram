document.addEventListener('DOMContentLoaded', () => {
  
  const like = () => {
    const buttonsLike = document.querySelectorAll('.btn-like');
    
    const handleClick = ( $event ) => {
      
      const element = $event.target;      
      const imageId = element.getAttribute('data-id');
      
      element.classList.replace('btn-like', 'btn-dislike');
      
      console.log({ state: 'dislike', imageId });
      
      // remueve el listener anclado para evitar acumular eventos
      // element.removeEventListener('click', handleClick );

      // vuelve a actualizar los elementos dom por cada cambio de estado
      dislike();
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
  
  const dislike = () => {

    const buttonsDislike = document.querySelectorAll('.btn-dislike');  
    const handleClick = ( $event ) => {

      const element = $event.target;
      const imageId = element.getAttribute('data-id');

      element.classList.replace('btn-dislike', 'btn-like');
      
      console.log({ state: 'like', imageId });
      
      // remueve el listener anclado para evitar acumular eventos
      // element.removeEventListener('click', handleClick );
      
      // vuelve a actualizar los elementos dom por cada cambio de estado
      like();
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

  const fetchData = ( request ) => {
    fetch( request )
  }

  like();
  dislike();
});