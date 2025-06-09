import { NextResponse } from "next/server"
import { checkDatabaseConnection, dbUtils } from "@/lib/neon-config"

export async function GET() {
  try {
    // Check basic connection
    const isConnected = await checkDatabaseConnection()

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      )
    }

    // Get database info
    const dbInfo = await dbUtils.getDatabaseInfo()
    const dbSize = await dbUtils.getDatabaseSize()
    const tableStats = await dbUtils.getTableStats()

    return NextResponse.json({
      status: "healthy",
      database: {
        connected: true,
        info: dbInfo,
        size: dbSize,
        tables: tableStats.length,
        timestamp: new Date().toISOString(),
      },
      tables: tableStats,
    })
  } catch (error) {
    console.error("Database health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Database health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
