// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor → attach JWT token if available
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor → handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            localStorage.removeItem("user");
            window.location.href = "/login";
        }

        return Promise.reject(error.response?.data || error.message);
    }
);

export default api;
