import { initializeApp } from 'firebase/app'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from "firebase/storage"
import { createContext } from 'react'

import { firebaseConfig } from './config'

// Initialize the Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
export const functions = getFunctions(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage();
export const AuthContext = createContext();

// A toggle for auth emulator warnings (they tend to bloat the unit test logs)
const consoleInfo = console.info
function setShowAuthEmulatorWarning(show) {
    console.info = show ? consoleInfo : () => { }
}

// Connect to emulators if running on localhost
export function connectFirebaseEmulators() {
    connectFunctionsEmulator(functions, "localhost", 5051);
    connectFirestoreEmulator(db, "localhost", 8081);
    connectStorageEmulator(storage, "localhost", 9199);

    setShowAuthEmulatorWarning(false);
    connectAuthEmulator(getAuth(), "http://localhost:9099");
    setShowAuthEmulatorWarning(true);
}

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    const nodeEnvironment = process.env.NODE_ENV.charAt(0).toUpperCase() + process.env.NODE_ENV.slice(1);
    console.info(`${nodeEnvironment} environment detected, this means that Firebase emulators are active.`);
    connectFirebaseEmulators();
}