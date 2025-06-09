import { PrismaClient } from "@prisma/client"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Database service functions
export class DatabaseService {
  // Writing Toolkit methods
  static async saveTextProcessing(data: {
    userId: string
    originalText: string
    processedText: string
    operation: string
    tone?: string
    wordCountOriginal: number
    wordCountProcessed: number
  }) {
    try {
      return await prisma.textProcessingHistory.create({
        data,
      })
    } catch (error) {
      console.error("Error saving text processing:", error)
      throw error
    }
  }

  static async getTextProcessingHistory(userId: string, limit = 10) {
    try {
      return await prisma.textProcessingHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
      })
    } catch (error) {
      console.error("Error getting text processing history:", error)
      throw error
    }
  }

  static async getTextProcessingStats(userId: string) {
    try {
      const stats = await prisma.textProcessingHistory.groupBy({
        by: ["operation"],
        where: { userId },
        _count: { operation: true },
        _sum: { wordCountOriginal: true },
      })

      return {
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
    } catch (error) {
      console.error("Error getting text processing stats:", error)
      throw error
    }
  }

  // Resume Builder methods
  static async saveResume(data: {
    id: string
    userId: string
    title: string
    jobTitle: string
    industry?: string
    experience: string
    skills: string
    education: string
    generatedResume: string
  }) {
    try {
      return await prisma.resume.create({
        data,
      })
    } catch (error) {
      console.error("Error saving resume:", error)
      throw error
    }
  }

  static async getResumes(userId: string) {
    try {
      return await prisma.resume.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error getting resumes:", error)
      throw error
    }
  }

  // Report Generator methods
  static async saveReport(data: {
    id: string
    userId: string
    title: string
    reportType: string
    bulletPoints: string
    generatedReport: string
    tone?: string
    audience?: string
  }) {
    try {
      return await prisma.report.create({
        data: {
          ...data,
          reportType: data.reportType as any,
        },
      })
    } catch (error) {
      console.error("Error saving report:", error)
      throw error
    }
  }

  static async getReports(userId: string) {
    try {
      return await prisma.report.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error getting reports:", error)
      throw error
    }
  }

  // SQL Generator methods
  static async saveSqlQuery(data: {
    id: string
    userId: string
    naturalLanguage: string
    generatedSql: string
    queryType: string
    database?: string
    explanation?: string
    isValid: boolean
  }) {
    try {
      return await prisma.sqlQuery.create({
        data: {
          ...data,
          queryType: data.queryType as any,
        },
      })
    } catch (error) {
      console.error("Error saving SQL query:", error)
      throw error
    }
  }

  static async getSqlQueries(userId: string) {
    try {
      return await prisma.sqlQuery.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error getting SQL queries:", error)
      throw error
    }
  }

  // Chatbot methods
  static async saveConversation(data: {
    id: string
    userId: string
    title: string
  }) {
    try {
      return await prisma.conversation.create({
        data,
      })
    } catch (error) {
      console.error("Error saving conversation:", error)
      throw error
    }
  }

  static async saveMessage(data: {
    id: string
    conversationId: string
    role: string
    content: string
  }) {
    try {
      return await prisma.message.create({
        data: {
          ...data,
          role: data.role as any,
        },
      })
    } catch (error) {
      console.error("Error saving message:", error)
      throw error
    }
  }

  static async getConversations(userId: string) {
    try {
      return await prisma.conversation.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error getting conversations:", error)
      throw error
    }
  }

  static async getMessages(conversationId: string) {
    try {
      return await prisma.message.findMany({
        where: { conversationId },
        orderBy: { timestamp: "asc" },
      })
    } catch (error) {
      console.error("Error getting messages:", error)
      throw error
    }
  }

  // Knowledge Base methods
  static async saveKnowledge(data: {
    id: string
    userId: string
    title: string
    content: string
    category?: string
    tags: string[]
  }) {
    try {
      return await prisma.knowledgeBase.create({
        data,
      })
    } catch (error) {
      console.error("Error saving knowledge base entry:", error)
      throw error
    }
  }

  static async getKnowledgeBase(userId: string) {
    try {
      return await prisma.knowledgeBase.findMany({
        where: { userId, isActive: true },
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error getting knowledge base:", error)
      throw error
    }
  }

  // Health check
  static async healthCheck() {
    try {
      await prisma.$queryRaw`SELECT 1`
      return {
        healthy: true,
        database: "PostgreSQL with Prisma",
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : "Unknown error",
        database: "PostgreSQL with Prisma",
        timestamp: new Date().toISOString(),
      }
    }
  }

  // Create default user if needed
  static async ensureDefaultUser() {
    try {
      const defaultUserId = process.env.DEFAULT_USER_ID || "user-test-123"

      const existingUser = await prisma.user.findFirst({
        where: { id: defaultUserId },
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: defaultUserId,
            email: "test@example.com",
            name: "Test User",
          },
        })
        console.log("Created default user")
      }

      return defaultUserId
    } catch (error) {
      console.error("Error ensuring default user:", error)
      throw error
    }
  }
}

export default prisma
