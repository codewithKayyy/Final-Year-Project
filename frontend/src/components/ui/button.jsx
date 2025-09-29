import * as React from "react";
import { cn } from "../lib/utils";

export const Button = React.forwardRef(
    (
        { className, variant = "default", size = "md", ...props },
        ref
    ) => {
        const variants = {
            default:
                "bg-primary text-primary-foreground hover:bg-blue-700 focus:ring-2 focus:ring-blue-400",
            secondary:
                "bg-secondary text-secondary-foreground hover:bg-slate-600 focus:ring-2 focus:ring-slate-400",
            outline:
                "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
            ghost:
                "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            destructive:
                "bg-destructive text-destructive-foreground hover:bg-red-700 focus:ring-2 focus:ring-red-400",
            success:
                "bg-success text-success-foreground hover:bg-green-700 focus:ring-2 focus:ring-green-400",
            warning:
                "bg-warning text-warning-foreground hover:bg-amber-600 focus:ring-2 focus:ring-amber-400",
        };

        const sizes = {
            sm: "px-2.5 py-1.5 text-sm rounded-md",
            md: "px-4 py-2 text-sm rounded-lg",
            lg: "px-5 py-3 text-base rounded-xl",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant] || variants.default,
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
