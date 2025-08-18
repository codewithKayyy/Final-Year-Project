import React, { useState } from "react";
import { assignStaffToAgent } from "../../services/agentService";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

const AssignStaffModal = ({ agent, staffList, onClose, onAssigned }) => {
    const [selectedStaff, setSelectedStaff] = useState(agent.staff?.id || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await assignStaffToAgent(agent.id, selectedStaff);
            onAssigned();
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={!!agent} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white rounded-xl p-6 shadow-lg">
                <DialogHeader>
                    <DialogTitle>
                        Assign Staff to{" "}
                        <span className="font-semibold">{agent.agent_name || "Agent"}</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Select Staff</label>
                        <select
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                            required
                            className="border rounded-md px-3 py-2 text-sm"
                        >
                            <option value="">-- Select --</option>
                            {staffList.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Assigning..." : "Assign"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AssignStaffModal;
