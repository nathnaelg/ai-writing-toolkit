"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@ai-tools/ui"
import { FileText, Zap, BarChart3, Clock, Loader2, Copy, RotateCcw } from "lucide-react"

interface ProcessingHistory {
  id: number
  operation: string
  originalText: string
  processedText: string
  tone: string | null
  wordCountOriginal: number
  wordCountProcessed: number
  createdAt: string
}

interface ProcessingStats {
  totalProcessed: number
  totalWordsProcessed: number
  operationCounts: Record<string, number>
}

const baseUrl = process.env.NODE_ENV === "development"
  ? "http://localhost:3001"
  : ""

export default function WritingToolkitPage() {
  const [text, setText] = useState("")
  const [operation, setOperation] = useState("")
  const [tone, setTone] = useState("")
  const [processedText, setProcessedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState<ProcessingHistory[]>([])
  const [stats, setStats] = useState<ProcessingStats | null>(null)
  const [userId] = useState("user-demo-123")

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/history?userId=${userId}&limit=5`)
      const data = await response.json()
      setHistory(data.history || [])
      setStats(data.stats || null)
    } catch (error) {
      console.error("Failed to fetch history:", error)
    }
  }

  const handleProcess = async () => {
    if (!text.trim() || !operation) return

    setIsProcessing(true)
    try {
      const response = await fetch(`${baseUrl}/api/process-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          operation,
          tone: tone || undefined,
          userId,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setProcessedText(data.processedText)
        fetchHistory()
      } else {
        console.error("Processing failed:", data.error)
        alert("Processing failed. Please try again.")
      }
    } catch (error) {
      console.error("Processing error:", error)
      alert("Processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = async () => {
    if (processedText) {
      await navigator.clipboard.writeText(processedText)
      alert("Text copied to clipboard!")
    }
  }

  const handleReset = () => {
    setText("")
    setProcessedText("")
    setOperation("")
    setTone("")
  }

  const operations = [
    { value: "summarize", label: "Summarize" },
    { value: "expand", label: "Expand" },
    { value: "rewrite", label: "Rewrite" },
    { value: "grammar", label: "Fix Grammar" },
    { value: "tone", label: "Adjust Tone" },
  ]

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "friendly", label: "Friendly" },
    { value: "formal", label: "Formal" },
    { value: "creative", label: "Creative" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Writing Toolkit</h1>
          </div>
          <p className="text-gray-600">Transform your text with AI-powered writing tools</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Processed</p>
                    <p className="text-2xl font-bold">{stats.totalProcessed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Words Processed</p>
                    <p className="text-2xl font-bold">{stats.totalWordsProcessed.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Most Used</p>
                    <p className="text-lg font-bold">
                      {Object.entries(stats.operationCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "None"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>Enter the text you want to process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Operation</label>
                  <Select value={operation} onValueChange={setOperation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      {operations.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tone (Optional)</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleProcess}
                  disabled={!text.trim() || !operation || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process Text"
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {text && (
                <div className="text-sm text-gray-600">
                  Word count: {text.split(/\s+/).filter((word) => word.length > 0).length}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Processed Text</CardTitle>
              <CardDescription>AI-enhanced version of your text</CardDescription>
            </CardHeader>
            <CardContent>
              {processedText ? (
                <div className="space-y-4">
                  <Textarea value={processedText} readOnly className="min-h-[200px]" />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Word count: {processedText.split(/\s+/).filter((word) => word.length > 0).length}
                    </p>
                    <Button variant="outline" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[200px] flex items-center justify-center text-gray-500">
                  Processed text will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent History */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Processing History</CardTitle>
              <CardDescription>Your last 5 text processing operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{item.operation}</Badge>
                        {item.tone && <Badge variant="outline">{item.tone}</Badge>}
                      </div>
                      <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.originalText.substring(0, 100)}...</p>
                    <p className="text-xs text-gray-500">
                      {item.wordCountOriginal} → {item.wordCountProcessed} words
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
