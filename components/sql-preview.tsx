"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Database, Code, CheckCircle, AlertTriangle, History } from "lucide-react"

export default function SqlGeneratorPreview() {
  const [naturalLanguage, setNaturalLanguage] = useState(
    "Show me all users who signed up in the last 7 days and have made at least one purchase",
  )
  const [database, setDatabase] = useState("PostgreSQL")

  const mockResult = {
    generatedSql: `SELECT DISTINCT u.id, u.email, u.name, u.created_at, 
       COUNT(o.id) as total_orders,
       SUM(o.total_amount) as total_spent
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= NOW() - INTERVAL '7 days'
  AND o.created_at IS NOT NULL
GROUP BY u.id, u.email, u.name, u.created_at
HAVING COUNT(o.id) >= 1
ORDER BY u.created_at DESC;`,
    explanation:
      "This query finds all users who registered within the last 7 days and have made at least one purchase. It joins the users and orders tables, filters by registration date, groups by user details, and ensures each user has at least one order using the HAVING clause.",
    queryType: "SELECT",
    isValid: true,
    suggestions: [
      "Consider adding an index on users.created_at for better performance",
      "You might want to add a date range filter for orders as well",
      "Consider using a LEFT JOIN if you want to include users with zero orders",
    ],
  }

  const mockHistory = [
    {
      id: 1,
      naturalLanguage: "Get top 10 products by sales revenue",
      generatedSql: "SELECT p.name, SUM(oi.quantity * oi.price) as revenue FROM products p...",
      queryType: "SELECT",
      database: "PostgreSQL",
      createdAt: "2024-01-14T16:20:00Z",
    },
    {
      id: 2,
      naturalLanguage: "Update user email where user ID is 123",
      generatedSql: "UPDATE users SET email = 'new@email.com' WHERE id = 123;",
      queryType: "UPDATE",
      database: "PostgreSQL",
      createdAt: "2024-01-14T15:45:00Z",
    },
  ]

  const examples = [
    "Show me all users who signed up last week",
    "Find the top 10 products by sales revenue",
    "Get all orders with their customer information",
    "Update user email where user ID is 123",
    "Delete all inactive users from last year",
    "Create a table for storing product reviews",
  ]

  const queryTypeColors = {
    SELECT: "bg-blue-100 text-blue-800",
    INSERT: "bg-green-100 text-green-800",
    UPDATE: "bg-yellow-100 text-yellow-800",
    DELETE: "bg-red-100 text-red-800",
    CREATE: "bg-purple-100 text-purple-800",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="h-8 w-8 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected to Neon PostgreSQL
            </Badge>
          </div>
          <h1 className="text-4xl font-bold">AI SQL Generator</h1>
          <p className="text-muted-foreground mt-2">Convert natural language to SQL queries with AI assistance</p>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="generator">SQL Generator</TabsTrigger>
            <TabsTrigger value="history">Query History</TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
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
                    <Textarea
                      placeholder="Describe what you want to query in plain English..."
                      value={naturalLanguage}
                      onChange={(e) => setNaturalLanguage(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Quick Examples</p>
                    <div className="flex flex-wrap gap-2">
                      {examples.map((example, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setNaturalLanguage(example)}
                          className="text-xs"
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Select value={database} onValueChange={setDatabase}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                        <SelectItem value="MySQL">MySQL</SelectItem>
                        <SelectItem value="SQLite">SQLite</SelectItem>
                        <SelectItem value="SQL Server">SQL Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Code className="mr-2 h-4 w-4" />
                    Generate SQL
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
                    <div className="flex items-center gap-2">
                      <Badge className={queryTypeColors[mockResult.queryType as keyof typeof queryTypeColors]}>
                        {mockResult.queryType}
                      </Badge>
                      {mockResult.isValid ? (
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
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* SQL Query */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">SQL Query</h4>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm font-mono whitespace-pre-wrap">{mockResult.generatedSql}</pre>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Explanation</h4>
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <p className="text-sm">{mockResult.explanation}</p>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Optimization Suggestions</h4>
                      <ul className="space-y-1">
                        {mockResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-sm text-green-800">
                        <Database className="h-4 w-4" />
                        <span>✅ Query saved to Neon Database</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Query History
                  <Badge variant="outline" className="ml-auto">
                    From Neon DB
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHistory.map((query) => (
                    <Card key={query.id} className="border-l-4 border-l-cyan-500">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={queryTypeColors[query.queryType as keyof typeof queryTypeColors]}>
                                {query.queryType}
                              </Badge>
                              <Badge variant="outline">{query.database}</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(query.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Natural Language:</p>
                            <p className="text-sm bg-muted p-2 rounded">{query.naturalLanguage}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Generated SQL:</p>
                            <div className="flex items-start gap-2">
                              <code className="text-sm bg-cyan-50 p-2 rounded flex-1 font-mono">
                                {query.generatedSql.length > 100
                                  ? `${query.generatedSql.substring(0, 100)}...`
                                  : query.generatedSql}
                              </code>
                              <Button variant="ghost" size="sm">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
