DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(45) NULL,
    department_name VARCHAR(50) NULL,
    price DECIMAL(20,2),
    stock_quantity INT NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("xbox", "electronics", "300.00", "42");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("ps4", "electronics", "210.00", "46");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("tv", "electronics", "499.99", "36");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("scarf", "clothing", "13.75", "12");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("shoes", "clothing", "54.00", "31");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("earrings", "jewelry", "49.95", "8");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("rings", "jewelry", "499.99", "36");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("bed sheets", "home", "19.99", "21");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("pillows", "home", "9.00", "20");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("rugs", "home", "21.50", "15");


