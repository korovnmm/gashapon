import { getAuth, signOut } from 'firebase/auth'
import { useAuthState } from '../firebase'

export const About = () => {
    return (
        <>
            <h1>Welcome to Project Gashapon!</h1>
        </>
    );
}