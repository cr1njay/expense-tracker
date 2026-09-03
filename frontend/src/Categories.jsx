import { useState } from 'react'

function Categories({ token, categories, setCategories }) {
    const [categoryId, setCategoryId] = useState("")
    const [newCategoryName, setNewCategoryName] = useState("")
    const [editingId, setEditingId] = useState(null)

    const handleCreateCategory = (e) => {
        e.preventDefault()
        const url = editingId ? `http://127.0.0.1:5000/categories/${editingId}` : "http://127.0.0.1:5000/categories";
        const method = editingId ? "PUT" : "POST";
        fetch(url, {
            method: method,
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
            if (editingId) {
                setCategories(categories.map(c => c.id === editingId ? data : c));
            } else {
                setCategories([...categories, data]);
            }
            setNewCategoryName("");
            setEditingId(null);
        })
        .catch(error => console.log(error));
    }

    const handleDeleteCategory = (id) => {
        fetch(`http://127.0.0.1:5000/categories/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete category");
            }
            return response.json();
        })
        .then(data => {
            setCategories(categories.filter(c => c.id !== id));
        })
        .catch(error => console.log(error));
    }

    const handleEditClick = (c) => {
        setNewCategoryName(c.name);
        setEditingId(c.id);
    }

    return (
        <>
            <form onSubmit={handleCreateCategory}>
                <input placeholder="Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}></input>
                <button type="submit">{editingId ? "Update Category" : "Add Category"}</button>
            </form>
            <ul>
                {categories.map(c => (
                    <li key={c.id}>
                        {c.name}
                        <button onClick={() => handleEditClick(c)}>Edit</button>
                        <button onClick={() => handleDeleteCategory(c.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Categories