from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from enum import Enum
import os, bcrypt, uuid
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


# # Initialize the database
# @app.before_first_request
# def initialize_database():
#     db.create_all()


# Endpoint to add a new user account
@app.route('/api/createaccount', methods=['POST'])
def create_account():
    data = request.json  # Expecting JSON data

    # Extracting fields from the request
    name = data.get('name')
    address = data.get('address')
    phone_number = data.get('phone_number')
    password = data.get('password')
    wishlist = data.get('wishlist', '')  # Optional field, default to empty string
    seller_id = data.get('seller_id')  # Optional field, can be None

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
        "id": new_account.acc_id,
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
        print(f"ID: {account.acc_id}, Name: {account.name}, Address: {account.address}, "
              f"Phone: {account.phone_number}, Wishlist: {account.wishlist}, Seller ID: {account.seller_id}")

    # Return a JSON response including the seller_id
    account_list = [{"id": account.acc_id, "name": account.name, "address": account.address,
                     "phone_number": account.phone_number, "wishlist": account.wishlist,
                     "seller_id": account.seller_id, "password": account.password}  # Include seller_id
                    for account in accounts]

    return jsonify(account_list), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json  # Expecting JSON data

    # Extracting username and password from the request
    name = data.get('name')
    password = data.get('password')

    # Check if the account exists
    account = Account.query.filter_by(name=name).first()

    if account is None:
        # If account does not exist, return an error
        return jsonify({"message": "Account not found!"}), 404

    # Verify the password
    if bcrypt.checkpw(password.encode('utf-8'), account.password.encode('utf-8')):
        # Password is correct, return success message
                return jsonify({
            "id": account.acc_id,
            "name": account.name,
            "address": account.address,
            "phone_number": account.phone_number,
            "wishlist": account.wishlist,
            "seller_id": account.seller_id
        }), 200
    else:
        # Password is incorrect
        return jsonify({"message": "Invalid password!"}), 401
    
# POST endpoint to add a new seller
@app.route('/api/add_seller', methods=['POST'])
def add_seller():
    data = request.get_json()
    locations = data.get('location')
    account_id = data.get('account_id')
    rating = 0
    if not locations or not account_id:
        return jsonify({"message": "Missing required fields!"}), 400
    
    if not Account.query.get(account_id):
        return jsonify({"message": "Account not found!"}), 404
    
    # update the account with the seller_id
    account = Account.query.get(account_id)

    # if already have sellerid dont create new seller
    if account and account.seller_id:
        return jsonify({"message": "Seller already exists!"}), 409
    
    new_seller = Seller(location=locations, rating=rating)
    account.seller_id = new_seller.seller_id
    db.session.add(account)
    db.session.add(new_seller)
    db.session.commit()
    
    return jsonify({"message": "Seller added successfully!"}), 201

@app.route('/api/sellers', methods=['GET'])
def get_all_sellers():
    sellers = Seller.query.all()
    seller_list = [{"seller_id": seller.seller_id, "location": seller.location, "rating": seller.rating} for seller in sellers]
    return jsonify(seller_list), 200

@app.route('/api/sellers/<int:seller_id>', methods=['GET'])
def get_seller_by_id(seller_id):
    seller = Seller.query.get(seller_id)
    if seller is None:
        return jsonify({"message": "Seller not found!"}), 404
    return jsonify({"seller_id": seller.seller_id, "location": seller.location, "rating": seller.rating}), 200

@app.route('/api/products', methods=['GET'])
def get_all_products():
    products = Product.query.all()
    product_list = [{"unid": product.unid, "product_id": product.product_id, "seller_id": product.seller_id, "qty": product.qty, "price": str(product.price), "name": product.name, "image": product.image, "type": product.type} for product in products]
    return jsonify(product_list), 200

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    product_id = data.get('product_id')
    seller_id = data.get('seller_id')
    qty = data.get('qty')
    price = data.get('price')
    name = data.get('name')
    image = data.get('image')
    type = data.get('type')
    if not product_id or not seller_id or not qty or not price or not name or not image or not type:
        return jsonify({"message": "Missing required fields!"}), 400
    if not Seller.query.get(seller_id):
        return jsonify({"message": "Seller not found!"}), 404
    new_product = Product(product_id=product_id, seller_id=seller_id, qty=qty, price=price, name=name, image=image, type=type)
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully!"}), 201

# Get products from seller
@app.route('/api/sellers/<int:seller_id>/products', methods=['GET'])
def get_products_by_seller(seller_id):
    products = Product.query.filter_by(seller_id=seller_id).all()
    if not products:
        return jsonify({"message": "No products found!"}), 404
    product_list = [{"unid": product.unid, "product_id": product.product_id, "seller_id": product.seller_id, "qty": product.qty, "price": str(product.price), "name": product.name, "image": product.image, "type": product.type} for product in products]
    return jsonify(product_list), 200

# Create transaction
@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    acc_id = data.get('acc_id')
    seller_id = data.get('seller_id')
    unid = data.get('unid')
    qty = data.get('qty')
    total = data
    new_transaction = Transaction(acc_id=acc_id, seller_id=seller_id, unid=unid, qty=qty, total=total)
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({"message": "Transaction created successfully!"}), 201

    

@app.route('/')
def test():
    return "Flask app is running!"

if __name__ == '__main__':
    app.run(debug=True)