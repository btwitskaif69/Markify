"use client";

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const missingKeys = Object.keys(firebaseConfig).filter((key) => !firebaseConfig[key]);
export const initializationError =
    missingKeys.length > 0 ? `Missing keys: ${missingKeys.join(", ")}` : null;

const isBrowser = typeof window !== "undefined";

if (isBrowser && initializationError) {
    console.error(`Firebase initialization failed! ${initializationError}`);
    console.error(
        "Make sure these environment variables are set in your .env file or deployment settings (e.g., Vercel)."
    );
}

let auth = null;
let googleProvider = null;

if (isBrowser && !initializationError) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
}

export const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
        throw new Error(initializationError || "Firebase auth is not initialized.");
    }
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};

export { auth, googleProvider };
