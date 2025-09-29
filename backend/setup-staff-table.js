const db = require('./src/config/db');

async function setupStaffTable() {
    try {
        console.log('Creating staff table...');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS staff (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                department VARCHAR(100),
                position VARCHAR(100),
                college VARCHAR(100),
                phone VARCHAR(20),
                risk ENUM('low', 'medium', 'high') DEFAULT 'medium',
                location VARCHAR(100),
                manager_name VARCHAR(100),
                hire_date DATE,
                is_active BOOLEAN DEFAULT TRUE,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                INDEX idx_email (email),
                INDEX idx_risk (risk),
                INDEX idx_department (department),
                INDEX idx_active_staff (is_active, created_at)
            )`;

        await db.execute(createTableQuery);
        console.log('Staff table created successfully!');

        // Insert sample staff members
        const insertSampleQuery = `
            INSERT INTO staff (name, email, department, position, college, phone, risk, location, manager_name, hire_date)
            VALUES
            ('John Smith', 'john.smith@company.com', 'IT', 'Software Developer', 'Engineering', '555-0101', 'low', 'Building A', 'Sarah Manager', '2023-01-15'),
            ('Sarah Johnson', 'sarah.johnson@company.com', 'HR', 'HR Manager', 'Business', '555-0102', 'medium', 'Building B', 'Mike Director', '2022-03-22'),
            ('Mike Wilson', 'mike.wilson@company.com', 'Finance', 'Financial Analyst', 'Business', '555-0103', 'high', 'Building C', 'Sarah Johnson', '2023-05-10'),
            ('Emily Davis', 'emily.davis@company.com', 'Marketing', 'Marketing Coordinator', 'Communications', '555-0104', 'medium', 'Building A', 'John Director', '2023-07-01'),
            ('Robert Brown', 'robert.brown@company.com', 'Operations', 'Operations Manager', 'Business', '555-0105', 'high', 'Building D', 'Mike Wilson', '2022-11-30')
            ON DUPLICATE KEY UPDATE name = VALUES(name)`;

        await db.execute(insertSampleQuery);
        console.log('Sample staff members inserted successfully!');

        // Test the table
        const [rows] = await db.execute('SELECT * FROM staff');
        console.log('Current staff members:', rows.length);

        process.exit(0);
    } catch (error) {
        console.error('Error setting up staff table:', error);
        process.exit(1);
    }
}

setupStaffTable();