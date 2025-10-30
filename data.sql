-- ============================================================================
-- MIBCOMMERCE E-COMMERCE APPLICATION
-- Complete Database Setup Script
-- ============================================================================

-- ============================================================================
-- STEP 1: Connect to MySQL as Root User
-- ============================================================================
-- Run this command in terminal:
-- mysql -u root -p
-- Then enter your root password

-- ============================================================================
-- STEP 2: Create Databases
-- ============================================================================

-- Create Product Service Database
CREATE DATABASE IF NOT EXISTS product_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create Auth Service Database
CREATE DATABASE IF NOT EXISTS auth_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create Order Service Database
CREATE DATABASE IF NOT EXISTS order_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Verify databases were created
SHOW DATABASES;

-- ============================================================================
-- STEP 3: Create Database User and Grant Privileges
-- ============================================================================

-- Create user (change password in production!)
CREATE USER IF NOT EXISTS 'ecomuser'@'localhost' 
IDENTIFIED BY 'ecomPassword@123';

-- Grant all privileges on product_db
GRANT ALL PRIVILEGES ON product_db.* TO 'ecomuser'@'localhost';

-- Grant all privileges on auth_db
GRANT ALL PRIVILEGES ON auth_db.* TO 'ecomuser'@'localhost';

-- Grant all privileges on order_db
GRANT ALL PRIVILEGES ON order_db.* TO 'ecomuser'@'localhost';

-- Apply the privilege changes
FLUSH PRIVILEGES;

-- Verify user and privileges
SELECT User, Host FROM mysql.user WHERE User = 'ecomuser';
SHOW GRANTS FOR 'ecomuser'@'localhost';

-- ============================================================================
-- STEP 4: Create Tables for Product Service
-- ============================================================================

-- Switch to product database
USE product_db;

-- Create Brand table
CREATE TABLE IF NOT EXISTS brand (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Type (Category) table
CREATE TABLE IF NOT EXISTS type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Product table
CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price BIGINT NOT NULL,
    picture_url VARCHAR(500),
    quantity_in_stock INT DEFAULT 0,
    product_brand_id INT NOT NULL,
    product_type_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_brand_id) REFERENCES brand(id) ON DELETE CASCADE,
    FOREIGN KEY (product_type_id) REFERENCES type(id) ON DELETE CASCADE,
    INDEX idx_brand (product_brand_id),
    INDEX idx_type (product_type_id),
    INDEX idx_name (name),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- STEP 5: Insert Sample Data for Product Service
-- ============================================================================

-- Insert Brands
INSERT INTO brand (id, name) VALUES 
(1, 'Nike'),
(2, 'Adidas'),
(3, 'Puma'),
(4, 'Reebok'),
(5, 'Under Armour'),
(6, 'New Balance'),
(7, 'Asics'),
(8, 'Converse')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert Product Types (Categories)
INSERT INTO type (id, name) VALUES 
(1, 'Shoes'),
(2, 'Clothing'),
(3, 'Accessories'),
(4, 'Equipment'),
(5, 'Sportswear')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert Sample Products
INSERT INTO product (name, description, price, picture_url, quantity_in_stock, product_brand_id, product_type_id) 
VALUES 
-- Nike Products
('Nike Air Max 270', 'Comfortable running shoes with air cushioning technology. Perfect for daily running and casual wear.', 12999, 'images/products/nike-air-max.jpg', 50, 1, 1),
('Nike Dri-FIT T-Shirt', 'Moisture-wicking sports t-shirt made with breathable fabric. Ideal for intense workouts.', 2999, 'images/products/nike-dri-fit.jpg', 100, 1, 2),
('Nike Baseball Cap', 'Adjustable sports cap with embroidered logo. One size fits all.', 1999, 'images/products/nike-cap.jpg', 75, 1, 3),
('Nike React Infinity Run', 'Premium running shoes designed to help reduce injury. Maximum comfort and support.', 14999, 'images/products/nike-react.jpg', 40, 1, 1),
('Nike Pro Compression Shorts', 'Tight-fitting shorts for enhanced performance. Moisture-wicking fabric.', 3499, 'images/products/nike-shorts.jpg', 80, 1, 2),

