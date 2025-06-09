"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, FileText, Star, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ResumeResult {
  generatedResume: string
  suggestions: string[]
  matchScore: number
  resumeId: string
}

export default function ResumeBuilder() {
  const [formData, setFormData] = useState({
    title: "",
    jobTitle: "",
    industry: "",
    experience: "",
    skills: "",
    education: "",
    targetJob: "",
  })
  const [result, setResult] = useState<ResumeResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Sales",
    "Engineering",
    "Design",
    "Operations",
    "Consulting",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.experience || !formData.skills) {
      toast({
        title: "Error",
        description: "Please fill in job title, experience, and skills.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-resume", {
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
        description: "Resume generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadResume = () => {
    if (result?.generatedResume) {
      const blob = new Blob([result.generatedResume], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${formData.title || "resume"}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Resume Builder</h1>
        <p className="text-muted-foreground">Create professional resumes tailored to your target role</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Resume Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resume Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Developer Resume"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Current/Target Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g., Software Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Professional Experience</Label>
              <Textarea
                id="experience"
                placeholder="Describe your work experience, achievements, and responsibilities..."
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills & Technologies</Label>
              <Textarea
                id="skills"
                placeholder="List your technical and soft skills..."
                value={formData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                placeholder="Your educational background, degrees, certifications..."
                value={formData.education}
                onChange={(e) => handleInputChange("education", e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetJob">Target Job Description (Optional)</Label>
              <Textarea
                id="targetJob"
                placeholder="Paste the job description you're targeting for better optimization..."
                value={formData.targetJob}
                onChange={(e) => handleInputChange("targetJob", e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.jobTitle || !formData.experience || !formData.skills}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Resume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Resume
              </span>
              {result && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {result.matchScore}% Match
                  </Badge>
                  <Button variant="outline" size="sm" onClick={downloadResume}>
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
                <div className="bg-muted p-4 rounded-lg max-h-[400px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{result.generatedResume}</pre>
                </div>

                {result.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Improvement Suggestions:</h4>
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
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your generated resume will appear here...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
