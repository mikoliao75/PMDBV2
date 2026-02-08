
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

// --- Step 1: Diagnosis - Log environment variables ---
// This will clearly show in the browser/server console if the .env file was loaded.
console.log("--- Firebase Config Diagnosis ---");
console.log("Attempting to load Firebase config from environment variables...");
console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
// We log the presence of the API key, not the key itself, for security.
console.log("Is NEXT_PUBLIC_FIREBASE_API_KEY set:", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("---------------------------------");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// --- Step 2: Error Handling & Fallback ---
// Check if the essential config values are present. If not, we'll enter a mock/offline mode.
if (firebaseConfig.projectId && firebaseConfig.apiKey) {
  try {
    // Initialize Firebase only if it hasn't been initialized yet.
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    console.log(`✅ Firebase initialized successfully for project: ${app.options.projectId}`);
  } catch (error) {
    console.error("🔥🔥🔥 Firebase Initialization Failed:", error);
    console.error("This likely means the Firebase config values are incorrect (e.g., typo in API key). Please double-check your .env file.");
    // Keep db and auth as null to indicate failure
  }
} else {
  // --- Fallback Logic ---
  console.warn("🔥🔥🔥 WARNING: Firebase config is missing or incomplete.");
  console.warn("Falling back to offline/mock mode. Firestore and Auth will not work.");
  console.warn("HOW TO FIX: Create a '.env' file in your project root with the correct Firebase credentials, then RESTART the development server.");
  // db and auth will remain null
}

export { db, auth };
