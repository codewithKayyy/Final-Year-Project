// frontend/src/pages/AttackLogs.jsx
import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Modal from "../components/common/Modal";
import { getAttackLogs } from "../services/attackLogService";
import { socket } from "../services/socket";
import { FaEye } from "react-icons/fa";

const AttackLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await getAttackLogs();
            setLogs(Array.isArray(data) ? data : []);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to fetch attack logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();

        // Real-time update
        socket.on("attackExecuted", (log) => {
            setLogs((prev) => [log, ...prev]);
        });

        return () => socket.off("attackExecuted");
    }, []);

    const handleViewDetails = (log) => {
        setSelectedLog(log);
        setShowDetailsModal(true);
    };

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Attack Logs</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading attack logs...</span>
                    </div>
                ) : logs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Simulation ID</TableHead>
                                    <TableHead>Agent ID</TableHead>
                                    <TableHead>Attack Type</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Outcome</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.id}</TableCell>
                                        <TableCell>{log.simulation_id}</TableCell>
                                        <TableCell>{log.agent_id}</TableCell>
                                        <TableCell>{log.attack_type}</TableCell>
                                        <TableCell>{log.target}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    log.outcome === "success"
                                                        ? "bg-green-100 text-green-800"
                                                        : log.outcome === "failed"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-gray-100 text-gray-800"
                                                }
                                            >
                                                {log.outcome}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <button
                                                onClick={() => handleViewDetails(log)}
                                                className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors duration-200"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        No attack logs available.
                    </div>
                )}
            </CardContent>

            {/* Details Modal */}
            <Modal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title="Attack Log Details"
            >
                {selectedLog && (
                    <div className="p-4 text-sm">
                        <p><strong>ID:</strong> {selectedLog.id}</p>
                        <p><strong>Simulation ID:</strong> {selectedLog.simulation_id}</p>
                        <p><strong>Agent ID:</strong> {selectedLog.agent_id}</p>
                        <p><strong>Attack Type:</strong> {selectedLog.attack_type}</p>
                        <p><strong>Target:</strong> {selectedLog.target}</p>
                        <p><strong>Outcome:</strong> {selectedLog.outcome}</p>
                        <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</p>
                        <p><strong>Details:</strong></p>
                        <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">
                            {typeof selectedLog.details === "string"
                                ? selectedLog.details
                                : JSON.stringify(selectedLog.details, null, 2)}
                        </pre>
                    </div>
                )}
            </Modal>
        </Card>
    );
};

export default AttackLogs;
