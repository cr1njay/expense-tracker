import { useState, useEffect } from 'react'

function Transactions({ token }) {
    const [transactions, setTransactions] = useState([])
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState("")
    const [newCategoryName, setNewCategoryName] = useState("")
    const [editingId, setEditingId] = useState(null)
    const getCategoryName = (categoryId) => {
        const match = categories.find(c => c.id === categoryId);
        return match ? match.name : "Uncategorized";
    };

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

    useEffect(() => {
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
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("categoryId:", categoryId, "editingId:", editingId, "date:", date, "amount:", amount);
        const url = editingId ? `http://127.0.0.1:5000/transactions/${editingId}` : "http://127.0.0.1:5000/transactions";
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
        fetch(`http://127.0.0.1:5000/transactions/${id}`, {
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

    const handleCreateCategory = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name: newCategoryName })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add category");
            }
            return response.json();
        })
        .then(data => {
            setCategories([...categories, data]);
            setNewCategoryName("");
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
        <>
            <form onSubmit={handleSubmit}>
                <input value={amount} onChange={(e) => setAmount(e.target.value)}></input>
                <input value={description} onChange={(e) => setDescription(e.target.value)}></input>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}></input>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <button type="submit">{editingId ? "Update Transaction" : "Add Transaction"}</button>
            </form>
            <form onSubmit={handleCreateCategory}>
                <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New Category Name"></input>
                <button type="submit">Add Category</button>
            </form>
            <ul>
                {transactions.map(t => (
                    <li key={t.id}>
                        {t.amount} - {t.description} - {getCategoryName(t.category_id)}
                        <button onClick={() => handleEditClick(t)}>Edit</button>
                        <button onClick={() => handleDelete(t.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Transactions