import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { io } from 'socket.io-client';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [data, setData] = useState({
        totalStaff: 228,
        activeCampaigns: 1,
        avgClickRate: 24.7,
        reportRate: 17.3,
    });

    const [activities, setActivities] = useState([
        { message: 'a.mensah@ug.edu.gh - Clicked malicious link', time: '2:25 PM' },
        { message: 's.osei@ug.edu.gh - Correctly reported phishing', time: '1:45 PM' },
        { message: 'y.appiah@ug.edu.gh - Passed with 95%', time: '12:30 PM' },
        { message: 'Admin - Campaign scheduled', time: '11:15 AM' },
        { message: 'admin@ug.edu.gh - Successful authentication', time: '10:00 AM' },
    ]);

    useEffect(() => {
        const socket = io('/socket.io');
        socket.on('connect_error', (error) => {
            console.log('Socket connection error:', error.message);
        });
        socket.on('activityUpdate', (activity) => {
            setActivities((prev) => [activity, ...prev].slice(0, 5));
        });
        return () => socket.disconnect();
    }, []);

    const lineData = {
        labels: ['Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'],
        datasets: [
            {
                label: 'Click Rate (%)',
                data: [35, 30, 25, 20, 15, 10],
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Report Rate (%)',
                data: [5, 7, 9, 11, 13, 15],
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const pieData = {
        labels: ['Finance', 'Administration', 'Engineering', 'Computer Science', 'IT Services'],
        datasets: [
            {
                data: [30, 25, 20, 15, 10],
                backgroundColor: ['#FF6384', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF'],
            },
        ],
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header & Controls */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-blue-900">Dashboard Overview</h2>
                <div className="space-x-3">
                    <button className="bg-blue-900 text-white px-5 py-2 rounded hover:bg-blue-800 transition">+ New Campaign</button>
                    <button className="bg-gray-100 text-blue-900 px-5 py-2 rounded hover:bg-gray-200 transition">Export Data</button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Staff', value: data.totalStaff, sub: '+5 this month', color: 'text-green-600' },
                    { label: 'Active Campaigns', value: data.activeCampaigns, sub: 'Q4 Finance Training', color: 'text-gray-600' },
                    { label: 'Avg Click Rate', value: `${data.avgClickRate}%`, sub: '+2.2% improvement', color: 'text-green-600' },
                    { label: 'Report Rate', value: `${data.reportRate}%`, sub: '+4.2% improvement', color: 'text-green-600' },
                ].map(({ label, value, sub, color }, i) => (
                    <div key={i} className="bg-white p-4 shadow-md rounded text-center space-y-1">
                        <p className="text-3xl font-bold text-blue-900">{value}</p>
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className={`text-sm ${color}`}>{sub}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded shadow-md">
                    <h3 className="font-medium text-blue-900 mb-2">Monthly Campaign Trends</h3>
                    <Line data={lineData} />
                </div>
                <div className="bg-white p-5 rounded shadow-md">
                    <h3 className="font-medium text-blue-900 mb-2">Department Risk Assessment</h3>
                    <Pie data={pieData} />
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white p-5 rounded shadow-md">
                <h3 className="font-medium text-blue-900 mb-3">Recent Activity</h3>
                <ul className="divide-y">
                    {activities.map((a, i) => (
                        <li key={i} className="flex justify-between py-2 text-sm">
              <span
                  className={`font-medium ${
                      a.message.includes('Clicked') ? 'text-red-600' :
                          a.message.includes('reported') ? 'text-blue-600' :
                              a.message.includes('Passed') ? 'text-green-600' :
                                  a.message.includes('scheduled') ? 'text-yellow-600' :
                                      'text-gray-800'
                  }`}
              >
                {a.message}
              </span>
                            <span className="text-gray-500">{a.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
