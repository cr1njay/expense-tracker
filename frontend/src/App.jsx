import Login from './Login'
import Signup from './Signup'
import Transactions from './Transactions'
import { useState, useEffect } from 'react'

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [showSignup, setShowSignup] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    }

  return (
    token ? (
      <>
        <button onClick={handleLogout}>Logout</button>
        <Transactions token={token} />
      </>
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