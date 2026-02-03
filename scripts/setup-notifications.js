const mysql = require('mysql2/promise');

// Database configuration (same as your backend server)
const config = {
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "certifurb",
  port: parseInt(process.env.DB_PORT) || 5000,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Logisol321#@!",
};

async function setupNotifications() {
  const pool = mysql.createPool(config);

  try {
    console.log('🔧 Setting up notifications system...');

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();

    // Create notifications table
    console.log('📋 Creating notifications table...');
    await pool.execute(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Notifications table created successfully');

    // Check if table has data
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM notifications');
    const count = rows[0].count;

    if (count === 0) {
      console.log('📝 Adding sample notifications...');
      
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

      console.log(`✅ Added ${notifications.length} sample notifications`);
    } else {
      console.log(`ℹ️  Table already has ${count} notifications`);
    }

    console.log('\n🎉 Notifications system setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure your backend server is running on port 5000');
    console.log('2. Restart your Next.js development server');
    console.log('3. Navigate to your CMS dashboard');
    console.log('4. Check the notification bell in the navbar');
    console.log('5. Test the notification dropdown');

    console.log('\n🔗 Test URLs:');
    console.log('- Test notifications: https://api.certifurb.com/api/cms/notifications/test');
    console.log('- Get notifications: https://api.certifurb.com/api/cms/notifications');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your database credentials in the config');
    console.log('2. Ensure your MySQL server is running');
    console.log('3. Verify the database "Certifurb" exists');
    console.log('4. Check if the user has CREATE TABLE permissions');
  } finally {
    await pool.end();
  }
}

// Run the setup
setupNotifications(); 