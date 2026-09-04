import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function Summary({ token, categories }) {
    const [byCategory, setByCategory] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [budgetVsActual, setBudgetVsActual] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/summary/by-category`, {
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
        fetch(`${import.meta.env.VITE_API_URL}/summary/monthly`, {
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
        fetch(`${import.meta.env.VITE_API_URL}/summary/budget-vs-actual`, {
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
        <Card>
            <CardHeader>
                <CardTitle>Summary</CardTitle>
            </CardHeader>
        <CardContent className="p-4 flex flex-col gap-8">
            <div>
                <h2 className="font-semibold text-lg mb-3">Spending by Category</h2>
                <div className="flex flex-col gap-3">
                    {categories.map(c => {
                        const row = byCategory.find(r => r.category_id === c.id);
                        return (
                            <div key={c.id}>
                                <h3 className="font-semibold">{c.name}</h3>
                                <p className="text-sm">Total: ${row ? row.total_amount : 0}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div>
                <h2 className="font-semibold text-lg mb-3">Monthly Totals</h2>
                <ul className="flex flex-col gap-1">
                    {monthly.map((row, index) => (
                        <li key={index} className="text-sm">
                            {row.month}: ${row.total}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="font-semibold text-lg mb-3">Budget vs Actual</h2>
                <div className="flex flex-col gap-3">
                    {categories.map(c => (
                        <div key={c.id}>
                            <h3 className="font-semibold">{c.name}</h3>
                            <ul className="flex flex-col gap-1">
                                {budgetVsActual.filter(r => r.category_id === c.id).map((r, index) => (
                                    <li key={index} className="text-sm">
                                        {r.period}: Budgeted ${r.budgeted}, Actual ${r.actual}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
    </CardContent>
  </Card>
)
}

export default Summary