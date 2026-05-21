import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// Your real Firebase keys
const firebaseConfig = {
  apiKey: "AIzaSyAQ-K5DobIKQPZa_0mfxfxGVmp7LzdwvUY",
  authDomain: "tour-manager-e8063.firebaseapp.com",
  projectId: "tour-manager-e8063",
  storageBucket: "tour-manager-e8063.firebasestorage.app",
  messagingSenderId: "277517814044",
  appId: "1:277517814044:web:e26f1f2cc0a91b685cd2d9",
  measurementId: "G-64Q1MYZ7R5"
};

// Initialize the app and database
const app = initializeApp(firebaseConfig);

// Properly enable offline persistence in Firebase v9+ to ensure immediate local reads/writes
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
});

// Export Auth
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
