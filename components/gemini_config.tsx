// components/gemini_config.ts
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI client
export const genAI = new GoogleGenAI({
  apiKey:"AIzaSyAZazcBQkD62sPV151Lj7LHVkkFLjoKycA"
});

// Helper function to generate content
export const generateContent = async (
  prompt: string,
  model: string = "gemini-2.5-flash"
) => {
  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    // response.text contains the generated content
    return response.text;
  } catch (err) {
    console.error("Error generating Gemini content:", err);
    throw new Error("Failed to fetch content from Gemini");
  }
};