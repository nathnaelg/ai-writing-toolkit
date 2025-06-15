"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@ai-tools/ui"
import { Database, Code, CheckCircle, XCircle, Loader2, Copy } from "lucide-react"

interface SqlQuery {
  id: string
  naturalLanguage: string
  generatedSql: string
  queryType: string
  database: string | null
  explanation: string | null
  isValid: boolean
  createdAt: string
}

export default function SqlGeneratorPage() {
  const [formData, setFormData] = useState({
    naturalLanguage: "",
    database: "",
    schema: "",
    queryType: "",
  })
  const [generatedSql, setGeneratedSql] = useState("")
  const [explanation, setExplanation] = useState("")
  const [queryType, setQueryType] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [queries, setQueries] = useState<SqlQuery[]>([])
  const [userId] = useState("user-demo-123") // In real app, get from auth

  useEffect(() => {
    fetchQueries()
  }, [])

  const fetchQueries = async () => {
    try {
      const response = await fetch(`/api/queries?userId=${userId}`)
      const data = await response.json()
      setQueries(data.queries || [])
    } catch (error) {
      console.error("Failed to fetch queries:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    if (!formData.naturalLanguage.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setGeneratedSql(data.generatedSql)
        setExplanation(data.explanation)
        setQueryType(data.queryType)
        setIsValid(data.isValid)
        fetchQueries() // Refresh queries list
      } else {
        console.error("Generation failed:", data.error)
      }
    } catch (error) {
      console.error("Generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const databases = [
    { value: "postgresql", label: "PostgreSQL" },
    { value: "mysql", label: "MySQL" },
    { value: "sqlite", label: "SQLite" },
    { value: "mssql", label: "SQL Server" },
    { value: "oracle", label: "Oracle" },
  ]

  const queryTypes = [
    { value: "SELECT", label: "SELECT" },
    { value: "INSERT", label: "INSERT" },
    { value: "UPDATE", label: "UPDATE" },
    { value: "DELETE", label: "DELETE" },
    { value: "CREATE", label: "CREATE" },
    { value: "ALTER", label: "ALTER" },
    { value: "JOIN", label: "JOIN" },
    { value: "AGGREGATE", label: "AGGREGATE" },
  ]

  const exampleQueries = [
    "Find all users who registered in the last 30 days",
    "Get the top 10 products by sales revenue",
    "Update all inactive users to active status",
    "Create a table for storing customer orders",
    "Calculate the average order value by month",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Database className="h-8 w-8 text-cyan-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI SQL Generator</h1>
          </div>
          <p className="text-gray-600">Generate SQL queries from natural language</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Query Request
              </CardTitle>
              <CardDescription>Describe what you want to query in plain English</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="naturalLanguage">Natural Language Query</Label>
                <Textarea
                  id="naturalLanguage"
                  placeholder="e.g., Find all customers who made purchases in the last month"
                  value={formData.naturalLanguage}
                  onChange={(e) => handleInputChange("naturalLanguage", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="database">Database Type (Optional)</Label>
                  <Select value={formData.database} onValueChange={(value) => handleInputChange("database", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select database" />
                    </SelectTrigger>
                    <SelectContent>
                      {databases.map((db) => (
                        <SelectItem key={db.value} value={db.value}>
                          {db.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="queryType">Expected Query Type (Optional)</Label>
                  <Select value={formData.queryType} onValueChange={(value) => handleInputChange("queryType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {queryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="schema">Schema Information (Optional)</Label>
                <Textarea
                  id="schema"
                  placeholder="Describe your database schema, table names, column names, relationships..."
                  value={formData.schema}
                  onChange={(e) => handleInputChange("schema", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!formData.naturalLanguage.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating SQL...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Generate SQL
                  </>
                )}
              </Button>

              {/* Example Queries */}
              <div className="space-y-2">
                <Label>Example Queries:</Label>
                <div className="space-y-1">
                  {exampleQueries.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleInputChange("naturalLanguage", example)}
                      className="text-left text-sm text-blue-600 hover:text-blue-800 block w-full p-2 rounded hover:bg-blue-50"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated SQL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                
              </CardTitle>
              <CardDescription>AI-generated SQL query and explanation</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedSql ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{queryType}</Badge>
                    <Badge variant={isValid ? "default" : "destructive"}>
                      {isValid ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Valid
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Check Required
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{generatedSql}</pre>
                  </div>

                  {explanation && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                      <p className="text-blue-800 text-sm">{explanation}</p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(generatedSql)}
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy SQL
                  </Button>
                </div>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center text-gray-500">
                  Generated SQL will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Query History */}
        {queries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Query History</CardTitle>
              <CardDescription>Your previously generated SQL queries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queries.slice(0, 5).map((query) => (
                  <div key={query.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{query.queryType}</Badge>
                        <Badge variant={query.isValid ? "default" : "destructive"}>
                          {query.isValid ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Valid
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1 h-3 w-3" />
                              Check Required
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{query.generatedSql}</pre>
                    </div>
                    {query.explanation && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                        <p className="text-blue-800 text-sm">{query.explanation}</p>
                      </div>
                    )}
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
