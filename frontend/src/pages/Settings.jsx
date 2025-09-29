import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Alert } from "../components/ui/alert";
import {
    FaCog,
    FaUser,
    FaEnvelope,
    FaServer,
    FaBell,
    FaSave,
    FaKey,
} from "react-icons/fa";

const Settings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        profile: {
            firstName: user?.first_name || "System",
            lastName: user?.last_name || "Administrator",
            email: user?.email || "admin@cybersec.local",
            role: user?.role || "admin",
        },
        notifications: {
            emailNotifications: true,
            campaignAlerts: true,
            agentOfflineAlerts: true,
            systemUpdates: false,
        },
        system: {
            sessionTimeout: 3600,
            maxLoginAttempts: 5,
            enableTwoFactor: false,
            dataRetention: 90,
        },
        smtp: {
            host: "smtp.mailtrap.io",
            port: 2525,
            username: "",
            password: "",
            fromName: "IT Security Team",
            fromEmail: "security@company.com",
        },
    });

    const [activeTab, setActiveTab] = useState("profile");
    const [saveStatus, setSaveStatus] = useState("");

    const handleInputChange = (section, field, value) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleSave = async (section) => {
        try {
            console.log("Saving settings for section:", section, settings[section]);
            setSaveStatus("success");
            setTimeout(() => setSaveStatus(""), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            setSaveStatus("error");
            setTimeout(() => setSaveStatus(""), 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <div className="flex items-center mb-2">
                    <FaCog className="text-blue-600 mr-3" size={28} />
                    <h2 className="text-2xl font-bold">Settings</h2>
                </div>
                <p className="text-gray-600">
                    Configure your system preferences and settings
                </p>
            </div>

            {/* Save Status Alert */}
            {saveStatus && (
                <Alert
                    variant={saveStatus === "success" ? "success" : "destructive"}
                    className="mb-4"
                >
                    {saveStatus === "success"
                        ? "Settings saved successfully!"
                        : "Error saving settings. Please try again."}
                </Alert>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="profile">
                        <FaUser className="mr-2" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <FaBell className="mr-2" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="system">
                        <FaServer className="mr-2" /> System
                    </TabsTrigger>
                    <TabsTrigger value="smtp">
                        <FaEnvelope className="mr-2" /> SMTP
                    </TabsTrigger>
                </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>First Name</Label>
                                    <Input
                                        value={settings.profile.firstName}
                                        onChange={(e) =>
                                            handleInputChange("profile", "firstName", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Last Name</Label>
                                    <Input
                                        value={settings.profile.lastName}
                                        onChange={(e) =>
                                            handleInputChange("profile", "lastName", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={settings.profile.email}
                                        onChange={(e) =>
                                            handleInputChange("profile", "email", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Role</Label>
                                    <Input value={settings.profile.role} disabled />
                                    <p className="text-xs text-gray-400">
                                        Contact your administrator to change your role
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <Button onClick={() => handleSave("profile")}>
                                    <FaSave className="mr-2" /> Save Profile
                                </Button>
                                <Button variant="outline">
                                    <FaKey className="mr-2" /> Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(settings.notifications).map(([field, value]) => (
                                <div key={field} className="flex items-center justify-between">
                                    <Label className="capitalize">{field}</Label>
                                    <Switch
                                        checked={value}
                                        onCheckedChange={(checked) =>
                                            handleInputChange("notifications", field, checked)
                                        }
                                    />
                                </div>
                            ))}
                            <Button onClick={() => handleSave("notifications")}>
                                <FaSave className="mr-2" /> Save Preferences
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="system">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label>Session Timeout (seconds)</Label>
                                <Input
                                    type="number"
                                    value={settings.system.sessionTimeout}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "system",
                                            "sessionTimeout",
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label>Max Login Attempts</Label>
                                <Input
                                    type="number"
                                    value={settings.system.maxLoginAttempts}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "system",
                                            "maxLoginAttempts",
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label>Data Retention (days)</Label>
                                <Input
                                    type="number"
                                    value={settings.system.dataRetention}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "system",
                                            "dataRetention",
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Enable Two-Factor Authentication</Label>
                                <Switch
                                    checked={settings.system.enableTwoFactor}
                                    onCheckedChange={(checked) =>
                                        handleInputChange("system", "enableTwoFactor", checked)
                                    }
                                />
                            </div>
                            <Button onClick={() => handleSave("system")}>
                                <FaSave className="mr-2" /> Save System Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SMTP Settings */}
                <TabsContent value="smtp">
                    <Card>
                        <CardHeader>
                            <CardTitle>SMTP Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            {Object.entries(settings.smtp).map(([field, value]) => (
                                <div key={field}>
                                    <Label className="capitalize">{field}</Label>
                                    <Input
                                        type={
                                            field === "password"
                                                ? "password"
                                                : field === "port"
                                                    ? "number"
                                                    : "text"
                                        }
                                        value={value}
                                        onChange={(e) =>
                                            handleInputChange("smtp", field, e.target.value)
                                        }
                                    />
                                </div>
                            ))}
                            <div className="flex justify-between col-span-2 mt-4">
                                <Button onClick={() => handleSave("smtp")}>
                                    <FaSave className="mr-2" /> Save SMTP Settings
                                </Button>
                                <Button variant="outline">Test Connection</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
