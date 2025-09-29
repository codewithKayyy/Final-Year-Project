const db = require('./src/config/db');

async function setupCampaignsTable() {
    try {
        console.log('Creating campaigns table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS campaigns (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                type ENUM('phishing', 'social_engineering', 'malware', 'mixed') DEFAULT 'phishing',
                status ENUM('draft', 'scheduled', 'running', 'completed', 'paused', 'cancelled') DEFAULT 'draft',
                created_by INT NOT NULL DEFAULT 1,
                start_date TIMESTAMP NULL,
                end_date TIMESTAMP NULL,
                target_type ENUM('all_staff', 'department', 'risk_level', 'manual') DEFAULT 'manual',
                participant_count INT DEFAULT 0,
                emails_sent INT DEFAULT 0,
                emails_opened INT DEFAULT 0,
                links_clicked INT DEFAULT 0,
                credentials_entered INT DEFAULT 0,
                reported_count INT DEFAULT 0,
                click_rate DECIMAL(5,2) DEFAULT 0.00,
                report_rate DECIMAL(5,2) DEFAULT 0.00,
                success_rate DECIMAL(5,2) DEFAULT 0.00,
                send_training_emails BOOLEAN DEFAULT TRUE,
                training_delay_minutes INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_created_by (created_by),
                INDEX idx_campaign_dates (start_date, end_date),
                INDEX idx_type_status (type, status)
            )`;

        await db.execute(createTableQuery);
        console.log('Campaigns table created successfully!');

        // Insert a sample campaign
        const insertSampleQuery = `
            INSERT INTO campaigns (name, description, type, status, created_by)
            VALUES ('Sample Phishing Campaign', 'A sample campaign for testing', 'phishing', 'draft', 1)
            ON DUPLICATE KEY UPDATE name = name`;

        await db.execute(insertSampleQuery);
        console.log('Sample campaign inserted successfully!');

        // Test the table
        const [rows] = await db.execute('SELECT * FROM campaigns');
        console.log('Current campaigns:', rows);

        process.exit(0);
    } catch (error) {
        console.error('Error setting up campaigns table:', error);
        process.exit(1);
    }
}

setupCampaignsTable();