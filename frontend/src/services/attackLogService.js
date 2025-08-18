// frontend/src/services/attackLogService.js
import api from "./api"; // reuse axios instance

const getAttackLogs = async () => {
    try {
        const response = await api.get(`/attack-logs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching attack logs:", error.response?.data || error.message);
        throw error;
    }
};

const getAttackLogById = async (id) => {
    try {
        const response = await api.get(`/attack-logs/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching attack log with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

const getAttackLogsBySimulationId = async (simulationId) => {
    try {
        const response = await api.get(`/attack-logs/simulation/${simulationId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching attack logs for simulation ID ${simulationId}:`, error.response?.data || error.message);
        throw error;
    }
};

const getAttackLogsByAgentId = async (agentId) => {
    try {
        const response = await api.get(`/attack-logs/agent/${agentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching attack logs for agent ID ${agentId}:`, error.response?.data || error.message);
        throw error;
    }
};

export { getAttackLogs, getAttackLogById, getAttackLogsBySimulationId, getAttackLogsByAgentId };
