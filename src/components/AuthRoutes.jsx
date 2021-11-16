import { Route, Redirect } from 'react-router-dom'
import { useAuthState } from 'auth';

/**
 * A route that only displays the given component if the user is authenticated, otherwise it'll redirect
 * the user to the designated login page.
 */
export const AuthenticatedRoute = ({ component: C, ...props }) => {
    const { isAuthenticated } = useAuthState();
    return (
        <Route {...props}
            render={routeProps =>
                isAuthenticated ? <C {...routeProps} /> : <Redirect to="/login" />
            }
        />
    );
}

/**
 * A route that only displays the given component if the user is ***not*** authenticated, otherwise it'll redirect
 * the user to the designated home (index) page.
 */
export const UnauthenticatedRoute = ({ component: C, ...props }) => {
    const { isAuthenticated } = useAuthState();
    return (
        <Route {...props}
            render={routeProps =>
                !isAuthenticated ? <C {...routeProps} /> : <Redirect to="/dashboard" />
            }
        />
    );
}