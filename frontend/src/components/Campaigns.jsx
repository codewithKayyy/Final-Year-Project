import React from 'react';
import { FaEye, FaEdit, FaStop, FaPlus } from 'react-icons/fa';

const campaigns = [
    {
        id: 'CAMP001',
        name: 'Q4 Finance Department Training',
        desc: 'Email Phishing',
        status: 'ACTIVE',
        type: 'Email Phishing',
        progress: '101/101',
        clickRate: 22.8,
        reportRate: 14.9,
    },
    {
        id: 'CAMP002',
        name: 'University-wide Security Awareness',
        desc: 'Email Phishing',
        status: 'COMPLETED',
        type: 'Email Phishing',
        progress: '228/228',
        clickRate: 29.4,
        reportRate: 19.7,
    },
    {
        id: 'CAMP003',
        name: 'Advanced Spear Phishing Test',
        desc: 'Spear Phishing',
        status: 'SCHEDULED',
        type: 'Spear Phishing',
        progress: '0/60',
        clickRate: 0,
        reportRate: 0,
    },
    {
        id: 'CAMP004',
        name: 'SMS Phishing Simulation',
        desc: 'SMS Phishing',
        status: 'DRAFT',
        type: 'SMS Phishing',
        progress: '0/78',
        clickRate: 0,
        reportRate: 0,
    },
];

const statusColors = {
    ACTIVE: 'bg-green-100 text-green-600',
    COMPLETED: 'bg-blue-100 text-blue-600',
    SCHEDULED: 'bg-yellow-100 text-yellow-600',
    DRAFT: 'bg-gray-200 text-gray-600',
};

const Campaigns = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Phishing Campaign Management</h2>
                <div className="space-x-2">
                    <button className="bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center">
                        <FaPlus className="mr-2" /> Create Campaign
                    </button>
                    <button className="bg-gray-200 px-4 py-2 rounded">Manage Templates</button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-500 mb-1">ACTIVE CAMPAIGNS</p>
                    <p className="text-2xl text-green-600 font-bold">1</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-500 mb-1">COMPLETED</p>
                    <p className="text-2xl text-blue-600 font-bold">12</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-500 mb-1">SCHEDULED</p>
                    <p className="text-2xl text-yellow-600 font-bold">3</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-500 mb-1">DRAFTS</p>
                    <p className="text-2xl text-gray-600 font-bold">2</p>
                </div>
            </div>

            {/* Campaign Table */}
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 text-left text-sm">
                    <tr>
                        <th className="p-3">Campaign ID</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Progress</th>
                        <th className="p-3">Click Rate</th>
                        <th className="p-3">Report Rate</th>
                        <th className="p-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {campaigns.map((c, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50 text-sm">
                            <td className="p-3">{c.id}</td>
                            <td className="p-3">
                                <div className="font-medium">{c.name}</div>
                                <div className="text-gray-500 text-xs">{c.desc}</div>
                            </td>
                            <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${statusColors[c.status]}`}>
                                        {c.status}
                                    </span>
                            </td>
                            <td className="p-3">{c.type}</td>
                            <td className="p-3">
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                parseInt(c.progress.split('/')[0]) /
                                                parseInt(c.progress.split('/')[1] || 1) * 100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="text-xs">{c.progress}</span>
                            </td>
                            <td className="p-3 text-red-600 font-semibold">{c.clickRate}%</td>
                            <td className="p-3 text-green-600 font-semibold">{c.reportRate}%</td>
                            <td className="p-3 space-x-2">
                                <button className="text-gray-600 hover:text-black">
                                    <FaEye />
                                </button>
                                <button className="text-blue-600 hover:text-blue-800">
                                    <FaEdit />
                                </button>
                                {c.status === 'ACTIVE' && (
                                    <button className="text-red-600 hover:text-red-800">
                                        <FaStop />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Campaigns;
