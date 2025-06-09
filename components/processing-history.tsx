"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, TrendingUp, FileText, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HistoryRecord {
  id: number
  original_text: string
  processed_text: string
  operation: string
  tone?: string
  created_at: string
  word_count_original: number
  word_count_processed: number
}

interface ProcessingStats {
  totalProcessed: number
  operationCounts: Record<string, number>
  totalWordsProcessed: number
}

export default function ProcessingHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [stats, setStats] = useState<ProcessingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history?userId=demo-user&limit=20")
      if (!response.ok) throw new Error("Failed to fetch history")

      const data = await response.json()
      setHistory(data.history)
      setStats(data.stats)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load processing history.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    })
  }

  const operationColors = {
    paraphrase: "bg-blue-100 text-blue-800",
    grammar: "bg-green-100 text-green-800",
    summarize: "bg-purple-100 text-purple-800",
    expand: "bg-orange-100 text-orange-800",
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalProcessed}</p>
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
                  <p className="text-2xl font-bold">{stats.totalWordsProcessed}</p>
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
                  {Object.entries(stats.operationCounts)
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
      )}

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Processing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No processing history found. Start by processing some text!
                </p>
              ) : (
                history.map((record) => (
                  <Card key={record.id} className="border-l-4 border-l-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              operationColors[record.operation as keyof typeof operationColors] ||
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {record.operation}
                          </Badge>
                          {record.tone && <Badge variant="outline">{record.tone}</Badge>}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Original:</p>
                          <p className="text-sm bg-muted p-2 rounded">
                            {record.original_text.length > 150
                              ? `${record.original_text.substring(0, 150)}...`
                              : record.original_text}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Processed:</p>
                          <div className="flex items-start gap-2">
                            <p className="text-sm bg-primary/5 p-2 rounded flex-1">
                              {record.processed_text.length > 150
                                ? `${record.processed_text.substring(0, 150)}...`
                                : record.processed_text}
                            </p>
                            <Button variant="ghost" size="sm" onClick={() => handleCopy(record.processed_text)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Words: {record.word_count_original} → {record.word_count_processed}
                          </span>
                          <span>
                            {record.word_count_processed > record.word_count_original ? "+" : ""}
                            {record.word_count_processed - record.word_count_original} words
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
