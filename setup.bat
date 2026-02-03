@echo off
REM APPAREL One-Click Setup Script (Windows)
REM =========================================

echo.
echo 🧵 APPAREL Development Setup
echo ============================
echo.

REM Check if .env exists
if not exist .env (
    echo 📋 Creating .env from .env.example...
    copy .env.example .env
    echo    ⚠️  Please update .env with your Supabase credentials
)

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

echo.
echo ✅ Setup complete!
echo.
echo Available commands:
echo   npm run dev          - Start Vite dev server (web only)
echo   npm run tauri dev    - Start Tauri desktop app
echo   npm run build        - Build for production
echo   npm run lint         - Run ESLint
echo   npm run format       - Format code with Prettier
echo.
echo 🚀 Run 'npm run dev' to start the development server

pause
