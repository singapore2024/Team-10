from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from enum import enum

# Initialize Flask app
app = Flask(__name__)

# Configure SQLite database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'

db = SQLAlchemy()

# Enum for transaction status
class TransactionStatus(Enum):
    ORDERED = 'ORDERED'
    READY = 'READY'
    COMPLETED = 'COMPLETED'
    INCOMPLETE = 'INCOMPLETE'


class Seller(db.Model):
    __tablename__ = 'seller'
    
    seller_id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(255))
    rating = db.Column(db.Numeric(2, 1))

    # One-to-Many relationship with Product and Account
    products = db.relationship('Product', backref='seller', lazy=True)
    accounts = db.relationship('Account', backref='seller', lazy=True)
    transactions = db.relationship('Transaction', backref='seller', lazy=True)


class Account(db.Model):
    __tablename__ = 'account'
    
    acc_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    address = db.Column(db.String(255))
    phone_number = db.Column(db.String(20))
    password = db.Column(db.String(255))
    seller_id = db.Column(db.Integer, db.ForeignKey('seller.seller_id'), nullable=True)
    wishlist = db.Column(db.Text)

    # One-to-Many relationship with Transaction
    transactions = db.relationship('Transaction', backref='account', lazy=True)


class Product(db.Model):
    __tablename__ = 'product'
    
    unid = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.String(255))
    seller_id = db.Column(db.Integer, db.ForeignKey('seller.seller_id'))
    qty = db.Column(db.Integer)
    price = db.Column(db.Numeric(10, 2))
    name = db.Column(db.String(255))
    image = db.Column(db.String(255))
    type = db.Column(db.String(50))

    # One-to-Many relationship with Transaction
    transactions = db.relationship('Transaction', backref='product', lazy=True)


class Transaction(db.Model):
    __tablename__ = 'transaction'
    
    trans_id = db.Column(db.Integer, primary_key=True)
    acc_id = db.Column(db.Integer, db.ForeignKey('account.acc_id'))
    seller_id = db.Column(db.Integer, db.ForeignKey('seller.seller_id'))
    unid = db.Column(db.Integer, db.ForeignKey('product.unid'))
    qty = db.Column(db.Integer)
    total = db.Column(db.Numeric(10, 2))
    trans_status = db.Column(db.Enum(TransactionStatus))

@app.route('/')
def test():
    pass

if __name__ == '__main__':
    app.run(debug=True)
