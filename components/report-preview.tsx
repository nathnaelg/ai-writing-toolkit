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
import { Download, FileText, Target, Users, Database, History } from "lucide-react"

export default function ReportGeneratorPreview() {
  const [formData, setFormData] = useState({
    title: "Q1 2024 Development Team Progress Report",
    reportType: "PROJECT_UPDATE",
    bulletPoints: `• Completed user authentication module ahead of schedule
• Fixed 15 critical bugs in payment system
• Team velocity increased by 20% this quarter
• UI redesign is 75% complete
• Need to address database performance issues
• Planning to implement push notifications next sprint
• Current budget utilization is at 65%
• Two new developers onboarded successfully`,
    tone: "Professional",
    audience: "Management",
  })

  const mockResult = {
    generatedReport: `# Q1 2024 Development Team Progress Report

## Executive Summary
The development team has demonstrated exceptional performance during Q1 2024, achieving significant milestones while maintaining high quality standards. Key accomplishments include the early completion of the user authentication module, resolution of critical payment system issues, and a notable 20% increase in team velocity. The UI redesign project is progressing well at 75% completion, and successful onboarding of two new team members has strengthened our development capacity.

## Key Achievements

### Development Milestones
The user authentication module was completed ahead of schedule, representing a critical foundation for our platform's security infrastructure. This early completion provides additional buffer time for comprehensive testing and integration with other system components.

The team successfully resolved 15 critical bugs in the payment system, significantly improving transaction reliability and user experience. These fixes addressed issues ranging from payment processing errors to integration challenges with third-party payment gateways.

### Team Performance
Team velocity has increased by 20% this quarter, reflecting improved processes, better collaboration, and growing expertise with our technology stack. This productivity boost has enabled the team to take on additional features while maintaining code quality standards.

The successful onboarding of two new developers has expanded our team capacity and brought fresh perspectives to ongoing projects. Both new team members have integrated well and are already contributing meaningfully to development efforts.

### User Interface Progress
The UI redesign project is 75% complete, with major components and user flows implemented according to the new design system. User feedback on the redesigned interfaces has been overwhelmingly positive, with usability metrics showing significant improvement over the previous design.

## Current Challenges

### Technical Issues
Database performance issues have been identified as a priority concern requiring immediate attention. Current query response times are exceeding acceptable thresholds during peak usage periods, which could impact user experience if not addressed promptly.

### Resource Management
Current budget utilization stands at 65%, which is slightly under the projected 70% for this stage of development. While this provides financial flexibility, it also indicates potential for accelerated development if additional resources are strategically allocated.

## Upcoming Initiatives

### Feature Development
The team is planning to implement push notifications in the next sprint, which will enhance user engagement and provide timely updates for critical account activities. This feature will support various notification types including transaction confirmations, security alerts, and promotional messages.

## Recommendations

1. **Prioritize database optimization** to address performance bottlenecks before they impact user experience
2. **Accelerate UI testing** for the remaining redesign components to maintain project timeline
3. **Consider strategic resource allocation** to take advantage of current budget surplus
4. **Implement comprehensive monitoring** for the new authentication system
5. **Plan knowledge transfer sessions** to leverage expertise from new team members

## Conclusion
Q1 2024 has been a highly successful quarter for the development team, with significant progress across multiple fronts. The combination of technical achievements, improved team performance, and successful team expansion positions us well for continued success in Q2. While database performance requires attention, the overall trajectory is positive and aligned with our strategic objectives.`,
    executiveSummary:
      "The development team achieved exceptional results in Q1 2024, completing the authentication module ahead of schedule, resolving 15 critical payment bugs, and increasing team velocity by 20%. While database performance needs attention, the team is well-positioned for continued success.",
    keyPoints: [
      "User authentication module completed ahead of schedule",
      "15 critical payment system bugs resolved",
      "Team velocity increased by 20%",
      "UI redesign 75% complete with positive user feedback",
      "Two new developers successfully onboarded",
    ],
    wordCount: 542,
  }

  const mockHistory = [
    {
      id: 1,
      title: "Weekly Sprint Review",
      reportType: "WEEKLY_REPORT",
      createdAt: "2024-01-12T14:30:00Z",
    },
    {
      id: 2,
      title: "Security Incident Analysis",
      reportType: "INCIDENT_REPORT",
      createdAt: "2024-01-10T09:15:00Z",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="h-8 w-8 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected to Neon PostgreSQL
            </Badge>
          </div>
          <h1 className="text-4xl font-bold">AI Report Generator</h1>
          <p className="text-muted-foreground mt-2">Transform bullet points into comprehensive professional reports</p>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="generator">Report Generator</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
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
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select
                      value={formData.reportType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, reportType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PROJECT_UPDATE">Project Update</SelectItem>
                        <SelectItem value="MEETING_SUMMARY">Meeting Summary</SelectItem>
                        <SelectItem value="WEEKLY_REPORT">Weekly Report</SelectItem>
                        <SelectItem value="INCIDENT_REPORT">Incident Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Tone
                      </Label>
                      <Select
                        value={formData.tone}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, tone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Formal">Formal</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Audience
                      </Label>
                      <Select
                        value={formData.audience}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, audience: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Management">Management</SelectItem>
                          <SelectItem value="Team Members">Team Members</SelectItem>
                          <SelectItem value="Stakeholders">Stakeholders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bulletPoints">Bullet Points / Notes</Label>
                    <Textarea
                      id="bulletPoints"
                      value={formData.bulletPoints}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bulletPoints: e.target.value }))}
                      className="min-h-[200px]"
                    />
                  </div>

                  <Button className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
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
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{mockResult.wordCount} words</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Executive Summary */}
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Executive Summary</h4>
                      <p className="text-sm text-muted-foreground">{mockResult.executiveSummary}</p>
                    </div>

                    {/* Key Points */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Key Points</h4>
                      <ul className="space-y-1">
                        {mockResult.keyPoints.map((point, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Full Report Preview */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Full Report Preview</h4>
                      <div className="bg-muted p-4 rounded-lg max-h-[300px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-xs">
                          {mockResult.generatedReport.substring(0, 800)}...
                        </pre>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-sm text-green-800">
                        <Database className="h-4 w-4" />
                        <span>✅ Report saved to Neon Database</span>
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
                  Report History
                  <Badge variant="outline" className="ml-auto">
                    From Neon DB
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockHistory.map((report) => (
                    <Card key={report.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">{report.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{report.reportType.replace("_", " ")}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
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
