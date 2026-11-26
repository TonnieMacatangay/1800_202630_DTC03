import { db } from "./firebaseConfig.js";
import { doc, collection, getDocs } from "firebase/firestore";

const params = new URL(window.location.href).searchParams;
const searchQuery = params.get("search").replaceAll("-", " ");

async function getAllResults() {
    const categoryCollectionRef = collection(db, "apps2");
    try {
        const categoryQuerySnapshot = await getDocs(categoryCollectionRef);
        // Need async at each new function, since we're calling await. Error otherwise
        // Outer-most loop
        categoryQuerySnapshot.forEach(async (category) => {
            // console.log(category.id);
            const appsRef = collection(
                db,
                "apps2",
                category.id,
                "app_selection",
            );
            try {
                const appQuerySnapshot = await getDocs(appsRef);
                // Middle loop
                appQuerySnapshot.forEach(async (app) => {
                    // console.log(app.id);
                    const appOptionsRef = collection(
                        db,
                        "apps2",
                        category.id,
                        "app_selection",
                        app.id,
                        "app_options",
                    );
                    try {
                        const appOptionsQuerySnapshot = await getDocs(appOptionsRef);
                        // Inner-most loop
                        let cardTemplate = document.getElementById("cards-go-here");
                        appOptionsQuerySnapshot.forEach((appOption) => {
                            // console.log(`[${category.id}] - ${app.id} - ${appOption.id}`);
                            // allAppOptions.push(`[${category.id}] - ${app.id}: ${appOption.id}`);
                            // allAppOptions.push(`${category.id}/${app.id}/${appOption.id}`);
                            // Clone the element from app-categories.html that has the id#cardTemplate
                            let newCard = cardTemplate.content.cloneNode(true);
                            // get the data (category fields of each document in app collection)
                            // console.log("App: ", appDoc)
                            // Create the Cards based on each document in apps collection in database
                            // console.log(`${category.id} ${app.id} ${appOption.id}`.includes(searchQuery))
                            // console.log(searchQuery.toLowerCase())
                            // console.log(`${category.id} ${app.id} ${appOption.id}`.toLowerCase())
                            if (`${category.id} ${app.id} ${appOption.id}`.toLowerCase().includes(searchQuery.toLowerCase())) {
                                newCard.querySelector("#card-link").href =
                                    `app-tutorial.html?category=${category.id.replaceAll(" ", "-")}&app-id=${app.id.replaceAll(" ", "-")}&option=${appOption.id.replaceAll(" ", "-")}`;
                                newCard.querySelector("#card-image").src = `/images/${appOption.data().step_image[0]}`;
                                newCard.querySelector("#card-title").textContent = category.id;
                                newCard.querySelector("#card-header").textContent = app.id;
                                newCard.querySelector("#card-description").textContent = appOption.id;
                                //     app.category_description;
                                // Append the newly created card on the DOM
                                document.getElementById("cards-go-here").appendChild(newCard);
                            }
                        });
                    } catch (error) {
                        console.error("Error getting app options: ", error);
                    }
                });
            } catch (error) {
                console.error("Error getting apps: ", error);
            }
        });
    } catch (error) {
        console.error("Error getting categories: ", error);
    }
    // console.log(allAppOptions.length);
}
// console.log("Array is:", allAppOptions);
getAllResults();