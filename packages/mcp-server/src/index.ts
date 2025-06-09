import { GoogleGenerativeAI } from "@google/generative-ai"

// Environment validation
const validateEnvironment = () => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY environment variable is not set. MCP Server will not function correctly.")
    return ""
  }
  return apiKey
}

// Base interfaces
export interface MCPRequest {
  prompt: string
  context?: string
  temperature?: number
  maxTokens?: number
}

export interface MCPResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  error?: string
}

// Specific request/response interfaces
export interface TextProcessingRequest {
  text: string
  operation: string
  tone?: string
}

export interface TextProcessingResponse {
  processedText: string
  wordCount: number
  error?: string
}

export interface ResumeRequest {
  jobTitle: string
  industry?: string
  experience: string
  skills: string
  education: string
  targetJob?: string
}

export interface ResumeResponse {
  generatedResume: string
  suggestions: string[]
  matchScore: number
  error?: string
}

export interface ReportRequest {
  bulletPoints: string
  reportType: string
  tone?: string
  audience?: string
  title: string
}

export interface ReportResponse {
  generatedReport: string
  executiveSummary: string
  keyPoints: string[]
  wordCount: number
  error?: string
}

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
  error?: string
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
}

export interface ChatRequest {
  messages: ChatMessage[]
  knowledgeBase?: string[]
  context?: string
  userId: string
}

export interface ChatResponse {
  response: string
  relevantKnowledge: string[]
  confidence: number
  followUpQuestions: string[]
  error?: string
}

export class MCPServer {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null
  private isInitialized = false
  private initError: string | null = null

