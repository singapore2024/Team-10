CREATE SCHEMA JPM;
USE JPM;

CREATE TABLE Seller (
    seller_id INT PRIMARY KEY,
    location VARCHAR(255),
    rating DECIMAL(2, 1)
);

CREATE TABLE Account (
    acc_id INT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    phone_number VARCHAR(20),
    password VARCHAR(255),
    seller_id INT,
    wishlist TEXT,
    FOREIGN KEY (seller_id) REFERENCES Seller(seller_id)
);

CREATE TABLE Product (
    unid INT PRIMARY KEY,
    product_id VARCHAR(255),
    seller_id INT,
    qty INT,
    price DECIMAL(10, 2),
    name VARCHAR(255),
    image VARCHAR(255),
    type VARCHAR(50),
    FOREIGN KEY (seller_id) REFERENCES Seller(seller_id)
);

CREATE TABLE `Transaction` (
    trans_id INT PRIMARY KEY,
    acc_id INT,
    seller_id INT,
    unid INT,
    qty INT,
    total DECIMAL(10, 2),
    trans_status ENUM('ORDERED', 'READY', 'COMPLETED', 'INCOMPLETE'),
    FOREIGN KEY (acc_id) REFERENCES Account(acc_id),
    FOREIGN KEY (seller_id) REFERENCES Seller(seller_id),
    FOREIGN KEY (unid) REFERENCES Product(unid)
);
