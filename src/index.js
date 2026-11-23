import { db } from "./firebaseConfig.js";
import {
    collection,
    getDocs,
} from "firebase/firestore";

async function displayAppsDynamically() {

    let cardTemplate = document.getElementById("cards-go-here");
    const appsCollectionRef = collection(db, "apps2")
    console.log("appsCollectionRef: ", appsCollectionRef);
        
    try {
        const querySnapshot = await getDocs(appsCollectionRef);
        //for each document (categories) in this collection 
        querySnapshot.forEach((appDoc) => {
            // Clone the element from app-categories.html that has the id#cardTemplate
            let newCard = cardTemplate.content.cloneNode(true);
            // get the data (category fields of each document in app collection)
            const app = appDoc.data();
            console.log("App: ", appDoc)
            // Create the Cards based on each document in apps collection in database
            newCard.querySelector("#card-link").href = `apps.html?category=${app.category}`
            newCard.querySelector("#card-image").src = `/images/${app.category_image}`
            newCard.querySelector("#card-title").textContent = app.category.replaceAll("-", " ");
            newCard.querySelector("#card-description").textContent = app.category_description;
            // Append the newly created card on the DOM
            document.getElementById("cards-go-here").appendChild(newCard);
        });
    } catch (error) {
        console.error("Error getting categories: ", error);
    }
}
displayAppsDynamically();