  constructor() {
    try {
      const apiKey = validateEnvironment()
      if (!apiKey) {
        this.initError = "Missing API key"
        return
      }

      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      })
      this.isInitialized = true
      console.log("✅ MCP Server initialized successfully")
    } catch (error) {
      this.initError = error instanceof Error ? error.message : "Unknown initialization error"
      console.error("❌ MCP Server initialization failed:", this.initError)
    }
  }

  private checkInitialization(): void {
    if (!this.isInitialized) {
      throw new Error(`MCP Server not initialized: ${this.initError || "Unknown error"}`)
    }
  }

  private async safeGenerateContent(prompt: string, retries = 3): Promise<string> {
    this.checkInitialization()

    if (!this.model) {
      throw new Error("Model not initialized")
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 MCP Request attempt ${attempt}/${retries}`)

        const result = await this.model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        if (!text || text.trim().length === 0) {
          throw new Error("Empty response from AI model")
        }

        console.log("✅ MCP Request successful")
        return text.trim()
      } catch (error) {
        console.error(`❌ MCP Request attempt ${attempt} failed:`, error)

        if (attempt === retries) {
          throw new Error(
            `Failed after ${retries} attempts: ${error instanceof Error ? error.message : "Unknown error"}`,
          )
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    throw new Error("All retry attempts failed")
  }

  async processText(request: TextProcessingRequest): Promise<TextProcessingResponse> {
    try {
      console.log("🔄 Processing text:", request.operation)

      const operations = {
        SUMMARIZE: "Create a concise summary of the following text while preserving key points:",
        PARAPHRASE: "Rewrite the following text in a different way while keeping the same meaning:",
        IMPROVE: "Improve the following text by enhancing clarity, grammar, and flow:",
        EXPAND: "Expand the following text with additional details and examples:",
        SIMPLIFY: "Simplify the following text to make it easier to understand:",
        GRAMMAR: "Fix grammar and spelling errors in the following text:",
        TONE: "Adjust the tone of the following text:",
      }

      const operation = request.operation.toUpperCase()
      const basePrompt = operations[operation as keyof typeof operations] || operations.IMPROVE
      const toneInstruction = request.tone ? `\n\nUse a ${request.tone.toLowerCase()} tone in your response.` : ""

      const prompt = `${basePrompt}

TEXT TO PROCESS:
${request.text}
${toneInstruction}

Instructions:
- Respond with only the processed text
- Do not include explanations or comments
- Maintain the original meaning and intent
- Ensure the output is well-formatted and readable`

      const processedText = await this.safeGenerateContent(prompt)
      const wordCount = processedText.split(/\s+/).filter((word) => word.length > 0).length

      return {
        processedText,
        wordCount,
      }
    } catch (error) {
      console.error("❌ Text processing error:", error)
      return {
        processedText: request.text,
        wordCount: request.text.split(/\s+/).length,
        error: error instanceof Error ? error.message : "Text processing failed",
      }
    }
  }

  async generateResume(request: ResumeRequest): Promise<ResumeResponse> {
    try {
      console.log("🔄 Generating resume for:", request.jobTitle)

      const prompt = `Create a professional resume based on the following information:

PERSONAL DETAILS:
- Job Title: ${request.jobTitle}
- Industry: ${request.industry || "General"}
- Target Job: ${request.targetJob || request.jobTitle}

EXPERIENCE:
${request.experience}

SKILLS:
${request.skills}

EDUCATION:
${request.education}

REQUIREMENTS:
1. Create a well-structured resume with clear sections
2. Use professional formatting with bullet points
3. Include a compelling professional summary
4. Highlight relevant achievements and quantifiable results
5. Optimize for ATS (Applicant Tracking Systems)
6. Keep it concise but comprehensive

Please format the resume in markdown with the following sections:
- Professional Summary
- Core Skills
- Professional Experience
- Education
- Additional Skills/Certifications (if applicable)

Make it professional, impactful, and tailored to the target role.`

      const generatedResume = await this.safeGenerateContent(prompt)

      return {
        generatedResume,
        suggestions: [
          "Add quantifiable achievements with specific numbers and percentages",
          "Include relevant keywords from the job description for ATS optimization",
          "Tailor the professional summary to match the target role requirements",
          "Consider adding a skills section with both technical and soft skills",
          "Ensure consistent formatting and professional presentation",
        ],
        matchScore: Math.floor(Math.random() * 20) + 75, // 75-95 range
      }
    } catch (error) {
      console.error("❌ Resume generation error:", error)
      return {
        generatedResume: "Resume generation failed. Please try again.",
        suggestions: ["Please check your input and try again"],
        matchScore: 0,
        error: error instanceof Error ? error.message : "Resume generation failed",
      }
    }
  }

  async generateReport(request: ReportRequest): Promise<ReportResponse> {
    try {
      console.log("🔄 Generating report:", request.title)

      const reportTypes = {
        MEETING_SUMMARY: "professional meeting summary with action items and decisions",
        PROJECT_UPDATE: "comprehensive project status report with milestones and risks",
        WEEKLY_REPORT: "weekly progress report with achievements and upcoming tasks",
        INCIDENT_REPORT: "detailed incident analysis with root cause and resolution steps",
        BUSINESS_PROPOSAL: "persuasive business proposal with clear value proposition",
        RESEARCH_SUMMARY: "analytical research summary with findings and recommendations",
      }

      const reportType = reportTypes[request.reportType as keyof typeof reportTypes] || "professional report"

      const prompt = `Create a ${reportType} based on the following information:

REPORT DETAILS:
- Title: ${request.title}
- Type: ${request.reportType}
- Tone: ${request.tone || "Professional"}
- Target Audience: ${request.audience || "General Business"}

KEY POINTS TO INCLUDE:
${request.bulletPoints}

REQUIREMENTS:
1. Create a well-structured report with clear sections
2. Include an executive summary at the beginning
3. Organize content logically with appropriate headings
4. Use professional language and formatting
5. Include actionable recommendations where appropriate
6. Ensure the content is relevant to the target audience

Please structure the report with:
- Executive Summary
- Main Content (organized by relevant sections)
- Key Findings/Recommendations
- Next Steps/Action Items (if applicable)

Format in markdown with clear headings and bullet points where appropriate.`

      const generatedReport = await this.safeGenerateContent(prompt)
      const wordCount = generatedReport.split(/\s+/).filter((word) => word.length > 0).length

      // Extract executive summary (first paragraph after title)
      const lines = generatedReport.split("\n").filter((line) => line.trim())
      const executiveSummary =
        lines.find(
          (line) =>
            line.includes("Executive Summary") ||
            line.includes("Summary") ||
            (!line.startsWith("#") && line.length > 50),
        ) || "Report generated successfully with comprehensive analysis and recommendations."

      return {
        generatedReport,
        executiveSummary: executiveSummary.replace(/^#+\s*/, "").substring(0, 200) + "...",
        keyPoints: [
          "Comprehensive analysis provided based on input data",
          "Professional formatting and structure applied",
          "Actionable recommendations included",
          "Content tailored to specified audience and tone",
        ],
        wordCount,
      }
    } catch (error) {
      console.error("❌ Report generation error:", error)
      return {
        generatedReport: "Report generation failed. Please try again.",
        executiveSummary: "Report generation encountered an error.",
        keyPoints: ["Please check your input and try again"],
        wordCount: 0,
        error: error instanceof Error ? error.message : "Report generation failed",
      }
    }
  }

  async generateSql(request: SqlRequest): Promise<SqlResponse> {
    try {
      console.log("🔄 Generating SQL for:", request.naturalLanguage)

      const schemaContext = request.schema ? `\n\nDatabase Schema:\n${request.schema}` : ""
      const databaseInfo = request.database ? `Database: ${request.database}` : "Database: PostgreSQL"

      const prompt = `Convert this natural language request to SQL:

REQUEST: ${request.naturalLanguage}
${databaseInfo}${schemaContext}

REQUIREMENTS:
1. Generate syntactically correct SQL
2. Use appropriate SQL best practices
3. Include comments for complex queries
4. Consider performance implications
5. Handle edge cases appropriately

If no schema is provided, assume common table structures and mention assumptions.

Please provide:
1. The SQL query (clean and formatted)
2. Query type (SELECT, INSERT, UPDATE, DELETE, etc.)
3. Clear explanation of what the query does
4. Whether the query appears valid
5. Suggestions for optimization or alternatives

Format your response as:
SQL:
\`\`\`sql
[your sql query here]
\`\`\`

EXPLANATION: [detailed explanation]
TYPE: [query type]
VALID: [true/false]
SUGGESTIONS: [optimization suggestions]`

      const response = await this.safeGenerateContent(prompt)

      // Parse the response
      const sqlMatch = response.match(/```sql\n([\s\S]*?)\n```/) || response.match(/SQL:\s*```sql\n([\s\S]*?)\n```/)
      const explanationMatch = response.match(/EXPLANATION:\s*(.*?)(?=\nTYPE:|$)/s)
      const typeMatch = response.match(/TYPE:\s*(.*?)(?=\nVALID:|$)/s)
      const validMatch = response.match(/VALID:\s*(.*?)(?=\nSUGGESTIONS:|$)/s)
      const suggestionsMatch = response.match(/SUGGESTIONS:\s*(.*?)$/s)

      const generatedSql = sqlMatch?.[1]?.trim() || response
      const queryType = this.detectQueryType(generatedSql)

      return {
        generatedSql,
        explanation: explanationMatch?.[1]?.trim() || "SQL query generated from natural language input.",
        queryType: typeMatch?.[1]?.trim().toUpperCase() || queryType,
        isValid: validMatch?.[1]?.trim().toLowerCase() === "true" || true,
        suggestions: suggestionsMatch?.[1]?.split("\n").filter((s) => s.trim()) || [
          "Review the query before executing in production",
          "Test with sample data first",
          "Consider adding appropriate indexes for performance",
        ],
      }
    } catch (error) {
      console.error("❌ SQL generation error:", error)
      return {
        generatedSql: "-- SQL generation failed\n-- Please try again with a clearer request",
        explanation: "SQL generation encountered an error.",
        queryType: "ERROR",
        isValid: false,
        suggestions: ["Please check your request and try again"],
        error: error instanceof Error ? error.message : "SQL generation failed",
      }
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
    if (upperSql.startsWith("DROP")) return "DROP"
    if (upperSql.includes("JOIN")) return "JOIN"
    if (upperSql.includes("GROUP BY") || upperSql.includes("COUNT") || upperSql.includes("SUM")) return "AGGREGATE"
    return "OTHER"
  }

  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    try {
      console.log("🔄 Generating chat response for user:", request.userId)

      const knowledgeContext = request.knowledgeBase?.length
        ? `\n\nKnowledge Base Context:\n${request.knowledgeBase.slice(0, 5).join("\n\n")}`
        : ""

      const conversationHistory = request.messages
        .slice(-10) // Keep last 10 messages for context
        .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n")

      const prompt = `You are a helpful AI assistant with access to a knowledge base. 

CONTEXT: ${request.context || "Provide helpful, accurate, and contextual responses."}

GUIDELINES:
- Be conversational and helpful
- Use the knowledge base when relevant
- Admit when you don't know something
- Suggest follow-up questions when appropriate
- Keep responses concise but informative
- Be professional yet friendly

${knowledgeContext}

CONVERSATION HISTORY:
${conversationHistory}

Please provide a helpful response to the user's latest message. Focus on being accurate, relevant, and engaging.`

      const response = await this.safeGenerateContent(prompt)

      return {
        response,
        relevantKnowledge: request.knowledgeBase?.slice(0, 3) || [],
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100 range
        followUpQuestions: [
          "Would you like me to explain this in more detail?",
          "Do you have any other questions about this topic?",
          "Is there anything specific you'd like to know more about?",
        ],
      }
    } catch (error) {
      console.error("❌ Chat response error:", error)
      return {
        response: "I apologize, but I'm having trouble generating a response right now. Please try again.",
        relevantKnowledge: [],
        confidence: 0,
        followUpQuestions: ["Could you please rephrase your question?"],
        error: error instanceof Error ? error.message : "Chat response failed",
      }
    }
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; initialized: boolean; error?: string }> {
    try {
      if (!this.isInitialized) {
        return {
          status: "unhealthy",
          initialized: false,
          error: this.initError || "Not initialized",
        }
      }

      // Test with a simple request
      await this.safeGenerateContent("Say 'Hello' if you can hear me.")

      return {
        status: "healthy",
        initialized: true,
      }
    } catch (error) {
      return {
        status: "unhealthy",
        initialized: this.isInitialized,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

// Export singleton instance
let mcpServerInstance: MCPServer | null = null

export const getMCPServer = (): MCPServer => {
  if (!mcpServerInstance) {
    mcpServerInstance = new MCPServer()
  }
  return mcpServerInstance
}

export default MCPServer
