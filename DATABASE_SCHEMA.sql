-- Cybersecurity Simulation Platform Database Schema
-- MySQL Schema for complete feature implementation

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS attack_logs;
DROP TABLE IF EXISTS simulations;
DROP TABLE IF EXISTS campaign_staff_assignments;
DROP TABLE IF EXISTS phishing_emails;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS agent_telemetry;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS users;

-- ================================================
-- 1. USERS TABLE - Admin users of the system
-- ================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'operator', 'viewer') DEFAULT 'admin',
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_active_users (is_active, created_at)
);

-- ================================================
-- 2. STAFF TABLE - Target users for simulations
-- ================================================
CREATE TABLE staff (
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
);

-- ================================================
-- 3. AGENTS TABLE - Deployed simulation agents
-- ================================================
CREATE TABLE agents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id VARCHAR(100) UNIQUE NOT NULL, -- UUID from agent software
    agent_name VARCHAR(100) NOT NULL,
    hostname VARCHAR(100),
    ip_address VARCHAR(45), -- IPv6 support
    mac_address VARCHAR(17),
    os_type VARCHAR(50),
    os_version VARCHAR(100),
    platform VARCHAR(50),
    arch VARCHAR(20),
    node_version VARCHAR(20),
    status ENUM('active', 'offline', 'inactive', 'deactivated') DEFAULT 'offline',
    staff_id INT NULL, -- Assignment to staff member
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_simulation_id INT NULL,
    last_attack_status ENUM('success', 'failed', 'running') NULL,
    total_simulations_run INT DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00, -- Percentage
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deactivated_at TIMESTAMP NULL,

    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
    INDEX idx_agent_id (agent_id),
    INDEX idx_status (status),
    INDEX idx_staff_assignment (staff_id),
    INDEX idx_last_seen (last_seen),
    INDEX idx_active_agents (status, last_seen)
);

-- ================================================
-- 4. AGENT TELEMETRY - Real-time agent metrics
-- ================================================
CREATE TABLE agent_telemetry (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id VARCHAR(100) NOT NULL,
    hostname VARCHAR(100),
    platform VARCHAR(50),
    cpu_count INT,
    cpu_model VARCHAR(200),
    load_average DECIMAL(5,2),
    total_memory_mb INT,
    free_memory_mb INT,
    memory_usage_percent DECIMAL(5,2),
    uptime_seconds BIGINT,
    node_version VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE CASCADE,
    INDEX idx_agent_timestamp (agent_id, timestamp),
    INDEX idx_recent_telemetry (timestamp)
);

-- ================================================
-- 5. CAMPAIGNS TABLE - Phishing campaign definitions
-- ================================================
CREATE TABLE campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('phishing', 'social_engineering', 'malware', 'mixed') DEFAULT 'phishing',
    status ENUM('draft', 'scheduled', 'running', 'completed', 'paused', 'cancelled') DEFAULT 'draft',
    created_by INT NOT NULL, -- User who created it

    -- Scheduling
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,

    -- Target settings
    target_type ENUM('all_staff', 'department', 'risk_level', 'manual') DEFAULT 'manual',
    target_departments JSON, -- Array of departments
    target_risk_levels JSON, -- Array of risk levels

    -- Campaign metrics
    participant_count INT DEFAULT 0,
    emails_sent INT DEFAULT 0,
    emails_opened INT DEFAULT 0,
    links_clicked INT DEFAULT 0,
    credentials_entered INT DEFAULT 0,
    reported_count INT DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0.00,
    report_rate DECIMAL(5,2) DEFAULT 0.00,
    success_rate DECIMAL(5,2) DEFAULT 0.00,

    -- Settings
    send_training_emails BOOLEAN DEFAULT TRUE,
    training_delay_minutes INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by),
    INDEX idx_campaign_dates (start_date, end_date),
    INDEX idx_type_status (type, status)
);

-- ================================================
-- 6. PHISHING EMAILS TABLE - Email templates for campaigns
-- ================================================
CREATE TABLE phishing_emails (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    template_name VARCHAR(200) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    from_name VARCHAR(100) NOT NULL,
    from_email VARCHAR(100) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,

    -- Tracking URLs and variables
    phishing_url VARCHAR(500),
    landing_page_url VARCHAR(500),

    -- Template settings
    is_active BOOLEAN DEFAULT TRUE,
    template_type ENUM('primary', 'followup', 'reminder') DEFAULT 'primary',

    -- A/B Testing
    variant_name VARCHAR(50) DEFAULT 'A',
    weight DECIMAL(3,2) DEFAULT 1.00, -- For A/B testing distribution

    -- Metrics
    emails_sent INT DEFAULT 0,
    emails_opened INT DEFAULT 0,
    links_clicked INT DEFAULT 0,
    click_count INT DEFAULT 0,
    success_count INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    INDEX idx_campaign (campaign_id),
    INDEX idx_active_templates (is_active, campaign_id),
    INDEX idx_variant (campaign_id, variant_name)
);

