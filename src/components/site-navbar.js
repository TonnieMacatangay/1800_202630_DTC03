// Import Firebase authentication tools
import { logoutUser, onAuthReady } from "/src/authentication.js";

// Colour palette
const CREAM = "#feffb3";
const LEAF = "#619252";
const MIST = "#b7dfdf";
const TEAL = "#4d998f";
const DEEP_TEAL = "#024a56";

// Bootstrap dark teal background, white text, cream when hover over
const NAVBAR_COLOURS = `

background-color: ${DEEP_TEAL};
  --bs-navbar-color: #fff; --bs-navbar-hover-color: ${CREAM};
  --bs-navbar-brand-color: #fff; --bs-navbar-brand-hover-color: ${CREAM};
  --bs-navbar-active-color: ${CREAM}; --bs-nav-underline-link-active-color: ${CREAM};
  
  `

// highlight page locator
function cleanPath(path) {
  return path.replace(/(index)?\.html$/, "").replace(/\/$/, "") || "/";

}

class SiteNavbar extends HTMLElement {
  renderNavbar() {
    this.innerHTML = `
            <!-- Navbar: single source of truth -->
            <nav class="sticky-top navbar navbar-expand-lg d-lg-flex d-none d-md-block" style="${NAVBAR_COLOURS}">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">
                        <img src="/images/logo.jpg" height="36" alt="DTC03 App logo">
                        DTC03 App
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto nav-underline">
                            <li class="nav-item">
                                <a class="nav-link" href="/">Home</a>

                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="/write-database.html">Add</a>

                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="/profile.html">Profile</a>
                                
                            </li>

                        </ul>


                        <div class="d-flex align-items-center gap-2 ms-lg-2" id="rightControls">
                            <div class="nav-underline d-flex align-items-center gap-2 my-2 my-lg-0" id="navSearch" role="search">
                                <input id="searchBar" class="form-control d-none d-sm-block w-auto" type="search" placeholder="Search" aria-label="Search">

                            </div>
                            <div id="authControls" class="auth-controls d-flex align-items-center gap-2 my-2 my-lg-0">
                                <!-- populated by JS -->
                            </div>
                        </div>

                    </div>
                </div>
            </nav>
        `;
  }

  constructor() {
    super();
    this.renderNavbar();
    this.highlightCurrentPage(); // Underlines the link for the page you're on
    this.renderAuthControls(); // This will add either login or logout button, depending on whether or not someone is logged in
    
  }
    // Marks the link for the current page as active (cream + underline)
  highlightCurrentPage() {
    const currentPage = cleanPath(window.location.pathname);
    this.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      if (cleanPath(link.getAttribute("href")) === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /**
   * Displays Log in or Log out button in the navbar based on Firebase authentication status.
   * Updates automatically when the user's login status changes.
   * Uses callbacks to detect auth changes and handle the Log out button click.
   */
  renderAuthControls() {
    const authControls = this.querySelector("#authControls"); // Find #authControls inside this navbar

    // Invisible placeholder prevents layout shifting while Firebase checks login status
    authControls.innerHTML = `<div class="btn btn-outline-light" style="visibility: hidden; min-width: 80px;">Log out</div>`;

    // Pass a callback that runs when Firebase reports the login status
    onAuthReady(function (user) {
      // Receives the user object (or null)

      if (user) {
        // User is logged in
        authControls.innerHTML = `<button class="btn btn-outline-light" id="signOutBtn" type="button" style="min-width: 80px;">Log out</button>`;

        const signOutBtn = authControls.querySelector("#signOutBtn");
        signOutBtn.addEventListener("click", logoutUser); // Callback: runs when Log out is clicked
      } else {
        // User is NOT logged in, and gets redirected to login page if user clicks the login button
        authControls.innerHTML = `<a class="btn btn-outline-light" id="loginBtn" href="/login.html" style="min-width: 80px;">Log in</a>`;
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);

function sendToNextPage() {
    searchBar.addEventListener("change", function () {
        let searchQueryString = document.getElementById("searchBar").value.replaceAll(" ", "-");
        console.log(searchQueryString);
        window.location.assign(`search-results.html?search=${searchQueryString}`);
    });
}
sendToNextPage();