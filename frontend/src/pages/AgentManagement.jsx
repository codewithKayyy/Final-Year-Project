import React, { useEffect, useState } from 'react';
import { getAgents, deleteAgent } from '../services/agentService';
import { FaPlus, FaEdit, FaTrash, FaCircle } from 'react-icons/fa';
import Modal from '../components/common/Modal';
import AgentForm from '../components/agents/AgentForm';
import { socket } from '../services/socket.js'; // Assuming you have a socket.js for Socket.IO client

const AgentManagement = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState(null);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const data = await getAgents();
            setAgents(data);
        } catch (err) {
            setError('Failed to fetch agents: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();

        // Listen for real-time agent status updates
        socket.on('agentStatusUpdate', (data) => {
            console.log('Agent status update received:', data);
            setAgents(prevAgents =>
                prevAgents.map(agent =>
                    agent.id === data.agentId ? { ...agent, status: data.status, last_seen: new Date().toISOString() } : agent
                )
            );
        });

        return () => {
            socket.off('agentStatusUpdate');
        };
    }, []);

    const handleCreateNew = () => {
        setSelectedAgent(null);
        setShowCreateModal(true);
    };

    const handleEdit = (agent) => {
        setSelectedAgent(agent);
        setShowEditModal(true);
    };

    const handleDeleteClick = (agent) => {
        setAgentToDelete(agent);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (agentToDelete) {
            try {
                await deleteAgent(agentToDelete.id);
                alert('Agent deleted successfully!');
                fetchAgents(); // Refresh the list
                setShowDeleteConfirm(false);
                setAgentToDelete(null);
            } catch (err) {
                alert('Failed to delete agent: ' + err.message);
            }
        }
    };

    if (loading) return <div className="text-center py-8">Loading agents...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Agent Management</h1>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleCreateNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
                >
                    <FaPlus className="mr-2" /> Add New Agent
                </button>
            </div>

            {agents.length === 0 ? (
                <p className="text-gray-600">No agents found. Click "Add New Agent" to get started.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">IP Address</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Last Seen</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                        {agents.map((agent) => (
                            <tr key={agent.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{agent.id}</td>
                                <td className="py-3 px-6 text-left">{agent.agent_name}</td>
                                <td className="py-3 px-6 text-left">{agent.ip_address || 'N/A'}</td>
                                <td className="py-3 px-6 text-left flex items-center">
                                    <FaCircle className={`mr-2 ${agent.status === 'online' ? 'text-green-500' : 'text-red-500'}`} />
                                    {agent.status}
                                </td>
                                <td className="py-3 px-6 text-left">{new Date(agent.last_seen).toLocaleString()}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-3">
                                        <button
                                            onClick={() => handleEdit(agent)}
                                            className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 flex items-center justify-center transition-colors duration-200"
                                            title="Edit Agent"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(agent)}
                                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors duration-200"
                                            title="Delete Agent"
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

            {/* Create/Edit Agent Modal */}
            <Modal
                isOpen={showCreateModal || showEditModal}
                onClose={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedAgent(null); }}
                title={selectedAgent ? "Edit Agent" : "Create New Agent"}
            >
                <AgentForm
                    agent={selectedAgent}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedAgent(null);
                        fetchAgents();
                    }}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Deletion"
            >
                {agentToDelete && (
                    <div className="p-4 text-center">
                        <p className="text-lg mb-4">Are you sure you want to delete agent "<strong>{agentToDelete.agent_name}</strong>" (ID: {agentToDelete.id})?</p>
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
                                Delete Agent
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AgentManagement;