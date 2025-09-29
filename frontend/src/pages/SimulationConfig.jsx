// frontend/src/pages/SimulationConfig.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
    getSimulations,
    startSimulation,
    updateSimulation,
} from "../services/simulationService";
import api from "../services/api";
import {
    FaUser,
    FaCode,
    FaPlay,
    FaArrowLeft,
    FaCog,
    FaUsers,
    FaBug,
} from "react-icons/fa";

const SimulationConfig = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [simulation, setSimulation] = useState(null);
    const [staff, setStaff] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [configData, setConfigData] = useState({
        targetStaffId: "",
        targetAgentId: "",
        attackScriptId: "",
        parameters: {},
    });

    const isGeneralView = !id;

    const handleBackToSimulations = () => {
        try {
            navigate("/simulations");
        } catch (error) {
            console.error("Navigation error:", error);
            window.location.href = "/simulations";
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (isGeneralView) {
                const simData = await getSimulations();
                setSimulation({ list: simData });
            } else {
                const [simData, staffData, agentsData] = await Promise.all([
                    api.get(`/simulations/${id}`),
                    api.get("/staff"),
                    api.get("/agents"),
                ]);

                setSimulation(simData.data);
                setStaff(staffData.data || []);
                setAgents(agentsData.data || []);

                if (simData.data.target_agents) {
                    try {
                        const targetAgents = JSON.parse(simData.data.target_agents);
                        setConfigData((prev) => ({
                            ...prev,
                            targetStaffId: targetAgents.staffId || "",
                            targetAgentId: targetAgents.agentId || "",
                            attackScriptId: targetAgents.scriptId || "",
                        }));
                    } catch (e) {
                        console.warn("Could not parse target_agents JSON:", e);
                    }
                }
            }
        } catch (err) {
            setError(err.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleConfigChange = (field, value) => {
        setConfigData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (field === "targetStaffId" && value) {
            const correspondingAgent = agents.find(
                (agent) => agent.staff_id == value
            );
            if (correspondingAgent) {
                setConfigData((prev) => ({
                    ...prev,
                    targetStaffId: value,
                    targetAgentId: correspondingAgent.id.toString(),
                }));
            }
        }
    };

    const handleSaveConfig = async () => {
        if (!id) {
            alert("Simulation must be created first before saving configuration.");
            return;
        }
        try {
            setLoading(true);
            await updateSimulation(id, {
                targetStaffId: configData.targetStaffId,
                targetAgentId: configData.targetAgentId,
                attackScriptId: configData.attackScriptId,
                attackParams: configData.parameters,
            });
            alert("Configuration saved successfully!");
            handleBackToSimulations();
        } catch (error) {
            alert(`Failed to save configuration: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleStartSimulation = async () => {
        if (!configData.targetStaffId || !configData.targetAgentId) {
            alert("Please select both target staff and agent before starting.");
            return;
        }

        if (
            !window.confirm(
                `Start simulation "${simulation.name}" with the selected configuration?`
            )
        ) {
            return;
        }

        try {
            await api.put(`/simulations/${id}`, {
                target_agents: JSON.stringify({
                    staffId: configData.targetStaffId,
                    agentId: configData.targetAgentId,
                    scriptId: configData.attackScriptId || "default_phishing_script",
                }),
                status: "scheduled",
            });

            const result = await startSimulation({
                simulationId: id,
                name: simulation.name,
                targetStaffId: configData.targetStaffId,
                targetAgentId: configData.targetAgentId,
                attackScriptId: configData.attackScriptId || "default_phishing_script",
                attackParams: configData.parameters,
            });

            alert(`Simulation started! ${result.message || ""}`);
            handleBackToSimulations();
        } catch (err) {
            alert(`Failed to start simulation: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading configuration...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );

    if (isGeneralView) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FaCog className="text-blue-600 text-2xl" />
                        <h1 className="text-3xl font-bold text-gray-800">
                            Simulation Configuration
                        </h1>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <p className="text-blue-700 mb-4">
                            Welcome to the simulation configuration center. Select
                            targets, attack vectors, and parameters.
                        </p>
                        <Button
                            onClick={handleBackToSimulations}
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

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <Button
                onClick={handleBackToSimulations}
                variant="outline"
                className="mb-4"
            >
                <FaArrowLeft className="mr-2" />
                Back to Simulations
            </Button>

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
                        <p>
                            <strong>Name:</strong> {simulation.name}
                        </p>
                        <p>
                            <strong>Type:</strong>{" "}
                            <Badge className="capitalize">{simulation.type}</Badge>
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <Badge className="capitalize">{simulation.status}</Badge>
                        </p>
                        {simulation.description && (
                            <p className="text-sm text-gray-700 mt-1">
                                {simulation.description}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Config Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaCog className="text-blue-600" />
                            Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block mb-2">Target Staff</label>
                            <select
                                value={configData.targetStaffId}
                                onChange={(e) =>
                                    handleConfigChange("targetStaffId", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2"
                            >
                                <option value="">Select staff</option>
                                {staff.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2">Target Agent</label>
                            <select
                                value={configData.targetAgentId}
                                onChange={(e) =>
                                    handleConfigChange("targetAgentId", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2"
                            >
                                <option value="">Select agent</option>
                                {agents.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.agent_name || a.agent_id} ({a.hostname})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2">Attack Script</label>
                            <select
                                value={configData.attackScriptId}
                                onChange={(e) =>
                                    handleConfigChange("attackScriptId", e.target.value)
                                }
                                className="w-full border rounded-md px-3 py-2"
                            >
                                <option value="">Default script</option>
                                <option value="phishing_email_basic">
                                    Basic Phishing
                                </option>
                                <option value="malware_simulation">
                                    Malware Simulation
                                </option>
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                onClick={handleSaveConfig}
                                className="bg-blue-600 text-white"
                            >
                                Save Config
                            </Button>
                            <Button
                                onClick={handleStartSimulation}
                                className="bg-green-600 text-white"
                            >
                                <FaPlay className="mr-2" /> Start
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SimulationConfig;
