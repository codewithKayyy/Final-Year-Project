# Phishing Simulation Platform - Architecture Summary

## Communication Flow (Fixed)

```
Admin creates simulation → Main backend API
Backend calls attack-executor → HTTP POST to http://localhost:5001/execute
Attack-executor queues job → Uses Redis/BullMQ internally
Agent-app receives commands → Via WebSocket from main backend
Results reported back → HTTP webhook to main backend
```

## Components

### 1. Frontend
- **Tech**: React.js with Vite
- **Purpose**: Admin dashboard for managing campaigns, agents, and staff
- **Key Pages**: Dashboard, Agent Management, Campaign Management, Simulation Config, Attack Logs

### 2. Backend
- **Tech**: Node.js/Express with MySQL and Socket.IO
- **Purpose**: Stateless web server that delegates heavy processing
- **Key Features**:
    - HTTP REST API for frontend
    - WebSocket server for agent connections
    - MySQL database for persistent data
    - HTTP client to attack-executor service

### 3. Attack-Executor
- **Tech**: Node.js with Redis/BullMQ and Docker
- **Purpose**: Specialized service for executing attack scripts
- **Key Features**:
    - HTTP API endpoint `/execute` for receiving jobs
    - Redis-based job queue with BullMQ
    - Docker containerized script execution
    - Webhook callbacks to main backend

### 4. Agent-App (Distributed)
- **Tech**: Node.js with Socket.IO client
- **Purpose**: Lightweight clients deployed on target machines
- **Key Features**:
    - WebSocket connection to main backend
    - Auto-reconnection and heartbeat
    - System telemetry reporting
    - Simulation execution (currently simulated)

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │ Attack-Executor │
│   (React)       │◄──►│   (Express)     │◄──►│   (Docker)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   MySQL     │
                       │  Database   │
                       └─────────────┘
                              │
                              ▼ WebSocket
                    ┌─────────────────────┐
                    │    Agent-Apps       │
                    │   (Distributed)     │
                    │  Various Networks   │
                    └─────────────────────┘
```

## Fixed Communication Issues

1. **Backend → Attack-Executor**: Now uses HTTP POST instead of direct Redis access
2. **Agent Registration**: Enhanced to handle detailed system information
3. **Simulation Execution**: Added proper WebSocket events and handlers
4. **Result Reporting**: Webhook-based reporting from attack-executor to backend
5. **Error Handling**: Improved connection management and graceful reconnection

## Agent Deployment

### Windows
```cmd
# Run as Administrator
cd agent-app
install-service-windows.bat
```

### macOS
```bash
# Run with sudo
cd agent-app
sudo ./install-service-macos.sh
```

### Linux
```bash
# Direct execution or systemd service (manual setup)
cd agent-app
npm start
```

## Environment Configuration

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD= yourpassword
DB_NAME=cybersecurity
PORT=3001
ATTACK_EXECUTOR_URL=http://localhost:5001
```

### Agent-App (.env)
```env
BACKEND_WS_URL=http://10.0.0.100:3001
AGENT_ID=agent_custom_name
TELEMETRY_INTERVAL=30000
```

### Attack-Executor (.env)
```env
ATTACK_EXECUTOR_PORT=5001
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
BACKEND_API_URL=http://localhost:3001
```

## Key Improvements Made

1. **Stateless Backend**: Main backend now delegates processing to specialized services
2. **HTTP-Based Communication**: Attack-executor uses HTTP API instead of shared Redis
3. **Robust Agent Client**: Enhanced with auto-reconnection, system info, and service installation
4. **Distributed Deployment**: Agent-app designed for deployment across multiple machines
5. **Service Management**: Windows service and macOS LaunchDaemon support
6. **Better Error Handling**: Graceful connection management and detailed logging

## Start Order

1. **MySQL Database**: Ensure database is running
2. **Redis**: Start Redis server for attack-executor queue
3. **Attack-Executor**: `cd attack-executor && node server.js`
4. **Backend**: `npm run start-backend`
5. **Frontend**: `npm run start-frontend`
6. **Agent-Apps**: Deploy and configure on target machines

The system is now properly architected for distributed deployment with clean separation of concerns.