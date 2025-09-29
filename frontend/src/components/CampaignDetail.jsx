import React, { useState } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "./ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Users, BarChart3, FileText, Activity } from "lucide-react";
import PhishingTemplateManager from "./PhishingTemplateManager";
import CampaignStats from "./CampaignStats";

const CampaignDetail = ({ campaign }) => {
    const [activeTab, setActiveTab] = useState("templates");

    const getStatusVariant = (status) => {
        switch (status?.toUpperCase()) {
            case "ACTIVE":
                return "bg-green-100 text-green-700";
            case "COMPLETED":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getProgressColor = (value) => {
        if (value >= 70) return "bg-green-500";
        if (value >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{campaign.name}</h2>
                <p className="text-sm text-gray-500">
                    Campaign details and management
                </p>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status */}
                <Card>
                    <CardContent className="p-4 flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">Status</span>
                        </div>
                        <Badge
                            className={`mt-2 px-2 py-1 text-xs font-semibold rounded-md ${getStatusVariant(
                                campaign.status
                            )}`}
                        >
                            {campaign.status || "DRAFT"}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Type */}
                <Card>
                    <CardContent className="p-4 flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">Type</span>
                        </div>
                        <p className="mt-2 text-lg font-semibold text-gray-800">
                            {campaign.type || "N/A"}
                        </p>
                    </CardContent>
                </Card>

                {/* Participants */}
                <Card>
                    <CardContent className="p-4 flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">
                Participants
              </span>
                        </div>
                        <p className="mt-2 text-lg font-semibold text-gray-800">
                            {campaign.participant_count || 0}
                        </p>
                    </CardContent>
                </Card>

                {/* Performance with color-coded progress bars */}
                <Card>
                    <CardContent className="p-4 flex flex-col items-start w-full">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">
                Performance
              </span>
                        </div>
                        <div className="mt-3 w-full space-y-3">
                            <div>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Click Rate</span>
                                    <span>{campaign.click_rate || 0}%</span>
                                </div>
                                <Progress
                                    value={campaign.click_rate || 0}
                                    className="h-2"
                                    indicatorClassName={getProgressColor(campaign.click_rate || 0)}
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Report Rate</span>
                                    <span>{campaign.report_rate || 0}%</span>
                                </div>
                                <Progress
                                    value={campaign.report_rate || 0}
                                    className="h-2"
                                    indicatorClassName={getProgressColor(campaign.report_rate || 0)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                    <TabsTrigger value="templates">Email Templates</TabsTrigger>
                    <TabsTrigger value="stats">Performance</TabsTrigger>
                    <TabsTrigger value="simulations">Simulations</TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Templates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PhishingTemplateManager campaign={campaign} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stats" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CampaignStats campaign={campaign} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="simulations" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Simulations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 text-sm">
                                Simulations list will appear here.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CampaignDetail;
