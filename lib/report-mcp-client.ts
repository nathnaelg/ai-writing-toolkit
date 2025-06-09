import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export interface ReportRequest {
  bulletPoints: string
  reportType: string
  tone?: string
  audience?: string
  title: string
}

export interface ReportResponse {
  generatedReport: string
  executiveSummary: string
  keyPoints: string[]
  wordCount: number
}

export class ReportMCPClient {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" })

  async generateReport(request: ReportRequest): Promise<ReportResponse> {
    const reportTemplates = {
      MEETING_SUMMARY: "professional meeting summary with action items and decisions",
      PROJECT_UPDATE: "comprehensive project status report with milestones and risks",
      WEEKLY_REPORT: "weekly progress report with achievements and upcoming tasks",
      INCIDENT_REPORT: "detailed incident analysis with root cause and resolution steps",
      BUSINESS_PROPOSAL: "persuasive business proposal with clear value proposition",
      RESEARCH_SUMMARY: "analytical research summary with findings and recommendations",
    }

    const template = reportTemplates[request.reportType as keyof typeof reportTemplates] || "professional report"

    const prompt = `
Create a ${template} based on these bullet points:

BULLET POINTS:
${request.bulletPoints}

REQUIREMENTS:
- Report Type: ${request.reportType}
- Tone: ${request.tone || "Professional"}
- Target Audience: ${request.audience || "General Business"}
- Title: ${request.title}

Please structure the report with:
1. Executive Summary
2. Main Content (organized by relevant sections)
3. Key Findings/Recommendations
4. Next Steps/Action Items (if applicable)

Also provide:
- A separate executive summary (2-3 sentences)
- 3-5 key points as bullet list
- Word count

Format as JSON with fields: generatedReport, executiveSummary, keyPoints (array), wordCount.
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response.text()

      try {
        return JSON.parse(response)
      } catch {
        const wordCount = response.split(" ").length
        return {
          generatedReport: response,
          executiveSummary: "Report generated successfully with comprehensive analysis and recommendations.",
          keyPoints: [
            "Comprehensive analysis provided",
            "Key recommendations identified",
            "Action items outlined",
            "Professional formatting applied",
          ],
          wordCount,
        }
      }
    } catch (error) {
      console.error("Report generation error:", error)
      throw new Error("Failed to generate report")
    }
  }

  async enhanceReport(report: string, enhancement: "expand" | "summarize" | "formalize"): Promise<string> {
    const prompts = {
      expand: `Expand this report with more details, examples, and analysis: ${report}`,
      summarize: `Create a concise summary of this report: ${report}`,
      formalize: `Make this report more formal and professional: ${report}`,
    }

    try {
      const result = await this.model.generateContent(prompts[enhancement])
      return result.response.text()
    } catch (error) {
      console.error("Report enhancement error:", error)
      throw new Error("Failed to enhance report")
    }
  }
}
