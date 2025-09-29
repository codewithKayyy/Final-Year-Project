// frontend/src/components/simulations/CreateSimulationForm.jsx
<<<<<<< HEAD
import React, { useState } from "react";
import { createSimulation } from "../../services/simulationService";
import { Button } from "../ui/button";
=======
import React, { useState } from 'react';
import { createSimulation } from '../../services/simulationService';
>>>>>>> origin/main

const CreateSimulationForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
<<<<<<< HEAD
        scheduled_start: "",
        type: "phishing",
        status: "draft",
        campaign_id: null,
        created_by: 1, // TODO: Replace with logged-in user ID
    });

=======
        start_time: "",
        end_time: "",
        status: "pending", // Default status
        created_by_user_id: 1, // Placeholder: Replace with actual logged-in user ID
    });
>>>>>>> origin/main
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
<<<<<<< HEAD
        setFormData((prev) => ({
            ...prev,
=======
        setFormData((prevData) => ({
            ...prevData,
>>>>>>> origin/main
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
<<<<<<< HEAD
            if (!formData.name) {
                throw new Error("Simulation name is required.");
            }

            const formattedData = {
                ...formData,
                scheduled_start: formData.scheduled_start
                    ? new Date(formData.scheduled_start)
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " ")
                    : null,
                campaign_id: formData.campaign_id || null,
=======
            // Basic validation
            if (!formData.name || !formData.start_time) {
                throw new Error("Simulation name and start time are required.");
            }

            // Format dates for MySQL (YYYY-MM-DD HH:MM:SS)
            const formattedData = {
                ...formData,
                start_time: formData.start_time ? new Date(formData.start_time).toISOString().slice(0, 19).replace('T', ' ') : null,
                end_time: formData.end_time ? new Date(formData.end_time).toISOString().slice(0, 19).replace('T', ' ') : null,
>>>>>>> origin/main
            };

            const result = await createSimulation(formattedData);
            alert(result.message || "Simulation created successfully!");
<<<<<<< HEAD
            onSuccess();
=======
            onSuccess(); // Close modal and refresh list
>>>>>>> origin/main
        } catch (err) {
            setError(err.message || "Failed to create simulation.");
        } finally {
            setLoading(false);
        }
    };

    return (
<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-800 border border-red-200 rounded-md p-4 text-sm">
                    {error}
                </div>
            )}

            {/* Name */}
            <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Simulation Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Simulation Type */}
            <div className="space-y-1">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Simulation Type</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="phishing">Phishing</option>
                    <option value="social_engineering">Social Engineering</option>
                    <option value="malware">Malware</option>
                    <option value="custom">Custom</option>
                </select>
            </div>

            {/* Scheduled Start */}
            <div className="space-y-1">
                <label htmlFor="scheduled_start" className="block text-sm font-medium text-gray-700">
                    Scheduled Start Time (Optional)
                </label>
                <input
                    type="datetime-local"
                    id="scheduled_start"
                    name="scheduled_start"
                    value={formData.scheduled_start}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Status */}
            <div className="space-y-1">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
=======
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
>>>>>>> origin/main
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
<<<<<<< HEAD
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Campaign ID */}
            <div className="space-y-1">
                <label htmlFor="campaign_id" className="block text-sm font-medium text-gray-700">Associated Campaign (Optional)</label>
                <input
                    type="number"
                    id="campaign_id"
                    name="campaign_id"
                    value={formData.campaign_id || ""}
                    onChange={handleChange}
                    placeholder="Enter campaign ID"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Hidden created_by */}
            <input type="hidden" name="created_by" value={formData.created_by} />

            {/* Submit */}
            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Simulation"}
                </Button>
=======
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
>>>>>>> origin/main
            </div>
        </form>
    );
};

<<<<<<< HEAD
export default CreateSimulationForm;
=======
export default CreateSimulationForm;
>>>>>>> origin/main
