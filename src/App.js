import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import { AuthContextProvider } from './firebase'
import { getAuth, signOut } from 'firebase/auth'

import { About } from './pages/About'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'

import { AuthenticatedRoute, UnauthenticatedRoute } from './components'

function App() {
  return (
    <AuthContextProvider>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </head>
      <Router>
        <header>
          <button onClick={() => signOut(getAuth())}>Sign Out</button>
        </header>
        <AuthenticatedRoute exact path="/" component={About} />
        <UnauthenticatedRoute exact path="/login" component={Login} />
        <UnauthenticatedRoute exact path="/signup" component={SignUp} />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
