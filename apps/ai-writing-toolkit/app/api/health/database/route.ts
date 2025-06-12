import { NextResponse } from "next/server"
import { DatabaseService}  from "@ai-tools/database"

export async function GET() {
  try {
    // Ensure DatabaseService is properly imported and has healthCheck method.
    if (typeof DatabaseService.healthCheck !== "function") {
      throw new Error("DatabaseService.healthCheck is not implemented.")
    }

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
