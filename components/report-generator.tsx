"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, FileText, Target, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReportResult {
  generatedReport: string
  executiveSummary: string
  keyPoints: string[]
  wordCount: number
  reportId: string
}

export default function ReportGenerator() {
  const [formData, setFormData] = useState({
    title: "",
    reportType: "",
    bulletPoints: "",
    tone: "Professional",
    audience: "",
  })
  const [result, setResult] = useState<ReportResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const reportTypes = [
    { value: "MEETING_SUMMARY", label: "Meeting Summary" },
    { value: "PROJECT_UPDATE", label: "Project Update" },
    { value: "WEEKLY_REPORT", label: "Weekly Report" },
    { value: "INCIDENT_REPORT", label: "Incident Report" },
    { value: "BUSINESS_PROPOSAL", label: "Business Proposal" },
    { value: "RESEARCH_SUMMARY", label: "Research Summary" },
  ]

  const tones = ["Professional", "Formal", "Casual", "Technical", "Executive"]
  const audiences = ["Management", "Team Members", "Clients", "Stakeholders", "Technical Team", "General"]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    if (!formData.title || !formData.reportType || !formData.bulletPoints) {
      toast({
        title: "Error",
        description: "Please fill in title, report type, and bullet points.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-report", {
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
        description: "Report generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = () => {
    if (result?.generatedReport) {
      const blob = new Blob([result.generatedReport], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${formData.title.replace(/\s+/g, "_")}_report.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Report Generator</h1>
        <p className="text-muted-foreground">Transform bullet points into comprehensive professional reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                placeholder="e.g., Q4 Project Status Update"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="tone" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Tone
                </Label>
                <Select value={formData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Target Audience
                </Label>
                <Select value={formData.audience} onValueChange={(value) => handleInputChange("audience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((audience) => (
                      <SelectItem key={audience} value={audience}>
                        {audience}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulletPoints">Bullet Points / Notes</Label>
              <Textarea
                id="bulletPoints"
                placeholder={`Enter your bullet points or notes here, for example:
• Completed user authentication module
• Fixed 15 critical bugs in payment system
• Team velocity increased by 20%
• Need to address database performance issues
• Planning to implement new feature next sprint`}
                value={formData.bulletPoints}
                onChange={(e) => handleInputChange("bulletPoints", e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.title || !formData.reportType || !formData.bulletPoints}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Report
              </span>
              {result && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{result.wordCount} words</Badge>
                  <Button variant="outline" size="sm" onClick={downloadReport}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {/* Executive Summary */}
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Executive Summary</h4>
                  <p className="text-sm text-muted-foreground">{result.executiveSummary}</p>
                </div>

                {/* Key Points */}
                <div className="space-y-2">
                  <h4 className="font-medium">Key Points</h4>
                  <ul className="space-y-1">
                    {result.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Full Report */}
                <div className="space-y-2">
                  <h4 className="font-medium">Full Report</h4>
                  <div className="bg-muted p-4 rounded-lg max-h-[400px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{result.generatedReport}</pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-muted p-8 rounded-lg text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your generated report will appear here...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
