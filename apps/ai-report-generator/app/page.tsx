"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@ai-tools/ui"
import { FileBarChart, Target, Users, TimerIcon as Tone, Loader2, Download } from "lucide-react"

interface Report {
  id: string
  title: string
  reportType: string
  tone: string | null
  audience: string | null
  generatedReport: string
  createdAt: string
}

export default function ReportGeneratorPage() {
  const [formData, setFormData] = useState({
    title: "",
    reportType: "",
    bulletPoints: "",
    tone: "",
    audience: "",
  })
  const [generatedReport, setGeneratedReport] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<Report[]>([])
  const [userId] = useState("user-demo-123") // In real app, get from auth

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/reports?userId=${userId}`)
      const data = await response.json()
      setReports(data.reports || [])
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    if (!formData.title || !formData.reportType || !formData.bulletPoints) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setGeneratedReport(data.generatedReport)
        fetchReports() // Refresh reports list
      } else {
        console.error("Generation failed:", data.error)
      }
    } catch (error) {
      console.error("Generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const reportTypes = [
    { value: "MEETING_SUMMARY", label: "Meeting Summary" },
    { value: "PROJECT_UPDATE", label: "Project Update" },
    { value: "WEEKLY_REPORT", label: "Weekly Report" },
    { value: "INCIDENT_REPORT", label: "Incident Report" },
    { value: "BUSINESS_PROPOSAL", label: "Business Proposal" },
    { value: "RESEARCH_SUMMARY", label: "Research Summary" },
  ]

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "technical", label: "Technical" },
    { value: "executive", label: "Executive" },
  ]

  const audiences = [
    { value: "executives", label: "Executives" },
    { value: "team_members", label: "Team Members" },
    { value: "clients", label: "Clients" },
    { value: "stakeholders", label: "Stakeholders" },
    { value: "general", label: "General Audience" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <FileBarChart className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Report Generator</h1>
          </div>
          <p className="text-gray-600">Generate professional reports with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Report Details
              </CardTitle>
              <CardDescription>Provide the key information for your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Q4 Project Status Update"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={formData.reportType} onValueChange={(value) => handleInputChange("reportType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tone">Tone (Optional)</Label>
                  <Select value={formData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="audience">Target Audience (Optional)</Label>
                  <Select value={formData.audience} onValueChange={(value) => handleInputChange("audience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map((audience) => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bulletPoints">Key Points</Label>
                <Textarea
                  id="bulletPoints"
                  placeholder="Enter the main points you want to include in your report. Each point on a new line or separated by bullet points..."
                  value={formData.bulletPoints}
                  onChange={(e) => handleInputChange("bulletPoints", e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!formData.title || !formData.reportType || !formData.bulletPoints || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileBarChart className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Generated Report
              </CardTitle>
              <CardDescription>Your AI-generated professional report</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedReport ? (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border max-h-[500px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{generatedReport}</pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(generatedReport)}
                      className="flex-1"
                    >
                      Copy Report
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const blob = new Blob([generatedReport], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `${formData.title || "report"}.txt`
                        a.click()
                      }}
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center text-gray-500">
                  Generated report will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Previous Reports */}
        {reports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Reports</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{report.title}</h3>
                      <Badge variant="secondary">{report.reportType.replace("_", " ")}</Badge>
                    </div>
                    <div className="flex gap-2">
                      {report.tone && (
                        <Badge variant="outline" className="text-xs">
                          <Tone className="mr-1 h-3 w-3" />
                          {report.tone}
                        </Badge>
                      )}
                      {report.audience && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="mr-1 h-3 w-3" />
                          {report.audience.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Created: {new Date(report.createdAt).toLocaleDateString()}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGeneratedReport(report.generatedReport)}
                      className="w-full"
                    >
                      View Report
                    </Button>
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
