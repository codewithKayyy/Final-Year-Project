const db = require('./src/config/db');

async function setupSimulationsTable() {
    try {
        console.log('Creating simulations table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS simulations (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                campaign_id INT NULL,
                created_by INT NOT NULL DEFAULT 1,
                type ENUM('phishing', 'social_engineering', 'malware', 'custom') DEFAULT 'phishing',
                script_id VARCHAR(100),
                target_agents JSON,
                parameters JSON,
                status ENUM('draft', 'scheduled', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'draft',
                scheduled_start TIMESTAMP NULL,
                actual_start TIMESTAMP NULL,
                completed_at TIMESTAMP NULL,
                total_targets INT DEFAULT 0,
                successful_executions INT DEFAULT 0,
                failed_executions INT DEFAULT 0,
                participant_count INT DEFAULT 0,
                click_rate DECIMAL(5,2) DEFAULT 0.00,
                report_rate DECIMAL(5,2) DEFAULT 0.00,
                success_rate DECIMAL(5,2) DEFAULT 0.00,
                results_summary JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_campaign (campaign_id),
                INDEX idx_created_by (created_by),
                INDEX idx_simulation_dates (scheduled_start, actual_start)
            )`;

        await db.execute(createTableQuery);
        console.log('Simulations table created successfully!');

        // Insert sample simulations
        const insertSampleQuery = `
            INSERT INTO simulations (name, description, type, status, created_by, campaign_id)
            VALUES
            ('Sample Phishing Simulation', 'A sample simulation for testing', 'phishing', 'draft', 1, 1),
            ('Email Security Test', 'Testing email security awareness', 'phishing', 'completed', 1, 1)
            ON DUPLICATE KEY UPDATE name = VALUES(name)`;

        await db.execute(insertSampleQuery);
        console.log('Sample simulations inserted successfully!');

        // Test the table
        const [rows] = await db.execute('SELECT * FROM simulations');
        console.log('Current simulations:', rows);

        process.exit(0);
    } catch (error) {
        console.error('Error setting up simulations table:', error);
        process.exit(1);
    }
}

setupSimulationsTable();