import { useState } from 'react'

function Signup({ onSignupSuccess }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:5000/signup", {
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
            console.log(data);
            onSignupSuccess();
        })
        .catch(error => console.log(error));
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={username} onChange={(e) => setUsername(e.target.value)}></input>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default Signup;