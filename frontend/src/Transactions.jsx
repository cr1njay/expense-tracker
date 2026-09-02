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

    return (
        <ul>
            {transactions.map(t => (
                <li key={t.id}>
                    {t.amount} - {t.description}
                </li>
            ))}
        </ul>
    )
}

export default Transactions