import { type NextRequest, NextResponse } from "next/server"
import { MCPClient, type MCPRequest } from "@/lib/mcp-client"
import { DatabaseMiddleware } from "@/lib/db-middleware"

const mcpClient = new MCPClient()
const dbMiddleware = new DatabaseMiddleware()

export async function POST(request: NextRequest) {
  try {
    const body: MCPRequest & { userId: string } = await request.json()

    if (!body.text || !body.operation || !body.userId) {
      return NextResponse.json({ error: "Missing required fields: text, operation, userId" }, { status: 400 })
    }

    // Process text using MCP
    const mcpResponse = await mcpClient.processText({
      text: body.text,
      operation: body.operation,
      tone: body.tone,
    })

    // Save to database
    await dbMiddleware.saveProcessingRecord({
      user_id: body.userId,
      original_text: mcpResponse.originalText,
      processed_text: mcpResponse.processedText,
      operation: mcpResponse.operation,
      tone: body.tone,
      word_count_original: mcpResponse.wordCount.original,
      word_count_processed: mcpResponse.wordCount.processed,
    })

    return NextResponse.json(mcpResponse)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to process text" }, { status: 500 })
  }
}
