import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export interface ResumeRequest {
  jobTitle: string
  industry?: string
  experience: string
  skills: string
  education: string
  targetJob?: string
}

export interface ResumeResponse {
  generatedResume: string
  suggestions: string[]
  matchScore: number
}

export class ResumeMCPClient {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" })

  async generateResume(request: ResumeRequest): Promise<ResumeResponse> {
    const prompt = `
Generate a professional resume based on the following information:

Job Title: ${request.jobTitle}
Industry: ${request.industry || "General"}
Experience: ${request.experience}
Skills: ${request.skills}
Education: ${request.education}
${request.targetJob ? `Target Job: ${request.targetJob}` : ""}

Please create a well-structured resume in markdown format with the following sections:
1. Professional Summary
2. Core Skills
3. Professional Experience
4. Education
5. Additional Skills/Certifications

Also provide 3 improvement suggestions and a match score (1-100) for the target role.

Format the response as JSON with fields: generatedResume, suggestions (array), matchScore (number).
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response.text()

      // Try to parse JSON response, fallback to structured format
      try {
        return JSON.parse(response)
      } catch {
        return {
          generatedResume: response,
          suggestions: [
            "Add more quantifiable achievements",
            "Include relevant keywords for ATS optimization",
            "Tailor experience to match job requirements",
          ],
          matchScore: 75,
        }
      }
    } catch (error) {
      console.error("Resume generation error:", error)
      throw new Error("Failed to generate resume")
    }
  }
}
