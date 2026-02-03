#!/bin/bash
# APPAREL One-Click Setup Script (Unix/Mac/Linux)
# ================================================

set -e

echo "🧵 APPAREL Development Setup"
echo "============================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
    echo "   ⚠️  Please update .env with your Supabase credentials"
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Available commands:"
echo "  npm run dev          - Start Vite dev server (web only)"
echo "  npm run tauri dev    - Start Tauri desktop app"
echo "  npm run build        - Build for production"
echo "  npm run lint         - Run ESLint"
echo "  npm run format       - Format code with Prettier"
echo ""
echo "🚀 Run 'npm run dev' to start the development server"
