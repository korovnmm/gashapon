import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { About } from './pages/About'
import { Login } from './pages/Login'
import { AuthContextProvider } from './firebase'
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
      </Router>
    </AuthContextProvider>
  );
}

export default App;
