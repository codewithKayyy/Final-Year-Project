// frontend/src/components/agents/AgentForm.jsx
import React, { useState, useEffect } from 'react';
import { createAgent, updateAgent } from '../../services/agentService';

const AgentForm = ({ agent, onSuccess }) => {
    const [formData, setFormData] = useState({
        id: '',
        agent_name: '',
        ip_address: '',
        status: 'offline',
        associated_staff_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (agent) {
            setFormData({
                id: agent.id || '',
                agent_name: agent.agent_name || '',
                ip_address: agent.ip_address || '',
                status: agent.status || 'offline',
                associated_staff_id: agent.associated_staff_id || '',
            });
        } else {
            setFormData({
                id: '',
                agent_name: '',
                ip_address: '',
                status: 'offline',
                associated_staff_id: '',
            });
        }
    }, [agent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (agent) {
                // Update existing agent
                await updateAgent(agent.id, formData);
                alert('Agent updated successfully!');
            } else {
                // Create new agent
                await createAgent(formData);
                alert('Agent created successfully!');
            }
            onSuccess(); // Close modal and refresh list
        } catch (err) {
            setError(err.message || 'Failed to save agent.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            <div className="mb-4">
                <label htmlFor="id" className="block text-gray-700 text-sm font-bold mb-2">Agent ID:</label>
                <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    disabled={!!agent} // Disable ID field if editing existing agent
                />
            </div>

            <div className="mb-4">
                <label htmlFor="agent_name" className="block text-gray-700 text-sm font-bold mb-2">Agent Name:</label>
                <input
                    type="text"
                    id="agent_name"
                    name="agent_name"
                    value={formData.agent_name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="ip_address" className="block text-gray-700 text-sm font-bold mb-2">IP Address:</label>
                <input
                    type="text"
                    id="ip_address"
                    name="ip_address"
                    value={formData.ip_address}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="compromised">Compromised</option>
                    <option value="disconnected">Disconnected</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="associated_staff_id" className="block text-gray-700 text-sm font-bold mb-2">Associated Staff ID (Optional):</label>
                <input
                    type="text"
                    id="associated_staff_id"
                    name="associated_staff_id"
                    value={formData.associated_staff_id}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                >
                    {loading ? (agent ? "Updating..." : "Creating...") : (agent ? "Update Agent" : "Create Agent")}
                </button>
            </div>
        </form>
    );
};

export default AgentForm;