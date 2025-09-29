import React, { useState } from "react";
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
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "../components/ui/tabs";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../components/ui/table";
import SecurityMetricCard from "../components/SecurityMetricCard";

import {
    FaShieldAlt,
    FaUserLock,
    FaServer,
    FaExclamationTriangle,
    FaCog,
} from "react-icons/fa";

const SecurityControls = () => {
    const [activeTab, setActiveTab] = useState("overview");

    const securityMetrics = {
        overallScore: 85,
        vulnerabilities: {
            critical: 2,
            high: 5,
            medium: 12,
            low: 8,
        },
        policies: {
            active: 15,
            inactive: 3,
        },
        firewall: {
            status: "active",
            rules: 127,
        },
        antivirus: {
            status: "active",
            lastUpdate: "2024-01-15 09:30:00",
        },
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <div className="flex items-center mb-2">
                    <FaShieldAlt className="text-blue-600 mr-3" size={28} />
                    <h2 className="text-2xl font-bold">Security Controls</h2>
                </div>
                <p className="text-gray-600">
                    Monitor and manage your organization's security posture
                </p>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="overview">
                        <FaShieldAlt className="mr-2" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="vulnerabilities">
                        <FaExclamationTriangle className="mr-2" /> Vulnerabilities
                    </TabsTrigger>
                    <TabsTrigger value="policies">
                        <FaUserLock className="mr-2" /> Policies
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent
                    value="overview"
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                >
                    <Card>
                        <CardContent className="text-center p-6">
                            <FaShieldAlt className="text-blue-600 mb-3 mx-auto" size={36} />
                            <h3 className="text-2xl font-bold text-blue-600">
                                {securityMetrics.overallScore}%
                            </h3>
                            <p className="text-gray-500">Security Score</p>
                            <Progress value={securityMetrics.overallScore} className="mt-3" />
                        </CardContent>
                    </Card>

                    <SecurityMetricCard
                        icon={FaExclamationTriangle}
                        value={
                            securityMetrics.vulnerabilities.critical +
                            securityMetrics.vulnerabilities.high
                        }
                        label="Critical Issues"
                        color="text-yellow-600"
                        badge={{
                            text: "Require attention",
                            color: "bg-yellow-100 text-yellow-800",
                        }}
                    />

                    <SecurityMetricCard
                        icon={FaServer}
                        value={securityMetrics.firewall.rules}
                        label="Firewall Rules"
                        color="text-green-600"
                        badge={{
                            text: securityMetrics.firewall.status,
                            color: "bg-green-100 text-green-800",
                        }}
                    />

                    <SecurityMetricCard
                        icon={FaUserLock}
                        value={securityMetrics.policies.active}
                        label="Security Policies"
                        color="text-indigo-600"
                        badge={{
                            text: `${securityMetrics.policies.inactive} inactive`,
                            color: "bg-gray-100 text-gray-800",
                        }}
                    />
                </TabsContent>

                {/* Vulnerabilities Tab */}
                <TabsContent value="vulnerabilities">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vulnerability Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Vulnerability counts */}
                                <div className="space-y-3">
                                    {Object.entries(securityMetrics.vulnerabilities).map(
                                        ([level, count]) => (
                                            <div
                                                key={level}
                                                className="flex justify-between items-center p-3 border rounded-md"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <FaExclamationTriangle
                                                        className={`${
                                                            level === "critical"
                                                                ? "text-red-600"
                                                                : level === "high"
                                                                    ? "text-yellow-600"
                                                                    : level === "medium"
                                                                        ? "text-blue-500"
                                                                        : "text-gray-500"
                                                        }`}
                                                    />
                                                    <span className="capitalize font-medium">
                            {level} Priority
                          </span>
                                                </div>
                                                <Badge
                                                    className={`${
                                                        level === "critical"
                                                            ? "bg-red-100 text-red-800"
                                                            : level === "high"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : level === "medium"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {count}
                                                </Badge>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Recent Vulnerabilities */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h6 className="font-semibold mb-3">Recent Vulnerabilities</h6>
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center">
                                            <span>CVE-2024-0001</span>
                                            <Badge className="bg-red-100 text-red-800">Critical</Badge>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Buffer overflow in authentication module
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center">
                                            <span>CVE-2024-0002</span>
                                            <Badge className="bg-yellow-100 text-yellow-800">High</Badge>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            SQL injection vulnerability
                                        </p>
                                    </div>
                                    <Button size="sm">View All Vulnerabilities</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Policies Tab */}
                <TabsContent value="policies">
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Security Policies</CardTitle>
                            <Button size="sm">
                                <FaCog className="mr-2" /> Add Policy
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Policy Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Last Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FaUserLock className="text-blue-600" /> Password
                                                    Policy
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-blue-100 text-blue-800">
                                                    Authentication
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-100 text-green-800">
                                                    Active
                                                </Badge>
                                            </TableCell>
                                            <TableCell>2024-01-10</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FaServer className="text-green-600" /> Network Access
                                                    Control
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-yellow-100 text-yellow-800">
                                                    Network
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-100 text-green-800">
                                                    Active
                                                </Badge>
                                            </TableCell>
                                            <TableCell>2024-01-08</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FaShieldAlt className="text-red-600" /> Data
                                                    Encryption
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-red-100 text-red-800">
                                                    Security
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-gray-100 text-gray-800">
                                                    Inactive
                                                </Badge>
                                            </TableCell>
                                            <TableCell>2024-01-05</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Security Status Alert */}
            <div className="rounded-md bg-yellow-50 p-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-600" />
                <p className="text-sm text-yellow-800">
                    <strong>Attention Required:</strong>{" "}
                    {securityMetrics.vulnerabilities.critical} critical vulnerabilities
                    detected.{" "}
                    <a href="#vulnerabilities" className="underline">
                        Review now
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SecurityControls;
