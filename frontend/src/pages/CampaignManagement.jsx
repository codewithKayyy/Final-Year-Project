import React, { useState, useEffect } from "react";
import campaignService from "../services/campaignService";
import CampaignTable from "../components/CampaignTable";
import CampaignModal from "../components/CampaignModal";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const CampaignManagement = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCampaign, setCurrentCampaign] = useState(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const data = await campaignService.getCampaigns();
            setCampaigns(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching campaigns:", err);
            setError("Failed to load campaigns. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setCurrentCampaign(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (campaign) => {
        setCurrentCampaign(campaign);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this campaign?")) {
            try {
                await campaignService.deleteCampaign(id);
                fetchCampaigns();
            } catch (err) {
                console.error("Error deleting campaign:", err);
                setError("Failed to delete campaign. Please try again.");
            }
        }
    };

    const handleModalSubmit = async (campaignData) => {
        try {
            if (currentCampaign) {
                await campaignService.updateCampaign(currentCampaign.id, campaignData);
            } else {
                await campaignService.createCampaign(campaignData);
            }
            setIsModalOpen(false);
            fetchCampaigns();
        } catch (err) {
            console.error("Error saving campaign:", err);
            setError("Failed to save campaign. Please check your input.");
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Campaign Management</h1>
                <Button onClick={handleCreateClick}>Create New Campaign</Button>
            </div>

            {/* Alerts */}
            {loading && (
                <Card>
                    <CardContent className="p-4 text-center text-gray-600">
                        Loading campaigns...
                    </CardContent>
                </Card>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {/* Campaigns */}
            {!loading && !error && campaigns.length === 0 && (
                <Card>
                    <CardContent className="p-6 text-center text-gray-600">
                        No campaigns found. Create one to get started!
                    </CardContent>
                </Card>
            )}

            {!loading && !error && campaigns.length > 0 && (
                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <CampaignTable
                            campaigns={campaigns}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Modal */}
            <CampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={currentCampaign}
            />
        </div>
    );
};

export default CampaignManagement;
