import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { topic, gradeLevel } = await request.json()

    if (!topic || !gradeLevel) {
      return Response.json({ error: "Missing topic or grade level" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(
      `Create 10 informative slides about ${topic} for a ${gradeLevel} grader in a way that makes the child understand. Each slide should have a Title and Explanation and not just empty strings. Avoid using any formatting like bold or italics.`,
    )

    const response = await result.response
    const text = await response.text()

    const cleanText = (str: string) => str.replace(/\*\*|\*/g, "")

    const slides = text.split("\n\n").map((slide) => {
      const [potentialTitle, ...remainingLines] = slide.split("\n")
      const title = cleanText(potentialTitle || "") || "Untitled Slide"
      const explanation = cleanText(remainingLines.join("\n") || "")
      return { Topic: title, explanation }
    })

    return Response.json({ slides })
  } catch (error) {
    console.error("Error generating flashcards:", error)
    return Response.json({ error: "Failed to generate flashcards" }, { status: 500 })
  }
}
