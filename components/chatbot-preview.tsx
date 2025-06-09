"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Bot, User, Brain, Database, Book, MessageCircle, Plus } from "lucide-react"

export default function ChatbotPreview() {
  const [inputMessage, setInputMessage] = useState("")

  const mockMessages = [
    {
      role: "assistant" as const,
      content:
        "Hello! I'm your AI assistant. I can help you with questions based on your knowledge base. How can I assist you today?",
      timestamp: new Date("2024-01-15T10:00:00Z"),
    },
    {
      role: "user" as const,
      content: "How do I use the AI Writing Toolkit?",
      timestamp: new Date("2024-01-15T10:01:00Z"),
    },
    {
      role: "assistant" as const,
      content:
        "The AI Writing Toolkit allows you to enhance your text in several ways:\n\n1. **Paraphrasing**: Rewrite text in different tones (formal, casual, academic, creative)\n2. **Grammar Check**: Fix grammar, spelling, and punctuation errors\n3. **Summarization**: Create concise summaries of long text\n4. **Text Expansion**: Add details and elaborate on short text\n\nSimply enter your text, select the operation and tone, then click the process button. Your results will be saved to your history for future reference.",
      timestamp: new Date("2024-01-15T10:01:30Z"),
    },
    {
      role: "user" as const,
      content: "What about the database performance issues mentioned in my reports?",
      timestamp: new Date("2024-01-15T10:02:00Z"),
    },
    {
      role: "assistant" as const,
      content:
        "Based on your knowledge base, I can see you've mentioned database performance issues in recent reports. Here are some recommendations:\n\n**Immediate Actions:**\n• Add indexes on frequently queried columns (users.email, created_at fields)\n• Implement connection pooling if not already in place\n• Review and optimize slow queries\n\n**Monitoring:**\n• Set up query performance monitoring\n• Track connection usage patterns\n• Monitor database resource utilization\n\n**Best Practices:**\n• Use EXPLAIN ANALYZE to identify bottlenecks\n• Consider read replicas for heavy read workloads\n• Implement proper caching strategies\n\nWould you like me to help you create a specific action plan for any of these areas?",
      timestamp: new Date("2024-01-15T10:02:45Z"),
    },
  ]

  const followUpQuestions = [
    "How do I optimize SQL queries?",
    "What are the best practices for database indexing?",
    "Can you help me create a performance monitoring plan?",
  ]

  const mockKnowledge = [
    {
      id: 1,
      title: "AI Writing Toolkit Usage Guide",
      content:
        "The AI Writing Toolkit allows you to paraphrase text, check grammar, summarize content, and expand ideas. Simply enter your text and select the desired operation.",
      category: "FAQ",
      tags: ["writing", "toolkit", "help"],
      createdAt: "2024-01-10T09:00:00Z",
    },
    {
      id: 2,
      title: "Database Performance Best Practices",
      content:
        "When working with databases, always use indexes for frequently queried columns, normalize your data structure, and implement proper backup strategies. Monitor query performance regularly.",
      category: "Technical",
      tags: ["database", "performance", "optimization"],
      createdAt: "2024-01-12T14:30:00Z",
    },
    {
      id: 3,
      title: "Team Onboarding Process",
      content:
        "New team members should complete the technical setup checklist, attend orientation sessions, and be assigned a mentor for the first month.",
      category: "Procedures",
      tags: ["onboarding", "team", "process"],
      createdAt: "2024-01-08T11:15:00Z",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="h-8 w-8 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected to Neon PostgreSQL
            </Badge>
          </div>
          <h1 className="text-4xl font-bold">AI Assistant Chatbot</h1>
          <p className="text-muted-foreground mt-2">
            Chat with your personal AI assistant powered by your knowledge base
          </p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat Assistant
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Chat Assistant
                  <Badge variant="secondary" className="ml-auto">
                    {mockMessages.length} messages
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 pb-4">
                    {mockMessages.map((message, index) => (
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
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>

                        {message.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Follow-up Questions */}
                <div className="px-6 py-3 border-t bg-muted/30">
                  <p className="text-sm font-medium mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {followUpQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputMessage(question)}
                        className="text-xs"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-6 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="icon">
                      <Send className="h-4 w-4" />
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
          </TabsContent>

          <TabsContent value="knowledge">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Knowledge Base</h2>
                  <p className="text-muted-foreground">Manage your AI assistant's knowledge base</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Knowledge
                </Button>
              </div>

              {/* Knowledge Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockKnowledge.map((item) => (
                  <Card key={item.id} className="h-fit border-l-4 border-l-indigo-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{item.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-4 mb-3">{item.content}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-sm text-green-800">
                  <Database className="h-4 w-4" />
                  <span>✅ Knowledge base stored in Neon Database with full-text search capabilities</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
