// frontend/src/App.jsx (Updated)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute'; // Import ProtectedRoute

// Import your page components
import Dashboard from './pages/Dashboard';
import StaffManagement from './pages/StaffManagement';
import SimulationManagement from './pages/SimulationManagement';
import SimulationConfig from "./pages/SimulationConfig";
import AgentManagement from './pages/AgentManagement';
import AttackLogs from './pages/AttackLogs';
import Auth from './pages/Auth'; // Import Auth page

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public route for authentication */}
                <Route path="/login" element={<Auth />} />

                {/* Protected routes - wrapped by ProtectedRoute and Layout */}
                <Route element={<ProtectedRoute />}> {/* All routes inside this will be protected */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} /> {/* Default route for / */}
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="staff" element={<StaffManagement />} />
                        <Route path="simulations" element={<SimulationManagement />} />
                        <Route path="/simulation-config" element={<SimulationConfig />} /> {/* Simulation config (create new) */}
                        <Route path="/simulation-config/:id" element={<SimulationConfig />} /> {/* Simulation config (edit/start existing) */}
                        <Route path="agents" element={<AgentManagement />} />
                        <Route path="attack-logs" element={<AttackLogs />} />
                        <Route path="*" element={<SimulationManagement />} />
                        {/* Add more routes as you create pages */}
                    </Route>
                </Route>

                {/* Catch-all for 404 - optional */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
        </Router>
    );
};

export default App;