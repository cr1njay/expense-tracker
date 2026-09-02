import { useState } from 'react'

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Login failed");
            }
            return response.json();
        })
        .then(data => {
            onLoginSuccess(data.access_token);
        })
        .catch(error => console.log(error));
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button type="submit">Login</button>
        </form>
    )
}

export default Login;