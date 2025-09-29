// frontend/src/components/PhishingTemplateManager.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Badge, Alert, Spinner } from 'react-bootstrap';
import PhishingEmailTemplateForm from './PhishingEmailTemplateForm';
import api from '../services/api';

const PhishingTemplateManager = ({ campaign }) => {
    const [templates, setTemplates] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (campaign?.id) {
            fetchTemplates();
        }
    }, [campaign?.id]);

    const fetchTemplates = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/phishing-emails/campaign/${campaign.id}`);
            setTemplates(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (templateId) => {
        if (!window.confirm('Are you sure you want to delete this template?')) return;
        try {
            await api.delete(`/phishing-emails/${templateId}`);
            setTemplates((prev) => prev.filter(t => t.id !== templateId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete template');
        }
    };

    const handleSave = (savedTemplate) => {
        if (editingTemplate) {
            setTemplates((prev) =>
                prev.map(t => t.id === savedTemplate.id ? savedTemplate : t)
            );
            setEditingTemplate(null);
        } else {
            setTemplates((prev) => [...prev, savedTemplate]);
        }
        setShowCreate(false);
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading templates...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Email Templates for {campaign?.name || 'N/A'}</h4>
                <Button variant="primary" onClick={() => setShowCreate(true)}>
                    + Create New Template
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Version</th>
                    <th>Subject</th>
                    <th>From</th>
                    <th>Status</th>
                    <th>Performance</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {templates.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                            No templates created yet. Create your first template to start A/B testing.
                        </td>
                    </tr>
                ) : (
                    templates.map(template => {
                        const clicks = template.click_count || 0;
                        const successes = template.success_count || 0;
                        const rate = clicks > 0 ? Math.round((successes / clicks) * 100) : 0;

                        return (
                            <tr key={template.id}>
                                <td>
                                    <Badge bg="secondary">{template.version}</Badge>
                                </td>
                                <td>{template.subject}</td>
                                <td>{template.from_name} &lt;{template.from_email}&gt;</td>
                                <td>
                                    <Badge bg={template.is_active ? "success" : "secondary"}>
                                        {template.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </td>
                                <td>
                                    {clicks} clicks / {successes} successes
                                    {clicks > 0 && (
                                        <span className="text-muted ms-2">({rate}% rate)</span>
                                    )}
                                </td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => setEditingTemplate(template)}
                                        className="me-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(template.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </Table>

            <Modal
                show={showCreate || editingTemplate}
                onHide={() => {
                    setShowCreate(false);
                    setEditingTemplate(null);
                }}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingTemplate ? 'Edit Template' : 'Create New Template'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PhishingEmailTemplateForm
                        campaignId={campaign?.id}
                        onSave={handleSave}
                        existingTemplate={editingTemplate}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PhishingTemplateManager;
