import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4">
                <form onSubmit={handleSubmit}>
                    <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <button type="submit" className="border border-input bg-background rounded-md px-3 py-2">Login</button>
                </form>
            </CardContent>
        </Card>
    )
}

export default Login;