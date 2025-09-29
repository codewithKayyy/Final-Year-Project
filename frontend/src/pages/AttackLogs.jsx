<<<<<<< HEAD
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
import { getAttackLogs } from "../services/attackLogService";
import { socket } from "../services/socket";

const AttackLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await getAttackLogs();
            setLogs(Array.isArray(data) ? data : []);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to fetch attack logs");
=======
import React, { useEffect, useState } from 'react';
import { getAttackLogs } from '../services/attackLogService';
import Modal from '../components/common/Modal';

const AttackLogs = () => {
    const [attackLogs, setAttackLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    const fetchAttackLogs = async () => {
        try {
            setLoading(true);
            const data = await getAttackLogs();
            setAttackLogs(data);
        } catch (err) {
            setError('Failed to fetch attack logs: ' + err.message);
>>>>>>> origin/main
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
<<<<<<< HEAD
        fetchLogs();

        socket.on("attackExecuted", (log) => {
            setLogs((prev) => [log, ...prev]);
        });

        return () => socket.off("attackExecuted");
    }, []);

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
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-right">Timestamp</TableHead>
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
                                                        : "bg-red-100 text-red-800"
                                                }
                                            >
                                                {log.outcome}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {typeof log.details === "string"
                                                ? log.details
                                                : JSON.stringify(log.details)}
                                        </TableCell>
                                        <TableCell className="text-right text-gray-600">
                                            {new Date(log.timestamp).toLocaleString()}
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
        </Card>
    );
};

export default AttackLogs;
=======
        fetchAttackLogs();
    }, []);

    const handleViewDetails = (log) => {
        setSelectedLog(log);
        setShowDetailsModal(true);
    };

    if (loading) return <div className="text-center py-8">Loading attack logs...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Attack Logs</h1>

            {attackLogs.length === 0 ? (
                <p className="text-gray-600">No attack logs found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Simulation ID</th>
                            <th className="py-3 px-6 text-left">Agent ID</th>
                            <th className="py-3 px-6 text-left">Attack Type</th>
                            <th className="py-3 px-6 text-left">Target</th>
                            <th className="py-3 px-6 text-left">Outcome</th>
                            <th className="py-3 px-6 text-left">Timestamp</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                        {attackLogs.map((log) => (
                            <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{log.id}</td>
                                <td className="py-3 px-6 text-left">{log.simulation_id}</td>
                                <td className="py-3 px-6 text-left">{log.agent_id}</td>
                                <td className="py-3 px-6 text-left">{log.attack_type}</td>
                                <td className="py-3 px-6 text-left">{log.target}</td>
                                <td className="py-3 px-6 text-left">
                    <span className={`py-1 px-3 rounded-full text-xs font-medium
                      ${log.outcome === 'success' ? 'bg-green-200 text-green-800'
                        : log.outcome === 'failed' ? 'bg-red-200 text-red-800'
                            : 'bg-gray-200 text-gray-800'}`}>
                      {log.outcome}
                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-3">
                                        <button
                                            onClick={() => handleViewDetails(log)}
                                            className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors duration-200"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Attack Log Details Modal */}
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
                        <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-xs">{JSON.stringify(selectedLog.details, null, 2)}</pre>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AttackLogs;
>>>>>>> origin/main
