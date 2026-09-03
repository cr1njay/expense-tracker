import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
        <Card>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4">
                <form onSubmit={handleCreateCategory}>
                    <input placeholder="Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="border border-input bg-background rounded-md px-3 py-2"></input>
                    <button type="submit" className="border border-input bg-background rounded-md px-3 py-2">{editingId ? "Update Category" : "Add Category"}</button>
                </form>
                <ul className="flex flex-col gap-2">
                    {categories.map(c => (
                        <li key={c.id} className="flex justify-between items-center">
                            <span>{c.name}</span>
                            <div className="flex gap-2">
                                <Button onClick={() => handleEditClick(c)}>Edit</Button>
                                <Button onClick={() => handleDeleteCategory(c.id)}>Delete</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

export default Categories