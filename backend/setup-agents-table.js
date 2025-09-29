const db = require('./src/config/db');

async function setupAgentsTable() {
    try {
        console.log('Creating agents table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS agents (
                id INT PRIMARY KEY AUTO_INCREMENT,
                agent_id VARCHAR(100) UNIQUE NOT NULL,
                agent_name VARCHAR(100) NOT NULL,
                hostname VARCHAR(100),
                ip_address VARCHAR(45),
                mac_address VARCHAR(17),
                os_type VARCHAR(50),
                os_version VARCHAR(100),
                platform VARCHAR(50),
                arch VARCHAR(20),
                node_version VARCHAR(20),
                status ENUM('active', 'offline', 'inactive', 'deactivated') DEFAULT 'offline',
                staff_id INT NULL,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_simulation_id INT NULL,
                last_attack_status ENUM('success', 'failed', 'running') NULL,
                total_simulations_run INT DEFAULT 0,
                success_rate DECIMAL(5,2) DEFAULT 0.00,
                location VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deactivated_at TIMESTAMP NULL,
                INDEX idx_agent_id (agent_id),
                INDEX idx_status (status),
                INDEX idx_staff_assignment (staff_id),
                INDEX idx_last_seen (last_seen),
                INDEX idx_active_agents (status, last_seen)
            )`;

        await db.execute(createTableQuery);
        console.log('Agents table created successfully!');

        // Insert a sample agent for testing
        const insertSampleQuery = `
            INSERT INTO agents (agent_id, agent_name, ip_address, mac_address, os_type, os_version, status)
            VALUES ('test-agent-001', 'Sample Test Agent', '192.168.1.100', '00:11:22:33:44:55', 'Windows', '10.0.19041', 'offline')
            ON DUPLICATE KEY UPDATE agent_name = VALUES(agent_name)`;

        await db.execute(insertSampleQuery);
        console.log('Sample agent inserted successfully!');

        // Test the table
        const [rows] = await db.execute('SELECT * FROM agents');
        console.log('Current agents:', rows);

        process.exit(0);
    } catch (error) {
        console.error('Error setting up agents table:', error);
        process.exit(1);
    }
}

setupAgentsTable();