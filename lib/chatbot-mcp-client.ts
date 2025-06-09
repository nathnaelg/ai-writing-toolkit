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

  async searchKnowledgeBase(
    query: string,
    knowledgeBase: Array<{ title: string; content: string; category?: string }>,
  ): Promise<Array<{ title: string; content: string; relevance: number }>> {
    if (!knowledgeBase.length) return []

    const searchPrompt = `
Given this search query: "${query}"

Find the most relevant knowledge base entries from the following:

${knowledgeBase
  .map(
    (kb, index) => `
${index + 1}. Title: ${kb.title}
Category: ${kb.category || "General"}
Content: ${kb.content.substring(0, 200)}...
`,
  )
  .join("\n")}

Return the top 3 most relevant entries with relevance scores (1-100).
Format as JSON array with fields: title, content, relevance.
`

    try {
      const result = await this.model.generateContent(searchPrompt)
      const response = result.response.text()

      try {
        return JSON.parse(response)
      } catch {
        // Fallback: return first few entries with default relevance
        return knowledgeBase.slice(0, 3).map((kb) => ({
          title: kb.title,
          content: kb.content,
          relevance: 75,
        }))
      }
    } catch (error) {
      console.error("Knowledge base search error:", error)
      return []
    }
  }

  async generateFollowUpQuestions(conversation: ChatMessage[], context?: string): Promise<string[]> {
    const recentMessages = conversation.slice(-5)
    const conversationSummary = recentMessages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")

    const prompt = `
Based on this conversation, suggest 3 relevant follow-up questions:

${conversationSummary}

Context: ${context || "General conversation"}

Generate questions that would naturally continue the conversation and provide value to the user.
Return as JSON array of strings.
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response.text()

      try {
        return JSON.parse(response)
      } catch {
        return [
          "Can you tell me more about that?",
          "How does this relate to other topics we've discussed?",
          "What would you like to explore next?",
        ]
      }
    } catch (error) {
      console.error("Follow-up questions error:", error)
      return []
    }
  }
}
