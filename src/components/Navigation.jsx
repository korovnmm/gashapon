import { Link } from 'react-router-dom'
import {
    getAuth,
    signOut,
    useAuthState
} from 'auth'


/**
 * Navigation Bar at the top of the page.
 */
const NavBar = (props) => {
    return (
        <div className="navbar-main" {...props}>
            <Link to="/" id="home-link" className="nav-item"> Home </Link>
            <Links />
        </div>
    );
}

const Links = () => {
    if (useAuthState().isAuthenticated) // if the user is logged in
        return (
            <>
                <Link to="/dashboard" className="nav-item" id="dashboard-link"> Dashboard </Link>
                <Link to="/" className="nav-item" id="signout" onClick={() => signOut(getAuth())}> Sign out </Link >
            </>
        );
    else
        return (
            <>
                <Link to="/about" className="nav-item" id="about-link"> About </Link>
                <Link to="/login" className="nav-item" id="login-link"> Log in </Link>
                <Link to="/signup" className="nav-item" id="signup-link"> Sign up </Link >
            </>
        );
}

export default NavBar;