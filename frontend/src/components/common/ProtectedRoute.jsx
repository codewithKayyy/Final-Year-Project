// frontend/src/components/common/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
    const { user, loading, isAuthenticated } = useAuth();

    console.log("ProtectedRoute - User:", user, "Loading:", loading, "IsAuthenticated:", isAuthenticated);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    console.log("Authenticated, rendering protected content");
    return <Outlet />;
};

export default ProtectedRoute;
