import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

const CampaignModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("draft");
    const [participantCount, setParticipantCount] = useState(0);
    const [clickRate, setClickRate] = useState(0);
    const [reportRate, setReportRate] = useState(0);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
            setType(initialData.type || "");
            setStatus(initialData.status || "draft");
            setParticipantCount(initialData.participant_count || 0);
            setClickRate(initialData.click_rate || 0);
            setReportRate(initialData.report_rate || 0);
        } else {
            setName("");
            setDescription("");
            setType("");
            setStatus("draft");
            setParticipantCount(0);
            setClickRate(0);
            setReportRate(0);
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            description,
            type,
            status,
            participant_count: participantCount,
            click_rate: clickRate,
            report_rate: reportRate,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-white rounded-xl p-6 shadow-lg">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Edit Campaign" : "Create New Campaign"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update the campaign details below." : "Fill in the details to create a new security awareness campaign."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Campaign Name */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Campaign Name</label>
                        <input
                            type="text"
                            className="border rounded-md px-3 py-2 text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Description</label>
                        <textarea
                            className="border rounded-md px-3 py-2 text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            placeholder="Describe the purpose and goals of this campaign"
                        />
                    </div>

                    {/* Type */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Campaign Type</label>
                        <select
                            className="border rounded-md px-3 py-2 text-sm"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="phishing">Phishing</option>
                            <option value="social_engineering">Social Engineering</option>
                            <option value="malware">Malware</option>
                            <option value="mixed">Mixed Campaign</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Status</label>
                        <select
                            className="border rounded-md px-3 py-2 text-sm"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="running">Running</option>
                            <option value="completed">Completed</option>
                            <option value="paused">Paused</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Participants */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Participants</label>
                        <input
                            type="number"
                            className="border rounded-md px-3 py-2 text-sm"
                            value={participantCount}
                            onChange={(e) => setParticipantCount(parseInt(e.target.value) || 0)}
                            min="0"
                        />
                    </div>

                    {/* Click Rate */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Click Rate (%)</label>
                        <input
                            type="number"
                            className="border rounded-md px-3 py-2 text-sm"
                            value={clickRate}
                            onChange={(e) => setClickRate(parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.1"
                        />
                    </div>

                    {/* Report Rate */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Report Rate (%)</label>
                        <input
                            type="number"
                            className="border rounded-md px-3 py-2 text-sm"
                            value={reportRate}
                            onChange={(e) => setReportRate(parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.1"
                        />
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {initialData ? "Update Campaign" : "Create Campaign"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CampaignModal;
