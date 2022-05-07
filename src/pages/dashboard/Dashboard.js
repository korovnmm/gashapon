import { 
    Redirect,
    useParams,
    useRouteMatch
} from 'react-router-dom'
import { useEffect, useState } from 'react'

import { 
    AuthenticatedRoute,
    DashboardContainer,
    DashNavbar,
    LinkTab
} from 'components'

//import { Overview } from './Overview'
import { Tickets } from './Tickets'
import { Inventory } from './Inventory'

const pages = [
    /*{
        name: "Overview",
        id: "overview",
        component: Overview
    },*/
    {
        name: "Inventory",
        id: "inventory",
        component: Inventory
    },
    /*{
        name: "Orders",
        id: "orders",
        component: Overview
    },*/
    {
        name: "Tickets",
        id: "tickets",
        component: Tickets
    },
    /*{
        name: "Listings",
        id: "listings",
        component: Overview
    }*/
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
    const [value, setValue] = useState(0);
    const { url, path } = useRouteMatch();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    // Check if the account's been set up first
    useEffect(() => {
        async function checkAccountSetup() {
            // TODO: Undo commit c649c76b63808587a3877c91c72459a5bb61497f
            // in PR #80 (story 58) to restores the variables and imports
            // required for the below code to work:
            //if (await getShopName(user.uid) == null) {
            //    history.push("/account/setup");
            //}
            return; // TODO
        }
        checkAccountSetup();
    });

    // HTML
    return (
        <DashboardContainer>
            <DashNavbar value={value} onChange={handleChange}>
                {pages.map(({name, id}) => (
                    <LinkTab disableRipple label={`${name}`} to={`${url}/${id}`} key={id}/>
                ))}
            </DashNavbar>

            <AuthenticatedRoute path={`${path}/:pageID`} component={DashboardPage} />

            <Redirect from={`${url}`} to={`${url}/inventory`} />
        </DashboardContainer>
    );
}