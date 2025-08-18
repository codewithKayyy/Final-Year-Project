// frontend/src/services/simulationApi.js
import api from "./api"; // reuse the axios instance from api.js

export const startSimulation = async (simulationDetails) => {
    try {
        const response = await api.post(`/simulations/start`, simulationDetails);
        return response.data;
    } catch (error) {
        console.error("Error starting simulation:", error.response?.data || error.message);
        throw error;
    }
};
