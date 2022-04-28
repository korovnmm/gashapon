import { 
    Box,
    Container,
    Tabs,
    Tab
} from '@mui/material';
import { Link } from 'react-router-dom';


/** Container element for the Dashboard */
export function DashboardContainer(props) {
    return (
        <Container maxWidth="lg" className="dashboard-container">
            <Box component="center" className="dashboard"
                sx={{
                    outline: '1px solid lightblue'
                }}>
                <h2 className="dashboard-header">DASHBOARD</h2>
                <div className="dash-body-wrapper"
                    {...props}
                /> 
            </Box>
        </Container >
    );
}

/**
 * A styled `<Tabs>` component for the Dashboard
 * @param {*} props 
 * @returns 
 */
export function DashNavbar(props) {
    return (
        <Tabs
            centered variant="fullWidth" className="dash-navbar"
            sx={{ 
                borderBottom: 1, 
                borderColor: 'divider' 
            }}
            aria-label="dashboard page navigation bar" 
            {...props}
        />
    );
}

/**
 * An MUI Tab component that supports <Link> functionality (i.e. a Tab that can take a 'to=' argument).
 */
export function LinkTab(props) {
    return (
        <Tab
            className="dash-tab"
            component={Link}
            {...props}
        />
    );
}