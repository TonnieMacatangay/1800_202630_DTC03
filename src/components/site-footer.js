// Colour palette
const CREAM = "#feffb3";
const LEAF = "#619252";
const MIST = "#b7dfdf";
const TEAL = "#4d998f";
const DEEP_TEAL = "#024a56";


// Bootstrap white text, teal when hover over
const BUTTON_COLOURS = `

--bs-btn-color: #fff; --bs-btn-hover-color: #fff; --bs-btn-hover-bg: ${TEAL};
  --bs-btn-active-color: ${DEEP_TEAL}; --bs-btn-active-bg: ${CREAM};
  
  `
  
  ;


// highlight page locator
function cleanPath(path) {
  return path.replace(/(index)?\.html$/, "").replace(/\/$/, "") || "/";

}



class SiteFooter extends HTMLElement {
  connectedCallback() {
    

    if (!document.getElementById("bootstrap-icons")) {
      document.head.insertAdjacentHTML(
        "beforeend",
        '<link id="bootstrap-icons" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">',
    );}

    this.innerHTML = `
        <footer class="py-4 mt-5 text-center" style="background-color: ${MIST}; color: ${DEEP_TEAL}">
            <p class="mb-0">&copy; 2026 BCIT COMP1800</p>
        </footer>

        <!-- Empty space so the bar never covers the bottom of the page (phones only) -->
        <div class="d-lg-none" style="height: 84px"></div>

        <!-- Phone only bar -->
        <nav class="fixed-bottom d-lg-none" style="background-color: ${DEEP_TEAL}" aria-label="Main">

            <div class="container d-flex gap-2 py-2">
                <a href="/" style="${BUTTON_COLOURS}" class="btn flex-fill d-flex flex-column align-items-center gap-1 py-2">
                    <i class="bi bi-house-door fs-4 lh-1" aria-hidden="true"></i>
                    <span class="small fw-medium">Home</span>
                </a>

                <a href="/search.html" style="${BUTTON_COLOURS}" class="btn flex-fill d-flex flex-column align-items-center gap-1 py-2">
                    <i class="bi bi-search fs-4 lh-1" aria-hidden="true"></i>
                    <span class="small fw-medium">Search</span>
                </a>

                <a href="/write-database.html" style="${BUTTON_COLOURS}" class="btn flex-fill d-flex flex-column align-items-center gap-1 py-2">
                    <i class="bi bi-plus-circle fs-4 lh-1" aria-hidden="true"></i>
                    <span class="small fw-medium">Add</span>
                </a>

                <a href="/profile.html" style="${BUTTON_COLOURS}" class="btn flex-fill d-flex flex-column align-items-center gap-1 py-2">
                    <i class="bi bi-person fs-4 lh-1" aria-hidden="true"></i>
                    <span class="small fw-medium">Profile</span>
                </a>


            </div>
        </nav>
    `;

     // Highlight the button for the page
    const currentPage = cleanPath(window.location.pathname);
    this.querySelectorAll("nav a").forEach((link) => {
      if (cleanPath(link.getAttribute("href")) === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }
}

customElements.define("site-footer", SiteFooter);