import { type NextRequest, NextResponse } from "next/server"
import { ResumeMCPClient, type ResumeRequest } from "@/lib/resume-mcp-client"
import { prisma } from "@/lib/prisma"

const resumeMCP = new ResumeMCPClient()

export async function POST(request: NextRequest) {
  try {
    const body: ResumeRequest & { userId: string; title: string } = await request.json()

    if (!body.jobTitle || !body.experience || !body.skills || !body.userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate resume using MCP
    const mcpResponse = await resumeMCP.generateResume({
      jobTitle: body.jobTitle,
      industry: body.industry,
      experience: body.experience,
      skills: body.skills,
      education: body.education,
      targetJob: body.targetJob,
    })

    // Save to database using Prisma
    const savedResume = await prisma.resume.create({
      data: {
        userId: body.userId,
        title: body.title || `${body.jobTitle} Resume`,
        jobTitle: body.jobTitle,
        industry: body.industry,
        experience: body.experience,
        skills: body.skills,
        education: body.education,
        generatedResume: mcpResponse.generatedResume,
      },
    })

    return NextResponse.json({
      ...mcpResponse,
      resumeId: savedResume.id,
    })
  } catch (error) {
    console.error("Resume generation error:", error)
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 })
  }
}
