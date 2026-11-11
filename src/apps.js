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

// From Demo 07
// Declare variable: the category from the URL (e.g., http://localhost:5173/apps.html?category=Communication-Apps)
const params = new URL(window.location.href).searchParams;
const appCategory = params.get("category");

// Basically displayCardsDynamically() from Demo 7
// The code here will replace elements in apps.html (Header and buttons)
async function displayAppsDynamically() {
    // Update the Page Header
    document.getElementById("insert-category-here").textContent = appCategory.replaceAll("-", " ");

    let buttonTemplate = document.getElementById("appsButtonTemplate");
    const appsCollectionRef = collection(db, "apps");
    console.log(appsCollectionRef);
    try {
        const querySnapshot = await getDocs(appsCollectionRef);
        //for each document (app names) in this (apps) collection
        querySnapshot.forEach((appDoc) => {
            console.log("appDoc:", appDoc)
            // Clone the element from app-categories.html that has the id#categoryButtonTemplate
            let newButton = buttonTemplate.content.cloneNode(true);
            // get the data (category field of each document in app collection is all we need for now)
            const app = appDoc.data();
            console.log("category = ", appDoc.data());

            // Create the button, only if the app_category field matches exactly with the URL query parameter.
            console.log("appCategory:", appCategory)
            console.log("app_category:", app.app_category)
            if (appCategory === app.app_category) {
                newButton.querySelector("#appsButton").textContent = app.app_name;
                newButton.querySelector("#appsButton").href = `app-options.html?category=${appCategory}`;
                // Attach the button to our page
                document.getElementById("appsGoHere").appendChild(newButton);
            }
            
        });
    } catch (error) {
        console.error("Error getting categories: ", error);
    }
}
displayAppsDynamically();
