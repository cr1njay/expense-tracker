from extenstions import db

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    description = db.Column(db.String(200))
    date = db.Column(db.Date)
    created_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "description": self.description,
            "date": self.date.isoformat(),
            "created_at": self.created_at.isoformat()
        }