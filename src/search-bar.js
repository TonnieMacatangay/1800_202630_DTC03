function sendToNextPage() {
    searchBar.addEventListener("change", function () {
        let searchQueryString = document.getElementById("searchBar").value.replaceAll(" ", "-");
        // console.log(searchQueryString);
        window.location.assign(`search-results.html?search=${searchQueryString}`);
        
    });

    searchButton.addEventListener("click", function () {
        let searchQueryString = document.getElementById("searchBar").value.replaceAll(" ", "-");
        // console.log(searchQueryString);
        window.location.assign(`search-results.html?search=${searchQueryString}`);
    });
}
sendToNextPage();