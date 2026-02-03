-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL COMMENT 'Type of notification: user, order, product, auction, email, shipment, review, warning, success',
  title VARCHAR(255) NOT NULL COMMENT 'Notification title',
  message TEXT NOT NULL COMMENT 'Notification message',
  isRead BOOLEAN DEFAULT FALSE COMMENT 'Whether notification has been read',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When notification was created',
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'When notification was last updated',
  INDEX idx_type (type),
  INDEX idx_isRead (isRead),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some sample notifications for testing
INSERT INTO notifications (type, title, message, isRead) VALUES
('user', 'New User Registration', 'New user registered: john.doe@example.com', false),
('order', 'New Order Received', 'New order #12345 received for $299.99', false),
('product', 'New Product Added', 'New product "MacBook Pro 2023" has been added to inventory', false),
('auction', 'New Auction Product', 'New auction product "iPhone 15 Pro" has been listed', false),
('email', 'New Email Received', 'New email from customer@example.com: Order inquiry', false),
('warning', 'Low Stock Alert', 'Product "Samsung Galaxy S24" is running low on stock (5 remaining)', false); 