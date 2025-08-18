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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
