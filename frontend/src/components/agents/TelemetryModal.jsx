import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { FaChartLine, FaDesktop, FaMemory, FaMicrochip, FaTimes, FaSync } from "react-icons/fa";
import api from "../../services/api";

const TelemetryModal = ({ agent, isOpen, onClose }) => {
    const [telemetryData, setTelemetryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTelemetry = async () => {
        if (!agent?.id) return;

        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/telemetry/agent/${agent.id}?limit=10`);
            setTelemetryData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch telemetry data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && agent) {
            fetchTelemetry();
        }
    }, [isOpen, agent]);

    const formatBytes = (bytes) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatUptime = (uptimeSeconds) => {
        if (!uptimeSeconds) return "N/A";
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "active": return "text-green-600 bg-green-100";
            case "offline": return "text-gray-600 bg-gray-100";
            case "warning": return "text-yellow-600 bg-yellow-100";
            case "error": return "text-red-600 bg-red-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    const latest = telemetryData[0] || {};

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <FaChartLine className="text-blue-600" />
                        Telemetry Data - {agent?.agent_name || agent?.hostname || "Unknown Agent"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header with refresh button */}
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600 text-sm">
                            Real-time system metrics and performance data
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={fetchTelemetry}
                            disabled={loading}
                        >
                            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Loading telemetry data...</span>
                        </div>
                    ) : telemetryData.length === 0 ? (
                        <div className="text-center py-8">
                            <FaChartLine className="text-gray-400 mx-auto mb-3" size={40} />
                            <h3 className="text-gray-600 font-medium">No telemetry data available</h3>
                            <p className="text-gray-500 text-sm">
                                This agent hasn't reported any telemetry data yet
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Current Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <FaDesktop className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">System Info</h4>
                                                <p className="text-sm text-gray-600">
                                                    {latest.platform} {latest.arch}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Node {latest.node_version}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <FaMemory className="text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Memory Usage</h4>
                                                <p className="text-sm text-gray-600">
                                                    {latest.memory_usage_percent}%
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatBytes(latest.free_memory_mb * 1024 * 1024)} free
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 p-2 rounded-full">
                                                <FaMicrochip className="text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">CPU Info</h4>
                                                <p className="text-sm text-gray-600">
                                                    {latest.cpu_count} cores
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Load: {latest.load_average}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Detailed Telemetry History */}
                            <Card>
                                <CardContent className="p-0">
                                    <div className="px-4 py-3 border-b bg-gray-50">
                                        <h3 className="font-medium text-gray-800">Recent Telemetry History</h3>
                                        <p className="text-sm text-gray-600">Last 10 telemetry reports</p>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Timestamp</th>
                                                    <th className="px-4 py-2 text-left">Status</th>
                                                    <th className="px-4 py-2 text-left">Memory</th>
                                                    <th className="px-4 py-2 text-left">CPU</th>
                                                    <th className="px-4 py-2 text-left">Uptime</th>
                                                    <th className="px-4 py-2 text-left">Load Avg</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {telemetryData.map((record, index) => (
                                                    <tr key={index} className="border-b hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-xs">
                                                            {new Date(record.timestamp).toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <Badge className={`text-xs ${getStatusColor(record.status)}`}>
                                                                {record.status || "Unknown"}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-2 text-xs">
                                                            <div>{record.memory_usage_percent}%</div>
                                                            <div className="text-gray-500">
                                                                {formatBytes((record.total_memory_mb - record.free_memory_mb) * 1024 * 1024)} used
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 text-xs">
                                                            <div>{record.cpu_count} cores</div>
                                                            <div className="text-gray-500">{record.cpu_model?.substring(0, 20)}...</div>
                                                        </td>
                                                        <td className="px-4 py-2 text-xs">
                                                            {formatUptime(record.uptime)}
                                                        </td>
                                                        <td className="px-4 py-2 text-xs">
                                                            {record.load_average || "N/A"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TelemetryModal;