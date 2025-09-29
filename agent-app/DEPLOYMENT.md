# Security Simulation Agent Deployment Guide

The Security Simulation Agent is designed to run on target machines for cybersecurity training and simulation purposes. It connects to a central backend server via WebSocket and can execute simulated attacks.

## System Requirements

- **Node.js**: Version 14 or higher
- **Network**: Access to the backend server (default port 3001)
- **Permissions**:
  - Windows: Administrator rights for service installation
  - macOS: Root/sudo access for LaunchDaemon installation

## Quick Deployment Steps

### 1. Download and Setup
```bash
# Copy agent-app folder to target machine
# Install dependencies
cd agent-app
npm install
```

### 2. Configuration
```bash
# Copy and edit configuration
cp config.example.env .env
nano .env  # Edit BACKEND_WS_URL to point to your server
```

### 3. Install as Background Service

#### Windows
```cmd
# Run as Administrator
install-service-windows.bat
```

#### macOS
```bash
# Run with sudo
sudo ./install-service-macos.sh
```

#### Linux (Manual)
```bash
# Run directly
npm start

# Or create systemd service (see Linux section below)
```

## Detailed Configuration

### Environment Variables (.env file)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BACKEND_WS_URL` | Yes | `http://localhost:3001` | WebSocket URL of main backend |
| `AGENT_ID` | No | Auto-generated | Unique agent identifier |
| `TELEMETRY_INTERVAL` | No | `30000` | Heartbeat interval in milliseconds |
| `ENVIRONMENT` | No | `production` | Environment identifier |

### Example Configuration
```env
BACKEND_WS_URL=http://192.168.1.100:3001
TELEMETRY_INTERVAL=15000
ENVIRONMENT=production
```

## Platform-Specific Installation

### Windows Service Installation

1. **Prerequisites**:
   - Node.js installed system-wide
   - Administrator privileges

2. **Installation**:
   ```cmd
   # Right-click Command Prompt -> "Run as Administrator"
   cd C:\path\to\agent-app
   install-service-windows.bat
   ```

3. **Service Management**:
   ```cmd
   # Check service status
   sc query SecuritySimulationAgent

   # Start/Stop service
   sc start SecuritySimulationAgent
   sc stop SecuritySimulationAgent

   # Uninstall service
   uninstall-service-windows.bat
   ```

### macOS LaunchDaemon Installation

1. **Prerequisites**:
   - Node.js installed (via Homebrew recommended)
   - Root access

2. **Installation**:
   ```bash
   cd /path/to/agent-app
   sudo ./install-service-macos.sh
   ```

3. **Service Management**:
   ```bash
   # Check service status
   sudo launchctl list | grep security.simulation

   # Start/Stop service
   sudo launchctl start com.security.simulation.agent
   sudo launchctl stop com.security.simulation.agent

   # View logs
   tail -f /var/log/security-simulation-agent.log

   # Uninstall service
   sudo ./uninstall-service-macos.sh
   ```

### Linux Systemd Service (Manual)

1. **Create service file** (`/etc/systemd/system/security-simulation-agent.service`):
   ```ini
   [Unit]
   Description=Security Simulation Agent
   After=network.target

   [Service]
   Type=simple
   User=nobody
   WorkingDirectory=/opt/security-simulation-agent
   ExecStart=/usr/bin/node index.js
   Restart=always
   RestartSec=10
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```

2. **Service Management**:
   ```bash
   # Enable and start service
   sudo systemctl enable security-simulation-agent
   sudo systemctl start security-simulation-agent

   # Check status
   sudo systemctl status security-simulation-agent

   # View logs
   sudo journalctl -u security-simulation-agent -f
   ```

## Network Configuration

### Firewall Requirements
- **Outbound**: Allow connections to backend server on port 3001 (or configured port)
- **No inbound ports required** - agent connects out to backend

### Backend Server Configuration
The main backend server must:
1. Be running and accessible on the network
2. Have WebSocket support enabled
3. Accept agent registrations

## Monitoring and Troubleshooting

### Agent Health Check
```bash
# Check if agent is running
ps aux | grep "security.*agent"  # Linux/macOS
tasklist | findstr node.exe     # Windows

# Check network connectivity
telnet <backend-ip> 3001
```

### Common Issues

1. **Connection Failed**:
   - Verify BACKEND_WS_URL is correct
   - Check network connectivity
   - Verify backend server is running

2. **Permission Denied**:
   - Windows: Run installation as Administrator
   - macOS: Use sudo for service installation

3. **Agent Not Registering**:
   - Check agent logs
   - Verify backend server accepts agent connections
   - Ensure no firewall blocking

### Log Locations
- **Windows Service**: Event Viewer > Application Logs
- **macOS LaunchDaemon**: `/var/log/security-simulation-agent.log`
- **Direct Run**: Console output

## Security Considerations

1. **Network Security**:
   - Use VPN or secure network for agent-backend communication
   - Consider TLS/SSL for WebSocket connections

2. **Agent Deployment**:
   - Deploy only on authorized test machines
   - Use strong authentication for backend access
   - Monitor agent activity regularly

3. **Access Control**:
   - Limit admin access to agent machines
   - Use dedicated service accounts where possible

## Deployment at Scale

For large deployments:

1. **Configuration Management**: Use tools like Ansible, Puppet, or SCCM
2. **Automated Installation**: Script the deployment process
3. **Centralized Logging**: Forward agent logs to central system
4. **Monitoring**: Implement health checks and alerting

### Example Ansible Playbook
```yaml
- name: Deploy Security Simulation Agent
  hosts: target_machines
  become: yes
  tasks:
    - name: Copy agent files
      copy:
        src: ./agent-app/
        dest: /opt/security-simulation-agent/

    - name: Install dependencies
      npm:
        path: /opt/security-simulation-agent

    - name: Configure agent
      template:
        src: .env.j2
        dest: /opt/security-simulation-agent/.env

    - name: Install as service
      shell: ./install-service-linux.sh
      args:
        chdir: /opt/security-simulation-agent
```

## Support and Maintenance

- **Updates**: Replace agent files and restart service
- **Configuration Changes**: Edit `.env` file and restart
- **Monitoring**: Monitor backend logs for agent connectivity
- **Cleanup**: Use uninstall scripts to remove completely