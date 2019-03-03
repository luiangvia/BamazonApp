DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products (
item_id INTEGER(10) NOT NULL,
product_name VARCHAR(30)NOT NULL, 
department_name VARCHAR(30)NOT NULL,
price INTEGER(10) NOT NULL,
stock_quantity INTEGER(10) NOT NULL,
PRIMARY KEY (item_id)
);
USE bamazon;
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES
(3439, "Oral-B 7000 Toothbrush", "Beauty & Personal Care", 100 , 69),
(7362, "Apple Airpods", "Electronics", 150 , 80),
(2830, "Pencil", "Office Supplies", 1 , 892),
(2372, "I-Phone X", "Electronics", 999.99 , 812),
(7420, "Gold Bracelet", "Jewelry", 500 , 340),
(2820, "Cup", "Kitchen", 20 , 999),
(7423, "Dog Food", "Animals", 40 , 569),
(2931, "Cat Necklace", "Animals", 10 , 199),
(3480, "Soccer Ball", "Sports", 40 , 499),
(2801, "Polarized Sports Sunglasses", "Fashion", 250 , 289);
SELECT * FROM products;