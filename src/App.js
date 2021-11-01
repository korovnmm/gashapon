import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import { About } from './pages/About'
import { AuthContextProvider } from './firebase'
import { AuthenticatedRoute, UnauthenticatedRoute } from './components'

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <UnauthenticatedRoute exact path="/" component={About} />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
