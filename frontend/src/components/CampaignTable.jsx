import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "./ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FaFlask } from "react-icons/fa";

const CampaignTable = ({ campaigns, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const getStatusBadge = (status) => {
        switch (status) {
            case "ACTIVE":
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case "COMPLETED":
                return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
            case "DRAFT":
            default:
                return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
        }
    };

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
                {campaigns.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Simulations</TableHead>
                                <TableHead>Participants</TableHead>
                                <TableHead>Click Rate</TableHead>
                                <TableHead>Report Rate</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">{campaign.name}</TableCell>
                                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                                    <TableCell>{campaign.type}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(`/simulations?campaign=${campaign.id}`)}
                                            className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                                        >
                                            <FaFlask className="mr-1" />
                                            {campaign.simulation_count || 0}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{campaign.participant_count || 0}</TableCell>
                                    <TableCell>{campaign.click_rate || 0}%</TableCell>
                                    <TableCell>{campaign.report_rate || 0}%</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/simulations?campaign=${campaign.id}`)}
                                            title="View Simulations"
                                        >
                                            <FaFlask className="mr-1" />
                                            Simulations
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(campaign)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onDelete(campaign.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        No campaigns found.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CampaignTable;
