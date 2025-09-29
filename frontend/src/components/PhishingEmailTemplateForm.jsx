import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FaEye, FaEyeSlash, FaSave, FaTimes } from 'react-icons/fa';
import api from '../services/api';

const PhishingEmailTemplateForm = ({ campaignId, onSave, existingTemplate }) => {
    const [formData, setFormData] = useState({
        campaign_id: campaignId || '',
        subject: '',
        html_content: '',
        from_name: '',
        from_email: '',
        target_url: '',
        version: 'A',
        is_active: true
    });
    const [campaigns, setCampaigns] = useState([]);
    const [preview, setPreview] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (existingTemplate) {
            setFormData(existingTemplate);
        }
        fetchCampaigns();
    }, [existingTemplate]);

    const fetchCampaigns = async () => {
        try {
            const response = await api.get('/campaigns');
            setCampaigns(response.data);
        } catch (err) {
            console.error('Failed to fetch campaigns:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = existingTemplate
                ? `/phishing-emails/${existingTemplate.id}`
                : '/phishing-emails';

            const method = existingTemplate ? 'PUT' : 'POST';

            const response = await api({
                url,
                method,
                data: formData
            });

            onSave(response.data);

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campaign Selection (if not provided) */}
                {!campaignId && (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2">Campaign *</label>
                        <select
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.campaign_id}
                            onChange={(e) => handleChange('campaign_id', e.target.value)}
                            required
                        >
                            <option value="">Select Campaign</option>
                            {campaigns.map(campaign => (
                                <option key={campaign.id} value={campaign.id}>
                                    {campaign.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Subject and Version Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Subject Line *</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.subject}
                            onChange={(e) => handleChange('subject', e.target.value)}
                            placeholder="Enter email subject"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Version</label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.version}
                            onChange={(e) => handleChange('version', e.target.value)}
                        >
                            <option value="A">Version A</option>
                            <option value="B">Version B</option>
                            <option value="C">Version C</option>
                            <option value="D">Version D</option>
                        </select>
                    </div>
                </div>

                {/* From Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">From Name *</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.from_name}
                            onChange={(e) => handleChange('from_name', e.target.value)}
                            placeholder="Display name"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">From Email *</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formData.from_email}
                            onChange={(e) => handleChange('from_email', e.target.value)}
                            placeholder="sender@example.com"
                            required
                        />
                    </div>
                </div>

                {/* Target URL */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-2">Target URL *</label>
                    <input
                        type="url"
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.target_url}
                        onChange={(e) => handleChange('target_url', e.target.value)}
                        placeholder="https://example.com/phishing-landing"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Use <code className="bg-gray-100 px-1 rounded">{'{{phishing_url}}'}</code> in HTML content to insert this URL
                    </p>
                </div>

                {/* HTML Content */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">HTML Content *</label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPreview(!preview)}
                        >
                            {preview ? (
                                <>
                                    <FaEyeSlash className="mr-2" />
                                    Hide Preview
                                </>
                            ) : (
                                <>
                                    <FaEye className="mr-2" />
                                    Show Preview
                                </>
                            )}
                        </Button>
                    </div>

                    <div className={`grid ${preview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                        <div>
                            <textarea
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                                rows={preview ? 16 : 12}
                                value={formData.html_content}
                                onChange={(e) => handleChange('html_content', e.target.value)}
                                placeholder="Enter HTML content for the phishing email..."
                                required
                            />
                        </div>

                        {preview && (
                            <div>
                                <div className="text-sm text-gray-600 mb-2 font-medium">Preview:</div>
                                <div
                                    className="border border-gray-300 rounded-md p-4 bg-white max-h-96 overflow-auto"
                                    dangerouslySetInnerHTML={{
                                        __html: formData.html_content.replace(/\{\{phishing_url\}\}/g, formData.target_url)
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => handleChange('is_active', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">
                        Template is Active
                    </label>
                    {formData.is_active && (
                        <Badge className="text-xs bg-green-100 text-green-800">
                            Will be used in simulations
                        </Badge>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="min-w-[120px]"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                            </div>
                        ) : (
                            <>
                                <FaSave className="mr-2" />
                                {existingTemplate ? 'Update Template' : 'Create Template'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PhishingEmailTemplateForm;