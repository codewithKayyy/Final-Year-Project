// backend/src/models/Agent.js
const db = require("../config/db");

class Agent {
    /**
     * Get all agents with their associated staff information
     */
    static async findAll() {
        const [rows] = await db.execute(`
            SELECT a.*, s.name as staff_name, s.email as staff_email, s.college, s.risk
            FROM agents a
                     LEFT JOIN staff s ON a.staff_id = s.id
            ORDER BY a.created_at DESC
        `);
        return rows;
    }

    /**
     * Get agent by primary ID with staff info
     */
    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT a.*, s.name as staff_name, s.email as staff_email, s.college, s.risk
            FROM agents a
                     LEFT JOIN staff s ON a.staff_id = s.id
            WHERE a.id = ?
        `, [id]);
        return rows[0];
    }

    /**
     * Get agent by external agent_id (UUID from agent software)
     */
    static async findByAgentId(agent_id) {
        const [rows] = await db.execute(`
            SELECT a.*, s.name as staff_name, s.email as staff_email
            FROM agents a
                     LEFT JOIN staff s ON a.staff_id = s.id
            WHERE a.agent_id = ?
        `, [agent_id]);
        return rows[0];
    }

    /**
     * Create a new agent (used by agent software during self-registration)
     */
    static async create(agentData) {
        const {
            agent_id,
            agent_name,
            ip_address,
            mac_address,
            os_type,
            os_version
        } = agentData;

        const query = `
            INSERT INTO agents
            (agent_id, agent_name, ip_address, mac_address, os_type, os_version, status, last_seen)
            VALUES (?, ?, ?, ?, ?, ?, 'offline', CURRENT_TIMESTAMP)
        `;

        const params = [agent_id, agent_name, ip_address, mac_address, os_type, os_version];
        const [result] = await db.execute(query, params);
        return { id: result.insertId, ...agentData, status: "offline" };
    }

    /**
     * Update agent (admin-level) - only admin-editable fields
     */
    static async update(id, agentData) {
        const { agent_name, staff_id } = agentData;

        const query = `
            UPDATE agents
            SET agent_name = ?, staff_id = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        const params = [agent_name || null, staff_id || null, id];
        const [result] = await db.execute(query, params);
        return result;
    }


    /**
     * Update agent telemetry (called by agent software on heartbeat)
     */
    static async updateTelemetry(agent_id, telemetryData) {
        const { ip_address, mac_address, os_type, os_version } = telemetryData;

        const query = `
            UPDATE agents
            SET ip_address = ?, mac_address = ?, os_type = ?, os_version = ?,
                last_seen = CURRENT_TIMESTAMP, status = 'active'
            WHERE agent_id = ?
        `;

        const params = [ip_address, mac_address, os_type, os_version, agent_id];
        const [result] = await db.execute(query, params);
        return result;
    }

    /**
     * Update agent status (used for heartbeats)
     */
    static async updateStatus(agent_id, status) {
        const query = `
            UPDATE agents
            SET status = ?, last_seen = CURRENT_TIMESTAMP
            WHERE agent_id = ?
        `;
        const [result] = await db.execute(query, [status, agent_id]);
        return result;
    }

    /**
     * Find all agents assigned to a specific staff member
     */
    static async findByStaffId(staffId) {
        const [rows] = await db.execute(`
            SELECT * FROM agents WHERE staff_id = ? ORDER BY created_at DESC
        `, [staffId]);
        return rows;
    }

    /**
     * Find all unassigned agents (available for assignment)
     */
    static async findUnassigned() {
        const [rows] = await db.execute(`
            SELECT a.* FROM agents a WHERE a.staff_id IS NULL ORDER BY a.created_at DESC
        `);
        return rows;
    }

    /**
     * Update simulation stats after an attack completes
     */
    static async updateSimulationStats(agentId, simulationId, success) {
        const agent = await this.findById(agentId);
        const total = agent.total_simulations_run + 1;
        const newSuccessRate = ((agent.success_rate * agent.total_simulations_run) + (success ? 1 : 0)) / total;

        const query = `
            UPDATE agents
            SET last_simulation_id = ?,
                last_attack_status = ?,
                total_simulations_run = ?,
                success_rate = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        const params = [simulationId, success ? 'success' : 'failed', total, newSuccessRate, agentId];
        const [result] = await db.execute(query, params);
        return result;
    }

    /**
     * Soft delete (deactivate)
     */
    static async deactivate(id) {
        const query = `
            UPDATE agents
            SET status = 'deactivated', deactivated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [id]);
        return result;
    }
}

module.exports = Agent;
