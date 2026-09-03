import { useState, useEffect } from 'react'

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
        fetch("http://127.0.0.1:5000/budgets", {
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
        const url = editingId ? `http://127.0.0.1:5000/budgets/${editingId}` : "http://127.0.0.1:5000/budgets";
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
        fetch(`http://127.0.0.1:5000/budgets/${id}`, {
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
        <>
            <form onSubmit={handleSubmit}>
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}></input>
                <input type="month" placeholder="Period" value={period} onChange={(e) => setPeriod(e.target.value)}></input>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <button type="submit">{editingId ? "Update Budget" : "Add Budget"}</button>
            </form>
            <ul>
                {budgets.map(b => (
                    <li key={b.id}>
                        {b.amount} - {b.period} - {getCategoryName(b.category_id)}
                        <button onClick={() => handleEditClick(b)}>Edit</button>
                        <button onClick={() => handleDelete(b.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Budgets