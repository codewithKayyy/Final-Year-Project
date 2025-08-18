// frontend/src/components/simulations/CreateSimulationForm.jsx
import React, { useState } from 'react';
import { createSimulation } from '../../services/simulationService';

const CreateSimulationForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        start_time: "",
        end_time: "",
        status: "pending", // Default status
        created_by_user_id: 1, // Placeholder: Replace with actual logged-in user ID
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            // Basic validation
            if (!formData.name || !formData.start_time) {
                throw new Error("Simulation name and start time are required.");
            }

            // Format dates for MySQL (YYYY-MM-DD HH:MM:SS)
            const formattedData = {
                ...formData,
                start_time: formData.start_time ? new Date(formData.start_time).toISOString().slice(0, 19).replace('T', ' ') : null,
                end_time: formData.end_time ? new Date(formData.end_time).toISOString().slice(0, 19).replace('T', ' ') : null,
            };

            const result = await createSimulation(formattedData);
            alert(result.message || "Simulation created successfully!");
            onSuccess(); // Close modal and refresh list
        } catch (err) {
            setError(err.message || "Failed to create simulation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Simulation Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                ></textarea>
            </div>

            <div className="mb-4">
                <label htmlFor="start_time" className="block text-gray-700 text-sm font-bold mb-2">Start Time:</label>
                <input
                    type="datetime-local"
                    id="start_time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="end_time" className="block text-gray-700 text-sm font-bold mb-2">End Time (Optional):</label>
                <input
                    type="datetime-local"
                    id="end_time"
                    name="end_time"
                    value={formData.end_time}
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
                    <option value="pending">Pending</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* created_by_user_id will eventually come from authentication context */}
            <input type="hidden" name="created_by_user_id" value={formData.created_by_user_id} />

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Simulation"}
                </button>
            </div>
        </form>
    );
};

export default CreateSimulationForm;