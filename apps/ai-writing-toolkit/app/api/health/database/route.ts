import { NextResponse } from "next/server"
import { DatabaseService } from "@ai-tools/database"

export async function GET() {
  try {
    const health = await DatabaseService.healthCheck()
    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        healthy: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
