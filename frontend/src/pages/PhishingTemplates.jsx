import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { FaEnvelope, FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaSyncAlt } from "react-icons/fa";
import api from "../services/api";
import PhishingEmailTemplateForm from "../components/PhishingEmailTemplateForm";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";

const PhishingTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [viewingTemplate, setViewingTemplate] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [campaignFilter, setCampaignFilter] = useState("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [templatesResponse, campaignsResponse] = await Promise.all([
                api.get("/phishing-emails"),
                api.get("/campaigns")
            ]);
            setTemplates(templatesResponse.data);
            setCampaigns(campaignsResponse.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (templateId) => {
        if (!window.confirm("Are you sure you want to delete this template?")) return;

        try {
            await api.delete(`/phishing-emails/${templateId}`);
            setTemplates(prev => prev.filter(t => t.id !== templateId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete template");
        }
    };

    const handleSave = (savedTemplate) => {
        if (editingTemplate) {
            setTemplates(prev =>
                prev.map(t => t.id === savedTemplate.id ? savedTemplate : t)
            );
            setEditingTemplate(null);
        } else {
            setTemplates(prev => [...prev, savedTemplate]);
        }
        setShowCreateModal(false);
    };

    // Filtered templates
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = !searchTerm ||
            template.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.from_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.from_email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCampaign = campaignFilter === "all" ||
            template.campaign_id === parseInt(campaignFilter);

        return matchesSearch && matchesCampaign;
    });

    const getCampaignName = (campaignId) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        return campaign?.name || "No Campaign";
    };

    const getStatusColor = (isActive) => {
        return isActive ? "text-green-600 bg-green-100" : "text-gray-600 bg-gray-100";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-80">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-3" />
                    <p className="text-gray-600">Loading email templates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-2xl font-bold">Email Templates</h2>
                        <p className="text-gray-500">Manage phishing email templates for campaigns</p>
                    </div>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <FaPlus className="mr-2" />
                    Create New Template
                </Button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center border rounded-md px-3 py-2">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm outline-none"
                    />
                </div>
                <select
                    value={campaignFilter}
                    onChange={(e) => setCampaignFilter(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                >
                    <option value="all">All Campaigns</option>
                    {campaigns.map(campaign => (
                        <option key={campaign.id} value={campaign.id}>
                            {campaign.name}
                        </option>
                    ))}
                </select>
                <Button variant="outline" onClick={fetchData}>
                    <FaSyncAlt className="mr-2" />
                    Refresh
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {/* Templates Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Email Templates ({filteredTemplates.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredTemplates.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Subject</th>
                                        <th className="px-4 py-3 text-left">From</th>
                                        <th className="px-4 py-3 text-left">Campaign</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Performance</th>
                                        <th className="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTemplates.map(template => {
                                        const clicks = template.click_count || 0;
                                        const successes = template.success_count || 0;
                                        const rate = clicks > 0 ? Math.round((successes / clicks) * 100) : 0;

                                        return (
                                            <tr key={template.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{template.subject}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Version {template.version}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>{template.from_name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {template.from_email}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="secondary">
                                                        {getCampaignName(template.campaign_id)}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge className={getStatusColor(template.is_active)}>
                                                        {template.is_active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    <div>{clicks} clicks / {successes} successes</div>
                                                    {clicks > 0 && (
                                                        <div className="text-gray-500">
                                                            {rate}% success rate
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setViewingTemplate(template)}
                                                        title="View Template"
                                                    >
                                                        <FaEye />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => setEditingTemplate(template)}
                                                        title="Edit Template"
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(template.id)}
                                                        title="Delete Template"
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaEnvelope className="text-gray-400 mx-auto mb-4" size={48} />
                            <h3 className="text-gray-600 font-medium mb-2">No email templates found</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                {searchTerm || campaignFilter !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "Create your first email template to get started"
                                }
                            </p>
                            <Button onClick={() => setShowCreateModal(true)}>
                                <FaPlus className="mr-2" />
                                Create Template
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Template Modal */}
            <Dialog
                open={showCreateModal || !!editingTemplate}
                onOpenChange={() => {
                    setShowCreateModal(false);
                    setEditingTemplate(null);
                }}
            >
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTemplate ? "Edit Template" : "Create New Template"}
                        </DialogTitle>
                        <p className="text-sm text-gray-600">
                            {editingTemplate ? "Update the email template details below." : "Create a new phishing email template for your campaigns."}
                        </p>
                    </DialogHeader>
                    <PhishingEmailTemplateForm
                        campaignId={null} // Allow selecting campaign
                        onSave={handleSave}
                        existingTemplate={editingTemplate}
                    />
                </DialogContent>
            </Dialog>

            {/* View Template Modal */}
            <Dialog open={!!viewingTemplate} onOpenChange={() => setViewingTemplate(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Template Preview</DialogTitle>
                        <p className="text-sm text-gray-600">
                            Preview the email template content and settings.
                        </p>
                    </DialogHeader>
                    {viewingTemplate && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Subject:</strong> {viewingTemplate.subject}
                                </div>
                                <div>
                                    <strong>From:</strong> {viewingTemplate.from_name} &lt;{viewingTemplate.from_email}&gt;
                                </div>
                                <div>
                                    <strong>Campaign:</strong> {getCampaignName(viewingTemplate.campaign_id)}
                                </div>
                                <div>
                                    <strong>Status:</strong> {viewingTemplate.is_active ? "Active" : "Inactive"}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Email Content:</h4>
                                <div
                                    className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto"
                                    dangerouslySetInnerHTML={{ __html: viewingTemplate.html_content }}
                                />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PhishingTemplates;