import { 
    getAuth, 
    onAuthStateChanged,
    signOut as fireBaseSignOut
} from 'firebase/auth'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../firebase'
import { clearCachedData } from 'db'

export {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithRedirect,
    signInWithPopup
} from 'firebase/auth';


/**
 * Signs out the current user.
 * @see {@link fireBaseSignOut firebase/auth.signOut}
 * @param auth - The Auth instance.
 */
export async function signOut(auth) {
    clearCachedData();
    return fireBaseSignOut(auth);
}


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