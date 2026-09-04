import { useState, useEffect } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function Budgets({ token, categories }) {
    const [budgets, setBudgets] = useState([])
    const [amount, setAmount] = useState("")
    const [period, setPeriod] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [editingId, setEditingId] = useState(null)
    const getCategoryName = (categoryId) => {
        const match = categories.find(c => c.id === categoryId);
        return match ? match.name : "Uncategorized";
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/budgets`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch budgets");
            }
            return response.json();
        })
        .then(data => {
            setBudgets(data);
        })
        .catch(error => console.log(error));
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        const url = editingId ? `${import.meta.env.VITE_API_URL}/budgets/${editingId}` : `${import.meta.env.VITE_API_URL}/budgets`;
        const method = editingId ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ amount, period, category_id: categoryId || null})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add budget");
            }
            return response.json();
        })
        .then(data => {
            if (editingId) {
                setBudgets(budgets.map(b => b.id === editingId ? data : b));
            } else {
                setBudgets([...budgets, data]);
            }
            setEditingId(null); 
            setAmount(""); setPeriod(""); setCategoryId("");
        })
        .catch(error => console.log(error));
    }

    const handleDelete = (id) => {
        fetch(`${import.meta.env.VITE_API_URL}/budgets/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete budget");
            }
            return response.json();
        })
        .then(data => {
            setBudgets(budgets.filter(budget => budget.id !== id));
        })
        .catch(error => console.log(error));
    }

    const handleEditClick = (b) => {
        setAmount(b.amount);
        setPeriod(b.period);
        setCategoryId(b.category_id || "");
        setEditingId(b.id);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budgets</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4">
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <input type="month" placeholder="Period" value={period} onChange={(e) => setPeriod(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2">
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <button type="submit" className="border border-input bg-background rounded-md px-3 py-2">{editingId ? "Update Budget" : "Add Budget" }</button>
                </form>
                <div className="flex flex-col gap-6">
                    {categories.map(c => (
                        <div key={c.id}>
                            <h3 className="font-semibold mb-2">{c.name}</h3>
                            <ul className="flex flex-col gap-2">
                                {budgets.filter(b => b.category_id === c.id).map(b => (
                                    <li key={b.id} className="flex justify-between items-center">
                                        <span>{b.amount} - {b.period}</span>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleEditClick(b)}>Edit</Button>
                                            <Button onClick={() => handleDelete(b.id)}>Delete</Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default Budgets