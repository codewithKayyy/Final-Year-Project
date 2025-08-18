// frontend/src/services/simulationService.js
import api from './api';

// Fetch all simulations
export const getSimulations = async () => {
    const response = await api.get('/simulations');
    return response.data;
};

// Fetch a single simulation by ID
export const getSimulationById = async (id) => {
    const response = await api.get(`/simulations/${id}`);
    return response.data;
};

// Create a new simulation
export const createSimulation = async (simulationData) => {
    const response = await api.post('/simulations', simulationData);
    return response.data;
};

// Update an existing simulation
export const updateSimulation = async (id, simulationData) => {
    const response = await api.put(`/simulations/${id}`, simulationData);
    return response.data;
};

// Delete a simulation by ID
export const deleteSimulation = async (id) => {
    const response = await api.delete(`/simulations/${id}`);
    return response.data;
};

// Start a simulation (trigger execution)
export const startSimulation = async (startData) => {
    const response = await api.post('/simulations/start', startData);
    return response.data;
};
