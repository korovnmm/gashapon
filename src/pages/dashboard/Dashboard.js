import { 
    Redirect,
    useParams,
    useRouteMatch
} from 'react-router-dom'
import { useState } from 'react'

import { 
    AuthenticatedRoute,
    DashboardContainer,
    DashNavbar,
    LinkTab
} from 'components'

import { Overview } from './Overview'
import { Tickets } from './Tickets'

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
    //const { user } = useAuthState();
    const [value, setValue] = useState(0);
    const { url, path } = useRouteMatch();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <DashboardContainer>
            <DashNavbar value={value} onChange={handleChange}>
                {pages.map(({name, id}) => (
                    <LinkTab label={`${name}`} to={`${url}/${id}`} />
                ))}
            </DashNavbar>

            <AuthenticatedRoute path={`${path}/:pageID`}>
                <DashboardPage />
            </AuthenticatedRoute>

            <Redirect from={`${url}`} to={`${url}/overview`} />
        </DashboardContainer>
    );
}