class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.renderSearchBar();
  }

  renderSearchBar() {
    this.innerHTML = `
            <!-- Search: single source of truth -->
            <div class="container" style="margin-top: 200px">
              <p class="fs-3">Got a specific Question? Please ask away!</p>
              </div>
              <div class="container bg-light row-align-items-center mt-5 mb-5 h-75">
                  <form class="form-inline">
                      <input class="form-control form-control-lg" type="text" placeholder="Type your Question Here:" aria-label="Search">
                      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                  </form>
              </div>
            </div>
            
        `;
  }
}

customElements.define("search-bar", SearchBar);
