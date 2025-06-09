#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up AI Tools Monorepo...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ package.json not found. Please run this script from the project root.${NC}"
  exit 1
fi

# Create directories if they don't exist
echo -e "${BLUE}📁 Creating directory structure...${NC}"
mkdir -p apps/ai-writing-toolkit
mkdir -p apps/ai-resume-builder
mkdir -p apps/ai-report-generator
mkdir -p apps/ai-sql-generator
mkdir -p apps/ai-assistant-chatbot
mkdir -p packages/database/src
mkdir -p packages/database/prisma
mkdir -p packages/mcp-server/src
mkdir -p packages/ui/src

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to install dependencies${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Dependencies installed successfully${NC}"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo -e "${BLUE}📝 Creating .env.local file...${NC}"
  if [ -f .env.example ]; then
    cp .env.example .env.local
  else
    cat > .env.local << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ai_tools_db"

# AI API Keys
GEMINI_API_KEY="your_gemini_api_key_here"

# Development Settings
NODE_ENV="development"
EOF
  fi
  echo -e "${GREEN}✅ Created .env.local file${NC}"
  echo -e "${YELLOW}⚠️  Please update .env.local with your database credentials and API keys${NC}"
fi

# Build packages if they exist
if [ -d "packages" ]; then
  echo -e "${BLUE}🔨 Building packages...${NC}"
  npm run build:packages 2>/dev/null || echo -e "${YELLOW}⚠️  Package build skipped (packages not ready yet)${NC}"
fi

# Setup database if packages/database exists
if [ -d "packages/database" ]; then
  echo -e "${BLUE}🗄️  Setting up database...${NC}"
  
  # Generate Prisma client
  npm run db:generate 2>/dev/null || echo -e "${YELLOW}⚠️  Database generation skipped (schema not ready yet)${NC}"
  
  # Push database schema
  npm run db:push 2>/dev/null || echo -e "${YELLOW}⚠️  Database push skipped (check your DATABASE_URL)${NC}"
  
  # Seed database
  npm run db:seed 2>/dev/null || echo -e "${YELLOW}⚠️  Database seeding skipped${NC}"
fi

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo -e ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "1. Update .env.local with your database URL and API keys"
echo -e "2. Make sure PostgreSQL is running"
echo -e "3. Run ${GREEN}npm run dev${NC} to start all applications"
echo -e ""
echo -e "${BLUE}📱 Your applications will be available at:${NC}"
echo -e "${GREEN}• AI Writing Toolkit:    http://localhost:3001${NC}"
echo -e "${GREEN}• AI Resume Builder:     http://localhost:3002${NC}"
echo -e "${GREEN}• AI Report Generator:   http://localhost:3003${NC}"
echo -e "${GREEN}• AI SQL Generator:      http://localhost:3004${NC}"
echo -e "${GREEN}• AI Assistant Chatbot:  http://localhost:3005${NC}"
