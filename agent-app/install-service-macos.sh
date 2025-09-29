#!/bin/bash
# macOS service installation script for Security Simulation Agent

set -e

SERVICE_NAME="com.security.simulation.agent"
SERVICE_LABEL="Security Simulation Agent"
AGENT_PATH="$(cd "$(dirname "$0")" && pwd)"
PLIST_PATH="/Library/LaunchDaemons/${SERVICE_NAME}.plist"
USER=$(whoami)

echo "Installing Security Simulation Agent as macOS LaunchDaemon..."

# Check if running as root/sudo
if [[ $EUID -ne 0 ]]; then
   echo "This script requires root privileges. Please run with sudo:"
   echo "sudo $0"
   exit 1
fi

# Find Node.js path
NODE_PATH=$(which node)
if [ -z "$NODE_PATH" ]; then
    echo "Node.js not found in PATH. Please install Node.js first."
    exit 1
fi

echo "Found Node.js at: $NODE_PATH"
echo "Agent path: $AGENT_PATH"

# Create LaunchDaemon plist file
cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$SERVICE_NAME</string>

    <key>ProgramArguments</key>
    <array>
        <string>$NODE_PATH</string>
        <string>$AGENT_PATH/index.js</string>
    </array>

    <key>WorkingDirectory</key>
    <string>$AGENT_PATH</string>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>

    <key>StandardOutPath</key>
    <string>/var/log/security-simulation-agent.log</string>

    <key>StandardErrorPath</key>
    <string>/var/log/security-simulation-agent.error.log</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin</string>
    </dict>
</dict>
</plist>
EOF

# Set proper permissions
chown root:wheel "$PLIST_PATH"
chmod 644 "$PLIST_PATH"

# Load the service
launchctl load "$PLIST_PATH"

# Start the service
launchctl start "$SERVICE_NAME"

echo ""
echo "Service installation completed!"
echo "Service Name: $SERVICE_NAME"
echo "Plist Location: $PLIST_PATH"
echo "Log Files:"
echo "  - Output: /var/log/security-simulation-agent.log"
echo "  - Error: /var/log/security-simulation-agent.error.log"
echo ""
echo "To check status: sudo launchctl list | grep security.simulation"
echo "To stop service: sudo launchctl stop $SERVICE_NAME"
echo "To uninstall: sudo ./uninstall-service-macos.sh"
echo ""