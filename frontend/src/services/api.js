// frontend/src/services/api.js
import axios from 'axios';

//const API_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding JWT token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        // Example: Handle 401 Unauthorized globally
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Optionally, refresh token or redirect to log in
            // For now, just log out
            localStorage.removeItem('user');
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

export default api;