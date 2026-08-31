from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from extenstions import db
db.init_app(app)

from models import Transaction

@app.route('/')
def index():
    return "Server is running!"

@app.route('/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    new_transaction = Transaction(
        amount=data['amount'],
        description=data['description'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
    )
    db.session.add(new_transaction)
    db.session.commit()
    return {"message": "Transaction created successfully!", "transaction_id": new_transaction.id}, 201

@app.route('/transactions')
def get_transactions():
    transactions = Transaction.query.all()
    return [t.to_dict() for t in transactions]

@app.route('/transactions/<int:id>')
def get_transaction(id):
    transaction = Transaction.query.get(id)
    if not transaction:
        return {"error": "Transaction not found"}, 404
    return transaction.to_dict()

if __name__ == '__main__':
    app.run(debug=True)