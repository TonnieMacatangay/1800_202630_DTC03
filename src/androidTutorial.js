import { auth, db } from "./firebaseConfig.js";

import {
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
// Instructions for four WhatsApp activities on Android.
const tutorials = {
  installApp: {
    title: "Install an App through Google Play Store",
    steps: ["1.", "2.", "3."],
  },

  deleteApp: {
    title: "Delete an Android App",
    steps: [
      "Find the application you want to delete",
      "Hold your finger down on the app until new options pop up",
      `Select "Uninstall"`,
      `If prompted, tap "Uninstall" again to confirm`,
    ],
  },
};
async function saveOneTutorial(tutorialID) {
  const tutorialRef = doc(db, "googlePlayStoreTutorials", tutorialID);

  const existingTutorial = await getDoc(tutorialRef);

  if (!existingTutorial.exists()) {
    await setDoc(tutorialRef, {
      title: tutorials[tutorialID].title,
      steps: tutorials[tutorialID].steps,
      platform: "android",
    });
  }
}

async function saveTutorials() {
  try {
    await saveOneTutorial("installApp");
    await saveOneTutorial("deleteApp");

    alert("Google Play Store tutorials saved to Firestore!");
  } catch (error) {
    console.error("Error saving tutorials:", error);
    alert("Could not save tutorials. Check the Console.");
  }
}
// saveTutorials(); // comment/uncomment as needed to save values to database.


// Get the selected tutorial from the URL.
const parameters = new URLSearchParams(window.location.search);
const requestedTopic = parameters.get("topic") || "installApp";

const tutorialID = requestedTopic === "installApp" ? "installApp" : requestedTopic;

let tutorial = tutorials[tutorialID] || tutorials["installApp"];

let currentStep = 0;

// Find the HTML elements.
const stepHeading = document.getElementById("step-heading");
const tutorialTitle = document.getElementById("tutorial-title");
const stepInstruction = document.getElementById("step-instruction");
const stepCaption = document.getElementById("step-caption");
const imagePlaceholder = document.getElementById("image-placeholder");
const stepImage = document.getElementById("step-image");
const previousButton = document.getElementById("previous-step");
const nextButton = document.getElementById("next-step");

// Display the current step.
function displayStep() {
  tutorialTitle.textContent = tutorial.title;

  if (currentStep === tutorial.steps.length) {
    stepHeading.textContent = "Tutorial Completed!";
    stepInstruction.textContent = "Great job! You have finished this tutorial.";
    stepCaption.textContent = "";
    imagePlaceholder.textContent = "Well done!";

    previousButton.disabled = false;
    nextButton.disabled = true;
    stepImage.hidden = true;
    stepImage.classList.add("d-none");
    imagePlaceholder.classList.remove("d-none");
    return;
  }

  stepHeading.textContent = `Step ${currentStep + 1} of ${tutorial.steps.length}`;

  stepInstruction.textContent = tutorial.steps[currentStep];
  stepCaption.textContent = tutorial.title;
  imagePlaceholder.textContent = `Screenshot for Step ${currentStep + 1}`;
  // Display the screenshot for each video-call step.
  // Display screenshots for the selected tutorial.
  if (
    tutorialID === "installApp" ||
    tutorialID === "deleteApp"
  ) {
    let imageName;

    if (tutorialID === "installApp") {
      imageName = `android-install-app-${currentStep + 1}.jpg`;
    } else if (tutorialID === "deleteApp") {
      imageName = `android-delete-app-${currentStep + 1}.jpg`;
    } 

    stepImage.src = `/images/${imageName}`;
    stepImage.alt = `WhatsApp tutorial step ${currentStep + 1}`;

    stepImage.hidden = false;
    stepImage.classList.remove("d-none");
    imagePlaceholder.classList.add("d-none");
  } else {
    stepImage.hidden = true;
    stepImage.classList.add("d-none");
    imagePlaceholder.classList.remove("d-none");
  }

  previousButton.disabled = currentStep === 0;

  nextButton.disabled = false;
  nextButton.textContent =
    currentStep === tutorial.steps.length - 1 ? "Finish →" : "Next step →";
}

async function readTutorial() {
  try {
    // Reference to the selected WhatsApp tutorial
    const tutorialRef = doc(db, "googlePlayStoreTutorials", tutorialID);

    // Read the document from Firestore
    const tutorialSnapshot = await getDoc(tutorialRef);

    if (tutorialSnapshot.exists()) {
      // Get the information stored in Firestore
      tutorial = tutorialSnapshot.data();

      console.log("Tutorial loaded from Firestore:", tutorial);

      // Show the first step
      currentStep = 0;
      displayStep();
    } else {
      console.log("Tutorial not found in Firestore.");
      alert("Tutorial not found.");
    }
  } catch (error) {
    console.error("Error reading tutorial:", error);
    alert("Could not load tutorial from Firestore.");
  }
}

// Next button.
nextButton.addEventListener("click", function () {
  if (currentStep < tutorial.steps.length) {
    currentStep++;
    displayStep();
  }
});

// Previous button.
previousButton.addEventListener("click", function () {
  if (currentStep > 0) {
    currentStep--;
    displayStep();
  }
});

// Show the first step when the page loads.
readTutorial();

// Favourites functionality.
const favouriteButton = document.getElementById("favourite-btn");

let signedInUser = null;
let isFavourite = false;

// Identify this tutorial in the user's favourites.
const favouriteID = "googlePlayStoreTutorials/" + tutorialID;

// Update the heart button.
function updateFavouriteButton() {
  if (isFavourite) {
    favouriteButton.textContent = "♥ Remove from Favourites";
  } else {
    favouriteButton.textContent = "♡ Add to Favourites";
  }
}

// Check whether the user is logged in.
onAuthStateChanged(auth, async function (user) {
  signedInUser = user;

  if (user) {
    try {
      // Read the user's Firestore document.
      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);

      let favourites = [];

      if (userSnapshot.exists()) {
        favourites = userSnapshot.data().favourites || [];
      }

      // Check whether this tutorial is already saved.
      isFavourite = favourites.includes(favouriteID);

      updateFavouriteButton();
      favouriteButton.disabled = false;
    } catch (error) {
      console.error("Error loading favourites:", error);
    }
  } else {
    favouriteButton.textContent = "♡ Log in to save favourites";
    favouriteButton.disabled = false;
  }
});

// Save or remove a favourite when the button is clicked.
favouriteButton.addEventListener("click", async function () {
  if (!signedInUser) {
    window.location.href = "login.html";
    return;
  }

  favouriteButton.disabled = true;

  try {
    const userRef = doc(db, "users", signedInUser.uid);

    if (isFavourite) {
      // Remove the tutorial from favourites.
      await setDoc(
        userRef,
        { favourites: arrayRemove(favouriteID) },
        { merge: true },
      );

      isFavourite = false;
    } else {
      // Add the tutorial to favourites.
      await setDoc(
        userRef,
        { favourites: arrayUnion(favouriteID) },
        { merge: true },
      );

      isFavourite = true;
    }

    updateFavouriteButton();
  } catch (error) {
    console.error("Error updating favourites:", error);
    alert("Could not update favourites.");
  }

  favouriteButton.disabled = false;
});
