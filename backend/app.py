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

if __name__ == '__main__':
    app.run(debug=True)