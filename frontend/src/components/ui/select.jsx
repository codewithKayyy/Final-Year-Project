import * as React from "react";
import { cn } from "../lib/utils";

const Select = ({ value, onValueChange, children }) => {
    return (
        <div className="relative w-full">{children({ value, onValueChange })}</div>
    );
};

// Trigger
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
    <button
        ref={ref}
        type="button"
        className={cn(
            "flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            className
        )}
        {...props}
    >
        {children}
    </button>
));
SelectTrigger.displayName = "SelectTrigger";

// Content
const SelectContent = ({ children, className }) => (
    <div
        className={cn(
            "absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg",
            className
        )}
    >
        <ul className="max-h-60 overflow-auto py-1">{children}</ul>
    </div>
);

// Item
const SelectItem = ({ value, children, onSelect }) => (
    <li
        className="cursor-pointer select-none px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => onSelect?.(value)}
    >
        {children}
    </li>
);

// Value
const SelectValue = ({ placeholder, value }) => (
    <span className={cn("text-sm", !value && "text-gray-400")}>
    {value || placeholder}
  </span>
);

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
