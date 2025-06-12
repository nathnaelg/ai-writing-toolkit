"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@ai-tools/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@ai-tools/ui"
import { Input } from "@ai-tools/ui"
import { ScrollArea } from "@ai-tools/ui"
import { Badge } from "@ai-tools/ui"
import { Loader2, Send, Bot, User, Brain, Database } from "lucide-react"

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

interface ChatResponse {
  response: string
  relevantKnowledge: string[]
  confidence: number
  followUpQuestions: string[]
  conversationId: string
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. I can help you with questions based on your knowledge base. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend || isLoading) return

    const userMessage: ChatMessage = {
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userId: "demo-user-1",
          conversationId,
        }),
      })

      if (!response.ok) throw new Error("Chat failed")

      const data: ChatResponse = await response.json()

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setConversationId(data.conversationId)
      setFollowUpQuestions(data.followUpQuestions)
    } catch (error) {
      alert("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFollowUpClick = (question: string) => {
    handleSendMessage(question)
    setFollowUpQuestions([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Database className="h-6 w-6 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ✅ Neon PostgreSQL Connected
            </Badge>
          </div>
          <h1 className="text-4xl font-bold">AI Assistant Chatbot</h1>
          <p className="text-muted-foreground">Chat with your personal AI assistant powered by your knowledge base</p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Chat Assistant
              <Badge variant="secondary" className="ml-auto">
                {messages.length} messages
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
              <div className="space-y-4 pb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">{message.timestamp.toLocaleTimeString()}</span>
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Follow-up Questions */}
            {followUpQuestions.length > 0 && !isLoading && (
              <div className="px-6 py-3 border-t bg-muted/30">
                <p className="text-sm font-medium mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {followUpQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleFollowUpClick(question)}
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={() => handleSendMessage()} disabled={isLoading || !inputMessage.trim()} size="icon">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="px-6 pb-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-sm text-green-800">
                  <Database className="h-4 w-4" />
                  <span>✅ Conversations saved to Neon Database</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
