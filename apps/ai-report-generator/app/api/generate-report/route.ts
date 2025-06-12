import { type NextRequest, NextResponse } from "next/server"
import { getMCPServer } from "@ai-tools/mcp-server"
import { prisma } from "@ai-tools/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, bulletPoints, reportType, tone, audience, userId } = body

    if (!title || !bulletPoints || !reportType || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Step 1: Ensure the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: `User with ID '${userId}' not found.` }, { status: 404 })
    }

    // Step 2: Generate report using MCP server
    const mcpServer = getMCPServer()
    const result = await mcpServer.generateReport({
      title,
      bulletPoints,
      reportType,
      tone,
      audience,
    })

    if ((result as any).error) {
      return NextResponse.json({ error: (result as any).error }, { status: 500 })
    }

    // Step 3: Save to database using Prisma
    const savedReport = await prisma.report.create({
      data: {
        id: `report-${Date.now()}`,
        userId,
        title,
        reportType: reportType as any,
        bulletPoints,
        generatedReport: result.generatedReport,
        tone,
        audience,
      },
    })

    return NextResponse.json({
      ...result,
      reportId: savedReport.id,
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
