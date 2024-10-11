from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from enum import Enum
import os
import bcrypt
from dotenv import load_dotenv



# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure SQLite database URI
database_uri = os.getenv('SQL_DATABASE_URI')
if not database_uri:
    raise RuntimeError("SQL_DATABASE_URI environment variable not set")

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()
db.init_app(app)

# # Test database connection
# try:
#     with app.app_context():
#         with db.engine.connect() as connection:
#             connection.execute(text('SELECT 1'))
#     print("Database connection successful!")
# except Exception as e:
#     print(f"Error connecting to the database: {e}")


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
    
    # Using phone_number as primary key
    phone_number = db.Column(db.String(20), primary_key=True, nullable=False)
    
    name = db.Column(db.String(255))
    address = db.Column(db.String(255))
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
    phone_number = db.Column(db.String(20), db.ForeignKey('account.phone_number'))
    seller_id = db.Column(db.Integer, db.ForeignKey('seller.seller_id'))
    unid = db.Column(db.Integer, db.ForeignKey('product.unid'))
    qty = db.Column(db.Integer)
    total = db.Column(db.Numeric(10, 2))
    trans_status = db.Column(db.Enum(TransactionStatus))


# Initialize the database
def initialize_database():
    with app.app_context():
        db.create_all()
        print("Database initialized successfully!")


# Endpoint to add a new user account
@app.route('/api/createaccount', methods=['POST'])
def create_account():
    data = request.json  # Expecting JSON data

    # Extracting fields from the request
    name = data.get('name')
    address = data.get('address', '') #Optional first
    phone_number = data.get('phone_number')
    password = data.get('password')
    wishlist = data.get('wishlist', '')  # Optional field, default to empty string
    seller_flag = data.get('seller_flag')
    seller_id = None
    if seller_flag == '1':
        seller_id = phone_number 

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Create a new account, seller_id can be None if not provided
    new_account = Account(
        name=name,
        address=address,
        phone_number=phone_number,
        password=hashed_password.decode('utf-8'),
        wishlist=wishlist,
        seller_id=seller_id  # This can be null
    )

    # Add and commit the new account to the database
    db.session.add(new_account)
    db.session.commit()  # Persist the data

    return jsonify({
        "name": new_account.name,
        "address": new_account.address,
        "phone_number": new_account.phone_number,
        "wishlist": new_account.wishlist,
        "seller_id": new_account.seller_id
    }), 201


@app.route('/api/accounts', methods=['GET'])
def get_all_accounts():
    # Query all accounts from the database
    accounts = Account.query.all()

    # Print each account's details, including seller_id
    for account in accounts:
        print(f"Name: {account.name}, Address: {account.address}, "
              f"Phone: {account.phone_number}, Wishlist: {account.wishlist}, Seller ID: {account.seller_id}")

    # Return a JSON response including the seller_id
    account_list = [{"name": account.name, "address": account.address,
                     "phone_number": account.phone_number, "wishlist": account.wishlist,
                     "seller_id": account.seller_id, "password": account.password}  # Include seller_id
                    for account in accounts]

    return jsonify(account_list), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json  # Expecting JSON data

    # Extracting username and password from the request
    phone_number = data.get('phone_number')
    password = data.get('password')

    # Check if the account exists
    account = Account.query.filter_by(phone_number=phone_number).first()

    if account is None:
        # If account does not exist, return an error
        return jsonify({"message": "Account not found!"}), 404

    # Verify the password
    if bcrypt.checkpw(password.encode('utf-8'), account.password.encode('utf-8')):
        # Password is correct, return success message
                return jsonify({
            "name": account.name,
            "address": account.address,
            "phone_number": account.phone_number,
            "wishlist": account.wishlist,
            "seller_id": account.seller_id
        }), 200
    else:
        # Password is incorrect
        return jsonify({"message": "Invalid password!"}), 401

@app.route('/')
def test():
    return "Flask app is running!"

if __name__ == '__main__':
    initialize_database() 
    app.run(debug=True, use_reloader=False)