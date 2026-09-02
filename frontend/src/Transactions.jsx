import { useState, useEffect } from 'react'

function Transactions({ token }) {
    const [transactions, setTransactions] = useState([])
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")

    useEffect(() => {
        fetch("http://127.0.0.1:5000/transactions", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }
            return response.json();
        })
        .then(data => {
            setTransactions(data);
        })
        .catch(error => console.log(error));
    }, [])

    const handleCreate = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ amount: amount, description: description, date: date })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add transaction");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            setTransactions([...transactions, data]);
        })
        .catch(error => console.log(error));
    }

    return (
        <>
            <form onSubmit={handleCreate}>
                <input value={amount} onChange={(e) => setAmount(e.target.value)}></input>
                <input value={description} onChange={(e) => setDescription(e.target.value)}></input>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}></input>
                <button type="submit">Add Transaction</button>
            </form>
            <ul>
                {transactions.map(t => (
                    <li key={t.id}>{t.amount} - {t.description}</li>
                ))}
            </ul>
        </>
    )
}

export default Transactions