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
                // ✅ Toggle this to enable/disable dev bypass
                const USE_DEV_BYPASS = false;

                if (USE_DEV_BYPASS) {
                    const mockUser = {
                        id: 5,
                        username: "tester411",
                        email: "tester4111@gmail.com",
                        role: "admin"
                    };

                    console.warn("🚫 BYPASSING LOGIN - Auto-authenticating as tester411");
                    setUser(mockUser);

                    const mockAuthData = {
                        message: "Login successful",
                        user: mockUser,
                        token: "mock-token-bypass"
                    };
                    localStorage.setItem("user", JSON.stringify(mockAuthData));
                } else {
                    const storedUser = authService.getCurrentUser();
                    if (storedUser) {
                        setUser(storedUser.user || storedUser); // normalize shape
                    }
                }
            } catch (error) {
                console.error("Error checking auth:", error);
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
                setUser(response.user);
                return response.user;
            }
            throw new Error("Invalid login response");
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await authService.register(username, email, password);
            if (response && response.token && response.user) {
                setUser(response.user);
                return response.user;
            }
            throw new Error("Invalid registration response");
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
        isAuthenticated: !!user && !!user.id
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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
