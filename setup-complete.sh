#!/bin/bash

echo "🚀 Setting up complete AI Tools Monorepo..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Install workspace dependencies
echo "📦 Installing workspace dependencies..."
pnpm run install:all

# Setup database
echo "🗄️ Setting up database..."
pnpm run db:setup

# Seed database
echo "🌱 Seeding database..."
pnpm run db:seed

echo "✅ Complete setup finished!"
echo ""
echo "🎯 Next steps:"
echo "1. Add your GEMINI_API_KEY to .env.local"
echo "2. Run 'npm run dev' to start all apps"
echo ""
echo "🌐 App URLs:"
echo "  Writing Toolkit: http://localhost:3001"
echo "  Resume Builder:  http://localhost:3002"
echo "  Report Generator: http://localhost:3003"
echo "  SQL Generator:   http://localhost:3004"
echo "  Assistant Chatbot: http://localhost:3005"
echo ""
echo "🗄️ Database: Neon PostgreSQL"
echo "📊 Sample data has been added to all tables"
