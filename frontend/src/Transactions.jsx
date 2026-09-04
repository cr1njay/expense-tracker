import { useState, useEffect } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function Transactions({ token, categories }) {
    const [transactions, setTransactions] = useState([])
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [editingId, setEditingId] = useState(null)
    const getCategoryName = (categoryId) => {
        const match = categories.find(c => c.id === categoryId);
        return match ? match.name : "Uncategorized";
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
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

    const handleSubmit = (e) => {
        e.preventDefault()
        const url = editingId ? `${import.meta.env.VITE_API_URL}/transactions/${editingId}` : `${import.meta.env.VITE_API_URL}/transactions`;
        const method = editingId ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ amount: amount, description: description, date: date, category_id: categoryId || null })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add transaction");
            }
            return response.json();
        })
        .then(data => {
            if (editingId) {
                setTransactions(transactions.map(t => t.id === editingId ? data : t));
            } else {
                setTransactions([...transactions, data]);
            }
            setEditingId(null);
            setAmount(""); setDescription(""); setDate(""); setCategoryId("");
        })
        .catch(error => console.log(error));
    }

    const handleDelete = (id) => {
        fetch(`${import.meta.env.VITE_API_URL}/transactions/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }
            return response.json();
        })
        .then(data => {
            setTransactions(transactions.filter(t => t.id !== id));
        })
        .catch(error => console.log(error));
    }

    const handleEditClick = (t) => {
        setAmount(t.amount);
        setDescription(t.description);
        setDate(t.date);
        setCategoryId(t.category_id || "");
        setEditingId(t.id);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4">
                <form onSubmit={handleSubmit}>
                    <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <input placeholder="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2">
                        <option value="">Select Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="border border-input bg-background rounded-md px-3 py-2">{editingId ? "Update Transaction" : "Add Transaction"}</button>
                </form>
                <div className="flex flex-col gap-6">
                    {categories.map(c => (
                        <div key={c.id}>
                            <h3 className="font-semibold mb-2">{c.name}</h3>
                            <ul className="flex flex-col gap-2">
                                {transactions.filter(t => t.category_id === c.id).map(t => (
                                    <li key={t.id} className="flex justify-between items-center">
                                        <span>{t.amount} - {t.description}</span>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleEditClick(t)}>Edit</Button>
                                            <Button onClick={() => handleDelete(t.id)}>Delete</Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <h3 className="font-semibold mb-2">Uncategorized</h3>
                        <ul className="flex flex-col gap-2">
                            {transactions.filter(t => !t.category_id).map(t => (
                                <li key={t.id} className="flex justify-between items-center">
                                    <span>{t.amount} - {t.description}</span>
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleEditClick(t)}>Edit</Button>
                                        <Button onClick={() => handleDelete(t.id)}>Delete</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Transactions