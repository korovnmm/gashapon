import { useCallback } from 'react'
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from 'auth'
import { call } from 'api'
import {
    Box,
    Button,
    Container,
    TextField,
    Typography
} from '@mui/material'
import { Link } from 'react-router-dom'
import { GoogleIcon } from 'components'
//import { useLocation } from 'react-router-dom'


export const SignUp = () => {
    //const location = useLocation(); // grabs the current page we're on (the login page), see location.push below
    // Submit Handler for Email & Password
    const handleSubmit = useCallback(async e => {
        e.preventDefault(); // prevents the page from refreshing

        const { email, password } = e.target.elements;
        const auth = getAuth();
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value);
            await call("userLoggedIn");
        } catch (e) {
            alert(e.message);
        }
        //location.push('/some-other-route') // redirect the user to a location that isn't the home page ('/')
    }, []);

    // Google Authentication
    const signInWithGoogle = useCallback(async e => {
        e.preventDefault();

        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        try {
            await signInWithPopup(auth, provider);
            await call("userLoggedIn");
        } catch (e) {
            alert(e.message);
        }
    }, []);

    // HTML
    return (
        <>
            <Container>
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h3" component="h3" align="center">Account Creation</Typography>
                    <TextField fullWidth required autoFocus id="email" type="email" label="Email Address" autoComplete="email" />
                    <TextField fullWidth required id="password" type="password" label="Password" autoComplete="current-password" />
                    <Button fullWidth variant="contained" type="submit">Create Account</Button>
                </Box>
                <center>or</center>
                <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={signInWithGoogle}>Continue with Google</Button>
                <div>Already have an account? <Link to="/login">Log in here!</Link></div>
            </Container>
        </>
    )
}