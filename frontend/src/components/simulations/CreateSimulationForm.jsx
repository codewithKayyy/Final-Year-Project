// frontend/src/components/simulations/CreateSimulationForm.jsx
import React, { useState } from "react";
import { createSimulation } from "../../services/simulationService";
import { Button } from "../ui/button";

const CreateSimulationForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        scheduled_start: "",
        type: "phishing",
        status: "draft",
        campaign_id: null,
        created_by: 1, // TODO: Replace with logged-in user ID
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
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
            };

            const result = await createSimulation(formattedData);
            alert(result.message || "Simulation created successfully!");
            onSuccess();
        } catch (err) {
            setError(err.message || "Failed to create simulation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-800 border border-red-200 rounded-md p-4 text-sm">
                    {error}
                </div>
            )}

            {/* Name */}
            <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Simulation Name
                </label>
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
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
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Simulation Type
                </label>
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
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
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
                <label htmlFor="campaign_id" className="block text-sm font-medium text-gray-700">
                    Associated Campaign (Optional)
                </label>
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
            </div>
        </form>
    );
};

export default CreateSimulationForm;