-- ================================================
-- 7. CAMPAIGN STAFF ASSIGNMENTS - Who's targeted in campaigns
-- ================================================
CREATE TABLE campaign_staff_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    staff_id INT NOT NULL,
    agent_id VARCHAR(100) NULL, -- Which agent will execute
    status ENUM('pending', 'sent', 'opened', 'clicked', 'reported', 'completed') DEFAULT 'pending',
    email_template_id INT NULL,

    -- Tracking
    email_sent_at TIMESTAMP NULL,
    email_opened_at TIMESTAMP NULL,
    link_clicked_at TIMESTAMP NULL,
    reported_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,

    -- Results
    clicked_links INT DEFAULT 0,
    credentials_entered BOOLEAN DEFAULT FALSE,
    training_completed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE SET NULL,
    FOREIGN KEY (email_template_id) REFERENCES phishing_emails(id) ON DELETE SET NULL,
    UNIQUE KEY unique_campaign_staff (campaign_id, staff_id),
    INDEX idx_campaign_status (campaign_id, status),
    INDEX idx_staff_campaigns (staff_id),
    INDEX idx_agent_assignments (agent_id)
);

-- ================================================
-- 8. SIMULATIONS TABLE - Individual simulation runs
-- ================================================
CREATE TABLE simulations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    campaign_id INT NULL, -- Can be independent or part of campaign
    created_by INT NOT NULL,

    -- Simulation configuration
    type ENUM('phishing', 'social_engineering', 'malware', 'custom') DEFAULT 'phishing',
    script_id VARCHAR(100), -- Attack script identifier
    target_agents JSON, -- Array of agent IDs
    parameters JSON, -- Simulation parameters

    -- Status and scheduling
    status ENUM('draft', 'scheduled', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'draft',
    scheduled_start TIMESTAMP NULL,
    actual_start TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,

    -- Metrics
    total_targets INT DEFAULT 0,
    successful_executions INT DEFAULT 0,
    failed_executions INT DEFAULT 0,
    participant_count INT DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0.00,
    report_rate DECIMAL(5,2) DEFAULT 0.00,
    success_rate DECIMAL(5,2) DEFAULT 0.00,

    -- Results
    results_summary JSON,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_campaign (campaign_id),
    INDEX idx_created_by (created_by),
    INDEX idx_simulation_dates (scheduled_start, actual_start)
);

-- ================================================
-- 9. ATTACK LOGS TABLE - Detailed execution logs
-- ================================================
CREATE TABLE attack_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    simulation_id INT NULL,
    campaign_id INT NULL,
    agent_id VARCHAR(100) NULL,
    staff_id INT NULL,

    -- Attack details
    attack_type VARCHAR(100),
    script_id VARCHAR(100),
    target VARCHAR(200),

    -- Execution details
    status ENUM('pending', 'running', 'completed', 'failed', 'timeout') DEFAULT 'pending',
    outcome ENUM('success', 'failed', 'partial') NULL,

    -- Technical details
    stdout TEXT,
    stderr TEXT,
    error_message TEXT,
    execution_time_ms INT,

    -- Results
    details JSON, -- Flexible results storage

    -- Timestamps
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (simulation_id) REFERENCES simulations(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
    INDEX idx_simulation (simulation_id),
    INDEX idx_campaign (campaign_id),
    INDEX idx_agent (agent_id),
    INDEX idx_status_timestamp (status, timestamp),
    INDEX idx_attack_type (attack_type)
);

-- ================================================
-- 10. SYSTEM SETTINGS TABLE - Application configuration
-- ================================================
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(50) NOT NULL, -- smtp, security, notifications, system
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_setting (category, setting_key),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_category (category)
);

-- ================================================
-- INSERT DEFAULT SETTINGS
-- ================================================

