import { type NextRequest, NextResponse } from "next/server"
import { getMCPServer } from "@ai-tools/mcp-server"
import { prisma } from "@ai-tools/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, operation, tone, userId } = body

    if (!text || !operation || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate user exists before inserting history
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) {
      return NextResponse.json({ error: `User not found: ${userId}` }, { status: 404 })
    }

    const mcpServer = getMCPServer()
    const result = await mcpServer.processText({ text, operation, tone })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await prisma.textProcessingHistory.create({
      data: {
        userId,
        originalText: text,
        processedText: result.processedText,
        operation,
        tone,
        wordCountOriginal: text.split(/\s+/).length,
        wordCountProcessed: result.wordCount,
      },
    })

    return NextResponse.json({
      processedText: result.processedText,
      wordCount: result.wordCount,
      originalWordCount: text.split(/\s+/).length,
    })
  } catch (error) {
    console.error("Text processing error:", error)
    return NextResponse.json({ error: "Failed to process text" }, { status: 500 })
  }
}
