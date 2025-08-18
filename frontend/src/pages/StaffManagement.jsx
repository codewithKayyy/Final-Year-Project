import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import api from "../services/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../components/ui/dialog.jsx"; // shadcn/ui uses radix under the hood

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        position: "",
        college: "",
        phone: "",
        risk: "medium",
        location: "",
        manager_name: "",
        hire_date: "",
        notes: "",
    });

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [riskFilter, setRiskFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/staff");
            setStaff(response.data || []);
        } catch (err) {
            setError("Failed to fetch staff: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const viewHistory = async (staffMember) => {
        try {
            const response = await api.get(`/api/staff/${staffMember.id}/history`);
            setHistory(response.data || []);
            setSelectedStaff(staffMember);
            setShowHistoryModal(true);
        } catch (err) {
            setError("Failed to fetch simulation history: " + err.message);
        }
    };

    const handleAdd = () => {
        setFormData({
            name: "",
            email: "",
            department: "",
            position: "",
            college: "",
            phone: "",
            risk: "medium",
            location: "",
            manager_name: "",
            hire_date: "",
            notes: "",
        });
        setShowAddModal(true);
    };

    const handleEdit = (staffMember) => {
        setFormData({
            name: staffMember.name || "",
            email: staffMember.email || "",
            department: staffMember.department || "",
            position: staffMember.position || "",
            college: staffMember.college || "",
            phone: staffMember.phone || "",
            risk: staffMember.risk || "medium",
            location: staffMember.location || "",
            manager_name: staffMember.manager_name || "",
            hire_date: staffMember.hire_date
                ? new Date(staffMember.hire_date).toISOString().split("T")[0]
                : "",
            notes: staffMember.notes || "",
        });
        setSelectedStaff(staffMember);
        setShowEditModal(true);
    };

    const handleSave = async () => {
        try {
            setSaveLoading(true);
            if (selectedStaff && selectedStaff.id) {
                await api.put(`/api/staff/${selectedStaff.id}`, formData);
            } else {
                await api.post("/api/staff", formData);
            }

            await fetchStaff();
            setShowEditModal(false);
            setShowAddModal(false);
            setError(null);
        } catch (err) {
            setError(
                "Failed to save staff member: " +
                (err.response?.data?.message || err.message)
            );
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async (staffMember) => {
        if (!window.confirm(`Delete ${staffMember.name}?`)) return;
        try {
            await api.delete(`/api/staff/${staffMember.id}`);
            await fetchStaff();
            setError(null);
        } catch (err) {
            setError(
                "Failed to delete staff member: " +
                (err.response?.data?.message || err.message)
            );
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Filters
    const filteredStaff = staff.filter((s) => {
        const matchesSearch =
            s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.department?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRisk = riskFilter ? s.risk === riskFilter : true;
        const matchesDepartment = departmentFilter
            ? s.department === departmentFilter
            : true;

        return matchesSearch && matchesRisk && matchesDepartment;
    });

    const departments = [
        ...new Set(staff.map((s) => s.department).filter(Boolean)),
    ];

    const getRiskBadgeVariant = (risk) => {
        switch (risk?.toLowerCase()) {
            case "low":
                return "success";
            case "high":
                return "destructive";
            default:
                return "warning";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Staff Management</h1>
                <Button onClick={handleAdd}>Add Staff Member</Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded-md px-3 py-2 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">All Risks</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">All Departments</option>
                        {departments.map((d) => (
                            <option key={d}>{d}</option>
                        ))}
                    </select>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm("");
                            setRiskFilter("");
                            setDepartmentFilter("");
                        }}
                    >
                        Clear Filters
                    </Button>
                </CardContent>
            </Card>

            {/* Staff Table */}
            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    {filteredStaff.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                            No staff members found.
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-left text-gray-700">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Department</th>
                                <th className="px-4 py-2">Position</th>
                                <th className="px-4 py-2">Risk</th>
                                <th className="px-4 py-2">College</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredStaff.map((s) => (
                                <tr
                                    key={s.id}
                                    className="border-b last:border-0 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">{s.name}</td>
                                    <td className="px-4 py-2">{s.email}</td>
                                    <td className="px-4 py-2">{s.department || "-"}</td>
                                    <td className="px-4 py-2">{s.position || "-"}</td>
                                    <td className="px-4 py-2">
                                        <Badge variant={getRiskBadgeVariant(s.risk)}>
                                            {s.risk}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-2">{s.college || "-"}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => viewHistory(s)}>👁</Button>
                                        <Button variant="warning" size="sm" onClick={() => handleEdit(s)}>✏</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(s)}>🗑</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            {(showAddModal || showEditModal) && (
                <Dialog open={showAddModal || showEditModal} onOpenChange={() => {setShowAddModal(false);setShowEditModal(false);}}>
                    <DialogContent className="max-w-2xl p-6 bg-white rounded-xl shadow-lg">
                        <DialogHeader>
                            <DialogTitle>{showAddModal ? "Add Staff Member" : "Edit Staff Member"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {["name","email","department","position","college","phone","location","manager_name"].map((field) => (
                                <div key={field} className="flex flex-col">
                                    <label className="text-sm font-medium mb-1 capitalize">{field.replace("_"," ")}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        className="border rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                            ))}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Risk</label>
                                <select
                                    name="risk"
                                    value={formData.risk}
                                    onChange={handleInputChange}
                                    className="border rounded-md px-3 py-2 text-sm"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Hire Date</label>
                                <input
                                    type="date"
                                    name="hire_date"
                                    value={formData.hire_date}
                                    onChange={handleInputChange}
                                    className="border rounded-md px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="md:col-span-2 flex flex-col">
                                <label className="text-sm font-medium mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="border rounded-md px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-6 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {setShowAddModal(false);setShowEditModal(false);}}>Cancel</Button>
                            <Button onClick={handleSave} disabled={saveLoading}>
                                {saveLoading ? "Saving..." : (showAddModal ? "Add" : "Save")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* History Dialog */}
            {showHistoryModal && (
                <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
                    <DialogContent className="max-w-3xl p-6 bg-white rounded-xl shadow-lg">
                        <DialogHeader>
                            <DialogTitle>Simulation History - {selectedStaff?.name}</DialogTitle>
                        </DialogHeader>
                        {history.length > 0 ? (
                            <table className="w-full text-sm mt-4">
                                <thead className="bg-gray-100 text-left text-gray-700">
                                <tr>
                                    <th className="px-4 py-2">Simulation</th>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Outcome</th>
                                    <th className="px-4 py-2">Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {history.map((h, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="px-4 py-2">{h.simulation_name || `Simulation ${h.simulation_id}`}</td>
                                        <td className="px-4 py-2">{h.type || "Phishing"}</td>
                                        <td className="px-4 py-2">
                                            <Badge variant={h.status === "completed" ? "success" : "warning"}>{h.status}</Badge>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Badge variant={h.outcome === "success" ? "destructive" : "success"}>{h.outcome}</Badge>
                                        </td>
                                        <td className="px-4 py-2">{new Date(h.created_at || h.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-6 text-gray-500">No history found.</div>
                        )}
                        <DialogFooter className="mt-6 flex justify-end">
                            <Button variant="outline" onClick={() => setShowHistoryModal(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default StaffManagement;
