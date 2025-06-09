#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐘 Setting up PostgreSQL for AI Tools Monorepo${NC}"
echo "=============================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo -e "${YELLOW}Please install PostgreSQL first:${NC}"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "  macOS: brew install postgresql"
    echo "  Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL is installed${NC}"

# Check if PostgreSQL service is running
if ! pg_isready &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL service is not running${NC}"
    echo "Starting PostgreSQL service..."
    
    # Try to start PostgreSQL service
    if command -v systemctl &> /dev/null; then
        sudo systemctl start postgresql
    elif command -v brew &> /dev/null; then
        brew services start postgresql
    else
        echo -e "${RED}❌ Could not start PostgreSQL service automatically${NC}"
        echo "Please start PostgreSQL manually and run this script again"
        exit 1
    fi
fi

echo -e "${GREEN}✅ PostgreSQL service is running${NC}"

# Database configuration
DB_NAME="ai_tools_db"
DB_USER="ai_tools_user"
DB_PASSWORD="ai_tools_password"

echo ""
echo -e "${BLUE}🗄️  Creating database and user...${NC}"

# Create database and user
sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;

\q
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database and user created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create database and user${NC}"
    exit 1
fi

# Create .env.local file
echo ""
echo -e "${BLUE}📝 Creating .env.local file...${NC}"

DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

cat > .env.local << EOF
# PostgreSQL Database Configuration
DATABASE_URL="$DATABASE_URL"

# Google Gemini API Configuration
GEMINI_API_KEY="your-gemini-api-key-here"

# Development environment
NODE_ENV="development"

# Application Configuration
NEXT_PUBLIC_APP_NAME="AI Tools Monorepo"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Default user ID for testing
DEFAULT_USER_ID="user-demo-123"
EOF

echo -e "${GREEN}✅ .env.local file created${NC}"

echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}🏗️  Building packages...${NC}"
npm run build:packages

echo ""
echo -e "${BLUE}🗄️  Setting up database schema...${NC}"
cd packages/database
npm run db:generate
npm run db:push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database schema created${NC}"
else
    echo -e "${RED}❌ Failed to create database schema${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🌱 Seeding database...${NC}"
npm run db:seed

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database seeded successfully${NC}"
else
    echo -e "${RED}❌ Failed to seed database${NC}"
    exit 1
fi

cd ../..

echo ""
echo -e "${GREEN}🎉 PostgreSQL setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Setup Summary:${NC}"
echo "=================="
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: localhost"
echo "Port: 5432"
echo ""
echo -e "${BLUE}🔧 Next Steps:${NC}"
echo "1. Add your GEMINI_API_KEY to .env.local file"
echo "2. Run 'npm run dev' to start all applications"
echo "3. Visit the applications:"
echo "   - Writing Toolkit: http://localhost:3001"
echo "   - Resume Builder: http://localhost:3002"
echo "   - Report Generator: http://localhost:3003"
echo "   - SQL Generator: http://localhost:3004"
echo "   - Assistant Chatbot: http://localhost:3005"
echo ""
echo -e "${YELLOW}⚠️  Important: Add your GEMINI_API_KEY to .env.local before starting!${NC}"
