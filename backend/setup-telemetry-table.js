const db = require('./src/config/db');

async function setupTelemetryTable() {
    try {
        console.log('Creating telemetry table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS telemetry (
                id INT PRIMARY KEY AUTO_INCREMENT,
                agent_id VARCHAR(255) NOT NULL,
                hostname VARCHAR(255),
                platform VARCHAR(50),
                arch VARCHAR(50),
                node_version VARCHAR(50),
                uptime BIGINT,
                cpu_count INT,
                cpu_model TEXT,
                load_average DECIMAL(10,2),
                total_memory_mb INT,
                free_memory_mb INT,
                memory_usage_percent INT,
                status VARCHAR(50),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_agent_id (agent_id),
                INDEX idx_timestamp (timestamp),
                INDEX idx_status (status)
            )`;

        await db.execute(createTableQuery);
        console.log('Telemetry table created successfully!');

        // Test the table
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM telemetry');
        console.log('Telemetry table is ready, current rows:', rows[0].count);

        process.exit(0);
    } catch (error) {
        console.error('Error setting up telemetry table:', error);
        process.exit(1);
    }
}

setupTelemetryTable();