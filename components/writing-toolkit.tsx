"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, RotateCcw, FileText, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProcessingResult {
  originalText: string
  processedText: string
  operation: string
  wordCount: {
    original: number
    processed: number
  }
}

export default function WritingToolkit() {
  const [inputText, setInputText] = useState("")
  const [operation, setOperation] = useState<"paraphrase" | "grammar" | "summarize" | "expand">("paraphrase")
  const [tone, setTone] = useState<"formal" | "casual" | "academic" | "creative">("formal")
  const [result, setResult] = useState<ProcessingResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleProcess = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to process.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/process-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          operation,
          tone,
          userId: "demo-user", // In a real app, this would come from authentication
        }),
      })

      if (!response.ok) throw new Error("Processing failed")

      const data = await response.json()
      setResult(data)
      toast({
        title: "Success",
        description: `Text ${operation} completed successfully!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = async () => {
    if (result?.processedText) {
      await navigator.clipboard.writeText(result.processedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      })
    }
  }

  const handleReset = () => {
    setInputText("")
    setResult(null)
    setCopied(false)
  }

  const operationLabels = {
    paraphrase: "Paraphrase",
    grammar: "Grammar Check",
    summarize: "Summarize",
    expand: "Expand",
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Writing Toolkit</h1>
        <p className="text-muted-foreground">
          Enhance your writing with AI-powered paraphrasing, grammar checking, and more
        </p>
      </div>

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
              <Select value={operation} onValueChange={(value: any) => setOperation(value)}>
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

              <Select value={tone} onValueChange={(value: any) => setTone(value)}>
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
              <Button onClick={handleProcess} disabled={isProcessing || !inputText.trim()} className="flex-1">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `${operationLabels[operation]} Text`
                )}
              </Button>

              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {inputText && (
              <div className="text-sm text-muted-foreground">
                Word count: {inputText.split(" ").filter((word) => word.length > 0).length}
              </div>
            )}
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
              {result && (
                <Badge variant="secondary">{operationLabels[result.operation as keyof typeof operationLabels]}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result ? (
              <>
                <div className="bg-muted p-4 rounded-lg min-h-[200px] whitespace-pre-wrap">{result.processedText}</div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Word count: {result.wordCount.processed}
                    {result.wordCount.original !== result.wordCount.processed && (
                      <span className="ml-1">
                        ({result.wordCount.processed > result.wordCount.original ? "+" : ""}
                        {result.wordCount.processed - result.wordCount.original})
                      </span>
                    )}
                  </span>

                  <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-2">
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="bg-muted p-4 rounded-lg min-h-[200px] flex items-center justify-center text-muted-foreground">
                Your processed text will appear here...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
