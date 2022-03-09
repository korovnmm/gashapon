import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Link,
} from 'react-router-dom'
import { 
  getAuth, 
  signOut, 
  AuthContextProvider 
} from './auth'
import { AuthenticatedRoute, UnauthenticatedRoute } from './components'
import { Home } from './pages/home/Home'
import { About } from './pages/About'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { Dashboard } from './pages/dashboard/Dashboard'
import { RedeemScreen } from './pages/home/RedeemScreen'

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <header>
          <div class="navbar-main">
            <Link to="/" id="nav-item"> Home </Link> |
            <Link to="/about" id="nav-item"> About </Link> |
            <Link to="/login" id="nav-item"> Login </Link> |{' '}
            <Link to="/signup" id="nav-item"> SignUp </Link> |{' '}
            <Link to="/signup" id="nav-item" onClick={() => signOut(getAuth())}> SignOut </Link>
          </div>

        </header>
        
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/redeem"><Redirect to={'/'} /></Route>
        <Route path="/redeem/:shopTag/:code" component={RedeemScreen} />
        <AuthenticatedRoute path="/dashboard" component={Dashboard} />
        <UnauthenticatedRoute exact path="/login" component={Login} />
        <UnauthenticatedRoute exact path="/signup" component={SignUp} />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
