import { useCallback } from 'react'
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithRedirect 
} from 'firebase/auth'
import { 
    Box,
    Button,
    Container,
    TextField,
    Typography
} from '@mui/material'
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
            signInWithRedirect(auth, provider);
        } catch (e) {
            alert(e.message);
        }
    }, []);

    // HTML
    return (
        <>
            <Container>
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h3" component="h3" align="center">Sign in</Typography>
                    <TextField fullWidth required autoFocus id="email" type="email" label="Email Address" autoComplete="email"/>  
                    <TextField fullWidth required id="password" type="password" label="Password" autoComplete="current-password" />
                    <Button fullWidth variant="contained" type="submit">Sign in</Button>
                </Box>
                <Button fullWidth variant="contained" onClick={signInWithGoogle}>Continue with Google</Button>
            </Container>
        </>
    )
}