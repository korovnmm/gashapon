import { initializeApp } from 'firebase/app'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getFirestore } from 'firebase/firestore'
import { createContext } from 'react'

import { firebaseConfig } from './config'

// Initialize the Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
export const functions = getFunctions(firebaseApp);
export const db = getFirestore(firebaseApp);
export const AuthContext = createContext();

// Connect to emulators if running on localhost
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    connectFunctionsEmulator(functions, "localhost", 5000);
}