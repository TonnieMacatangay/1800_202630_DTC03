import { db } from "./firebaseConfig.js";
import { doc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { getDoc } from "firebase/firestore";

// From Demo 07
// Declare variable: the category from the URL (e.g., http://localhost:5173/apps.html?category=Communication-Apps)
const params = new URL(window.location.href).searchParams;
const appCategory = params.get("category").replaceAll("-", " "); // .replaceAll so we match exactly the document ID (with spaces, instead of "-")
const appName =
  params.get("app-id") === null
    ? null
    : params.get("app-id").replaceAll("-", " "); // This value is null, if we're at the "Communication Apps" page that lists all the apps

console.log("appCategory:", appCategory);
console.log("appName:", appName); // Will be null, unless we're on the App Options page

// Basically displayCardsDynamically() from Demo 7
// The code here will replace elements in apps.html (Header and buttons)
async function displayAppsDynamically() {
  let buttonTemplate = document.getElementById("appsButtonTemplate");
  // if null, do the assign to things on left of ":". Otherwise assign to right of ":".
  const appsCollectionRef =
    appName === null
      ? collection(db, "apps2", appCategory, "app_selection")
      : collection(
          db,
          "apps2",
          appCategory,
          "app_selection",
          appName,
          "app_options",
        );
  console.log("appsCollectionRef: ", appsCollectionRef);

  // Update the Page Header
  if (appName === null) {
    document.getElementById("insert-header-here").textContent =
      appCategory.replaceAll("-", " ");
  } else {
    document.getElementById("insert-header-here").textContent = appName;
  }

  try {
    console.log("Trying to getDocs");
    const querySnapshot = await getDocs(appsCollectionRef);
    //for each document (app names) in this collection OR subcollection
    console.log("qsnapshot", querySnapshot);
    querySnapshot.forEach((appDoc) => {
      console.log("Item in QuerySnapshot");
      // Clone the element from app-categories.html that has the id#categoryButtonTemplate
      let newButton = buttonTemplate.content.cloneNode(true);
      // get the data (category field of each document in app collection is all we need for now)
      const app = appDoc.data();
      console.log("App: ", appDoc.id, appDoc);
      // Create the button,
      // When we're on the Apps Page, ensure we only show the apps who have matching category
      // When we're on the Options Page, show all the options
      if (appName === null) {
        newButton.querySelector("#appsButton").textContent = appDoc.id;
        // appDoc.id will pass the generated ID of each document (Apps in this case)
        newButton.querySelector("#appsButton").href =
          `apps.html?category=${appCategory.replaceAll(" ", "-")}&app-id=${appDoc.id.replaceAll(" ", "-")}`;
      } else {
        newButton.querySelector("#appsButton").textContent = appDoc.id;
        // appDoc.id will pass the generated ID of each document (Options in this case)
        newButton.querySelector("#appsButton").href =
          `app-tutorial.html?category=${appCategory.replaceAll(" ", "-")}&app-id=${appName.replaceAll(" ", "-")}&option=${appDoc.id.replaceAll(" ", "-")}`;
      }
      // Attach the button to our page
      document.getElementById("appsGoHere").appendChild(newButton);
    });
  } catch (error) {
    console.error("Error getting categories: ", error);
  }
}
displayAppsDynamically();