-- SMTP Configuration
INSERT INTO system_settings (category, setting_key, setting_value, data_type, description) VALUES
('smtp', 'host', 'smtp.mailtrap.io', 'string', 'SMTP server hostname'),
('smtp', 'port', '2525', 'number', 'SMTP server port'),
('smtp', 'secure', 'false', 'boolean', 'Use TLS/SSL'),
('smtp', 'username', '', 'string', 'SMTP authentication username'),
('smtp', 'password', '', 'string', 'SMTP authentication password'),
('smtp', 'from_name', 'IT Security Team', 'string', 'Default sender name'),
('smtp', 'from_email', 'security@company.com', 'string', 'Default sender email'),
('smtp', 'max_send_rate', '100', 'number', 'Maximum emails per hour');

-- Security Settings
INSERT INTO system_settings (category, setting_key, setting_value, data_type, description) VALUES
('security', 'session_timeout', '3600', 'number', 'Session timeout in seconds'),
('security', 'max_login_attempts', '5', 'number', 'Maximum login attempts before lockout'),
('security', 'lockout_duration', '900', 'number', 'Account lockout duration in seconds'),
('security', 'require_2fa', 'false', 'boolean', 'Require two-factor authentication'),
('security', 'password_min_length', '8', 'number', 'Minimum password length'),
('security', 'password_require_special', 'true', 'boolean', 'Require special characters in password');

-- Notification Settings
INSERT INTO system_settings (category, setting_key, setting_value, data_type, description) VALUES
('notifications', 'email_enabled', 'true', 'boolean', 'Enable email notifications'),
('notifications', 'admin_emails', '[]', 'json', 'Admin email addresses for notifications'),
('notifications', 'notify_campaign_complete', 'true', 'boolean', 'Notify when campaigns complete'),
('notifications', 'notify_agent_offline', 'true', 'boolean', 'Notify when agents go offline'),
('notifications', 'notify_high_success_rate', 'true', 'boolean', 'Notify for high phishing success rates');

-- System Settings
INSERT INTO system_settings (category, setting_key, setting_value, data_type, description) VALUES
('system', 'backup_enabled', 'true', 'boolean', 'Enable automated backups'),
('system', 'backup_retention_days', '30', 'number', 'Days to retain backup files'),
('system', 'log_retention_days', '90', 'number', 'Days to retain log entries'),
('system', 'telemetry_retention_days', '7', 'number', 'Days to retain telemetry data'),
('system', 'maintenance_mode', 'false', 'boolean', 'System maintenance mode'),
('system', 'max_concurrent_simulations', '10', 'number', 'Maximum concurrent simulations');

-- ================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- ================================================

-- View for active agents with latest telemetry
CREATE VIEW v_active_agents AS
SELECT
    a.*,
    s.name as staff_name,
    s.email as staff_email,
    s.department as staff_department,
    s.risk as staff_risk,
    t.memory_usage_percent,
    t.load_average,
    t.timestamp as last_telemetry
FROM agents a
LEFT JOIN staff s ON a.staff_id = s.id
LEFT JOIN (
    SELECT agent_id, memory_usage_percent, load_average, timestamp,
           ROW_NUMBER() OVER (PARTITION BY agent_id ORDER BY timestamp DESC) as rn
    FROM agent_telemetry
) t ON a.agent_id = t.agent_id AND t.rn = 1
WHERE a.status != 'deactivated';

-- View for campaign performance summary
CREATE VIEW v_campaign_performance AS
SELECT
    c.*,
    u.username as created_by_username,
    COUNT(DISTINCT csa.staff_id) as total_targets,
    COUNT(DISTINCT s.id) as simulation_count,
    COUNT(DISTINCT CASE WHEN csa.status = 'clicked' THEN csa.staff_id END) as clicked_count,
    COUNT(DISTINCT CASE WHEN csa.status = 'reported' THEN csa.staff_id END) as reported_count
FROM campaigns c
LEFT JOIN users u ON c.created_by = u.id
LEFT JOIN campaign_staff_assignments csa ON c.id = csa.campaign_id
LEFT JOIN simulations s ON c.id = s.campaign_id
GROUP BY c.id;

-- View for simulation results
CREATE VIEW v_simulation_results AS
SELECT
    s.*,
    u.username as created_by_username,
    c.name as campaign_name,
    COUNT(al.id) as log_count,
    COUNT(CASE WHEN al.outcome = 'success' THEN 1 END) as success_count,
    COUNT(CASE WHEN al.outcome = 'failed' THEN 1 END) as failure_count
