import Login from './Login'
import Signup from './Signup'
import Transactions from './Transactions'
import Budgets from './Budgets'
import Categories from './Categories'
import Summary from './Summary'
import { useState, useEffect } from 'react'

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [showSignup, setShowSignup] = useState(false)
  const [categories, setCategories] = useState([])
  const [view, setView] = useState("transactions")

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    }

  useEffect(() => {
    fetch("http://127.0.0.1:5000/categories", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      } 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    })
    .then(data => {
      setCategories(data);
    })
    .catch(error => console.log(error));
  }, [])

  return (
    token ? (
      <>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => setView("transactions")}>Transactions</button>
        <button onClick={() => setView("budgets")}>Budgets</button>
        <button onClick={() => setView("summary")}>Summary</button>
        <Summary token={token} categories={categories} />
        <Categories token={token} categories={categories} setCategories={setCategories} />
        {view === "transactions" && <Transactions token={token} categories={categories} />}
        {view === "budgets" && <Budgets token={token} categories={categories} />}
        {view === "summary" && <Summary token={token} categories={categories} />}
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