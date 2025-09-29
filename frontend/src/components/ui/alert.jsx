import * as React from "react";
import { cn } from "../lib/utils";

export const Alert = ({ variant = "default", className, children, ...props }) => {
    const variantClasses = {
        default: "bg-gray-50 text-gray-800 border-gray-200",
        success: "bg-green-50 text-green-800 border-green-200",
        destructive: "bg-red-50 text-red-800 border-red-200",
    };

    return (
        <div
            className={cn(
                "rounded-md border p-4 text-sm",
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
