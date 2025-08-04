import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Staff from './components/Staff';
import Campaigns from "./components/Campaigns.jsx";
import Monitoring from "./components/Monitoring.jsx";
import SimulationConfig from "./components/SimulationConfig.jsx";
import Report from "./components/Report";
import './App.css';
import Reports from "./components/Report";

// Placeholder pages (create them in /components)
//const SimulationConfig = () => <div><h2>Simulation Configuration</h2></div>;

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Navbar />
                <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 p-4">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/staff" element={<Staff />} />
                            <Route path="/campaigns" element={<Campaigns />} />
                            <Route path="/monitoring" element={<Monitoring />} />
                            <Route path="/config" element={<SimulationConfig/>} />
                            <Route path="/reports" element={<Reports />} />
                            {/* Add more <Route> elements as needed */}
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;
