import { type NextRequest, NextResponse } from "next/server"
import { getMCPServer } from "@ai-tools/mcp-server"
import { prisma } from "@ai-tools/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobTitle, industry, experience, skills, education, targetJob, userId, title } = body

    if (!jobTitle || !experience || !skills || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get MCP server instance
    const mcpServer = getMCPServer()

    // Generate resume using MCP server
    const result = await mcpServer.generateResume({
      jobTitle,
      industry,
      experience,
      skills,
      education,
      targetJob,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Save to database using Prisma directly
    const savedResume = await prisma.resume.create({
      data: {
        id: `resume-${Date.now()}`,
        userId,
        title: title || `${jobTitle} Resume`,
        jobTitle,
        industry,
        experience,
        skills,
        education,
        generatedResume: result.generatedResume,
      },
    })

    return NextResponse.json({
      ...result,
      resumeId: savedResume.id,
    })
  } catch (error) {
    console.error("Resume generation error:", error)
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 })
  }
}
