import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

const SecurityMetricCard = ({ icon: Icon, value, label, color, badge }) => {
    return (
        <Card>
            <CardContent className="text-center p-6">
                <Icon className={`${color} mb-3 mx-auto`} size={36} />
                <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
                <p className="text-gray-500">{label}</p>
                {badge && (
                    <Badge className={`${badge.color} mt-2`}>{badge.text}</Badge>
                )}
            </CardContent>
        </Card>
    );
};

export default SecurityMetricCard;
