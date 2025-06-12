import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export interface SqlRequest {
  naturalLanguage: string
  database?: string
  schema?: string
  queryType?: string
}

export interface SqlResponse {
  generatedSql: string
  explanation: string
  queryType: string
  isValid: boolean
  suggestions: string[]
}

export class SqlMCPClient {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" })

  async generateSql(request: SqlRequest): Promise<SqlResponse> {
    const schemaContext = request.schema ? `\n\nDatabase Schema:\n${request.schema}` : ""

    const prompt = `
Convert this natural language request to SQL:

REQUEST: ${request.naturalLanguage}
DATABASE: ${request.database || "PostgreSQL"}${schemaContext}

Please provide:
1. The SQL query
2. A clear explanation of what the query does
3. The query type (SELECT, INSERT, UPDATE, DELETE, etc.)
4. Whether the query appears valid
5. Any suggestions for optimization or alternatives

If no schema is provided, assume common table structures and mention any assumptions made.

Format as JSON with fields: generatedSql, explanation, queryType, isValid (boolean), suggestions (array).
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response.text()

      try {
        return JSON.parse(response)
      } catch {
        // Fallback parsing
        const sqlMatch = response.match(/```sql\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/)
        const sql = sqlMatch ? sqlMatch[1].trim() : response

        return {
          generatedSql: sql,
          explanation: "SQL query generated based on natural language input.",
          queryType: this.detectQueryType(sql),
          isValid: true,
          suggestions: ["Review the query before executing", "Test with sample data first"],
        }
      }
    } catch (error) {
      console.error("SQL generation error:", error)
      throw new Error("Failed to generate SQL")
    }
  }

  private detectQueryType(sql: string): string {
    const upperSql = sql.toUpperCase().trim()
    if (upperSql.startsWith("SELECT")) return "SELECT"
    if (upperSql.startsWith("INSERT")) return "INSERT"
    if (upperSql.startsWith("UPDATE")) return "UPDATE"
    if (upperSql.startsWith("DELETE")) return "DELETE"
    if (upperSql.startsWith("CREATE")) return "CREATE"
    if (upperSql.startsWith("ALTER")) return "ALTER"
    if (upperSql.includes("JOIN")) return "JOIN"
    if (upperSql.includes("GROUP BY") || upperSql.includes("COUNT") || upperSql.includes("SUM")) return "AGGREGATE"
    return "OTHER"
  }
}
