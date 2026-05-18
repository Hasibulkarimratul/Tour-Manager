import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAQ-K5DobIKQPZa_0mfxfxGVmp7LzdwvUY",
  authDomain: "tour-manager-e8063.firebaseapp.com",
  projectId: "tour-manager-e8063",
  storageBucket: "tour-manager-e8063.firebasestorage.app",
  messagingSenderId: "277517814044",
  appId: "1:277517814044:web:e26f1f2cc0a91b685cd2d9",
  measurementId: "G-64Q1MYZ7R5"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getFirestore(app);

// Enable offline persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a a time.
    console.warn('Firebase persistence failed precondition: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the features required to enable persistence
    console.warn('Firebase persistence unimplemented in this browser');
  }
});

export const auth = getAuth(app);

export const signInAnonymouslyUser = async () => {
    try {
        const result = await signInAnonymously(auth);
        return result.user;
    } catch (error) {
        console.error("Error signing in anonymously:", error);
        throw error;
    }
};
