// frontend/src/services/attackLogService.js
import api from './api';

export const getAttackLogs = async () => {
    const response = await api.get('/attack-logs');
    return response.data;
};
