import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function Signup({ onSignupSuccess }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, email: email, password: password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Signup failed");
            }
            return response.json();
        })
        .then(data => {
            onSignupSuccess();
        })
        .catch(error => console.log(error));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4">
                <form onSubmit={handleSubmit}>
                    <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <button type="submit" className="border border-input bg-background rounded-md px-3 py-2">Sign Up</button>
                </form>
            </CardContent>
        </Card>
    );
}

export default Signup;