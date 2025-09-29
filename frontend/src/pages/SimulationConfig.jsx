<<<<<<< HEAD
//frontend/src/pages/SimulationConfig.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getSimulations, startSimulation } from '../services/simulationService';
import api from '../services/api';
import { FaUser, FaCode, FaPlay, FaArrowLeft, FaCog, FaUsers, FaBug } from 'react-icons/fa';

const SimulationConfig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [simulation, setSimulation] = useState(null);
    const [staff, setStaff] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [configData, setConfigData] = useState({
        targetStaffId: '',
        targetAgentId: '',
        attackScriptId: '',
        parameters: {},
    });

    // If no ID is provided, show the general simulation list
    const isGeneralView = !id;

    const handleBackToSimulations = () => {
        try {
            handleBackToSimulations();
        } catch (error) {
            console.error('Navigation error:', error);
            // Fallback to window location
            window.location.href = '/simulations';
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (isGeneralView) {
                // Show general simulation config view
                const simData = await getSimulations();
                setSimulation({ list: simData });
            } else {
                // Fetch specific simulation and related data
                const [simData, staffData, agentsData] = await Promise.all([
                    api.get(`/simulations/${id}`),
                    api.get('/staff'),
                    api.get('/agents')
                ]);

                setSimulation(simData.data);
                setStaff(staffData.data || []);
                setAgents(agentsData.data || []);

                // Pre-populate configuration if it exists
                if (simData.data.target_agents) {
                    try {
                        const targetAgents = JSON.parse(simData.data.target_agents);
                        setConfigData(prev => ({
                            ...prev,
                            targetStaffId: targetAgents.staffId || '',
                            targetAgentId: targetAgents.agentId || '',
                            attackScriptId: targetAgents.scriptId || '',
                        }));
                    } catch (e) {
                        console.warn('Could not parse target_agents JSON:', e);
                    }
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
=======
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { startSimulation, getSimulations, updateSimulation } from "../services/simulationService";

const SimulationConfig = () => {
    const { id } = useParams(); // Optional simulation ID from route
    const navigate = useNavigate();

    const [simulationName, setSimulationName] = useState("");
    const [selectedStaffId, setSelectedStaffId] = useState("");
    const [selectedAttackScript, setSelectedAttackScript] = useState("");
    const [attackParameters, setAttackParameters] = useState({});
    const [loading, setLoading] = useState(false);

    // Example data for dropdowns (replace with API calls if needed)
    const [staffList, setStaffList] = useState([]);
    const [attackScripts, setAttackScripts] = useState([]);

    // Load simulation data if ID is present
    useEffect(() => {
        const fetchSimulationData = async () => {
            if (id) {
                try {
                    setLoading(true);
                    const allSimulations = await getSimulations();
                    const sim = allSimulations.find((s) => s.id === parseInt(id));
                    if (sim) {
                        setSimulationName(sim.name || "");
                        setSelectedStaffId(sim.targetStaffId || "");
                        setSelectedAttackScript(sim.attackScriptId || "");
                        setAttackParameters(sim.attackParams || {});
                    }
                } catch (error) {
                    console.error("Error loading simulation:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSimulationData();

        // Placeholder static options (replace with real API calls if you have them)
        setStaffList([
            { id: 1, name: "John Doe" },
            { id: 2, name: "Jane Smith" },
        ]);
        setAttackScripts([
            { id: "phishing", name: "Phishing Email" },
            { id: "malware", name: "Malware Drop" },
        ]);
    }, [id]);

    const handleSaveConfig = async () => {
        if (!id) {
            alert("Simulation must be created first before saving configuration.");
            return;
        }
        try {
            setLoading(true);
            await updateSimulation(id, {
                name: simulationName,
                targetStaffId: selectedStaffId,
                attackScriptId: selectedAttackScript,
                attackParams: attackParameters
            });
            alert("Configuration saved successfully!");
            navigate("/simulations");
        } catch (error) {
            alert(`Failed to save configuration: ${error.message}`);
>>>>>>> origin/main
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    const handleConfigChange = (field, value) => {
        setConfigData(prev => ({
            ...prev,
            [field]: value
        }));

        // Auto-select corresponding agent when staff is selected
        if (field === 'targetStaffId' && value) {
            const selectedStaff = staff.find(s => s.id == value);
            if (selectedStaff) {
                // Find agent assigned to this staff member
                const correspondingAgent = agents.find(agent => agent.staff_id == value);
                if (correspondingAgent) {
                    setConfigData(prev => ({
                        ...prev,
                        targetStaffId: value,
                        targetAgentId: correspondingAgent.id.toString()
                    }));
                }
            }
        }
    };

    const handleStartSimulation = async () => {
        if (!configData.targetStaffId || !configData.targetAgentId) {
            alert('Please select both target staff and agent before starting the simulation.');
            return;
        }

        if (!window.confirm(`Start simulation "${simulation.name}" with the selected configuration?`)) {
            return;
        }

        try {
            // Update simulation with target configuration
            await api.put(`/simulations/${id}`, {
                target_agents: JSON.stringify({
                    staffId: configData.targetStaffId,
                    agentId: configData.targetAgentId,
                    scriptId: configData.attackScriptId || 'default_phishing_script'
                }),
                status: 'scheduled'
            });

            // Start the simulation
            const result = await startSimulation({
                simulationId: id,
                name: simulation.name,
                targetStaffId: configData.targetStaffId,
                targetAgentId: configData.targetAgentId,
                attackScriptId: configData.attackScriptId || 'default_phishing_script',
                attackParams: configData.parameters
            });

            alert(`Simulation started successfully! ${result.message || ''}`);
            handleBackToSimulations();
        } catch (err) {
            alert(`Failed to start simulation: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading configuration...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        </div>
    );

    // General view when no specific simulation ID
    if (isGeneralView) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FaCog className="text-blue-600 text-2xl" />
                        <h1 className="text-3xl font-bold text-gray-800">Simulation Configuration</h1>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <FaBug className="text-blue-600 text-xl" />
                            <h2 className="text-xl font-semibold text-blue-800">Configure Your Simulations</h2>
                        </div>
                        <p className="text-blue-700 mb-4">
                            Welcome to the simulation configuration center. Here you can set up your security awareness simulations
                            with specific targets, attack vectors, and parameters.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3 text-blue-700">
                                <FaUsers className="text-blue-500" />
                                <span>Select target staff members</span>
                            </div>
                            <div className="flex items-center gap-3 text-blue-700">
                                <FaCode className="text-blue-500" />
                                <span>Choose attack scripts and agents</span>
                            </div>
                        </div>
                        <Button
                            onClick={() => handleBackToSimulations()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Simulations
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Specific simulation configuration view
    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <Button
                    onClick={() => handleBackToSimulations()}
                    variant="outline"
                    className="mb-4"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Simulations
                </Button>

                <div className="flex items-center gap-3 mb-2">
                    <FaCog className="text-blue-600 text-2xl" />
                    <h1 className="text-3xl font-bold text-gray-800">Configure Simulation</h1>
                </div>
                <p className="text-gray-600">Set up parameters and targets for your security simulation</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Simulation Info Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaBug className="text-green-600" />
                            Simulation Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-lg font-semibold">{simulation.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Type</label>
                            <Badge className="ml-2 capitalize">{simulation.type}</Badge>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Status</label>
                            <Badge
                                className={`ml-2 capitalize ${
                                    simulation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    simulation.status === 'running' ? 'bg-blue-100 text-blue-800' :
                                    simulation.status === 'failed' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                                {simulation.status}
                            </Badge>
                        </div>
                        {simulation.description && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Description</label>
                                <p className="text-sm text-gray-700 mt-1">{simulation.description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Configuration Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaCog className="text-blue-600" />
                            Configuration Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Target Staff Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaUser className="inline mr-2 text-blue-600" />
                                Target Staff Member
                            </label>
                            <select
                                value={configData.targetStaffId}
                                onChange={(e) => handleConfigChange('targetStaffId', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a staff member</option>
                                {staff.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.name} ({member.email}) - {member.department}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Target Agent Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaCode className="inline mr-2 text-green-600" />
                                Target Agent
                            </label>
                            <select
                                value={configData.targetAgentId}
                                onChange={(e) => handleConfigChange('targetAgentId', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select an agent</option>
                                {agents.map(agent => {
                                    const assignedStaff = staff.find(s => s.id === agent.staff_id);
                                    return (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.agent_name || agent.agent_id} ({agent.hostname}) - {agent.status}
                                            {assignedStaff ? ` - Assigned to ${assignedStaff.name}` : ' - Unassigned'}
                                        </option>
                                    );
                                })}
                            </select>
                            {configData.targetStaffId && configData.targetAgentId && (() => {
                                const selectedAgent = agents.find(a => a.id == configData.targetAgentId);
                                const selectedStaff = staff.find(s => s.id == configData.targetStaffId);
                                if (selectedAgent && selectedAgent.staff_id == configData.targetStaffId) {
                                    return (
                                        <p className="text-sm text-green-600 mt-1">
                                            ✓ Auto-selected agent assigned to {selectedStaff?.name}
                                        </p>
                                    );
                                }
                                return null;
                            })()}
                        </div>

                        {/* Attack Script Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaBug className="inline mr-2 text-red-600" />
                                Attack Script (Optional)
                            </label>
                            <select
                                value={configData.attackScriptId}
                                onChange={(e) => handleConfigChange('attackScriptId', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Use default script</option>
                                <option value="phishing_email_basic">Basic Phishing Email</option>
                                <option value="phishing_email_advanced">Advanced Phishing Email</option>
                                <option value="social_engineering_call">Social Engineering Call</option>
                                <option value="malware_simulation">Malware Simulation</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4 border-t">
                            <Button
                                onClick={handleStartSimulation}
                                disabled={!configData.targetStaffId || !configData.targetAgentId}
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                            >
                                <FaPlay />
                                Start Simulation
                            </Button>
                            <Button
                                onClick={() => handleBackToSimulations()}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
=======
    const handleStartSimulation = async () => {
        try {
            setLoading(true);
            const result = await startSimulation({
                name: simulationName,
                targetStaffId: selectedStaffId,
                attackScriptId: selectedAttackScript,
                attackParams: attackParameters
            });
            alert(result.message || "Simulation started successfully!");
            navigate("/simulations");
        } catch (error) {
            alert(`Failed to start simulation: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">
                {id ? "Configure Simulation" : "New Simulation Configuration"}
            </h1>

            {loading && <p className="mb-4">Loading...</p>}

            <div className="mb-4">
                <label className="block font-medium mb-2">Simulation Name</label>
                <input
                    type="text"
                    value={simulationName}
                    onChange={(e) => setSimulationName(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full"
                    placeholder="Enter simulation name"
                />
            </div>

            <div className="mb-4">
                <label className="block font-medium mb-2">Target Staff</label>
                <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full"
                >
                    <option value="">Select staff</option>
                    {staffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                            {staff.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-medium mb-2">Attack Script</label>
                <select
                    value={selectedAttackScript}
                    onChange={(e) => setSelectedAttackScript(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full"
                >
                    <option value="">Select attack script</option>
                    {attackScripts.map((script) => (
                        <option key={script.id} value={script.id}>
                            {script.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-medium mb-2">Attack Parameters (JSON)</label>
                <textarea
                    value={JSON.stringify(attackParameters, null, 2)}
                    onChange={(e) => {
                        try {
                            setAttackParameters(JSON.parse(e.target.value));
                        } catch {
                            // Invalid JSON — don't update state
                        }
                    }}
                    className="border border-gray-300 p-2 rounded w-full font-mono"
                    rows="5"
                />
            </div>

            <div className="flex space-x-4 mt-6">
                <button
                    onClick={handleSaveConfig}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={!simulationName || !selectedStaffId || !selectedAttackScript || loading}
                >
                    {loading ? "Saving..." : "Save Configuration"}
                </button>

                <button
                    onClick={handleStartSimulation}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    disabled={!simulationName || !selectedStaffId || !selectedAttackScript || loading}
                >
                    {loading ? "Starting..." : "Start Simulation"}
                </button>
>>>>>>> origin/main
            </div>
        </div>
    );
};

export default SimulationConfig;
<<<<<<< HEAD

=======
>>>>>>> origin/main
