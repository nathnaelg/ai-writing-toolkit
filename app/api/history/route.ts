import { type NextRequest, NextResponse } from "next/server"
import { DatabaseMiddleware } from "@/lib/db-middleware"

const dbMiddleware = new DatabaseMiddleware()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const history = await dbMiddleware.getUserHistory(userId, limit)
    const stats = await dbMiddleware.getProcessingStats(userId)

    return NextResponse.json({ history, stats })
  } catch (error) {
    console.error("History API Error:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
