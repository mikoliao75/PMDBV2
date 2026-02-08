
// Load environment variables from .env file
require('dotenv').config();

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, Timestamp } = require("firebase/firestore");

// --- Configuration --- 
// All settings are now managed in the .env file. 
// Please edit the .env file to configure the script.

// 1. Firebase Project Configuration (from .env)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Manager's Firebase Auth User UID (from .env)
const MANAGER_UID = process.env.MANAGER_UID;

// 3. Manager's Profile Information (from .env)
const MANAGER_NAME = process.env.MANAGER_NAME;
const MANAGER_EMAIL = process.env.MANAGER_EMAIL;

// --- Script (Do Not Modify) ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createManagerProfile() {
  // Validation checks to ensure environment variables are set
  if (!MANAGER_UID || MANAGER_UID === "your_firebase_auth_uid") {
    console.error("Error: Please set your Firebase User UID in the .env file (MANAGER_UID).");
    return;
  }
  if (!MANAGER_NAME || MANAGER_NAME === "your_name") {
    console.error("Error: Please set your name in the .env file (MANAGER_NAME).");
    return;
  }
  if (!MANAGER_EMAIL || MANAGER_EMAIL === "your_email") {
    console.error("Error: Please set your email in the .env file (MANAGER_EMAIL).");
    return;
  }

  try {
    const userDocRef = doc(db, "users", MANAGER_UID);
    
    console.log(`Creating manager profile for UID: ${MANAGER_UID}...`);

    await setDoc(userDocRef, {
      name: MANAGER_NAME,
      email: MANAGER_EMAIL,
      role: 'Manager',
      avatarUrl: `https://i.pravatar.cc/150?u=${MANAGER_UID}`,
      createdAt: Timestamp.now(),
    });

    console.log("Success! Your manager profile has been written to the database.");
    console.log("You can now log in with the account you created.");

  } catch (e) {
    console.error("Error creating manager profile: ", e);
  }
}

createManagerProfile().then(() => {
  console.log("Script execution finished.");
  process.exit(0);
});
