import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import {
    Users,
    BarChart3,
    MousePointerClick,
    Flag,
    LineChart as LineChartIcon,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

// Helper: color-coded progress like in CampaignDetail
const getProgressColor = (value) => {
    if (value >= 70) return "bg-green-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-red-500";
};

// Custom tooltip renderer
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
        <div className="bg-white border border-gray-200 shadow-md rounded-md p-2 text-sm">
            <p className="font-medium text-gray-700">{label}</p>
            {payload.map((entry, idx) => (
                <p
                    key={idx}
                    className="text-gray-600"
                    style={{ color: entry.stroke }}
                >
                    {entry.name}: <span className="font-semibold">{entry.value}</span>
                </p>
            ))}
        </div>
    );
};

const CampaignStats = ({ campaign }) => {
    const [hiddenLines, setHiddenLines] = useState({ clicks: false, reports: false });

    // Fallback mock chart data
    const chartData =
        campaign?.stats_over_time || [
            { date: "Day 1", clicks: 10, reports: 3 },
            { date: "Day 2", clicks: 25, reports: 8 },
            { date: "Day 3", clicks: 40, reports: 15 },
            { date: "Day 4", clicks: 60, reports: 20 },
            { date: "Day 5", clicks: 45, reports: 18 },
        ];

    // Toggle line visibility when legend item clicked
    const handleLegendClick = (e) => {
        setHiddenLines((prev) => ({
            ...prev,
            [e.dataKey]: !prev[e.dataKey],
        }));
    };

    return (
        <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Participants */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-gray-500" />
                            Participants
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-gray-800">
                            {campaign.participant_count || 0}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            People included in this campaign
                        </p>
                    </CardContent>
                </Card>

                {/* Click Rate */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MousePointerClick className="h-5 w-5 text-gray-500" />
                            Click Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Click Rate</span>
                            <span>{campaign.click_rate || 0}%</span>
                        </div>
                        <Progress
                            value={campaign.click_rate || 0}
                            className="h-2"
                            indicatorClassName={getProgressColor(campaign.click_rate || 0)}
                        />
                    </CardContent>
                </Card>

                {/* Report Rate */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Flag className="h-5 w-5 text-gray-500" />
                            Report Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Report Rate</span>
                            <span>{campaign.report_rate || 0}%</span>
                        </div>
                        <Progress
                            value={campaign.report_rate || 0}
                            className="h-2"
                            indicatorClassName={getProgressColor(campaign.report_rate || 0)}
                        />
                    </CardContent>
                </Card>

                {/* Overall Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-500" />
                            Overall Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            A quick overview of how this campaign performed against its
                            objectives.
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                            <li>
                                Engagement:{" "}
                                <span className="font-semibold">
                  {campaign.click_rate >= 50 ? "High" : "Low"}
                </span>
                            </li>
                            <li>
                                Awareness:{" "}
                                <span className="font-semibold">
                  {campaign.report_rate >= 50 ? "Good" : "Needs Work"}
                </span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Over Time Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChartIcon className="h-5 w-5 text-gray-500" />
                        Performance Over Time
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend onClick={handleLegendClick} />
                                {!hiddenLines.clicks && (
                                    <Line
                                        type="monotone"
                                        dataKey="clicks"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={false}
                                        name="Clicks"
                                        animationDuration={300}
                                    />
                                )}
                                {!hiddenLines.reports && (
                                    <Line
                                        type="monotone"
                                        dataKey="reports"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={false}
                                        name="Reports"
                                        animationDuration={300}
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CampaignStats;
