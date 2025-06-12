import { type NextRequest, NextResponse } from "next/server"
import { getMCPServer } from "@ai-tools/mcp-server"
import { prisma } from "@ai-tools/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { naturalLanguage, database, schema, userId } = body

    if (!naturalLanguage || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get MCP server instance
    const mcpServer = getMCPServer()

    // Generate SQL using MCP server
    const result = await mcpServer.generateSql({
      naturalLanguage,
      database,
      schema,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Save to database using Prisma directly
    const savedQuery = await prisma.sqlQuery.create({
      data: {
        id: `sql-${Date.now()}`,
        userId,
        naturalLanguage,
        generatedSql: result.generatedSql,
        queryType: result.queryType as any,
        database,
        explanation: result.explanation,
        isValid: result.isValid,
      },
    })

    return NextResponse.json({
      ...result,
      queryId: savedQuery.id,
    })
  } catch (error) {
    console.error("SQL generation error:", error)
    return NextResponse.json({ error: "Failed to generate SQL" }, { status: 500 })
  }
}
