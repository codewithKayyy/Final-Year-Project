#!/bin/bash
# macOS service uninstallation script for Security Simulation Agent

set -e

SERVICE_NAME="com.security.simulation.agent"
PLIST_PATH="/Library/LaunchDaemons/${SERVICE_NAME}.plist"

echo "Uninstalling Security Simulation Agent macOS LaunchDaemon..."

# Check if running as root/sudo
if [[ $EUID -ne 0 ]]; then
   echo "This script requires root privileges. Please run with sudo:"
   echo "sudo $0"
   exit 1
fi

# Stop the service if running
echo "Stopping service..."
launchctl stop "$SERVICE_NAME" 2>/dev/null || true

# Unload the service
echo "Unloading service..."
launchctl unload "$PLIST_PATH" 2>/dev/null || true

# Remove the plist file
if [ -f "$PLIST_PATH" ]; then
    echo "Removing plist file..."
    rm "$PLIST_PATH"
fi

# Clean up log files
echo "Cleaning up log files..."
rm -f /var/log/security-simulation-agent.log
rm -f /var/log/security-simulation-agent.error.log

echo ""
echo "Service uninstallation completed!"
echo "The Security Simulation Agent has been removed from the system."
echo ""