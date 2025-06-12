import { type NextRequest, NextResponse } from "next/server"
import {prisma } from "@ai-tools/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // Get history
    const history = await prisma.textProcessingHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    // Get stats
    const stats = await prisma.textProcessingHistory.groupBy({
      by: ["operation"],
      where: { userId },
      _count: { operation: true },
      _sum: { wordCountOriginal: true },
    })

    const processedStats = {
      totalProcessed: stats.reduce((sum, stat) => sum + stat._count.operation, 0),
      totalWordsProcessed: stats.reduce((sum, stat) => sum + (stat._sum.wordCountOriginal || 0), 0),
      operationCounts: stats.reduce(
        (acc, stat) => {
          acc[stat.operation] = stat._count.operation
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    return NextResponse.json({
      history,
      stats: processedStats,
    })
  } catch (error) {
    console.error("History fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
