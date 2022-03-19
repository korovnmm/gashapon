import {
    Box,
    Container,
    Tabs, 
    Tab,
} from '@mui/material'
import { 
    Redirect,
    Link,
    useParams,
    useRouteMatch
} from 'react-router-dom'
import { useEffect, useState } from 'react'

import { useAuthState } from 'auth'
import { getShopName } from 'db'
import { AuthenticatedRoute } from 'components'

import { Overview } from './Overview'
import { Tickets } from './Tickets'
import { useHistory } from 'react-router-dom'

const pages = [
    {
        name: "Overview",
        id: "overview",
        component: Overview
    },
    {
        name: "Inventory",
        id: "inventory",
        component: Overview
    },
    {
        name: "Orders",
        id: "orders",
        component: Overview
    },
    {
        name: "Tickets",
        id: "tickets",
        component: Tickets
    },
    {
        name: "Listings",
        id: "listings",
        component: Overview
    }
]

/**
 * An MUI Tab component that supports <Link> functionality (i.e. a Tab that can take a 'to=' argument).
 */
function LinkTab(props) {
    return (
        <Tab
            component={Link}
            {...props}
        />
    );
}

/**
 * @returns JSX element of the dashboard page corresponding to the current route path (the url).
 */
function DashboardPage () {
    const { pageID } = useParams();
    const page = pages.find(({ id }) => id === pageID);
    const C = page.component;
    return (
        <C />
    );
}

export const Dashboard = () => {
    const { user } = useAuthState();
    const [value, setValue] = useState(0);
    const { url, path } = useRouteMatch();
    const history = useHistory();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    // Check if the account's been set up first
    useEffect(() => {
        async function checkAccountSetup() {
            if (await getShopName(user.uid) == null) {
                history.push("/account/setup");
            }
        }
        checkAccountSetup();
    });

    // HTML
    return (
        <Container maxWidth="lg">
            <Box component="center" className="dashboard-wrapper"
                sx={{
                    outline: '1px solid lightblue'
                }}>
                <h2 class="dashboard-header">DASHBOARD</h2>
                <div class="dash-body-wrapper">
                    
                    <Tabs centered variant="fullWidth" class="dash-navbar"
                        value={value} onChange={handleChange}
                        sx={{borderBottom: 1, borderColor: 'divider'}}
                        aria-label="dashboard page navigation bar">
                            {pages.map(({name, id}) => (
                                <LinkTab label={`${name}`} to={`${url}/${id}`} />
                            ))}
                    </Tabs>

                    <AuthenticatedRoute path={`${path}/:pageID`}>
                        <DashboardPage />
                    </AuthenticatedRoute>

                    <Redirect from={`${url}`} to={`${url}/overview`} />
                </div>
            </Box>
        </Container>
    );
}