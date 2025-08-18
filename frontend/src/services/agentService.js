import api from './api';

export const getAgents = async () => {
    const response = await api.get('/agents');
    return response.data;
};

export const deleteAgent = async (id) => {
    const response = await api.delete(`/agents/${id}`);
    return response.data;
};

export const assignStaffToAgent = async (agentId, staffId) => {
    const response = await api.put(`/agents/${agentId}/assign-staff`, { staffId });
    return response.data;
};
