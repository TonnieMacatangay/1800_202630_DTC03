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

// Helper function to add the sample apps documents (Specific Apps).
// https://stackoverflow.com/questions/48873465/how-to-add-sub-collection-to-a-document-in-firestore
// https://firebase.google.com/docs/firestore/manage-data/add-data#web


async function loadCategories() {
    const categorySelect = document.getElementById("appCategory");
    const querySnapshot = await getDocs(collection(db, "apps2"));

    querySnapshot.forEach((categoryDoc) => {
        const option = document.createElement("option");
        option.value = categoryDoc.id;
        option.textContent = categoryDoc.id;
        categorySelect.appendChild(option);

    });
}

loadCategories();

// Demo 10
// ---- (1) What to do when the review form is submitted ----
async function submitReview(event) {
    event.preventDefault();

    const newReview = {
        hikeDocID: hikeId,                                   // the PARENT (from the URL)
        userID: currentUser.uid,                             // who
        userName: currentUser.displayName || currentUser.email,
        title: document.getElementById("reviewTitle").value,
        rating: Number(document.getElementById("reviewRating").value),
        text: document.getElementById("reviewText").value,
        timestamp: serverTimestamp()                         // when
    };

    try {
        await addDoc(collection(db, "reviews"), newReview);
        event.target.reset();     // clear the form
        displayReviews();         // re-read the list so the new review shows (Step 1.3)
    } catch (error) {
        alert(`Error saving review:\n${error.code || ""}\n${error.message || error}`);
    }
}

// ---- (2) Connect it: "form, when you are submitted, run submitReview" ----
document.getElementById("databaseForm").addEventListener("submit", submitReview);


// Adds an app (document) to the apps collection
async function addApp(appName, appPlatform) {
    const appsRef = collection(db, "apps2");
    console.log("Adding sample apps data...");
    await addDoc(appsRef, {
        name: appName,
        platform: appPlatform,
    });
}


// Adds steps to an option
// Note, stepDescriptions, stepImagePaths are both an array
// step_title is a string
async function addSteps(appId, optionId, stepDescriptions, stepImagePaths, stepTitle) {
    const stepsRef = collection(db, "apps2", appId, optionId);
    console.log("Adding sample steps data...");
    await addDoc(stepsRef, {
        descriptions: stepDescriptions,
        imagePaths: stepImagePaths,
        title: stepTitle,
    });
}