import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export interface TextProcessingRecord {
  id?: number
  user_id: string
  original_text: string
  processed_text: string
  operation: string
  tone?: string
  created_at?: Date
  word_count_original: number
  word_count_processed: number
}

export class DatabaseMiddleware {
  async saveProcessingRecord(record: Omit<TextProcessingRecord, "id" | "created_at">): Promise<number> {
    try {
      const result = await sql`
        INSERT INTO text_processing_history 
        (user_id, original_text, processed_text, operation, tone, word_count_original, word_count_processed)
        VALUES (${record.user_id}, ${record.original_text}, ${record.processed_text}, 
                ${record.operation}, ${record.tone || null}, ${record.word_count_original}, ${record.word_count_processed})
        RETURNING id
      `
      return result[0].id
    } catch (error) {
      console.error("Database save error:", error)
      throw new Error("Failed to save processing record")
    }
  }

  async getUserHistory(userId: string, limit = 10): Promise<TextProcessingRecord[]> {
    try {
      const result = await sql`
        SELECT * FROM text_processing_history 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
      return result as TextProcessingRecord[]
    } catch (error) {
      console.error("Database fetch error:", error)
      throw new Error("Failed to fetch user history")
    }
  }

  async getProcessingStats(userId: string): Promise<{
    totalProcessed: number
    operationCounts: Record<string, number>
    totalWordsProcessed: number
  }> {
    try {
      const stats = await sql`
        SELECT 
          COUNT(*) as total_processed,
          SUM(word_count_original) as total_words_processed,
          operation,
          COUNT(operation) as operation_count
        FROM text_processing_history 
        WHERE user_id = ${userId}
        GROUP BY operation
      `

      const operationCounts: Record<string, number> = {}
      let totalProcessed = 0
      let totalWordsProcessed = 0

      stats.forEach((stat: any) => {
        operationCounts[stat.operation] = Number.parseInt(stat.operation_count)
        totalProcessed += Number.parseInt(stat.operation_count)
        totalWordsProcessed += Number.parseInt(stat.total_words_processed || 0)
      })

      return {
        totalProcessed,
        operationCounts,
        totalWordsProcessed,
      }
    } catch (error) {
      console.error("Database stats error:", error)
      return { totalProcessed: 0, operationCounts: {}, totalWordsProcessed: 0 }
    }
  }
}
