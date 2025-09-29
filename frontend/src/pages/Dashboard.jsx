// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
    FaRobot,
    FaBullhorn,
    FaFlask,
    FaUsers,
    FaCheckCircle,
    FaClock,
    FaNetworkWired,
    FaChartPie,
    FaBell,
    FaRocket,
    FaChartLine,
    FaPlay,
    FaPlus,
    FaEye,
} from "react-icons/fa";
import { socket } from "../services/socket";
import api from "../services/api";

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        agents: { online: 0, offline: 0, total: 0 },
        campaigns: { active: 0, completed: 0, total: 0 },
        simulations: { running: 0, completed: 0, total: 0 },
        staff: { total: 0, targeted: 0 },
        recentLogs: [],
    });

    const [systemHealth, setSystemHealth] = useState({
        backend: "healthy",
        database: "healthy",
        attackExecutor: "healthy",
        redis: "healthy",
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        setupRealTimeUpdates();
        return () => {
            socket.off("agentStatusUpdate");
            socket.off("simulationUpdate");
            socket.off("campaignUpdate");
            socket.off("systemHealthUpdate");
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [agentsRes, campaignsRes, simulationsRes, staffRes, logsRes, healthRes] =
                await Promise.all([
                    api.get("/agents"),
                    api.get("/campaigns"),
                    api.get("/simulations"),
                    api.get("/staff"),
                    api.get("/attack-logs?limit=10"),
                    api.get("/system/health"),
                ]);

            const agents = agentsRes.data || [];
            const campaigns = campaignsRes.data || [];
            const simulations = simulationsRes.data || [];
            const staff = staffRes.data || [];
            const logs = logsRes.data || [];

            setMetrics({
                agents: {
                    online: agents.filter((a) => a.status === "active").length,
                    offline: agents.filter((a) => a.status === "offline").length,
                    total: agents.length,
                },
                campaigns: {
                    active: campaigns.filter((c) => c.status === "running").length,
                    completed: campaigns.filter((c) => c.status === "completed").length,
                    total: campaigns.length,
                },
                simulations: {
                    running: simulations.filter((s) => s.status === "running").length,
                    completed: simulations.filter((s) => s.status === "completed").length,
                    total: simulations.length,
                },
                staff: {
                    total: staff.length,
                    targeted: staff.filter((s) => s.is_active).length,
                },
                recentLogs: logs,
            });

            setSystemHealth(healthRes.data || systemHealth);

            setRecentActivity(
                logs.slice(0, 5).map((log) => ({
                    id: log.id,
                    type: "simulation",
                    message: `${log.attack_type} simulation ${log.outcome} on agent ${log.agent_id}`,
                    timestamp: log.timestamp,
                    status: log.outcome,
                }))
            );
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const setupRealTimeUpdates = () => {
        socket.on("agentStatusUpdate", (data) => {
            setMetrics((prev) => ({
                ...prev,
                agents: {
                    ...prev.agents,
                    online:
                        data.status === "online"
                            ? prev.agents.online + 1
                            : Math.max(0, prev.agents.online - 1),
                    offline:
                        data.status === "offline"
                            ? prev.agents.offline + 1
                            : Math.max(0, prev.agents.offline - 1),
                },
            }));

            setRecentActivity((prev) => [
                {
                    id: Date.now(),
                    type: "agent",
                    message: `Agent ${data.agentId} went ${data.status}`,
                    timestamp: new Date().toISOString(),
                    status: data.status === "online" ? "success" : "warning",
                },
                ...prev.slice(0, 4),
            ]);
        });

        socket.on("simulationUpdate", (data) => {
            if (data.status === "completed") {
                setMetrics((prev) => ({
                    ...prev,
                    simulations: {
                        ...prev.simulations,
                        running: Math.max(0, prev.simulations.running - 1),
                        completed: prev.simulations.completed + 1,
                    },
                }));
            }

            setRecentActivity((prev) => [
                {
                    id: Date.now(),
                    type: "simulation",
                    message: `Simulation ${data.simulationId} ${data.status}`,
                    timestamp: new Date().toISOString(),
                    status: data.status === "completed" ? "success" : "info",
                },
                ...prev.slice(0, 4),
            ]);
        });

        socket.on("campaignUpdate", fetchDashboardData);

        socket.on("systemHealthUpdate", (data) => {
            setSystemHealth(data);
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "healthy":
                return "bg-green-500";
            case "warning":
                return "bg-yellow-500";
            case "error":
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                        <FaClock /> Real-time monitoring of your cybersecurity simulation
                        platform
                    </p>
                </div>
                <Badge className="bg-green-100 text-green-700 flex items-center gap-2">
                    <FaCheckCircle /> System Online
                </Badge>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: "Agents",
                        value: metrics.agents.total,
                        icon: <FaRobot className="text-blue-500" size={24} />,
                        details: [
                            { label: "Online", value: metrics.agents.online, color: "text-green-600" },
                            { label: "Offline", value: metrics.agents.offline, color: "text-gray-600" },
                        ],
                    },
                    {
                        title: "Campaigns",
                        value: metrics.campaigns.total,
                        icon: <FaBullhorn className="text-sky-500" size={24} />,
                        details: [
                            { label: "Running", value: metrics.campaigns.active, color: "text-blue-600" },
                            { label: "Completed", value: metrics.campaigns.completed, color: "text-green-600" },
                        ],
                    },
                    {
                        title: "Simulations",
                        value: metrics.simulations.total,
                        icon: <FaFlask className="text-yellow-500" size={24} />,
                        details: [
                            { label: "Running", value: metrics.simulations.running, color: "text-yellow-600" },
                            { label: "Completed", value: metrics.simulations.completed, color: "text-green-600" },
                        ],
                    },
                    {
                        title: "Staff",
                        value: metrics.staff.total,
                        icon: <FaUsers className="text-gray-500" size={24} />,
                        details: [
                            { label: "Targeted", value: metrics.staff.targeted, color: "text-blue-600" },
                            { label: "Not Targeted", value: metrics.staff.total - metrics.staff.targeted, color: "text-gray-600" },
                        ],
                    },
                ].map((card, i) => (
                    <Card key={i} className="hover:shadow-lg transition">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-center mb-3">
                                <div className="bg-gray-100 p-3 rounded-lg">{card.icon}</div>
                            </div>
                            <h3 className="text-xl font-bold">{card.value}</h3>
                            <p className="text-gray-500 mb-3">{card.title}</p>
                            <div className="flex justify-between">
                                {card.details.map((d, j) => (
                                    <span key={j} className={`text-sm ${d.color}`}>
                                        {d.value} {d.label}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* System Health & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaBell className="text-blue-500" /> Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((a) => (
                                <div
                                    key={a.id}
                                    className="flex justify-between items-center p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaChartLine className="text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium">{a.message}</p>
                                            <span className="text-xs text-gray-500">
                                                {new Date(a.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge>{a.status}</Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-6">No recent activity</p>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FaNetworkWired className="text-green-500" /> System Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Object.entries(systemHealth).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between p-3 rounded-md bg-gray-50"
                                >
                                    <span className="capitalize text-gray-700">{key}</span>
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${getStatusColor(
                                            value
                                        )} text-white`}
                                    >
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FaRocket className="text-purple-500" /> Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                className="w-full flex gap-2"
                                onClick={() => (window.location.href = "/simulation-config")}
                            >
                                <FaPlay /> Start New Simulation
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full flex gap-2"
                                onClick={() => (window.location.href = "/campaigns")}
                            >
                                <FaPlus /> Create Campaign
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full flex gap-2"
                                onClick={() => (window.location.href = "/agents")}
                            >
                                <FaEye /> View Agents
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Progress */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FaChartPie className="text-sky-500" /> Resource Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="flex justify-between text-sm mb-2">
                            <span>Agent Status</span>
                            <span>{metrics.agents.online}/{metrics.agents.total}</span>
                        </p>
                        <Progress value={(metrics.agents.online / metrics.agents.total) * 100 || 0} />
                    </div>
                    <div>
                        <p className="flex justify-between text-sm mb-2">
                            <span>Campaign Status</span>
                            <span>{metrics.campaigns.active}/{metrics.campaigns.total}</span>
                        </p>
                        <Progress value={(metrics.campaigns.active / metrics.campaigns.total) * 100 || 0} />
                    </div>
                    <div>
                        <p className="flex justify-between text-sm mb-2">
                            <span>Simulation Status</span>
                            <span>{metrics.simulations.running}/{metrics.simulations.total}</span>
                        </p>
                        <Progress value={(metrics.simulations.running / metrics.simulations.total) * 100 || 0} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
