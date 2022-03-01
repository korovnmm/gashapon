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

// A toggle for auth emulator warnings (they tend to bloat the unit test logs)
const consoleInfo = console.info
function setShowAuthEmulatorWarning(show) {
    console.info = show ? consoleInfo : () => { }
}

// Connect to emulators if running on localhost
export function connectFirebaseEmulators() {
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectFirestoreEmulator(db, "localhost", 8080);

    setShowAuthEmulatorWarning(false);
    connectAuthEmulator(getAuth(), "http://localhost:9099");
    setShowAuthEmulatorWarning(true);
}
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    connectFirebaseEmulators();
}