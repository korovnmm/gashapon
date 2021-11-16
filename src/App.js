import {
  BrowserRouter as Router,
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

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <header>
          <div>
            <Link to="/" > Home </Link> |
            <Link to="/about" > About </Link> |
            <Link to="/login"> Login </Link> |{' '}
            <Link to="/signup"> SignUp </Link> 
          </div>
          <button onClick={() => signOut(getAuth())}> Sign Out </button>
        </header>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <AuthenticatedRoute path="/dashboard" component={Dashboard} />
        <UnauthenticatedRoute exact path="/login" component={Login} />
        <UnauthenticatedRoute exact path="/signup" component={SignUp} />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
