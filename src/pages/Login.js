import { useCallback } from 'react'
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup
} from 'auth'
import { call } from 'api'
import { 
    Box,
    Button,
    Container,
    Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Footnote, GoogleIcon, TextField } from 'components'
//import { useLocation } from 'react-router-dom'


export const Login = () => {
    //const location = useLocation(); // grabs the current page we're on (the login page), see location.push below
    // Login Form Submission Handler
    const handleSubmit = useCallback(async e => {
        e.preventDefault() // prevents refresh on clicking the submit button

        const { email, password } = e.target.elements;
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
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
            <Container className="signup-box">
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography component="h3" variant="h3" align="center">Shop Login</Typography>
                    <TextField fullWidth required autoFocus id="email" type="email" label="Email Address" autoComplete="email"/>  
                    <TextField fullWidth required id="password" type="password" label="Password" autoComplete="current-password" />
                    <Button fullWidth variant="contained" type="submit">Log in</Button>
                </Box>
                <center>or</center>
                <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={signInWithGoogle}>Continue with Google</Button>
                <Footnote>Don't have an account?<br/><Link to="/signup">Create one here!</Link></Footnote>
            </Container>
        </>
    );
}