FROM simulations s
LEFT JOIN users u ON s.created_by = u.id
LEFT JOIN campaigns c ON s.campaign_id = c.id
LEFT JOIN attack_logs al ON s.id = al.simulation_id
GROUP BY s.id;

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Composite indexes for common queries
CREATE INDEX idx_agent_status_lastseen ON agents (status, last_seen);
CREATE INDEX idx_campaign_status_dates ON campaigns (status, start_date, end_date);
CREATE INDEX idx_simulation_status_dates ON simulations (status, scheduled_start, actual_start);
CREATE INDEX idx_attacklog_timestamp_status ON attack_logs (timestamp, status);
CREATE INDEX idx_telemetry_agent_timestamp ON agent_telemetry (agent_id, timestamp DESC);

-- ================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ================================================

-- Update campaign metrics when assignments change
DELIMITER //
CREATE TRIGGER update_campaign_metrics
AFTER UPDATE ON campaign_staff_assignments
FOR EACH ROW
BEGIN
    UPDATE campaigns c SET
        click_rate = (
            SELECT COALESCE(AVG(CASE WHEN status IN ('clicked', 'completed') THEN 1 ELSE 0 END) * 100, 0)
            FROM campaign_staff_assignments
            WHERE campaign_id = NEW.campaign_id
        ),
        report_rate = (
            SELECT COALESCE(AVG(CASE WHEN status = 'reported' THEN 1 ELSE 0 END) * 100, 0)
            FROM campaign_staff_assignments
            WHERE campaign_id = NEW.campaign_id
        )
    WHERE c.id = NEW.campaign_id;
END//
DELIMITER ;

-- Update agent success rate when simulations complete
DELIMITER //
CREATE TRIGGER update_agent_success_rate
AFTER INSERT ON attack_logs
FOR EACH ROW
BEGIN
    IF NEW.outcome IS NOT NULL AND NEW.agent_id IS NOT NULL THEN
        UPDATE agents SET
            total_simulations_run = total_simulations_run + 1,
            success_rate = (
                SELECT COALESCE(AVG(CASE WHEN outcome = 'success' THEN 1 ELSE 0 END) * 100, 0)
                FROM attack_logs
                WHERE agent_id = NEW.agent_id AND outcome IS NOT NULL
            ),
            last_simulation_id = NEW.simulation_id,
            last_attack_status = CASE
                WHEN NEW.outcome = 'success' THEN 'success'
                ELSE 'failed'
            END
        WHERE agent_id = NEW.agent_id;
    END IF;
END//
DELIMITER ;

-- ================================================
-- DATA CLEANUP PROCEDURES
-- ================================================

-- Procedure to clean old telemetry data
DELIMITER //
CREATE PROCEDURE CleanOldTelemetry()
BEGIN
    DECLARE retention_days INT DEFAULT 7;

    SELECT setting_value INTO retention_days
    FROM system_settings
    WHERE category = 'system' AND setting_key = 'telemetry_retention_days';

    DELETE FROM agent_telemetry
    WHERE timestamp < DATE_SUB(NOW(), INTERVAL retention_days DAY);

    SELECT ROW_COUNT() as deleted_records;
END//
DELIMITER ;

-- Procedure to clean old logs
DELIMITER //
CREATE PROCEDURE CleanOldLogs()
BEGIN
    DECLARE retention_days INT DEFAULT 90;

    SELECT setting_value INTO retention_days
    FROM system_settings
    WHERE category = 'system' AND setting_key = 'log_retention_days';

    DELETE FROM attack_logs
    WHERE timestamp < DATE_SUB(NOW(), INTERVAL retention_days DAY);

    SELECT ROW_COUNT() as deleted_records;
END//
DELIMITER ;

-- ================================================
-- SAMPLE DATA (Optional - for testing)
-- ================================================

-- Default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role, first_name, last_name) VALUES
('admin', 'admin@cybersec.local', '$2b$10$8K0JcK0K1QZYZYzv4gX./.7x7XhZGkQz5J5C8N5sR5H5Z8J8K8K8K8', 'admin', 'System', 'Administrator');

-- Sample staff members
INSERT INTO staff (name, email, department, position, risk, college) VALUES
('John Smith', 'john.smith@company.com', 'IT', 'Developer', 'low', 'Engineering'),
('Sarah Johnson', 'sarah.johnson@company.com', 'HR', 'Manager', 'medium', 'Business'),
('Mike Wilson', 'mike.wilson@company.com', 'Finance', 'Analyst', 'high', 'Business'),
('Emily Davis', 'emily.davis@company.com', 'Marketing', 'Coordinator', 'medium', 'Communications');

-- System will auto-generate other data through normal operations