// backend/src/controllers/agentController.js
const Agent = require("../models/Agent");

// 🔹 Agent Software Self-Registration Endpoint
exports.registerAgent = async (req, res) => {
    try {
        const { agent_id, ip_address, mac_address, os_type, os_version } = req.body;

        // Validate required fields from agent
        if (!agent_id || !ip_address || !mac_address || !os_type) {
            return res.status(400).json({
                error: "Missing required fields: agent_id, ip_address, mac_address, os_type are required"
            });
        }

        // Check if agent already exists
        const existingAgent = await Agent.findByAgentId(agent_id);

        if (existingAgent) {
            // Update existing agent's telemetry and set to active
            await Agent.updateTelemetry(agent_id, { ip_address, mac_address, os_type, os_version });
            res.json({
                success: true,
                agentId: existingAgent.id,
                message: "Agent telemetry updated"
            });
        } else {
            // Create new agent with auto-collected data
            const newAgent = await Agent.create({
                agent_id,
                ip_address,
                mac_address,
                os_type,
                os_version
            });
            res.status(201).json({
                success: true,
                agentId: newAgent.id,
                message: "Agent registered successfully"
            });
        }
    } catch (err) {
        console.error("Error in agent registration:", err);
        res.status(500).json({ error: "Failed to process agent registration" });
    }
};

// 🔹 Admin → Get all agents
exports.getAgents = async (req, res) => {
    try {
        const agents = await Agent.findAll();
        res.json(agents);
    } catch (err) {
        console.error("Error fetching agents:", err);
        res.status(500).json({ error: "Failed to fetch agents" });
    }
};

// 🔹 Admin → Get single agent
exports.getAgentById = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);
        if (!agent) return res.status(404).json({ error: "Agent not found" });
        res.json(agent);
    } catch (err) {
        console.error("Error fetching agent:", err);
        res.status(500).json({ error: "Failed to fetch agent" });
    }
};

// 🔹 Admin → Update agent (only admin-editable fields)
exports.updateAgent = async (req, res) => {
    try {
        const { agent_name, staff_id } = req.body;

        await Agent.update(req.params.id, {
            agent_name,
            staff_id
        });

        res.json({ success: true, message: "Agent updated successfully" });
    } catch (err) {
        console.error("Error updating agent:", err);
        res.status(500).json({ error: "Failed to update agent" });
    }
};


// 🔹 Admin → Deactivate agent
exports.deactivateAgent = async (req, res) => {
    try {
        await Agent.deactivate(req.params.id);
        res.json({ success: true, message: "Agent deactivated successfully" });
    } catch (err) {
        console.error("Error deactivating agent:", err);
        res.status(500).json({ error: "Failed to deactivate agent" });
    }
};

// 🔹 Get agents for a specific staff member
exports.getAgentsByStaff = async (req, res) => {
    try {
        const agents = await Agent.findByStaffId(req.params.staffId);
        res.json(agents);
    } catch (err) {
        console.error("Error fetching staff agents:", err);
        res.status(500).json({ error: "Failed to fetch staff agents" });
    }
};

// 🔹 Get unassigned agents
exports.getUnassignedAgents = async (req, res) => {
    try {
        const agents = await Agent.findUnassigned();
        res.json(agents);
    } catch (err) {
        console.error("Error fetching unassigned agents:", err);
        res.status(500).json({ error: "Failed to fetch unassigned agents" });
    }
};

// 🔹 Assign staff to agent
exports.assignStaffToAgent = async (req, res) => {
    try {
        const { staffId } = req.body;
        const agentId = req.params.id;

        if (!staffId) {
            return res.status(400).json({ error: "Staff ID is required" });
        }

        await Agent.updateStaffAssignment(agentId, staffId);
        res.json({ success: true, message: "Staff assigned to agent successfully" });
    } catch (err) {
        console.error("Error assigning staff to agent:", err);
        res.status(500).json({ error: "Failed to assign staff to agent" });
    }
};