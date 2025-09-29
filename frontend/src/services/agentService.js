// frontend/src/services/agentService.js
import api from "./api"; // reuse axios instance

const getAgents = async () => {
    try {
        const response = await api.get(`/agents`);
        return response.data;
    } catch (error) {
        console.error("Error fetching agents:", error.response?.data || error.message);
        throw error;
    }
};

const getAgentById = async (id) => {
    try {
        const response = await api.get(`/agents/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching agent with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

const createAgent = async (agentData) => {
    try {
        const response = await api.post(`/agents`, agentData);
        return response.data;
    } catch (error) {
        console.error("Error creating agent:", error.response?.data || error.message);
        throw error;
    }
};

const updateAgent = async (id, agentData) => {
    try {
        const response = await api.put(`/agents/${id}`, agentData);
        return response.data;
    } catch (error) {
        console.error(`Error updating agent with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

const deleteAgent = async (id) => {
    try {
        const response = await api.delete(`/agents/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting agent with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

const assignStaffToAgent = async (agentId, staffId) => {
    try {
        const response = await api.put(`/agents/${agentId}/assign-staff`, { staffId });
        return response.data;
    } catch (error) {
        console.error(
            `Error assigning staff ID ${staffId} to agent ID ${agentId}:`,
            error.response?.data || error.message
        );
        throw error;
    }
};

export {
    getAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
    assignStaffToAgent,
};
