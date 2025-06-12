import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@ai-tools/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // Get queries using Prisma directly
    const queries = await prisma.sqlQuery.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ queries })
  } catch (error) {
    console.error("Queries fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch queries" }, { status: 500 })
  }
}