-- Adidas Products
('Adidas Ultraboost 22', 'Premium running shoes with boost technology for ultimate comfort and energy return.', 15999, 'images/products/adidas-ultraboost.jpg', 45, 2, 1),
('Adidas Training Pants', 'Comfortable training pants with side pockets. Perfect for gym and outdoor activities.', 4999, 'images/products/adidas-pants.jpg', 60, 2, 2),
('Adidas Gym Gloves', 'Padded workout gloves for better grip and hand protection during weight training.', 2499, 'images/products/adidas-gloves.jpg', 90, 2, 3),
('Adidas Predator Soccer Cleats', 'Professional soccer cleats with superior ball control. Designed for performance.', 11999, 'images/products/adidas-predator.jpg', 35, 2, 1),
('Adidas Track Jacket', 'Classic track jacket with iconic three stripes. Comfortable and stylish.', 5999, 'images/products/adidas-jacket.jpg', 55, 2, 2),

-- Puma Products
('Puma RS-X', 'Retro style sneakers with bold colors. Comfortable for all-day wear.', 9999, 'images/products/puma-rsx.jpg', 65, 3, 1),
('Puma Sports Bag', 'Durable sports duffle bag with multiple compartments. Perfect for gym and travel.', 3499, 'images/products/puma-bag.jpg', 40, 3, 3),
('Puma T-Shirt', 'Cotton sports t-shirt with Puma cat logo. Breathable and comfortable.', 2499, 'images/products/puma-tshirt.jpg', 120, 3, 2),
('Puma Suede Classic', 'Iconic suede sneakers. Timeless style and comfort.', 7999, 'images/products/puma-suede.jpg', 50, 3, 1),
('Puma Training Shorts', 'Lightweight training shorts with elastic waistband. Quick-dry fabric.', 2999, 'images/products/puma-shorts.jpg', 85, 3, 2),

-- Reebok Products
('Reebok CrossFit Shoes', 'Heavy-duty training shoes built for CrossFit workouts. Durable and stable.', 11999, 'images/products/reebok-crossfit.jpg', 30, 4, 1),
('Reebok Yoga Mat', 'Non-slip yoga mat with extra cushioning. 6mm thickness.', 3999, 'images/products/reebok-yoga-mat.jpg', 45, 4, 4),
('Reebok Sports Bra', 'High-impact sports bra with adjustable straps. Maximum support.', 3499, 'images/products/reebok-bra.jpg', 70, 4, 2),
('Reebok Nano X2', 'Versatile training shoes for all types of workouts. Lightweight and flexible.', 10999, 'images/products/reebok-nano.jpg', 40, 4, 1),

-- Under Armour Products
('Under Armour Hoodie', 'Warm fleece hoodie with kangaroo pocket. Perfect for cold weather training.', 6999, 'images/products/ua-hoodie.jpg', 55, 5, 2),
('Under Armour Curry 10', 'Signature basketball shoes with responsive cushioning. Designed for court performance.', 13999, 'images/products/ua-curry.jpg', 25, 5, 1),
('Under Armour Backpack', 'Water-resistant backpack with laptop compartment. Durable and spacious.', 4999, 'images/products/ua-backpack.jpg', 35, 5, 3),
('Under Armour HeatGear Tank', 'Compression tank top that stays cool and dry. UPF 30+ sun protection.', 3299, 'images/products/ua-tank.jpg', 60, 5, 2),

-- New Balance Products
('New Balance 574', 'Classic lifestyle sneakers with iconic design. All-day comfort.', 8999, 'images/products/nb-574.jpg', 55, 6, 1),
('New Balance Fresh Foam', 'Plush running shoes with Fresh Foam cushioning. Smooth ride.', 12999, 'images/products/nb-fresh-foam.jpg', 40, 6, 1),
('New Balance Running Shorts', 'Lightweight running shorts with built-in brief. Reflective details.', 3499, 'images/products/nb-shorts.jpg', 75, 6, 2),

