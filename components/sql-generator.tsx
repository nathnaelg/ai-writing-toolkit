"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, Database, Code, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SqlResult {
  generatedSql: string
  explanation: string
  queryType: string
  isValid: boolean
  suggestions: string[]
  queryId: string
}

export default function SqlGenerator() {
  const [formData, setFormData] = useState({
    naturalLanguage: "",
    database: "PostgreSQL",
    schema: "",
  })
  const [result, setResult] = useState<SqlResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const databases = ["PostgreSQL", "MySQL", "SQLite", "SQL Server", "Oracle", "MongoDB"]

  const examples = [
    "Show me all users who signed up last week",
    "Find the top 10 products by sales revenue",
    "Get all orders with their customer information",
    "Update user email where user ID is 123",
    "Delete all inactive users from last year",
    "Create a table for storing product reviews",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    if (!formData.naturalLanguage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a natural language query.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: "demo-user-1",
        }),
      })

      if (!response.ok) throw new Error("Generation failed")

      const data = await response.json()
      setResult(data)
      toast({
        title: "Success",
        description: "SQL query generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate SQL. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (result?.generatedSql) {
      await navigator.clipboard.writeText(result.generatedSql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "SQL query copied to clipboard.",
      })
    }
  }

  const handleExampleClick = (example: string) => {
    setFormData((prev) => ({ ...prev, naturalLanguage: example }))
  }

  const queryTypeColors = {
    SELECT: "bg-blue-100 text-blue-800",
    INSERT: "bg-green-100 text-green-800",
    UPDATE: "bg-yellow-100 text-yellow-800",
    DELETE: "bg-red-100 text-red-800",
    CREATE: "bg-purple-100 text-purple-800",
    ALTER: "bg-orange-100 text-orange-800",
    JOIN: "bg-indigo-100 text-indigo-800",
    AGGREGATE: "bg-pink-100 text-pink-800",
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI SQL Generator</h1>
        <p className="text-muted-foreground">Convert natural language to SQL queries with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Query Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="naturalLanguage">Natural Language Query</Label>
              <Textarea
                id="naturalLanguage"
                placeholder="Describe what you want to query in plain English..."
                value={formData.naturalLanguage}
                onChange={(e) => handleInputChange("naturalLanguage", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Quick Examples</Label>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExampleClick(example)}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="database">Database Type</Label>
              <Select value={formData.database} onValueChange={(value) => handleInputChange("database", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {databases.map((db) => (
                    <SelectItem key={db} value={db}>
                      {db}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schema">Database Schema (Optional)</Label>
              <Textarea
                id="schema"
                placeholder={`Provide your database schema for better results:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  created_at TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10,2)
);`}
                value={formData.schema}
                onChange={(e) => handleInputChange("schema", e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.naturalLanguage.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating SQL...
                </>
              ) : (
                <>
                  <Code className="mr-2 h-4 w-4" />
                  Generate SQL
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated SQL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Generated SQL
              </span>
              {result && (
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      queryTypeColors[result.queryType as keyof typeof queryTypeColors] || "bg-gray-100 text-gray-800"
                    }
                  >
                    {result.queryType}
                  </Badge>
                  {result.isValid ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Review
                    </Badge>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {/* SQL Query */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">SQL Query</h4>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm font-mono whitespace-pre-wrap">{result.generatedSql}</pre>
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-2">
                  <h4 className="font-medium">Explanation</h4>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="text-sm">{result.explanation}</p>
                  </div>
                </div>

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Suggestions</h4>
                    <ul className="space-y-1">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-muted p-8 rounded-lg text-center text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your generated SQL query will appear here...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
