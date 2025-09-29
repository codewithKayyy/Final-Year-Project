const db = require('./src/config/db');

async function setupUsersTable() {
    try {
        console.log('Creating users table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                INDEX idx_username (username),
                INDEX idx_email (email)
            )`;

        await db.execute(createTableQuery);
        console.log('Users table created successfully!');

        // Insert a default admin user
        const insertAdminQuery = `
            INSERT INTO users (username, email, password_hash, role)
            VALUES
            ('admin', 'admin@company.com', '$2a$10$YourHashedPasswordHere', 'admin')
            ON DUPLICATE KEY UPDATE username = VALUES(username)`;

        // For demo purposes, let's hash a simple password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await db.execute(
            `INSERT INTO users (username, email, password_hash, role)
             VALUES ('admin', 'admin@company.com', ?, 'admin')
             ON DUPLICATE KEY UPDATE username = VALUES(username)`,
            [hashedPassword]
        );

        console.log('Default admin user created successfully!');
        console.log('Login credentials: username=admin, password=admin123');

        // Test the table
        const [rows] = await db.execute('SELECT id, username, email, role FROM users');
        console.log('Current users:', rows.length);
        rows.forEach(user => {
            console.log(`- ${user.username} (${user.email}) - ${user.role}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error setting up users table:', error);
        process.exit(1);
    }
}

setupUsersTable();