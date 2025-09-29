import * as React from "react";
import { cn } from "../lib/utils";

export function Badge({ className, variant = "default", ...props }) {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-gray-300 text-gray-700",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                variants[variant] || variants.default,
                className
            )}
            {...props}
        />
    );
}
