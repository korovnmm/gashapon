import { initializeApp } from 'firebase/app'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { createContext } from 'react'

import { firebaseConfig } from './config'

// Initialize the Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
export const functions = getFunctions(firebaseApp);
export const db = getFirestore(firebaseApp);
export const AuthContext = createContext();

// Connect to emulators if running on localhost
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectFirestoreEmulator(db, "localhost", 8080);
    connectAuthEmulator(getAuth(), "http://localhost:9099");
}