import * as React from "react";
import { cn } from "../lib/utils";

export const Progress = React.forwardRef(
    ({ className, value, max = 100, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
                    className
                )}
                {...props}
            >
                <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, !isNaN(value) && max > 0 ? (value / max) * 100 : 0))}%` }}
                />
            </div>
        );
    }
);
Progress.displayName = "Progress";
