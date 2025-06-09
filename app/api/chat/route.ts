import { type NextRequest, NextResponse } from "next/server"
import { ChatbotMCPClient, type ChatRequest } from "@/lib/chatbot-mcp-client"
import { prisma } from "@/lib/prisma"

const chatbotMCP = new ChatbotMCPClient()

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest & { conversationId?: string } = await request.json()

    if (!body.messages || !body.userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user's knowledge base
    const knowledgeBase = await prisma.knowledgeBase.findMany({
      where: {
        userId: body.userId,
        isActive: true,
      },
      select: {
        title: true,
        content: true,
        category: true,
      },
    })

    // Search relevant knowledge
    const userMessage = body.messages[body.messages.length - 1]
    const relevantKnowledge = await chatbotMCP.searchKnowledgeBase(userMessage.content, knowledgeBase)

    // Generate response using MCP
    const mcpResponse = await chatbotMCP.generateResponse({
      messages: body.messages,
      knowledgeBase: relevantKnowledge.map((kb) => `${kb.title}: ${kb.content}`),
      context: body.context,
      userId: body.userId,
    })

    // Save conversation to database
    let conversationId = body.conversationId

    if (!conversationId) {
      // Create new conversation
      const conversation = await prisma.conversation.create({
        data: {
          userId: body.userId,
          title: userMessage.content.substring(0, 50) + "...",
        },
      })
      conversationId = conversation.id
    }

    // Save messages
    await prisma.message.createMany({
      data: [
        {
          conversationId,
          role: "USER",
          content: userMessage.content,
        },
        {
          conversationId,
          role: "ASSISTANT",
          content: mcpResponse.response,
        },
      ],
    })

    return NextResponse.json({
      ...mcpResponse,
      conversationId,
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
