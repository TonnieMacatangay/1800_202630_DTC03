// Import the file that has the authentication helper function we want to use.
// The function we want to use is called "onAuthReady" which returns the login state
import { onAuthReady } from "../authentication.js";

function showName() {
  // Pass a CALLBACK function to run when Firebase finishes checking login status
  onAuthReady(function (user) {
    // Firebase passes the user object (or null)
    if (user) {
      // User is logged in
      const name = user.displayName || user.email; // Use email if name is missing
      document.getElementById("name-goes-here").textContent = name + "!";
    } else {
      // User is NOT logged in
      location.href = "index.html"; // Redirect to login page
    }
  });
}

showName();

class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.renderSearchBar();
  }

  renderSearchBar() {
    this.innerHTML = `
            <!-- Search: single source of truth -->
              <div class="container" style="margin-top: 200px">
                <p class="fs-3">Hi, <span id="name-goes-here">Friend!</span> Got a specific Question? Please ask away!</p>
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
