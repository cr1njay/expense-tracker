import Login from './Login'
import Signup from './Signup'
import { useState } from 'react'

function App() {
  const [token, setToken] = useState(null)
  const [showSignup, setShowSignup] = useState(false)
  console.log(token)
  return (
    token ? (
      <p>Logged in!</p>
    ) : showSignup ? (
      <Signup onSignupSuccess={() => setShowSignup(false)} />
    ) : (
    <>
      <button onClick={() => setShowSignup(true)}>Need an account? Sign up</button>
      <Login onLoginSuccess={setToken} />
    </>
)
)
}

export default App