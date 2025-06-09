import { type NextRequest, NextResponse } from "next/server"
import { SqlMCPClient, type SqlRequest } from "@/lib/sql-mcp-client"
import { prisma } from "@/lib/prisma"

const sqlMCP = new SqlMCPClient()

export async function POST(request: NextRequest) {
  try {
    const body: SqlRequest & { userId: string } = await request.json()

    if (!body.naturalLanguage || !body.userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate SQL using MCP
    const mcpResponse = await sqlMCP.generateSql({
      naturalLanguage: body.naturalLanguage,
      database: body.database,
      schema: body.schema,
      queryType: body.queryType,
    })

    // Save to database using Prisma
    const savedQuery = await prisma.sqlQuery.create({
      data: {
        userId: body.userId,
        naturalLanguage: body.naturalLanguage,
        generatedSql: mcpResponse.generatedSql,
        queryType: mcpResponse.queryType as any,
        database: body.database,
        explanation: mcpResponse.explanation,
        isValid: mcpResponse.isValid,
      },
    })

    return NextResponse.json({
      ...mcpResponse,
      queryId: savedQuery.id,
    })
  } catch (error) {
    console.error("SQL generation error:", error)
    return NextResponse.json({ error: "Failed to generate SQL" }, { status: 500 })
  }
}
