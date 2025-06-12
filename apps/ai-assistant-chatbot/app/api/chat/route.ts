import { type NextRequest, NextResponse } from "next/server"
import { getMCPServer } from "@ai-tools/mcp-server"
import { prisma } from "@ai-tools/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, conversationId, userId } = body

    if (!messages || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get knowledge base for context
    const knowledgeBase = await prisma.knowledgeBase.findMany({
      where: { userId, isActive: true },
      select: { content: true },
      take: 5,
    })

    // Get MCP server instance
    const mcpServer = getMCPServer()

    // Generate response using MCP server
    const result = await mcpServer.generateResponse({
      messages,
      knowledgeBase: knowledgeBase.map((kb) => kb.content),
      userId,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Save messages to database if conversationId provided
    if (conversationId) {
      const userMessage = messages[messages.length - 1]

      await prisma.message.create({
        data: {
          id: `msg-user-${Date.now()}`,
          conversationId,
          role: "USER",
          content: userMessage.content,
        },
      })

      await prisma.message.create({
        data: {
          id: `msg-assistant-${Date.now()}`,
          conversationId,
          role: "ASSISTANT",
          content: result.response,
        },
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
