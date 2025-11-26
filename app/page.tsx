"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Flashcard from "@/components/flashcard"
import Quiz from "@/components/quiz"

export default function Home() {
  const [topic, setTopic] = useState("")
  const [grade, setGrade] = useState("")
  const [mode, setMode] = useState<"home" | "flashcard" | "quiz">("home")

  const handleStart = (selectedMode: "flashcard" | "quiz") => {
    if (topic.trim() && grade.trim()) {
      setMode(selectedMode)
    }
  }

  const handleBack = () => {
    setMode("home")
  }

  if (mode === "flashcard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleBack}
            className="mb-8 flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 hover:translate-x-[-4px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <Flashcard topic={topic} class={grade} />
        </div>
      </div>
    )
  }

  if (mode === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleBack}
            className="mb-8 flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 hover:translate-x-[-4px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <Quiz topic={topic} class={grade} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">Flashy</h1>
          </div>
          <p className="text-lg text-slate-300 mb-2">Master Any Subject in Minutes</p>
          <p className="text-slate-400">AI-powered flashcards and quizzes for smarter learning</p>
        </div>

        {/* Main Card */}
        <Card className="border border-slate-700 shadow-2xl bg-slate-800/50 backdrop-blur">
          <CardHeader className="text-center pb-8 border-b border-slate-700">
            <CardTitle className="text-3xl font-bold text-white mb-2">Get Started Learning</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your topic and grade level to generate personalized content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">What do you want to learn?</label>
              <Input
                placeholder="e.g., Photosynthesis, World War II, Calculus..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-12 text-base bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-2"
              />
            </div>

            {/* Grade Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Grade level or age</label>
              <Input
                placeholder="e.g., 5th Grade, 14 years old, College..."
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="h-12 text-base bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-2"
              />
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-all duration-200">
                <div className="text-3xl mb-3">📚</div>
                <p className="font-semibold text-white text-sm">Flashcards</p>
                <p className="text-xs text-slate-400 mt-1">Learn at your own pace</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all duration-200">
                <div className="text-3xl mb-3">✅</div>
                <p className="font-semibold text-white text-sm">Quizzes</p>
                <p className="text-xs text-slate-400 mt-1">Test your knowledge</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={() => handleStart("flashcard")}
                disabled={!topic.trim() || !grade.trim()}
                className="h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/40"
              >
                Start Flashcards
              </Button>
              <Button
                onClick={() => handleStart("quiz")}
                disabled={!topic.trim() || !grade.trim()}
                className="h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/40"
              >
                Take Quiz
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-4 rounded-lg border border-slate-600 text-sm text-slate-200">
              <p className="font-semibold mb-2">Pro Tips:</p>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>• Be specific with your topic for better results</li>
                <li>• Mention the grade level for appropriate difficulty</li>
                <li>• Start with flashcards to learn, then quiz to test</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>Powered by AI • No login required • Always free</p>
        </div>
      </div>
    </div>
  )
}
