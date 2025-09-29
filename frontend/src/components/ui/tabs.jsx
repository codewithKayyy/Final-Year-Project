"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../lib/utils";

// Root
const Tabs = TabsPrimitive.Root;

// List
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500",
            className
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// Trigger
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Content
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn("mt-3 focus-visible:outline-none", className)}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
