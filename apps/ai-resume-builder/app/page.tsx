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
import { FileIcon as FileUser, Briefcase, GraduationCap, Star, Loader2, Download } from "lucide-react"

interface Resume {
  id: string
  title: string
  jobTitle: string
  industry: string | null
  generatedResume: string
  createdAt: string
}

export default function ResumeBuilderPage() {
  const [formData, setFormData] = useState({
    title: "",
    jobTitle: "",
    industry: "",
    experience: "",
    skills: "",
    education: "",
    targetJob: "",
  })
  const [generatedResume, setGeneratedResume] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [userId] = useState("user-demo-123")

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const response = await fetch(`/api/resumes?userId=${userId}`)
      const data = await response.json()
      setResumes(data.resumes || [])
    } catch (error) {
      console.error("Failed to fetch resumes:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.experience || !formData.skills) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setGeneratedResume(data.generatedResume)
        fetchResumes()
      } else {
        console.error("Generation failed:", data.error)
        alert("Generation failed. Please try again.")
      }
    } catch (error) {
      console.error("Generation error:", error)
      alert("Generation failed. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Sales",
    "Engineering",
    "Design",
    "Consulting",
    "Other",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <FileUser className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Resume Builder</h1>
          </div>
          <p className="text-gray-600">Create professional resumes with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Resume Information
              </CardTitle>
              <CardDescription>Fill in your details to generate a professional resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Resume Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Software Engineer Resume"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Current/Target Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Software Engineer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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
                <div>
                  <Label htmlFor="targetJob">Target Job (Optional)</Label>
                  <Input
                    id="targetJob"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.targetJob}
                    onChange={(e) => handleInputChange("targetJob", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your work experience, including job titles, companies, dates, and key achievements..."
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  placeholder="List your technical and soft skills, separated by commas..."
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  placeholder="Include your educational background, degrees, institutions, and graduation dates..."
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!formData.jobTitle || !formData.experience || !formData.skills || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Resume...
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Generate Resume
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Resume */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Generated Resume
              </CardTitle>
              <CardDescription>Your AI-generated professional resume</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedResume ? (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-lg border max-h-[500px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{generatedResume}</pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(generatedResume)}
                      className="flex-1"
                    >
                      Copy Resume
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const blob = new Blob([generatedResume], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `${formData.title || "resume"}.txt`
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
                  Generated resume will appear here
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Previous Resumes */}
        {resumes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Resumes</CardTitle>
              <CardDescription>Previously generated resumes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumes.map((resume) => (
                  <div key={resume.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{resume.title}</h3>
                      <Badge variant="secondary">{resume.jobTitle}</Badge>
                    </div>
                    {resume.industry && (
                      <Badge variant="outline" className="text-xs">
                        {resume.industry}
                      </Badge>
                    )}
                    <p className="text-sm text-gray-500">Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGeneratedResume(resume.generatedResume)}
                      className="w-full"
                    >
                      View Resume
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
