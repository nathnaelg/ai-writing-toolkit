import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    const stats = await prisma.resume.groupBy({
      by: ["industry"],
      where: { userId },
      _count: { id: true },
    })

    return NextResponse.json({ resumes, stats })
  } catch (error) {
    console.error("Resume fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 })
  }
}
