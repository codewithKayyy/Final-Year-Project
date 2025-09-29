// frontend/src/services/authService.js
import api from "./api";

const register = async (username, email, password) => {
    try {
        const response = await api.post(`/users/register`, { username, email, password });
        console.log("Backend response data (register):", response.data);

        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log("User data stored in localStorage (register):", response.data);
        }

        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || "Registration failed. Please try again.";
        console.error("Error during registration:", errorMsg);
        throw new Error(errorMsg);
    }
};

const login = async (username, password) => {
    try {
        const response = await api.post(`/users/login`, { username, password });
        console.log("Backend response data (login):", response.data);

        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log("User data stored in localStorage (login):", response.data);
        }

        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || "Login failed. Please try again.";
        console.error("Error during login:", errorMsg);
        throw new Error(errorMsg);
    }
};

const logout = () => {
    localStorage.removeItem("user");
    console.log("User removed from localStorage.");
};

const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    console.log("Raw user data from localStorage:", user);

    if (user) {
        try {
            const parsedUser = JSON.parse(user);
            console.log("Parsed user data from localStorage:", parsedUser);
            return parsedUser;
        } catch (e) {
            console.error("Error parsing user data from localStorage:", e);
            localStorage.removeItem("user"); // Clear invalid data
            return null;
        }
    }
    return null;
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;
