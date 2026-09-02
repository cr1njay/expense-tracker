import Login from './Login'
import { useState } from 'react'

function App() {
  const [token, setToken] = useState(null)
  console.log(token)
  return (
  token ? <p>Logged in!</p> : <Login onLoginSuccess={setToken} />
)
}

export default App