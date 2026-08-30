from extenstions import db

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    description = db.Column(db.String(200))
    date = db.Column(db.Date)
    created_at = db.Column(db.DateTime)