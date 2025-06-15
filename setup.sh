#!/bin/bash

echo "🚀 Setting up AI Tools Monorepo with Neon PostgreSQL..."

# Install root dependencies
pnpm install

# Install workspace dependencies
pnpm run install:all

# Setup database tables
pnpm run db:setup

# Seed database with sample data
pnpm run db:seed

echo "✅ Setup complete!"
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