-- Asics Products
('Asics Gel-Kayano 29', 'Stability running shoes with GEL cushioning. Long-distance comfort.', 14999, 'images/products/asics-kayano.jpg', 30, 7, 1),
('Asics Performance Socks', 'Cushioned running socks with arch support. Moisture-wicking.', 1499, 'images/products/asics-socks.jpg', 100, 7, 3),
('Asics Running Tights', 'Compression tights for running. Reflective elements for visibility.', 4999, 'images/products/asics-tights.jpg', 50, 7, 2),

-- Converse Products
('Converse Chuck Taylor All Star', 'Iconic canvas sneakers. Timeless style since 1917.', 5999, 'images/products/converse-chuck.jpg', 80, 8, 1),
('Converse One Star', 'Retro suede sneakers with star logo. Vintage style.', 6999, 'images/products/converse-onestar.jpg', 45, 8, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Verify product data
SELECT p.id, p.name, p.price, b.name as brand, t.name as type 
FROM product p 
JOIN brand b ON p.product_brand_id = b.id 
JOIN type t ON p.product_type_id = t.id 
LIMIT 10;

-- ============================================================================
-- STEP 6: Create Tables for Auth Service
-- ============================================================================

-- Switch to auth database
USE auth_db;

-- Create User table
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert test users (passwords are hashed with BCrypt)
-- Password: password123
INSERT INTO user (username, email, password, first_name, last_name, role) 
VALUES 
('admin', 'admin@mibcommerce.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5hfZAt0eYRkVvdcnLKpn9XRSJ/XgLKW', 'Admin', 'User', 'ADMIN'),
('john', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5hfZAt0eYRkVvdcnLKpn9XRSJ/XgLKW', 'John', 'Doe', 'USER'),
('jane', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5hfZAt0eYRkVvdcnLKpn9XRSJ/XgLKW', 'Jane', 'Smith', 'USER')
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Verify users
SELECT id, username, email, first_name, last_name, role, created_at FROM user;

-- ============================================================================
-- STEP 7: Create Tables for Order Service
-- ============================================================================

-- Switch to order database
USE order_db;

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    basket_id VARCHAR(100),
    subtotal BIGINT NOT NULL,
    delivery_charge BIGINT DEFAULT 0,
    total BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Shipping Address
    shipping_name VARCHAR(100),
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_zip VARCHAR(20),
    shipping_country VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_brand VARCHAR(100),
    product_type VARCHAR(100),
    picture_url VARCHAR(500),
    price BIGINT NOT NULL,
    quantity INT NOT NULL,
    subtotal BIGINT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample orders (optional for testing)
INSERT INTO orders (
    order_number, user_id, basket_id, subtotal, delivery_charge, total, status,
    shipping_name, shipping_address_line1, shipping_city, shipping_state, shipping_zip, shipping_country
) VALUES 
('ORD-2024-00001', 2, 'basket-123', 25998, 200, 26198, 'DELIVERED', 
 'John Doe', '123 Main Street', 'New York', 'NY', '10001', 'USA'),
('ORD-2024-00002', 3, 'basket-456', 15999, 200, 16199, 'PENDING',
 'Jane Smith', '456 Oak Avenue', 'Los Angeles', 'CA', '90001', 'USA')
ON DUPLICATE KEY UPDATE order_number = VALUES(order_number);

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, product_name, product_brand, product_type, picture_url, price, quantity, subtotal)
VALUES 
(1, 1, 'Nike Air Max 270', 'Nike', 'Shoes', 'images/products/nike-air-max.jpg', 12999, 2, 25998),
(2, 6, 'Adidas Ultraboost 22', 'Adidas', 'Shoes', 'images/products/adidas-ultraboost.jpg', 15999, 1, 15999)
ON DUPLICATE KEY UPDATE order_id = VALUES(order_id);

-- Verify order data
SELECT o.order_number, o.user_id, o.total, o.status, o.order_date,
       COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.id
GROUP BY o.id;

-- ============================================================================
-- STEP 8: Verify All Databases and Tables
-- ============================================================================

-- Show all databases
SHOW DATABASES;

-- Show all tables in product_db
USE product_db;
SHOW TABLES;
SELECT 'product_db' as database_name, COUNT(*) as product_count FROM product;
SELECT 'product_db' as database_name, COUNT(*) as brand_count FROM brand;
SELECT 'product_db' as database_name, COUNT(*) as type_count FROM type;

-- Show all tables in auth_db
USE auth_db;
SHOW TABLES;
SELECT 'auth_db' as database_name, COUNT(*) as user_count FROM user;

-- Show all tables in order_db
USE order_db;
SHOW TABLES;
SELECT 'order_db' as database_name, COUNT(*) as order_count FROM orders;
SELECT 'order_db' as database_name, COUNT(*) as order_items_count FROM order_items;

-- ============================================================================
-- STEP 9: Grant Additional Privileges if Needed
-- ============================================================================

-- If you need to grant CREATE/DROP privileges
GRANT CREATE, DROP, ALTER ON product_db.* TO 'ecomuser'@'localhost';
GRANT CREATE, DROP, ALTER ON auth_db.* TO 'ecomuser'@'localhost';
GRANT CREATE, DROP, ALTER ON order_db.* TO 'ecomuser'@'localhost';
FLUSH PRIVILEGES;

-- ============================================================================
-- STEP 10: Test Connection with New User
-- ============================================================================

-- Exit MySQL and reconnect with new user
-- EXIT;
-- mysql -u ecomuser -p
-- Enter password: ecomPassword@123

-- Test queries
USE product_db;
SELECT * FROM brand LIMIT 5;
SELECT * FROM type LIMIT 5;
SELECT * FROM product LIMIT 5;

USE auth_db;
SELECT username, email, role FROM user;

USE order_db;
SELECT * FROM orders;

-- ============================================================================
-- OPTIONAL: Cleanup Commands (Use with Caution!)
-- ============================================================================

-- To drop all databases (WARNING: This will delete all data!)
-- DROP DATABASE IF EXISTS product_db;
-- DROP DATABASE IF EXISTS auth_db;
-- DROP DATABASE IF EXISTS order_db;

-- To drop user
-- DROP USER IF EXISTS 'ecomuser'@'localhost';

-- ============================================================================
-- BACKUP COMMANDS (Recommended)
-- ============================================================================

-- Backup all databases (run in terminal, not in MySQL)
-- mysqldump -u root -p --databases product_db auth_db order_db > mibcommerce_backup.sql

-- Backup specific database
-- mysqldump -u root -p product_db > product_db_backup.sql

-- Restore from backup
-- mysql -u root -p product_db < product_db_backup.sql

-- ============================================================================
-- USEFUL QUERIES FOR MONITORING
-- ============================================================================

-- Check database sizes
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema IN ('product_db', 'auth_db', 'order_db')
GROUP BY table_schema;

-- Check table row counts
SELECT 
    TABLE_SCHEMA AS 'Database',
    TABLE_NAME AS 'Table',
    TABLE_ROWS AS 'Row Count'
FROM information_schema.tables
WHERE TABLE_SCHEMA IN ('product_db', 'auth_db', 'order_db')
ORDER BY TABLE_SCHEMA, TABLE_NAME;

-- ============================================================================
-- END OF DATABASE SETUP
-- ============================================================================

-- Summary of what was created:
-- 1. Three databases: product_db, auth_db, order_db
-- 2. Database user: ecomuser with password: ecomPassword@123
-- 3. Product tables: brand, type, product (with 30+ sample products)
-- 4. Auth tables: user (with 3 sample users)
-- 5. Order tables: orders, order_items (with 2 sample orders)
-- 
-- Default login credentials for testing:
-- Username: john, Password: password123
-- Username: jane, Password: password123
-- Username: admin, Password: password123 (ADMIN role)
