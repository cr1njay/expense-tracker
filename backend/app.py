from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "some-random-string-here"  # Change this to a random secret key in production

from extensions import db, jwt
db.init_app(app)
jwt.init_app(app)

from models import Transaction

@app.route('/')
def index():
    return "Server is running!"

@app.route('/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_transaction = Transaction(
        amount=data['amount'],
        description=data['description'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date() if 'date' in data else datetime.now().date(),
        user_id=int(current_user_id)
    )
    db.session.add(new_transaction)
    db.session.commit()
    return {"message": "Transaction created successfully!", "transaction_id": new_transaction.id}, 201

@app.route('/transactions')
@jwt_required()
def get_transactions():
    current_user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=int(current_user_id)).all()
    return [t.to_dict() for t in transactions]

@app.route('/transactions/<int:id>')
@jwt_required()
def get_transaction(id):
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.get(id)
    if not transaction:
        return {"error": "Transaction not found"}, 404
    if transaction.user_id != int(current_user_id):
        return {"error": "Unauthorized access"}, 403
    return transaction.to_dict()

@app.route('/transactions/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(id):
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.get(id)
    if not transaction:
        return {"error": "Transaction not found"}, 404
    if transaction.user_id != int(current_user_id):
        return {"error": "Unauthorized access"}, 403
    db.session.delete(transaction)
    db.session.commit()
    return {"message": "Transaction deleted successfully!"}

@app.route('/transactions/<int:id>', methods=['PUT'])
@jwt_required()
def update_transaction(id):
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.get(id)
    if not transaction:
        return {"error": "Transaction not found"}, 404
    if transaction.user_id != int(current_user_id):
        return {"error": "Unauthorized access"}, 403
    data = request.get_json()
    if "amount" in data:
        transaction.amount = data['amount']
    if "description" in data:
        transaction.description = data['description']
    if "date" in data:
        transaction.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    db.session.commit()
    return transaction.to_dict()

from models import User

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return {"message": "User created successfully!", "id": new_user.id, "username": new_user.username}, 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if not user:
        return {"error": "Invalid username or password"}, 401
    if user:
        if not check_password_hash(user.password_hash, data['password']):
            return {"error": "Invalid username or password"}, 401
        access_token = create_access_token(identity=str(user.id))
        return {"message": "Login successful!", "access_token": access_token, "id": user.id, "username": user.username}, 200

if __name__ == '__main__':
    app.run(debug=True)