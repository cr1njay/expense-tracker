import Login from './Login'
import Signup from './Signup'
import Transactions from './Transactions'
import Budgets from './Budgets'
import Categories from './Categories'
import Summary from './Summary'
import { useState, useEffect } from 'react'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
    if (!token) return;
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
  }, [token])

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen bg-background text-foreground">
      {token ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={() => setView("transactions")}>Transactions</Button>
            <Button onClick={() => setView("budgets")}>Budgets</Button>
            <Button onClick={() => setView("categories")}>Categories</Button>
            <Button onClick={() => setView("summary")}>Summary</Button>
          </div>
          {view === "transactions" && <Transactions token={token} categories={categories} />}
          {view === "budgets" && <Budgets token={token} categories={categories} />}
          {view === "summary" && <Summary token={token} categories={categories} />}
          {view === "categories" && <Categories token={token} categories={categories} setCategories={setCategories} />}
        </div>
      ) : showSignup ? (
        <Signup onSignupSuccess={() => setShowSignup(false)} />
      ) : (
        <div className="flex flex-col gap-4">
          <Button onClick={() => setShowSignup(true)}>Need an account? Sign up</Button>
          <Login onLoginSuccess={setToken} />
        </div>
      )}
    </div>
  )
}

export default App