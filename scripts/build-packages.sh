#!/bin/bash

echo "Building packages..."

# Build MCP Server
echo "Building MCP Server..."
cd packages/mcp-server
npm run build
cd ../..

# Build Database
echo "Building Database..."
cd packages/database
npm run build
npm run db:generate
cd ../..

# Build UI
echo "Building UI..."
cd packages/ui
npm run build
cd ../..

echo "All packages built successfully!"
.