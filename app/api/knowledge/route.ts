import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const knowledgeBase = await prisma.knowledgeBase.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ knowledgeBase })
  } catch (error) {
    console.error("Knowledge fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch knowledge base" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.content || !body.userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const knowledgeItem = await prisma.knowledgeBase.create({
      data: {
        userId: body.userId,
        title: body.title,
        content: body.content,
        category: body.category,
        tags: body.tags || [],
      },
    })

    return NextResponse.json(knowledgeItem)
  } catch (error) {
    console.error("Knowledge creation error:", error)
    return NextResponse.json({ error: "Failed to create knowledge item" }, { status: 500 })
  }
}
