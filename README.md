# AI Tools Monorepo

A comprehensive collection of AI-powered tools built with Next.js, TypeScript, and modern web technologies.

## 🚀 Applications

This monorepo contains five AI-powered applications:

1. **AI Writing Toolkit** (Port 3001) - Advanced text processing and writing assistance
2. **AI Resume Builder** (Port 3002) - Intelligent resume creation and optimization
3. **AI Report Generator** (Port 3003) - Automated report generation from data
4. **AI SQL Generator** (Port 3004) - Natural language to SQL query conversion
5. **AI Assistant Chatbot** (Port 3005) - Conversational AI with knowledge base

## 🏗️ Architecture

### Monorepo Structure
```bash
ai-writing-toolkit/
├── apps/                          # Next.js applications
│   ├── ai-writing-toolkit/
│   ├── ai-resume-builder/
│   ├── ai-report-generator/
│   ├── ai-sql-generator/
│   └── ai-assistant-chatbot/
├── packages/                      # Shared packages
│   ├── database/                  # PostgreSQL + Prisma
│   ├── mcp-server/               # AI processing middleware
│   └── ui/                       # Shared React components
└── scripts/                      # Setup and utility scripts
```

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini API
- **Build System**: Turbo (monorepo)
- **Package Manager**: npm workspaces

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key

### Installation

1. **Clone and setup:**
   \`\`\`bash
   git clone <repository-url>
   cd ai-tools-monorepo
   pnpm run setup
   \`\`\`

2. **Configure environment:**
   \`\`\`bash
   # Update .env.local with your credentials
   DATABASE_URL="postgresql://username:password@localhost:5432/ai_tools_db"
   GEMINI_API_KEY="your_gemini_api_key_here"
   \`\`\`

3. **Start development:**
   \`\`\`bash
   pnpmrun dev
   \`\`\`

## 📦 Package Scripts

\`\`\`bash
# Development
pnpm run dev              # Start all applications
pnpm run dev:writing      # Start writing toolkit only
pnpm run dev:resume       # Start resume builder only
pnpm run dev:report       # Start report generator only
pnpm run dev:sql          # Start SQL generator only
pnpm run dev:chatbot      # Start chatbot only

# Build
pnpm run build            # Build all applications
pnpm run build:packages   # Build shared packages only

# Database
pnpm run db:generate      # Generate Prisma client
pnpm run db:push          # Push schema to database
pnpm run db:seed          # Seed database with sample data
pnpm run db:studio        # Open Prisma Studio

# Utilities
pnpm run setup            # Initial project setup
pnpm run clean            # Clean all build artifacts
pnpm run lint             # Lint all packages
pnpm run format           # Format code with Prettier
\`\`\`

## 🌐 Application URLs

When running in development mode:

- **AI Writing Toolkit**: http://localhost:3001
- **AI Resume Builder**: http://localhost:3002  
- **AI Report Generator**: http://localhost:3003
- **AI SQL Generator**: http://localhost:3004
- **AI Assistant Chatbot**: http://localhost:3005

## 🔧 Development

### Adding New Features
1. Shared components go in `packages/ui/`
2. Database models in `packages/database/prisma/schema.prisma`
3. AI processing logic in `packages/mcp-server/`
4. App-specific code in respective `apps/` directories

### Database Changes
\`\`\`bash
# After modifying schema.prisma
pnpm run db:push          # Apply changes
pnpm run db:generate      # Update Prisma client
\`\`\`

### Package Dependencies
- Use `workspace:*` for internal package dependencies
- Shared packages are automatically linked across apps

## 🚀 Deployment

Each application can be deployed independently:

\`\`\`bash
# Build specific app
cd apps/ai-writing-toolkit
pnpm run build

# Or build all
pnpm run build
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across all applications
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
