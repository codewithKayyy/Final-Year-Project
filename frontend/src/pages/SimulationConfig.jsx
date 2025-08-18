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
        } finally {
            setLoading(false);
        }
    };

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
            </div>
        </div>
    );
};

export default SimulationConfig;
