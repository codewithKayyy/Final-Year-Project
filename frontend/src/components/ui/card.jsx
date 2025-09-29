import * as React from "react";
import { cn } from "../lib/utils";

export function Card({ className, ...props }) {
    return (
        <div
            className={cn(
                "rounded-xl border bg-white shadow-sm",
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }) {
    return (
        <div
            className={cn("border-b p-4 flex flex-col gap-1", className)}
            {...props}
        />
    );
}

export function CardTitle({ className, ...props }) {
    return (
        <h3
            className={cn("text-lg font-semibold leading-none tracking-tight", className)}
            {...props}
        />
    );
}

export function CardContent({ className, ...props }) {
    return (
        <div
            className={cn("p-4", className)}
            {...props}
        />
    );
}
