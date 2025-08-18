import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSimulations, deleteSimulation, startSimulation } from "../services/simulationService";
import { FaPlus, FaEdit, FaTrash, FaEye, FaPlay } from "react-icons/fa";
import Modal from "../components/common/Modal";
import CreateSimulationForm from "../components/simulations/CreateSimulationForm";

const SimulationManagement = () => {
    const [simulations, setSimulations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedSimulation, setSelectedSimulation] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [simulationToDelete, setSimulationToDelete] = useState(null);

    const navigate = useNavigate();

    const fetchSimulations = async () => {
        try {
            setLoading(true);
            const data = await getSimulations();
            setSimulations(data);
        } catch (err) {
            setError("Failed to fetch simulations: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSimulations();
    }, []);

    const handleViewDetails = (simulation) => {
        setSelectedSimulation(simulation);
        setShowDetailsModal(true);
    };

    const handleCreateNew = () => {
        setShowCreateModal(true);
    };

    const handleDeleteClick = (simulation) => {
        setSimulationToDelete(simulation);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (simulationToDelete) {
            try {
                await deleteSimulation(simulationToDelete.id);
                alert("Simulation deleted successfully!");
                fetchSimulations();
                setShowDeleteConfirm(false);
                setSimulationToDelete(null);
            } catch (err) {
                alert("Failed to delete simulation: " + err.message);
            }
        }
    };

    const handleStartClick = (simulation) => {
        // If required fields exist, start directly; else navigate to config page
        if (simulation.targetStaffId && simulation.attackScriptId) {
            if (window.confirm(`Start simulation "${simulation.name}" now?`)) {
                startSimulation({
                    name: simulation.name,
                    targetStaffId: simulation.targetStaffId,
                    attackScriptId: simulation.attackScriptId,
                    attackParams: {} // Customize if needed
                })
                    .then((result) => {
                        alert(`Simulation started! Job ID: ${result.attackJobId}`);
                        fetchSimulations();
                    })
                    .catch((err) => {
                        alert(`Failed to start simulation: ${err.message}`);
                    });
            }
        } else {
            // Navigate to configuration page to fill missing details
            navigate(`/simulation-config/${simulation.id}`);
        }
    };

    if (loading) return <div className="text-center py-8">Loading simulations...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Simulation Management</h1>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleCreateNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
                >
                    <FaPlus className="mr-2" /> Add New Simulation
                </button>
            </div>

            {simulations.length === 0 ? (
                <p className="text-gray-600">No simulations found. Click "Add New Simulation" to get started.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Start Time</th>
                            <th className="py-3 px-6 text-left">End Time</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                        {simulations.map((sim) => (
                            <tr key={sim.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{sim.id}</td>
                                <td className="py-3 px-6 text-left">{sim.name}</td>
                                <td className="py-3 px-6 text-left">
                                        <span
                                            className={`py-1 px-3 rounded-full text-xs font-medium
                                            ${sim.status === "completed"
                                                ? "bg-green-200 text-green-800"
                                                : sim.status === "running"
                                                    ? "bg-blue-200 text-blue-800"
                                                    : "bg-yellow-200 text-yellow-800"}`}
                                        >
                                            {sim.status}
                                        </span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {sim.start_time ? new Date(sim.start_time).toLocaleString() : "N/A"}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {sim.end_time ? new Date(sim.end_time).toLocaleString() : "N/A"}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-3">
                                        <button
                                            onClick={() => handleStartClick(sim)}
                                            className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors duration-200"
                                            title="Start Simulation"
                                        >
                                            <FaPlay />
                                        </button>
                                        <button
                                            onClick={() => handleViewDetails(sim)}
                                            className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors duration-200"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(sim)}
                                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200"
                                            title="Delete Simulation"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Simulation Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Simulation"
            >
                <CreateSimulationForm
                    onSuccess={async () => {
                        setShowCreateModal(false);
                        await fetchSimulations();
                    }}
                />
            </Modal>

            {/* Simulation Details Modal */}
            <Modal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title="Simulation Details"
            >
                {selectedSimulation && (
                    <div className="p-4">
                        <p><strong>ID:</strong> {selectedSimulation.id}</p>
                        <p><strong>Name:</strong> {selectedSimulation.name}</p>
                        <p><strong>Description:</strong> {selectedSimulation.description || "N/A"}</p>
                        <p><strong>Status:</strong> {selectedSimulation.status}</p>
                        <p><strong>Start Time:</strong> {selectedSimulation.start_time ? new Date(selectedSimulation.start_time).toLocaleString() : "N/A"}</p>
                        <p><strong>End Time:</strong> {selectedSimulation.end_time ? new Date(selectedSimulation.end_time).toLocaleString() : "N/A"}</p>
                        <p><strong>Created By:</strong> {selectedSimulation.created_by_user_id || "N/A"}</p>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Deletion"
            >
                {simulationToDelete && (
                    <div className="p-4 text-center">
                        <p className="text-lg mb-4">
                            Are you sure you want to delete simulation "<strong>{simulationToDelete.name}</strong>" (ID: {simulationToDelete.id})?
                        </p>
                        <p className="text-red-600 font-semibold mb-6">This action cannot be undone.</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                            >
                                Delete Simulation
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SimulationManagement;
