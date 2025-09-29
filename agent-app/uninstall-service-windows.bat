@echo off
REM Windows service uninstallation script for Security Simulation Agent

echo Uninstalling Security Simulation Agent Windows Service...

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
set NODE_PATH=%~dp0

REM Create service uninstallation script
echo var Service = require('node-windows').Service; > uninstall-temp.js
echo. >> uninstall-temp.js
echo var svc = new Service({ >> uninstall-temp.js
echo   name:'%SERVICE_NAME%', >> uninstall-temp.js
echo   script: '%NODE_PATH%index.js' >> uninstall-temp.js
echo }); >> uninstall-temp.js
echo. >> uninstall-temp.js
echo svc.on('uninstall',function(){ >> uninstall-temp.js
echo   console.log('Service uninstalled successfully'); >> uninstall-temp.js
echo }); >> uninstall-temp.js
echo. >> uninstall-temp.js
echo svc.uninstall(); >> uninstall-temp.js

REM Run uninstallation
node uninstall-temp.js

REM Clean up
del uninstall-temp.js

echo.
echo Service uninstallation completed!
echo.
pause