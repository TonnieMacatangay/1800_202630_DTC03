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
import { query, where } from "firebase/firestore";

// From Demo 07
// Declare variable: the category from the URL (e.g., http://localhost:5173/apps.html?category=Communication-Apps)
const params = new URL(window.location.href).searchParams;
const appCategory = params.get("category");
const appId = params.get("app-id"); // This value is null, if we're at the "Communication Apps" page that lists all the apps

console.log("appCategory:", appCategory);
console.log("appId:", appId); // Will be null, unless we're on the App Options page

// Basically displayCardsDynamically() from Demo 7
// The code here will replace elements in apps.html (Header and buttons)
async function displayAppsDynamically() {

    let buttonTemplate = document.getElementById("appsButtonTemplate");
    // if (appName === null) {
    //     const appsCollectionRef = collection(db, "apps");
    // } else {
    //     const appsCollectionRef = collection(db, "apps", appName, "app_options");
    // }
    const appsCollectionRef = (appId === null) ? collection(db, "apps") : collection(db, "apps", appId, "app_options");
    console.log("appsCollectionRef: ", appsCollectionRef);
    
    // Update the Page Header
    if (appId === null) {
        document.getElementById("insert-header-here").textContent = appCategory.replaceAll("-", " ");
    } else {
        // Get app name:
        const appSnapShot = await getDoc(doc(db, "apps", appId));
        const name = appSnapShot.data();
        document.getElementById("insert-header-here").textContent = name.app_name;
    }
        
    try {
        const querySnapshot = await getDocs(appsCollectionRef);
        //for each document (app names) in this collection OR subcollection 
        querySnapshot.forEach((appDoc) => {
            // Clone the element from app-categories.html that has the id#categoryButtonTemplate
            let newButton = buttonTemplate.content.cloneNode(true);
            // get the data (category field of each document in app collection is all we need for now)
            const app = appDoc.data();
            console.log("App: ", appDoc)
            // Create the button, 
            // When we're on the Apps Page, ensure we only show the apps who have matching category
            // When we're on the Options Page, show all the options
            if (appCategory === app.app_category || appId !== null) {
                if (appId === null) {
                    newButton.querySelector("#appsButton").textContent = app.app_name;
                    // appDoc.id will pass the generated ID of each document (Apps in this case)
                    newButton.querySelector("#appsButton").href = `apps.html?category=${app.app_category}&app-id=${appDoc.id}`;
                } else {
                    newButton.querySelector("#appsButton").textContent = app.option_name;
                    // appDoc.id will pass the generated ID of each document (Options in this case)
                    newButton.querySelector("#appsButton").href = `app-tutorial.html?category=${app.app_category}&app-id=${appId}&option=${appDoc.id}`;
                }
                // Attach the button to our page
                document.getElementById("appsGoHere").appendChild(newButton);
            }
            
        });
    } catch (error) {
        console.error("Error getting categories: ", error);
    }
}
displayAppsDynamically();
