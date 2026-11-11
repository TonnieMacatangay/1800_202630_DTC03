class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `

            <nav class="navbar bg-body-tertiary fixed-bottom container-fluid p-4">
                <button type="button" class="btn-icon" aria-label="Home" onclick="window.location.href = '/'">
                    <img src="/images/home_icon.svg" width="25" height="25" alt="">
                </button>

                <button type="button" class="btn-icon" aria-label="Search" onclick="window.location.href = 'search.html'">
                    <img src="/images/search_icon.svg" width="25" height="25" alt="">
                </button>

                <button type="button" class="btn-icon" aria-label="Message">
                    <img src="/images/message-text_icon.svg" width="25" height="25" alt="">
                </button>

                <button type="button" class="btn-icon" aria-label="Profile" onclick="window.location.href = '/profile.html'">
                    <img src="/images/profile-circle_icon.svg" width="25" height="25" alt="">
                </button>
            </nav>

            <!-- Footer: single source of truth -->
            <footer class="py-3 my-4 border-top text-center">
                <p class="mb-0 text-muted">&copy; 2026 BCIT COMP1800</p>
            </footer>
        `;
  }
}

customElements.define("site-footer", SiteFooter);
