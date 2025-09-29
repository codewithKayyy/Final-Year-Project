// frontend/src/pages/AgentManagement.jsx
import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
    FaRobot,
    FaSearch,
    FaUserPlus,
    FaTrash,
    FaCircle,
    FaDesktop,
    FaSyncAlt,
    FaChartLine,
    FaPlus,
    FaEdit,
} from "react-icons/fa";
import {
    getAgents,
    deleteAgent,
    assignStaffToAgent,
} from "../services/agentService";
import { getStaff } from "../services/staffService";
import { socket } from "../services/socket";
import AssignStaffModal from "../components/agents/AssignStaffModal";
import TelemetryModal from "../components/agents/TelemetryModal";
import Modal from "../components/common/Modal";
import AgentForm from "../components/agents/AgentForm";

const AgentManagement = () => {
    const [agents, setAgents] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalAgent, setModalAgent] = useState(null);
    const [telemetryAgent, setTelemetryAgent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // New from origin/main
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState(null);

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const data = await getAgents();
            setAgents(data);
        } catch (err) {
            setError("Failed to fetch agents: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        try {
            const data = await getStaff();
            setStaff(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this agent?")) return;
        try {
            await deleteAgent(id);
            fetchAgents();
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchAgents();
        fetchStaff();

        socket.on("agentStatusUpdate", (updatedAgent) => {
            setAgents((prev) =>
                prev.map((a) =>
                    a.id === updatedAgent.id
                        ? { ...a, status: updatedAgent.status, last_seen: new Date().toISOString() }
                        : a
                )
            );
        });

        return () => {
            socket.off("agentStatusUpdate");
        };
    }, []);

    // Status helpers
    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "success";
            case "offline":
                return "secondary";
            case "inactive":
                return "warning";
            case "deactivated":
                return "destructive";
            default:
                return "secondary";
        }
    };

    const getStatusIcon = (status) => {
        const base = "mr-1";
        switch (status?.toLowerCase()) {
            case "active":
                return <FaCircle className={`${base} text-success`} />;
            case "offline":
                return <FaCircle className={`${base} text-gray-400`} />;
            case "inactive":
                return <FaCircle className={`${base} text-yellow-500`} />;
            case "deactivated":
                return <FaCircle className={`${base} text-red-500`} />;
            default:
                return <FaCircle className={`${base} text-gray-400`} />;
        }
    };

    // Filtered agents
    const filteredAgents = agents.filter((agent) => {
        const matchesSearch =
            !searchTerm ||
            agent.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.ip_address?.includes(searchTerm) ||
            agent.hostname?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || agent.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Metrics
    const metrics = {
        total: agents.length,
        active: agents.filter((a) => a.status === "active").length,
        offline: agents.filter((a) => a.status === "offline").length,
        assigned: agents.filter((a) => a.staff_id).length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-80">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-3" />
                    <p className="text-gray-600">Loading agents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-3">
                <FaRobot className="text-primary" size={32} />
                <div>
                    <h2 className="text-2xl font-bold">Agent Management</h2>
                    <p className="text-gray-500">
                        Monitor and manage deployed security agents
                    </p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <FaRobot className="text-primary" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">{metrics.total}</h4>
                            <p className="text-sm text-gray-500">Total Agents</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaCircle className="text-green-500" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">{metrics.active}</h4>
                            <p className="text-sm text-gray-500">Online Agents</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                            <FaCircle className="text-gray-500" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">{metrics.offline}</h4>
                            <p className="text-sm text-gray-500">Offline Agents</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 p-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaUserPlus className="text-blue-500" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">{metrics.assigned}</h4>
                            <p className="text-sm text-gray-500">Assigned</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center border rounded-md px-3 py-2">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search agents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="offline">Offline</option>
                    <option value="inactive">Inactive</option>
                    <option value="deactivated">Deactivated</option>
                </select>
                <Button
                    variant="outline"
                    onClick={() => {
                        setError("");
                        fetchAgents();
                    }}
                >
                    <FaSyncAlt className="mr-2" /> Refresh
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {/* Agents Table */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Agents ({filteredAgents.length})</CardTitle>
                    <Button
                        className="bg-blue-600 text-white"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FaPlus className="mr-2" /> Add Agent
                    </Button>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    {filteredAgents.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left">Agent</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">System Info</th>
                                <th className="px-4 py-2 text-left">Assignment</th>
                                <th className="px-4 py-2 text-left">Last Seen</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredAgents.map((agent) => (
                                <tr
                                    key={agent.id}
                                    className="border-b last:border-0 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <FaDesktop className="text-gray-400" />
                                            <div>
                                                <div className="font-medium">
                                                    {agent.agent_name || "Unnamed Agent"}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {agent.hostname || "Unknown Host"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Badge
                                            variant={getStatusVariant(agent.status)}
                                            className="flex items-center"
                                        >
                                            {getStatusIcon(agent.status)}
                                            {agent.status || "Unknown"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-2 text-xs text-gray-600">
                                        <div>
                                            <strong>IP:</strong>{" "}
                                            {agent.ip_address || "N/A"}
                                        </div>
                                        <div>
                                            <strong>OS:</strong>{" "}
                                            {agent.os_type || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        {agent.staff_id ? (
                                            <Badge variant="primary">Staff Assigned</Badge>
                                        ) : (
                                            <Badge variant="secondary">Unassigned</Badge>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-xs text-gray-500">
                                        {agent.last_seen
                                            ? new Date(agent.last_seen).toLocaleString()
                                            : "Never"}
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setTelemetryAgent(agent)}
                                            title="View Telemetry"
                                        >
                                            <FaChartLine />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => setModalAgent(agent)}
                                            title="Assign Staff"
                                        >
                                            <FaUserPlus />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedAgent(agent);
                                                setShowEditModal(true);
                                            }}
                                            title="Edit Agent"
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(agent.id)}
                                            title="Delete Agent"
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-10">
                            <FaRobot
                                className="text-gray-400 mx-auto mb-3"
                                size={40}
                            />
                            <h5 className="text-gray-500 font-medium">
                                No agents found
                            </h5>
                            <p className="text-gray-400 text-sm">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "No agents are currently registered in the system"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assign Staff Modal */}
            {modalAgent && (
                <AssignStaffModal
                    agent={modalAgent}
                    staffList={staff}
                    onClose={() => setModalAgent(null)}
                    onAssigned={fetchAgents}
                />
            )}

            {/* Telemetry Modal */}
            <TelemetryModal
                agent={telemetryAgent}
                isOpen={!!telemetryAgent}
                onClose={() => setTelemetryAgent(null)}
            />

            {/* Create/Edit Agent Modal */}
            <Modal
                isOpen={showCreateModal || showEditModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedAgent(null);
                }}
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
        </div>
    );
};

export default AgentManagement;
