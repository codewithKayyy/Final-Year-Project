@echo off
REM Windows service installation script for Security Simulation Agent

echo Installing Security Simulation Agent as Windows Service...

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo This script requires administrator privileges.
    echo Please run as administrator.
    pause
    exit /b 1
)

REM Set service configuration
set SERVICE_NAME=SecuritySimulationAgent
set SERVICE_DISPLAY=Security Simulation Agent
set SERVICE_DESC=Cybersecurity simulation agent for distributed security training
set NODE_PATH=%~dp0
set EXECUTABLE=%NODE_PATH%index.js

REM Install Node.js service wrapper if not exists
if not exist "%NODE_PATH%node-windows" (
    echo Installing node-windows service wrapper...
    npm install node-windows --save
)

REM Create service installation script
echo var Service = require('node-windows').Service; > install-temp.js
echo. >> install-temp.js
echo var svc = new Service({ >> install-temp.js
echo   name:'%SERVICE_NAME%', >> install-temp.js
echo   description: '%SERVICE_DESC%', >> install-temp.js
echo   script: '%EXECUTABLE%' >> install-temp.js
echo }); >> install-temp.js
echo. >> install-temp.js
echo svc.on('install',function(){ >> install-temp.js
echo   console.log('Service installed successfully'); >> install-temp.js
echo   svc.start(); >> install-temp.js
echo }); >> install-temp.js
echo. >> install-temp.js
echo svc.install(); >> install-temp.js

REM Run installation
node install-temp.js

REM Clean up
del install-temp.js

echo.
echo Service installation completed!
echo Service Name: %SERVICE_NAME%
echo.
echo To start the service: sc start %SERVICE_NAME%
echo To stop the service: sc stop %SERVICE_NAME%
echo To uninstall: run uninstall-service-windows.bat
echo.
pause