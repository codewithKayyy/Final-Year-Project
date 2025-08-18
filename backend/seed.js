// backend/seed.js
const pool = require('./src/config/db');

async function seed() {
    try {
        // 1. Ensure campaigns table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS campaigns (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                status ENUM('DRAFT','ACTIVE','COMPLETED') DEFAULT 'DRAFT',
                type VARCHAR(50) NOT NULL,
                progress INT DEFAULT 0,
                click_rate DECIMAL(5,2) DEFAULT 0.00,
                report_rate DECIMAL(5,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // 2. Seed campaigns
        const campaigns = [
            ["Q4 Finance Training", "ACTIVE", "Email Phishing", 10, 22.8, 14.9],
            ["Q1 HR Awareness", "COMPLETED", "Spear Phishing", 100, 30.2, 12.5],
            ["Q2 IT Security", "ACTIVE", "Malware Simulation", 45, 18.9, 9.4],
            ["Q3 Staff Refresher", "ACTIVE", "Social Engineering", 0, 0.0, 0.0]
        ];

        await pool.query(
            `INSERT INTO campaigns
                 (name, status, type, progress, click_rate, report_rate)
             VALUES ?`,
            [campaigns]
        );

        console.log('✅ Multiple campaigns seeded successfully');
    } catch (err) {
        console.error('❌ Error seeding data:', err);
    } finally {
        await pool.end();
    }
}

seed();
