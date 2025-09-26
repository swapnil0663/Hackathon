@echo off
echo Installing ComplainTrack Database...
echo.

cd /d "%~dp0.."

echo Checking if Node.js dependencies are installed...
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    npm install
)

echo.
echo Running database installation script...
node scripts/install-database.js

echo.
echo Database installation complete!    
pause