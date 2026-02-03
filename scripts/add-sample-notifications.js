const mysql = require('mysql2/promise');

// Database configuration
const config = {
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "Certifurb",
  port: parseInt(process.env.DB_PORT) || 5000,
  user: process.env.DB_USER || "logisol",
  password: process.env.DB_PASSWORD || "logisol321123",
};

async function addSampleNotifications() {
  const pool = mysql.createPool(config);

  try {
    // Sample notifications
    const notifications = [
      {
        type: 'user',
        title: 'New User Registration',
        message: 'New user registered: John Doe (john.doe@example.com)',
        isRead: false
      },
      {
        type: 'order',
        title: 'New Order Received',
        message: 'New order #12345 received for $299.99',
        isRead: false
      },
      {
        type: 'product',
        title: 'New Product Added',
        message: 'New product "MacBook Pro 2023" has been added to inventory',
        isRead: false
      },
      {
        type: 'auction',
        title: 'New Auction Product',
        message: 'New auction product "iPhone 15 Pro" has been listed for $999',
        isRead: false
      },
      {
        type: 'auction',
        title: 'New Auction Request',
        message: 'New auction request from Jane Smith (jane.smith@example.com)',
        isRead: false
      },
      {
        type: 'email',
        title: 'New Email Received',
        message: 'New email from customer@example.com: Order inquiry',
        isRead: false
      },
      {
        type: 'shipment',
        title: 'New Shipment Created',
        message: 'New shipment created for order #12345',
        isRead: false
      },
      {
        type: 'review',
        title: 'New Review Submitted',
        message: 'New review submitted for product "Samsung Galaxy S24"',
        isRead: false
      },
      {
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'Product "Samsung Galaxy S24" is running low on stock (5 remaining)',
        isRead: false
      },
      {
        type: 'warning',
        title: 'Payment Failed',
        message: 'Payment failed for order #12346',
        isRead: false
      }
    ];

    // Insert notifications
    for (const notification of notifications) {
      await pool.execute(`
        INSERT INTO notifications (type, title, message, isRead, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `, [
        notification.type,
        notification.title,
        notification.message,
        notification.isRead
      ]);
    }

    console.log('✅ Sample notifications added successfully!');
  } catch (error) {
    console.error('❌ Error adding sample notifications:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
addSampleNotifications(); 