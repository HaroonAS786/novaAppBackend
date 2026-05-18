-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(100),
  price DECIMAL(10, 2),
  originalPrice DECIMAL(10, 2),
  rating DECIMAL(3, 1),
  reviews INT DEFAULT 0,
  stock INT DEFAULT 0,
  sold INT DEFAULT 0,
  badge VARCHAR(100),
  description LONGTEXT,
  tags TEXT,
  imageUrl LONGTEXT,
  imageAlt VARCHAR(255),
  accent VARCHAR(20),
  deliveryEta VARCHAR(100),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (userId, productId),
  INDEX idx_userId (userId)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  shopperEmail VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  statusIndex INT DEFAULT 0,
  eta VARCHAR(100),
  subtotal DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  shippingCost DECIMAL(10, 2),
  total DECIMAL(10, 2),
  deliveryMethod VARCHAR(100),
  paymentMethod VARCHAR(100),
  destination TEXT,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_status (status)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId VARCHAR(50) NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL,
  priceAtPurchase DECIMAL(10, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id),
  INDEX idx_orderId (orderId)
);

-- Ensure schema upgrades if existing tables lack the new columns
ALTER TABLE products ADD COLUMN tags TEXT;
ALTER TABLE orders ADD COLUMN shopperEmail VARCHAR(255);
ALTER TABLE orders ADD COLUMN statusIndex INT DEFAULT 0;
ALTER TABLE orders ADD COLUMN eta VARCHAR(100);
ALTER TABLE orders ADD COLUMN deliveryMethod VARCHAR(100);
ALTER TABLE orders ADD COLUMN paymentMethod VARCHAR(100);
ALTER TABLE orders ADD COLUMN destination TEXT;
ALTER TABLE orders ADD COLUMN notes TEXT;
