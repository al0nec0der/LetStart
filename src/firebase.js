// File: lestart/src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration - using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase config values are present
const hasFirebaseConfig = firebaseConfig.apiKey && 
                         firebaseConfig.authDomain && 
                         firebaseConfig.projectId && 
                         firebaseConfig.storageBucket && 
                         firebaseConfig.messagingSenderId && 
                         firebaseConfig.appId;

let app, db, auth, isFirebaseConfigured;

if (hasFirebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseConfigured = true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Fallback to mock objects
    app = null;
    db = { noop: true };
    auth = {
      onAuthStateChanged: () => (() => {}),
      signInWithPopup: () => Promise.reject(new Error('Firebase initialization failed')),
      signOut: () => Promise.resolve(),
    };
    isFirebaseConfigured = false;
  }
} else {
  console.warn('Firebase not configured. Please add your Firebase configuration to .env file');
  // Create mock objects to prevent app crashes
  app = null;
  db = { noop: true };
  auth = {
    onAuthStateChanged: () => (() => {}),
    signInWithPopup: () => Promise.reject(new Error('Firebase not configured')),
    signOut: () => Promise.resolve(),
  };
  isFirebaseConfigured = false;
}

export { app, db, auth, isFirebaseConfigured };
