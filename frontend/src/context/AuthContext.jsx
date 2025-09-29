// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = () => {
            try {
                // TEMPORARY: Auto-authenticate as tester411 user to bypass login
                const mockUser = {
                    id: 5,
                    username: 'tester411',
                    email: 'tester4111@gmail.com',
                    role: 'admin'
                };

                console.log("🚫 BYPASSING LOGIN - Auto-authenticating as tester411");
                setUser(mockUser);

                // Store mock auth data in localStorage
                const mockAuthData = {
                    message: "Login successful",
                    user: mockUser,
                    token: "mock-token-bypass"
                };
                localStorage.setItem("user", JSON.stringify(mockAuthData));

            } catch (error) {
                console.error("Error in bypass auth:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authService.login(username, password);
            if (response && response.token && response.user) {
                setUser(response.user); // Set the user object from response
                return response.user;
            } else {
                throw new Error("Invalid login response");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await authService.register(username, email, password);
            if (response && response.token && response.user) {
                setUser(response.user); // Set the user object from response
                return response.user;
            } else {
                throw new Error("Invalid registration response");
            }
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user && !!user.id // Check for user.id since user is now the user object
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};