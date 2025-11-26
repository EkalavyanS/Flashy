"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { generateContent } from "./gemini_config";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

function Quiz(props: { topic: string; class: string }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (score === questions.length && questions.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [score, questions.length]);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const prompt = `Create 5 multiple-choice questions about ${props.topic} for a ${props.class} grader. Each question should have 4 options and one correct answer. Return the questions in JSON format with fields 'question', 'options', and 'correctAnswer'.`;

        const text = await generateContent(prompt, "gemini-2.5-flash");

        // Clean and parse
        const cleanedText = text.replace(/```json|```/g, "").trim();
        const jsonData: Question[] = JSON.parse(cleanedText);

        setQuestions(jsonData);
      } catch (err) {
        console.error("Error fetching quiz from Gemini:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [props.topic, props.class]);

  const handleOptionClick = (option: string) => {
    if (!answered) setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || answered) return;

    const current = questions[currentQuestion];
    const correct = selectedOption.trim() === current.correctAnswer.trim();
    setIsCorrect(correct);
    setAnswered(true);

    if (correct) setScore(score + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setAnswered(false);
      setIsCorrect(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleBackQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setAnswered(false);
      setIsCorrect(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Skeleton height={40} width={150} style={{ borderRadius: 8 }} />
      </div>
    );
  }

  if (!questions.length) {
    return <div className="text-center text-red-400 mt-10">Error occurred. Please try again.</div>;
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const perfect = score === questions.length;
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-96 px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
            <span className="text-5xl">{perfect ? "🏆" : "🎉"}</span>
          </div>
          <h2 className="text-4xl font-bold text-white">Quiz Complete!</h2>
          <p className="text-slate-300">Your score: {score}/{questions.length} ({percentage}%)</p>
          <Button onClick={() => window.location.reload()}>Try Another Quiz</Button>
        </div>
        {showConfetti && <Confetti />}
      </div>
    );
  }

  const current = questions[currentQuestion];

  return (
    <div className="flex flex-col items-center w-full px-4">
      <Card className="w-full max-w-3xl mb-20 border border-slate-700 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900">
        <CardContent className="p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 font-bold">{currentQuestion + 1}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{current.question}</h2>
          </div>

          <div className="space-y-3 mb-8">
            {current.options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === current.correctAnswer;
              let bgClass = "bg-slate-700/50 border border-slate-600 hover:border-blue-500/50";

              if (answered) {
                if (isCorrectOption) bgClass = "bg-green-500/10 border border-green-500/50";
                else if (isSelected) bgClass = "bg-red-500/10 border border-red-500/50";
              } else if (isSelected) bgClass = "bg-blue-500/20 border border-blue-500";

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={answered}
                  className={`w-full p-4 rounded-lg text-left font-medium ${bgClass}`}
                >
                  <span>{option}</span>
                  {answered && isCorrectOption && <span className="ml-auto text-lg">✓</span>}
                  {answered && isSelected && !isCorrectOption && <span className="ml-auto text-lg">✗</span>}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`p-4 rounded-lg mb-6 ${isCorrect ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"}`}>
              <p>{isCorrect ? "Correct!" : `Incorrect! Correct: ${current.correctAnswer}`}</p>
            </div>
          )}

          <div className="flex justify-between gap-4">
            <Button onClick={handleBackQuestion} disabled={currentQuestion === 0}>Back</Button>
            {!answered ? (
              <Button onClick={handleSubmitAnswer} disabled={!selectedOption}>Submit Answer</Button>
            ) : (
              <Button onClick={handleNextQuestion}>{currentQuestion === questions.length - 1 ? "See Results" : "Next Question"}</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Quiz;