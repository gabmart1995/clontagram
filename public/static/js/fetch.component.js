(function () {
  const likesContainer = Array.from( document.querySelectorAll('.likes'));
  
  likesContainer.forEach(( element ) => {
    
    const likeIcon = element.querySelector('.heart');
    const likeCount = element.querySelector('.likesCount');

    const idImage = Number(likeIcon.getAttribute('aria-image-id'));
    let like = likeIcon.getAttribute('aria-like') === 'true';
    
    // set color heart
    likeIcon.style.color = like ? 'red' : 'black';

    // add click event to fetch likes
    likeIcon.addEventListener('click', async ( event ) => {  
      
      try {

        let url = `http://${location.host}/`;
        url += !like ? `like/${idImage}` : `like/dislike/${idImage}`;
        
        const response = await fetch(url);
        const json = await response.json();
        
        console.log( json );
        
        // set color heart and counter
        let value = Number( likeCount.innerText );
        
        value = !like ? ++value : --value;
        
        // like = json.like && value > 0;
        
        likeIcon.style.color = like ? 'red' : 'black';
        likeCount.innerText = value;

      } catch (error) {
        console.error( error );
      }
    });
  });
})();