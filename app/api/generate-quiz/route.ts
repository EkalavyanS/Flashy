import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

interface Question {
  question: string
  options: string[]
  correctAnswer: string
}

export async function POST(request: Request) {
  try {
    const { topic, gradeLevel } = await request.json()

    if (!topic || !gradeLevel) {
      return Response.json({ error: "Missing topic or grade level" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(
      `Create 5 multiple-choice questions about ${topic} for a ${gradeLevel} grader. Each question should have 4 options and one correct answer. Return the questions in JSON format with fields 'question', 'options', and 'correctAnswer'.`,
    )

    const response = await result.response
    const text = await response.text()

    const cleanedText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/\\"/g, "")
      .trim()

    let questions: Question[]
    try {
      questions = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      return Response.json({ error: "Failed to parse generated questions" }, { status: 500 })
    }

    return Response.json({ questions })
  } catch (error) {
    console.error("Error generating quiz:", error)
    return Response.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
