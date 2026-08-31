from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

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

@app.route('/transactions/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    transaction = Transaction.query.get(id)
    if not transaction:
        return {"error": "Transaction not found"}, 404
    db.session.delete(transaction)
    db.session.commit()
    return {"message": "Transaction deleted successfully!"}

@app.route('/transactions/<int:id>', methods=['PUT'])
def update_transaction(id):
    transaction = Transaction.query.get(id)
    if not transaction:
        return {"error": "Transaction not found"}, 404
    data = request.get_json()
    if "amount" in data:
        transaction.amount = data['amount']
    if "description" in data:
        transaction.description = data['description']
    if "date" in data:
        transaction.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    db.session.commit()
    return transaction.to_dict()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password
    )
    db.add(new_user)
    db.session.commit()
    return {"message": "User created successfully!", "id": new_user.id, "username": new_user.username}, 201

if __name__ == '__main__':
    app.run(debug=True)