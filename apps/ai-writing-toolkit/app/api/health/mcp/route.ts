import { NextResponse } from "next/server"
import { getMCPServer } from "@ai-tools/mcp-server"

export async function GET() {
  try {
    const mcpServer = getMCPServer()
    const health = await mcpServer.healthCheck()

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
