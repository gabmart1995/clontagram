/*
    Pagination component
    web components html
*/

customElements.define('pagination-component', class PaginationComponent extends HTMLElement {
    
    constructor() {
        super();

        // props
        this.registers = this._registers;
        this.page = this._page;
    }

    static get observedAttributes() {
        return ['limit', 'page', 'registers'];
    } 

    // es obligatorio los set y get ya que invocan el attributeChangedCallback
  // cuando cambian de valor

    /** prop limite de paginacion */
    set _limit( val = '' ) {
        return this.setAttribute('limit', val );
    }

    /** prop pagina actual */
    set _page( val = '' ) {
        return this.setAttribute('page', val || '1' );
    }

    /** prop total registrados  */
    set _registers( val = '' ) {
        return this.setAttribute('registers', val );
    }

    get _limit() {
        return this.getAttribute('limit');
    }


    get _page() {
        return this.getAttribute('page');
    }


    get _registers() {
        return this.getAttribute('registers');
    }

    /**
   * funcion que avanza la paginacion
   * @param  {number} index indice de busqueda
   */
  prev( index = 1 ) {

    if ( index < 1 ) {
      index = 1;
      return;
    }

    // this._page = index;
    this.sendPagination( index );
  }

  /**
   * funcion que retrocede la paginacion
   * @param  {number} index indice de busqueda
   */
  next( index = this.limit ) {

    if ( index > +this.limit ) {
      index = this.limit;
      return;
    }

    // this._page = index;
    this.sendPagination( index );
  }

  calculatePages( totalRegisters, pagination = 5 ) {
    
    const limit = Math.ceil( totalRegisters / pagination );
    
    // console.log({ limit, totalRegisters });
    
    return limit;
  }

  /**
   * dispara el evento de paginacion
   * @param  {number} page pagina actual
   * @param  {number} pagination cantidad de registros a tomar
   */
  sendPagination( page, pagination = 5 ) {
    
    let skip = ( +page - 1 ) * pagination;
    
    // console.log({ indexPagination });

    // redirecciona con js pasando el query al backend
    if ( page > 1 ) {

        location = `http://${location.host}/user?page=${page}&skip=${skip}`;

        return;
    }
    
    location = `http://${location.host}/user`;
  }

  /** callback que se dispara al conectar el elemento al DOM */
  connectedCallback() {
    this.limit = this.calculatePages( this._registers );
    this.render();
  }

  /** metodo que escucha el cambio de atributo */
  attributeChangedCallback( name, oldValue, newValue ) {

    // console.log({ name, oldValue, newValue });

    if ( oldValue !== newValue ) {
      this[name] = newValue;
      this.render();
    }
  }

  /** renderiza el elemento de paginacion con los nuevos valores */
  render() {

    this.innerHTML = (`
      <div class="row pt-2">
        <div class="col-sm-6 col-12 text-start">
          Total de registros: <span>${ this.registers }</span>
        </div>
        <div class="col-sm-6 col-12 text-end">
          Página actual: <span>${ +this.page }</span> de <span>${ +this.limit }</span>
        </div>
      </div>

      <nav aria-label="Table navigation" class="mt-2">
          <ul class="pagination justify-content-center">
            <li class="page-item pointer" id="prev">
                <a class="page-link" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item active">
              <a class="page-link">${ +this.page }</a>
            </li>
            <li class="page-item pointer" id="next">
              <a class="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
      </nav>
    `);

    // listeners
    this.querySelector('#prev').addEventListener('click', ( $event ) => this.prev( +this.page - 1 ));
    this.querySelector('#next').addEventListener('click', ( $event ) => this.next( +this.page + 1 ));
  }
});