import { type NextRequest, NextResponse } from "next/server"
import { ReportMCPClient, type ReportRequest } from "@/lib/report-mcp-client"
import { prisma } from "@/lib/prisma"

const reportMCP = new ReportMCPClient()

export async function POST(request: NextRequest) {
  try {
    const body: ReportRequest & { userId: string } = await request.json()

    if (!body.bulletPoints || !body.reportType || !body.title || !body.userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate report using MCP
    const mcpResponse = await reportMCP.generateReport({
      bulletPoints: body.bulletPoints,
      reportType: body.reportType,
      tone: body.tone,
      audience: body.audience,
      title: body.title,
    })

    // Save to database using Prisma
    const savedReport = await prisma.report.create({
      data: {
        userId: body.userId,
        title: body.title,
        reportType: body.reportType as any,
        bulletPoints: body.bulletPoints,
        generatedReport: mcpResponse.generatedReport,
        tone: body.tone,
        audience: body.audience,
      },
    })

    return NextResponse.json({
      ...mcpResponse,
      reportId: savedReport.id,
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
