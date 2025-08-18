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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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