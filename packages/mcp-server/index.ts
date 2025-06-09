import { GoogleGenerativeAI } from "@google/generative-ai"

const getApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set")
  }
  return apiKey
}

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
}

export class MCPServer {
  private model: any
  private genAI: any

  constructor(modelName = "gemini-1.5-flash") {
    try {
      this.genAI = new GoogleGenerativeAI(getApiKey())
      this.model = this.genAI.getGenerativeModel({ model: modelName })
    } catch (error) {
      console.error("Failed to initialize MCP Server:", error)
      throw error
    }
  }

  async generateContent(request: MCPRequest): Promise<MCPResponse> {
    try {
      const prompt = request.context ? `${request.context}\n\n${request.prompt}` : request.prompt

      const generationConfig = {
        temperature: request.temperature || 0.7,
        maxOutputTokens: request.maxTokens || 1024,
      }

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      })

      const response = await result.response
      const content = response.text()

      return {
        content,
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      }
    } catch (error) {
      console.error("MCP Server error:", error)
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async processText(params: {
    text: string
    operation: string
    tone?: string
  }): Promise<{ processedText: string; wordCount: number }> {
    const prompts = {
      summarize: `Summarize the following text in a clear and concise manner${params.tone ? ` with a ${params.tone} tone` : ""}:\n\n${params.text}`,
      expand: `Expand and elaborate on the following text${params.tone ? ` with a ${params.tone} tone` : ""}:\n\n${params.text}`,
      rewrite: `Rewrite the following text to improve clarity and flow${params.tone ? ` with a ${params.tone} tone` : ""}:\n\n${params.text}`,
      grammar: `Fix grammar and spelling errors in the following text while maintaining the original meaning:\n\n${params.text}`,
      tone: `Adjust the tone of the following text to be ${params.tone || "professional"}:\n\n${params.text}`,
    }

    const prompt = prompts[params.operation as keyof typeof prompts] || prompts.rewrite
    const response = await this.generateContent({ prompt })
    const wordCount = response.content.split(/\s+/).length

    return {
      processedText: response.content,
      wordCount,
    }
  }

  async generateResume(params: {
    jobTitle: string
    industry?: string
    experience: string
    skills: string
    education: string
    targetJob?: string
  }): Promise<{ generatedResume: string }> {
    const prompt = `Create a professional resume for the following details:

Job Title: ${params.jobTitle}
${params.industry ? `Industry: ${params.industry}` : ""}
${params.targetJob ? `Target Job: ${params.targetJob}` : ""}

Experience:
${params.experience}

Skills:
${params.skills}

Education:
${params.education}

Please format this as a complete, professional resume with proper sections and formatting.`

    const response = await this.generateContent({ prompt })
    return { generatedResume: response.content }
  }

  async generateReport(params: {
    bulletPoints: string
    reportType: string
    tone?: string
    audience?: string
    title: string
  }): Promise<{ generatedReport: string }> {
    const prompt = `Create a ${params.reportType.toLowerCase().replace("_", " ")} report with the following details:

Title: ${params.title}
${params.tone ? `Tone: ${params.tone}` : ""}
${params.audience ? `Audience: ${params.audience}` : ""}

Key Points:
${params.bulletPoints}

Please format this as a professional report with proper structure, introduction, main content, and conclusion.`

    const response = await this.generateContent({ prompt })
    return { generatedReport: response.content }
  }

  async generateSql(params: {
    naturalLanguage: string
    database?: string
    schema?: string
  }): Promise<{
    generatedSql: string
    queryType: string
    explanation: string
    isValid: boolean
  }> {
    const prompt = `Convert the following natural language request into SQL:

Request: ${params.naturalLanguage}
${params.database ? `Database: ${params.database}` : ""}
${params.schema ? `Schema: ${params.schema}` : ""}

Please provide:
1. The SQL query
2. Query type (SELECT, INSERT, UPDATE, DELETE, etc.)
3. Brief explanation of what the query does
4. Whether the query appears to be valid

Format your response as:
SQL: [your sql query]
TYPE: [query type]
EXPLANATION: [explanation]
VALID: [true/false]`

    const response = await this.generateContent({ prompt })
    const content = response.content

    const sqlMatch = content.match(/SQL:\s*(.*?)(?=\nTYPE:|$)/s)
    const typeMatch = content.match(/TYPE:\s*(.*?)(?=\nEXPLANATION:|$)/s)
    const explanationMatch = content.match(/EXPLANATION:\s*(.*?)(?=\nVALID:|$)/s)
    const validMatch = content.match(/VALID:\s*(.*?)(?=\n|$)/s)

    return {
      generatedSql: sqlMatch?.[1]?.trim() || content,
      queryType: typeMatch?.[1]?.trim().toUpperCase() || "OTHER",
      explanation: explanationMatch?.[1]?.trim() || "SQL query generated from natural language",
      isValid: validMatch?.[1]?.trim().toLowerCase() === "true",
    }
  }

  async generateResponse(params: {
    messages: Array<{ role: string; content: string }>
    knowledgeBase?: string[]
    context?: string
    userId: string
  }): Promise<{ response: string }> {
    const conversationHistory = params.messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")
    const knowledgeContext = params.knowledgeBase?.length
      ? `\n\nKnowledge Base:\n${params.knowledgeBase.join("\n")}`
      : ""

    const prompt = `You are a helpful AI assistant. Respond to the user's message based on the conversation history and available knowledge.

Conversation History:
${conversationHistory}
${knowledgeContext}
${params.context ? `\n\nAdditional Context: ${params.context}` : ""}

Please provide a helpful, accurate, and engaging response.`

    const response = await this.generateContent({ prompt })
    return { response: response.content }
  }
}

export default MCPServer
