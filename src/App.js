import {
  Redirect,
  Route
} from 'react-router-dom'
import { StyledEngineProvider } from '@mui/material'
import { AuthenticatedRoute, SiteHeader, UnauthenticatedRoute } from './components'

import { Home } from './pages/home/Home'
import { About } from './pages/About'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { Dashboard } from './pages/dashboard/Dashboard'
import { RedeemScreen } from './pages/home/RedeemScreen'
import { AccountSetup } from 'pages/AccountSetup'

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <SiteHeader />
    
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/redeem"><Redirect to={'/'} /></Route>
      <Route path="/redeem/:shopTag/:code" component={RedeemScreen} />
      <AuthenticatedRoute path="/account/setup" component={AccountSetup} />
      <AuthenticatedRoute path="/dashboard" component={Dashboard} />
      <UnauthenticatedRoute exact path="/login" component={Login} />
      <UnauthenticatedRoute exact path="/signup" component={SignUp} />
    </StyledEngineProvider>
  );
}

export default App;
