"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, RotateCcw, FileText, CheckCircle, History, TrendingUp, Database } from "lucide-react"

export default function WritingToolkitPreview() {
  const [inputText, setInputText] = useState(
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for testing.",
  )
  const [operation, setOperation] = useState("paraphrase")
  const [tone, setTone] = useState("formal")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState({
    processedText:
      "The swift brown fox leaps over the sluggish canine. This phrase encompasses all alphabetic characters and is frequently utilized for examination purposes.",
    wordCount: { original: 23, processed: 21 },
  })

  const mockHistory = [
    {
      id: 1,
      originalText: "AI is changing the world rapidly.",
      processedText: "Artificial Intelligence is transforming the global landscape at an unprecedented pace.",
      operation: "expand",
      tone: "academic",
      createdAt: "2024-01-15T10:30:00Z",
      wordCount: { original: 6, processed: 12 },
    },
    {
      id: 2,
      originalText: "The meeting was productive and we made good progress on the project.",
      processedText: "The meeting was effective and we achieved significant advancement on the project.",
      operation: "paraphrase",
      tone: "professional",
      createdAt: "2024-01-15T09:15:00Z",
      wordCount: { original: 12, processed: 11 },
    },
  ]

  const mockStats = {
    totalProcessed: 47,
    totalWordsProcessed: 1250,
    operationCounts: {
      paraphrase: 18,
      grammar: 12,
      summarize: 10,
      expand: 7,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="h-8 w-8 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected to Neon PostgreSQL
            </Badge>
          </div>
          <h1 className="text-4xl font-bold">AI Writing Toolkit</h1>
          <p className="text-muted-foreground mt-2">
            Enhance your writing with AI-powered paraphrasing, grammar checking, and more
          </p>
        </div>

        <Tabs defaultValue="toolkit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="toolkit">Writing Toolkit</TabsTrigger>
            <TabsTrigger value="history">History & Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="toolkit">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Input Text
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={operation} onValueChange={setOperation}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paraphrase">Paraphrase</SelectItem>
                        <SelectItem value="grammar">Grammar Check</SelectItem>
                        <SelectItem value="summarize">Summarize</SelectItem>
                        <SelectItem value="expand">Expand</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsProcessing(!isProcessing)}
                      disabled={!inputText.trim()}
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `${operation.charAt(0).toUpperCase() + operation.slice(1)} Text`
                      )}
                    </Button>

                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Word count: {inputText.split(" ").filter((word) => word.length > 0).length}
                  </div>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Processed Text
                    </span>
                    <Badge variant="secondary">{operation}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg min-h-[200px] whitespace-pre-wrap">
                    {result.processedText}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Word count: {result.wordCount.processed}
                      <span className="ml-1 text-green-600">
                        ({result.wordCount.processed > result.wordCount.original ? "+" : ""}
                        {result.wordCount.processed - result.wordCount.original})
                      </span>
                    </span>

                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <Database className="h-4 w-4" />
                      <span>✅ Saved to Neon Database</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-2xl font-bold">{mockStats.totalProcessed}</p>
                        <p className="text-sm text-muted-foreground">Total Processed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-2xl font-bold">{mockStats.totalWordsProcessed}</p>
                        <p className="text-sm text-muted-foreground">Words Processed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <History className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Most Used</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(mockStats.operationCounts)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 2)
                          .map(([operation, count]) => (
                            <Badge key={operation} variant="secondary" className="text-xs">
                              {operation}: {count}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* History List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Processing History
                    <Badge variant="outline" className="ml-auto">
                      From Neon DB
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockHistory.map((record) => (
                      <Card key={record.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-100 text-blue-800">{record.operation}</Badge>
                              <Badge variant="outline">{record.tone}</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(record.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Original:</p>
                              <p className="text-sm bg-muted p-2 rounded">{record.originalText}</p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Processed:</p>
                              <div className="flex items-start gap-2">
                                <p className="text-sm bg-blue-50 p-2 rounded flex-1">{record.processedText}</p>
                                <Button variant="ghost" size="sm">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>
                                Words: {record.wordCount.original} → {record.wordCount.processed}
                              </span>
                              <span className="text-green-600">
                                {record.wordCount.processed > record.wordCount.original ? "+" : ""}
                                {record.wordCount.processed - record.wordCount.original} words
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
