"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Star, Briefcase, Database, History } from "lucide-react"

export default function ResumeBuilderPreview() {
  const [formData, setFormData] = useState({
    title: "Senior Software Engineer Resume",
    jobTitle: "Senior Software Engineer",
    industry: "Technology",
    experience:
      "5+ years of full-stack development experience with React, Node.js, and PostgreSQL. Led team of 4 developers on e-commerce platform serving 100K+ users. Implemented CI/CD pipelines reducing deployment time by 60%.",
    skills: "JavaScript, TypeScript, React, Node.js, PostgreSQL, AWS, Docker, Kubernetes, Git, Agile/Scrum",
    education:
      "Bachelor of Science in Computer Science, University of Technology (2019). Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering.",
    targetJob:
      "Looking for Senior Software Engineer role at a fast-growing tech company focused on scalable web applications.",
  })

  const mockResult = {
    generatedResume: `# John Doe
## Senior Software Engineer

📧 john.doe@email.com | 📱 (555) 123-4567 | 🌐 linkedin.com/in/johndoe | 📍 San Francisco, CA

### Professional Summary
Experienced Senior Software Engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and PostgreSQL. Proven track record of leading development teams and implementing scalable solutions for high-traffic applications. Passionate about clean code, performance optimization, and mentoring junior developers.

### Core Skills
**Frontend:** JavaScript, TypeScript, React, HTML5, CSS3, Redux
**Backend:** Node.js, Express.js, RESTful APIs, GraphQL
**Database:** PostgreSQL, MongoDB, Redis
**Cloud & DevOps:** AWS, Docker, Kubernetes, CI/CD Pipelines
**Tools:** Git, Agile/Scrum, JIRA, VS Code

### Professional Experience

**Senior Software Engineer** | TechCorp Inc. | 2021 - Present
• Led a team of 4 developers in building and maintaining e-commerce platform serving 100K+ active users
• Implemented CI/CD pipelines using GitHub Actions and AWS, reducing deployment time by 60%
• Architected microservices infrastructure resulting in 40% improvement in application performance
• Mentored 3 junior developers, contributing to their promotion within 18 months

**Software Engineer** | StartupXYZ | 2019 - 2021
• Developed responsive web applications using React and Node.js
• Collaborated with product team to define technical requirements and user stories
• Optimized database queries resulting in 25% faster page load times
• Participated in code reviews and maintained 95% test coverage

### Education
**Bachelor of Science in Computer Science**
University of Technology | 2015 - 2019
• Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering
• Dean's List: Fall 2018, Spring 2019

### Additional Skills & Certifications
• AWS Certified Solutions Architect - Associate (2022)
• Agile/Scrum methodology expertise
• Strong problem-solving and analytical skills
• Excellent communication and leadership abilities`,
    suggestions: [
      "Add specific metrics and KPIs to quantify your achievements",
      "Include links to your GitHub profile and portfolio projects",
      "Consider adding a technical projects section showcasing your best work",
    ],
    matchScore: 92,
  }

  const mockHistory = [
    {
      id: 1,
      title: "Frontend Developer Resume",
      jobTitle: "Frontend Developer",
      industry: "Technology",
      createdAt: "2024-01-14T15:30:00Z",
    },
    {
      id: 2,
      title: "Full Stack Engineer Resume",
      jobTitle: "Full Stack Engineer",
      industry: "Fintech",
      createdAt: "2024-01-12T10:15:00Z",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="h-8 w-8 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected to Neon PostgreSQL
            </Badge>
          </div>
          <h1 className="text-4xl font-bold">AI Resume Builder</h1>
          <p className="text-muted-foreground mt-2">Create professional resumes tailored to your target role</p>
        </div>

        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="builder">Resume Builder</TabsTrigger>
            <TabsTrigger value="history">Resume History</TabsTrigger>
          </TabsList>

          <TabsContent value="builder">
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
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Target Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Professional Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills & Technologies</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => setFormData((prev) => ({ ...prev, education: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Resume
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
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {mockResult.matchScore}% Match
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg max-h-[400px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">{mockResult.generatedResume}</pre>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">AI Suggestions:</h4>
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
                        <span>✅ Resume saved to Neon Database</span>
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
                  Resume History
                  <Badge variant="outline" className="ml-auto">
                    From Neon DB
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockHistory.map((resume) => (
                    <Card key={resume.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">{resume.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{resume.industry}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(resume.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{resume.jobTitle}</p>
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
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
