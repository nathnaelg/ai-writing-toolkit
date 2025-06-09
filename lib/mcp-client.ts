import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export interface MCPRequest {
  text: string
  operation: "paraphrase" | "grammar" | "summarize" | "expand"
  tone?: "formal" | "casual" | "academic" | "creative"
}

export interface MCPResponse {
  originalText: string
  processedText: string
  operation: string
  timestamp: Date
  wordCount: {
    original: number
    processed: number
  }
}

export class MCPClient {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" })

  async processText(request: MCPRequest): Promise<MCPResponse> {
    const prompts = {
      paraphrase: `Rewrite the following text in a ${request.tone || "neutral"} tone while maintaining the original meaning: "${request.text}"`,
      grammar: `Fix grammar, spelling, and punctuation errors in the following text: "${request.text}"`,
      summarize: `Provide a concise summary of the following text: "${request.text}"`,
      expand: `Expand and elaborate on the following text with more details and examples: "${request.text}"`,
    }

    try {
      const result = await this.model.generateContent(prompts[request.operation])
      const processedText = result.response.text()

      return {
        originalText: request.text,
        processedText,
        operation: request.operation,
        timestamp: new Date(),
        wordCount: {
          original: request.text.split(" ").length,
          processed: processedText.split(" ").length,
        },
      }
    } catch (error) {
      console.error("MCP processing error:", error)
      throw new Error("Failed to process text")
    }
  }
}
