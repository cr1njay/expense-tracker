import { useState, useEffect } from "react";

function Summary({ token, categories }) {
    const [byCategory, setByCategory] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [budgetVsActual, setBudgetVsActual] = useState([]);
    const getCategoryName = (categoryId) => {
        const match = categories.find(c => c.id === categoryId);
        return match ? match.name : "Uncategorized";
    };

    useEffect(() => {
        fetch("http://127.0.0.1:5000/summary/by-category", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch summary");
            }
            return response.json();
        })
        .then(data => {
            setByCategory(data);
        })
        .catch(error => console.log(error));
    }, [token])

    useEffect(() => {
        fetch("http://127.0.0.1:5000/summary/monthly", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch summary");
            }
            return response.json();
        })
        .then(data => {
            setMonthly(data);
        })
        .catch(error => console.log(error));
    }, [token])

    useEffect(() => {
        fetch("http://127.0.0.1:5000/summary/budget-vs-actual", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch summary");
            }
            return response.json();
        })
        .then(data => {
            setBudgetVsActual(data);
        })
        .catch(error => console.log(error));
    }, [token])

    return (
        <>
            <ul>
                {byCategory.map((row, index) => (
                    <li key={index}>
                        {getCategoryName(row.category_id)}: ${row.total}
                    </li>
                ))}
            </ul>
            <ul>
                {monthly.map((row, index) => (
                    <li key={index}>
                        {row.month}: ${row.total}
                    </li>
                ))}
            </ul>
            <ul>
                {budgetVsActual.map((row, index) => (
                    <li key={index}>
                        {getCategoryName(row.category_id)}: Period: {row.period} - Budget: ${row.budgeted}, Actual: ${row.actual}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Summary