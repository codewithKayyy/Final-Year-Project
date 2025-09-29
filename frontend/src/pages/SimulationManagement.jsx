// frontend/src/pages/SimulationManagement.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    getSimulations,
    deleteSimulation,
    startSimulation,
} from "../services/simulationService";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../components/ui/dialog";
import CreateSimulationForm from "../components/simulations/CreateSimulationForm";
import { FaPlus, FaEye, FaTrash, FaPlay, FaArrowLeft, FaBullhorn } from "react-icons/fa";
import api from "../services/api";

const SimulationManagement = () => {
    const [simulations, setSimulations] = useState([]);
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedSimulation, setSelectedSimulation] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [simulationToDelete, setSimulationToDelete] = useState(null);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const campaignId = searchParams.get('campaign');

    const fetchSimulations = async () => {
        try {
            setLoading(true);
            let data;
            let campaignData = null;

            if (campaignId) {
                // Fetch simulations for specific campaign
                const [simulationsRes, campaignRes] = await Promise.all([
                    api.get(`/simulations?campaign=${campaignId}`),
                    api.get(`/campaigns/${campaignId}`)
                ]);
                data = simulationsRes.data;
                campaignData = campaignRes.data;
            } else {
                // Fetch all simulations
                data = await getSimulations();
            }

            setSimulations(data);
            setCampaign(campaignData);
        } catch (err) {
            setError("Failed to fetch simulations: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSimulations();
    }, [campaignId]);

    const handleStartClick = (simulation) => {
        if (simulation.targetStaffId && simulation.attackScriptId) {
            if (window.confirm(`Start simulation "${simulation.name}" now?`)) {
                startSimulation({
                    name: simulation.name,
                    targetStaffId: simulation.targetStaffId,
                    attackScriptId: simulation.attackScriptId,
                    attackParams: {},
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
            navigate(`/simulation-config/${simulation.id}`);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteSimulation(simulationToDelete.id);
            alert(`Simulation "${simulationToDelete.name}" deleted successfully.`);
            setShowDeleteConfirm(false);
            setSimulationToDelete(null);
            await fetchSimulations();
        } catch (err) {
            alert(`Failed to delete simulation: ${err.message}`);
        }
    };

    if (loading)
        return <div className="text-center py-8">Loading simulations...</div>;
    if (error)
        return (
            <div className="text-center py-8 text-red-600">Error: {error}</div>
        );

    return (
        <div className="space-y-6">
            {/* Breadcrumb and Header */}
            {campaign && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/campaigns')}
                        className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                    >
                        <FaArrowLeft className="mr-1" />
                        Back to Campaigns
                    </Button>
                    <span>/</span>
                    <FaBullhorn className="text-gray-500" />
                    <span className="font-medium">{campaign.name}</span>
                    <span>/</span>
                    <span>Simulations</span>
                </div>
            )}

            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {campaign ? `${campaign.name} - Simulations` : 'Simulation Management'}
                    </h1>
                    {campaign && (
                        <p className="text-gray-600 text-sm mt-1">
                            Manage simulations for this campaign
                        </p>
                    )}
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <FaPlus className="mr-2" /> Add New Simulation
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Simulations</CardTitle>
                </CardHeader>
                <CardContent>
                    {simulations.length === 0 ? (
                        <p className="text-gray-500">
                            No simulations found. Click "Add New Simulation" to get started.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Start Time</TableHead>
                                        <TableHead>End Time</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {simulations.map((sim) => (
                                        <TableRow key={sim.id}>
                                            <TableCell>{sim.id}</TableCell>
                                            <TableCell>{sim.name}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`${
                                                        sim.status === "completed"
                                                            ? "bg-green-100 text-green-800"
                                                            : sim.status === "running"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {sim.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {sim.scheduled_start
                                                    ? new Date(sim.scheduled_start).toLocaleString()
                                                    : sim.actual_start
                                                        ? new Date(sim.actual_start).toLocaleString()
                                                        : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {sim.completed_at
                                                    ? new Date(sim.completed_at).toLocaleString()
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStartClick(sim)}
                                                >
                                                    <FaPlay />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedSimulation(sim);
                                                        setShowDetailsModal(true);
                                                    }}
                                                >
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setSimulationToDelete(sim);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Simulation Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create New Simulation</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to create a new security simulation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-2">
                        <CreateSimulationForm
                            campaignId={campaignId}
                            onSuccess={async () => {
                                setShowCreateModal(false);
                                await fetchSimulations();
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Simulation Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Simulation Details</DialogTitle>
                    </DialogHeader>
                    {selectedSimulation && (
                        <div className="space-y-2 text-sm">
                            <p>
                                <strong>ID:</strong> {selectedSimulation.id}
                            </p>
                            <p>
                                <strong>Name:</strong> {selectedSimulation.name}
                            </p>
                            <p>
                                <strong>Description:</strong>{" "}
                                {selectedSimulation.description || "N/A"}
                            </p>
                            <p>
                                <strong>Status:</strong> {selectedSimulation.status}
                            </p>
                            <p>
                                <strong>Scheduled Start:</strong>{" "}
                                {selectedSimulation.scheduled_start
                                    ? new Date(
                                        selectedSimulation.scheduled_start
                                    ).toLocaleString()
                                    : "N/A"}
                            </p>
                            <p>
                                <strong>Actual Start:</strong>{" "}
                                {selectedSimulation.actual_start
                                    ? new Date(
                                        selectedSimulation.actual_start
                                    ).toLocaleString()
                                    : "N/A"}
                            </p>
                            <p>
                                <strong>Completed At:</strong>{" "}
                                {selectedSimulation.completed_at
                                    ? new Date(
                                        selectedSimulation.completed_at
                                    ).toLocaleString()
                                    : "N/A"}
                            </p>
                            <p>
                                <strong>Type:</strong> {selectedSimulation.type || "N/A"}
                            </p>
                            <p>
                                <strong>Campaign:</strong>{" "}
                                {selectedSimulation.campaign_name || "N/A"}
                            </p>
                            <p>
                                <strong>Created By:</strong>{" "}
                                {selectedSimulation.created_by || "N/A"}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    {simulationToDelete && (
                        <div className="space-y-4">
                            <p>
                                Are you sure you want to delete simulation{" "}
                                <strong>{simulationToDelete.name}</strong> (ID:{" "}
                                {simulationToDelete.id})?
                            </p>
                            <p className="text-red-600 font-semibold">
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteConfirm}>
                                    Delete Simulation
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SimulationManagement;
