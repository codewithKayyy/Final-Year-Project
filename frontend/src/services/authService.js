<<<<<<< HEAD
//frontend/src/services/authService.js
=======
// frontend/src/services/authService.js
>>>>>>> origin/main
import api from "./api";

const register = async (username, email, password) => {
    try {
        const response = await api.post(`/users/register`, { username, email, password });
<<<<<<< HEAD
        console.log("Backend response data (register):", response.data);

        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log("User data stored in localStorage (register):", response.data);
        }

        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.error || "Registration failed. Please try again.";
        console.error("Error during registration:", errorMsg);
        throw new Error(errorMsg);
=======
        console.log("Backend response data (register):", response.data); // ADD THIS LINE
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log("User data stored in localStorage (register):", response.data); // ADD THIS LINE
        }
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error.response?.data || error.message);
        throw error;
>>>>>>> origin/main
    }
};

const login = async (username, password) => {
    try {
        const response = await api.post(`/users/login`, { username, password });
<<<<<<< HEAD
        console.log("Backend response data (login):", response.data);

        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log("User data stored in localStorage (login):", response.data);
        }

        return response.data;
    } catch (error) {
        const errorMsg = error.response?.data?.error || "Login failed. Please try again.";
        console.error("Error during login:", errorMsg);
        throw new Error(errorMsg);
=======
        console.log("Backend response data (login):", response.data); // ADD THIS LINE
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
            console.log("User data stored in localStorage (login):", response.data); // ADD THIS LINE
        }
        return response.data;
    } catch (error) {
        console.error("Error during login:", error.response?.data || error.message);
        throw error;
>>>>>>> origin/main
    }
};

const logout = () => {
    localStorage.removeItem("user");
<<<<<<< HEAD
    console.log("User removed from localStorage.");
=======
    console.log("User removed from localStorage."); // ADD THIS LINE
>>>>>>> origin/main
};

const getCurrentUser = () => {
    const user = localStorage.getItem("user");
<<<<<<< HEAD
    console.log("Raw user data from localStorage:", user);

    if (user) {
        try {
            const parsedUser = JSON.parse(user);
            console.log("Parsed user data from localStorage:", parsedUser);
            return parsedUser;
        } catch (e) {
            console.error("Error parsing user data from localStorage:", e);
=======
    console.log("Raw user data from localStorage:", user); // ADD THIS LINE
    if (user) {
        try {
            const parsedUser = JSON.parse(user);
            console.log("Parsed user data from localStorage:", parsedUser); // ADD THIS LINE
            return parsedUser;
        } catch (e) {
            console.error("Error parsing user data from localStorage:", e); // ADD THIS LINE
>>>>>>> origin/main
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
