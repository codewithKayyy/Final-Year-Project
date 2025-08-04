import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { FaSyncAlt } from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const lineData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
        {
            label: 'Campaign Activity',
            data: [10, 20, 45, 50, 35, 25],
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4,
        },
    ],
};

const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
        {
            label: 'Performance',
            data: [10, 12, 18, 9, 14],
            backgroundColor: '#36D399',
        },
    ],
};

const alerts = [
    'Multiple failed attempts',
    'Unusual login pattern',
    'Credential harvesting detected',
];

const activityLogs = [
    '[5:30:26 PM] ALERT: New phishing attempt detected',
    '[5:29:54 PM] INFO: System health check completed',
    '[5:29:12 PM] ALERT: New phishing attempt detected',
    '[5:28:54 PM] ALERT: New phishing attempt detected',
    '[5:28:34 PM] INFO: Campaign metrics updated',
    '[5:27:54 PM] SUCCESS: User completed security training',
    '[5:26:54 PM] ALERT: New phishing attempt detected',
    '[5:25:54 PM] SUCCESS: User completed security training',
    '[5:24:54 PM] ALERT: New phishing attempt detected',
];

const Monitoring = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Real-time Monitoring & Analytics</h2>
                <button className="bg-gray-100 px-4 py-2 rounded inline-flex items-center">
                    <FaSyncAlt className="mr-2" /> Refresh
                </button>
            </div>

            {/* Top 3 + Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Active Simulations */}
                <div className="bg-white rounded shadow p-4">
                    <h3 className="text-sm font-semibold mb-2">ACTIVE SIMULATIONS</h3>
                    <p className="text-3xl font-bold text-green-600 mb-2">1</p>
                    <p className="text-sm text-gray-500 mb-2">Campaign Running</p>
                    <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>

                {/* Response Rate */}
                <div className="bg-white rounded shadow p-4 flex flex-col justify-between">
                    <h3 className="text-sm font-semibold mb-2">RESPONSE RATE</h3>
                    <p className="text-3xl font-bold text-green-600 mb-1">67%</p>
                    <p className="text-sm text-gray-500">Staff Engaged</p>
                    <div className="mt-4 w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center text-green-600 font-bold self-center">
                        67%
                    </div>
                </div>

                {/* Security Alerts */}
                <div className="bg-white rounded shadow p-4">
                    <h3 className="text-sm font-semibold mb-2">SECURITY ALERTS</h3>
                    <p className="text-3xl font-bold text-red-600 mb-2">3</p>
                    <p className="text-sm text-gray-500 mb-2">High Priority</p>
                    <ul className="space-y-2">
                        {alerts.map((alert, idx) => (
                            <li key={idx} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm">
                                {alert}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Performance Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded shadow p-4">
                    <h3 className="text-sm font-semibold mb-2">PERFORMANCE TREND</h3>
                    <p className="text-xl font-bold text-green-600 mb-2">+12.4% Improvement</p>
                    <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>

                {/* Live Monitor */}
                <div className="bg-white rounded shadow p-4">
                    <h3 className="text-sm font-semibold mb-2">Live Activity Monitor</h3>
                    <div className="overflow-y-auto max-h-64 border border-gray-200 p-2 text-sm font-mono bg-gray-50 rounded">
                        {activityLogs.map((log, idx) => (
                            <div key={idx} className="py-1 border-b border-dotted">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Monitoring;
