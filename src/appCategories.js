import { onAuthReady } from "/src/authentication.js";
import { db } from "./firebaseConfig.js";
import { doc, onSnapshot } from "firebase/firestore";
import {
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { getDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";

// Basically displayCardsDynamically() from Demo 7
async function displayCategoriesDynamically() {
    let categoryButtonTemplate = document.getElementById("categoryButtonTemplate");
    const appsCollectionRef = collection(db, "apps");
    console.log(appsCollectionRef);
    try {
        const querySnapshot = await getDocs(appsCollectionRef);
        //for each document (app names) in this (apps) collection
        querySnapshot.forEach((appDoc) => {
            console.log("appDoc:", appDoc)
            // Clone the element from app-categories.html that has the id#categoryButtonTemplate
            let newButton = categoryButtonTemplate.content.cloneNode(true);
            // get the data (category field of each document in app collection is all we need for now)
            const app = appDoc.data();
            console.log("category = ", appDoc.data());

            // Create the button
            newButton.querySelector("#categoryButton").textContent =
                app.category;

            // Attach the button to our page
            document.getElementById("#categoriesGoHere").appendChild(newButton);
        });
    } catch (error) {
        console.error("Error getting categories: ", error);
    }
}
displayCategoriesDynamically();
