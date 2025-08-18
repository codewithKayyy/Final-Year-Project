// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Import pages
import Dashboard from "./pages/Dashboard";
import StaffManagement from "./pages/StaffManagement";
import CampaignManagement from "./pages/CampaignManagement";
import SimulationManagement from "./pages/SimulationManagement";
import SimulationConfig from "./pages/SimulationConfig";
import AgentManagement from "./pages/AgentManagement";
import AttackLogs from "./pages/AttackLogs";
import SecurityControls from "./pages/SecurityControls";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Public routes */}
                <Route path="/login" element={<Auth />} />

                {/* Protected routes wrapped in Layout */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/staff" element={<StaffManagement />} />
                        <Route path="/agents" element={<AgentManagement />} />
                        <Route path="/campaigns" element={<CampaignManagement />} />
                        <Route path="/simulations" element={<SimulationManagement />} />
                        <Route path="/simulation-config" element={<SimulationConfig />} />
                        <Route path="/simulation-config/:id" element={<SimulationConfig />} />
                        <Route path="/attack-logs" element={<AttackLogs />} />
                        <Route path="/security-controls" element={<SecurityControls />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Route>

                {/* Catch all route for 404 */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>

    );
};

export default App;
