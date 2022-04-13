import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import {
    MemoryRouter
} from 'react-router-dom';

import {
    AuthContextProvider,
    createUserWithEmailAndPassword,
    getAuth
} from 'auth';
import { call } from 'api';
import App from 'App';

// Setup
const click = fireEvent.click
let auth = getAuth();
let exampleUserEmail = "inventory@example.com";
let examplePassword = "inventoryPassword123";
beforeAll(() => { // create a new user account and navigate to the inventory page
    return createUserWithEmailAndPassword(auth, exampleUserEmail, examplePassword)
        .then(() => {
            return call("userLoggedIn")
                .then((json) => {
                    expect(json.data.result).toMatch("created");
                    
                    const user = auth.currentUser;
                    render(
                        <MemoryRouter initialEntries={["/dashboard"]}>
                            <AuthContextProvider value={{ user }}>
                                <App />
                            </AuthContextProvider>
                        </MemoryRouter>
                    );
                });
        });
});
afterAll(() => {
    return auth.currentUser.delete();
});



// --- Tests ---

test('renders the dashboard header', () => {
    const dashHeader = screen.getByText("DASHBOARD");
    expect(dashHeader).toBeInTheDocument();
});
