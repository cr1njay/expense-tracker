# Expense Tracker

A full-stack web app for tracking personal expenses — log transactions, organize them by category, set budgets, and see spending broken down over time.

## Features
- User accounts with JWT-based authentication (signup/login)
- Full CRUD for transactions, categories, and budgets — all scoped to the logged-in user
- Spending summaries: totals by category, totals by month, and budget-vs-actual comparisons
- Frontend dashboard with charts (in progress)

## Tech Stack
- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Werkzeug (password hashing)
- **Database:** SQLite (development) / PostgreSQL (production)
- **Frontend:** React
- **Charts:** Recharts / Chart.js

## Project Structure
```
expense-tracker/
├── backend/     # Flask API, database models, business logic
├── frontend/    # React app
└── README.md
```

## Getting Started

### Backend
1. Navigate to `backend/`
2. Create and activate a virtual environment
3. Install dependencies: `pip install -r requirements.txt`
4. Create a `.env` file in `backend/` with:
   ```
   JWT_SECRET_KEY=your-random-secret-here
   ```
5. Create the database tables:
   ```
   flask shell
   >>> from extensions import db
   >>> db.create_all()
   >>> exit()
   ```
6. Run the app: `python app.py`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies
3. Start the dev server

## API Endpoints

**Auth**
- `POST /signup` — create a new user
- `POST /login` — log in, returns a JWT access token

All routes below require a valid JWT in the `Authorization: Bearer <token>` header, and only return/affect data belonging to the logged-in user.

**Transactions**
- `GET /transactions` — list all transactions
- `GET /transactions/<id>` — get one transaction
- `POST /transactions` — create a transaction
- `PUT /transactions/<id>` — update a transaction
- `DELETE /transactions/<id>` — delete a transaction

**Categories**
- `GET /categories` — list all categories
- `POST /categories` — create a category
- `DELETE /categories/<id>` — delete a category

**Budgets**
- `GET /budgets` — list all budgets
- `POST /budgets` — create a budget
- `PUT /budgets/<id>` — update a budget
- `DELETE /budgets/<id>` — delete a budget

**Summaries**
- `GET /summary/by-category` — total spending per category
- `GET /summary/monthly` — total spending per month
- `GET /summary/budget-vs-actual` — budgeted vs. actual spending per budget

## Status
✅ Backend complete — full data model, JWT auth, ownership checks, and summary endpoints, all tested.
🚧 Frontend in progress.