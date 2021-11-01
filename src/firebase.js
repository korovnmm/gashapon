import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect, useContext, createContext } from 'react'

import { firebaseConfig } from './config'

// Initialize the Firebase App
export const firebaseApp = initializeApp(firebaseConfig);
export const AuthContext = createContext();

/**
 * @returns an AuthContextProvider containing with the current user state already filled in.
 */
export const AuthContextProvider = props => {
    const [user, setUser] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError)
        return () => unsubscribe();
    }, []);

    return (<AuthContext.Provider value={{ user, error }} {...props} />);
}

/**
 * @returns the current auth state and a boolean on whether a user is logged in. 
 */
export const useAuthState = () => {
    const auth = useContext(AuthContext);
    return { ...auth, isAuthenticated: auth.user != null };
}