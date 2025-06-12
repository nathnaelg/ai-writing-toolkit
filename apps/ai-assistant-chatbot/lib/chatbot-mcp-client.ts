import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

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
}

export class ChatbotMCPClient {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" })

  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    const knowledgeContext = request.knowledgeBase?.length
      ? `\n\nKnowledge Base Context:\n${request.knowledgeBase.join("\n\n")}`
      : ""

    const conversationHistory = request.messages
      .slice(-10) // Keep last 10 messages for context
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n")

    const systemPrompt = `You are a helpful AI assistant with access to a knowledge base. 
${request.context || "Provide helpful, accurate, and contextual responses."}

Guidelines:
- Be conversational and helpful
- Use the knowledge base when relevant
- Admit when you don't know something
- Suggest follow-up questions when appropriate
- Keep responses concise but informative

${knowledgeContext}

Conversation History:
${conversationHistory}

Please provide your response and suggest 2-3 relevant follow-up questions.
Format as JSON with fields: response, relevantKnowledge (array of knowledge base items used), confidence (1-100), followUpQuestions (array).
`

    try {
      const result = await this.model.generateContent(systemPrompt)
      const response = result.response.text()

      try {
        return JSON.parse(response)
      } catch {
        return {
          response: response,
          relevantKnowledge: request.knowledgeBase?.slice(0, 2) || [],
          confidence: 85,
          followUpQuestions: [
            "Would you like me to explain this in more detail?",
            "Do you have any other questions about this topic?",
            "Is there anything specific you'd like to know more about?",
          ],
        }
      }
    } catch (error) {
      console.error("Chat response error:", error)
      throw new Error("Failed to generate response")
    }
  }
}
