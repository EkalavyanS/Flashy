"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { generateContent } from "./gemini_config";

interface Slide {
  Topic: string;
  explanation: string;
}

export default function Flashcard({ topic, class: gradeLevel }: { topic: string; class: string }) {
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      try {
        const prompt = `Create 10 informative slides about ${topic} for a ${gradeLevel} grader in JSON array format: [{ "Topic": "...", "explanation": "..." }]`;
        const text = await generateContent(prompt, "gemini-2.5-flash");

        const cleanedText = text.replace(/```json|```/g, "").trim();
        const jsonData: Slide[] = JSON.parse(cleanedText);

        setSlides(jsonData);
      } catch (err) {
        console.error("Error fetching Gemini slides:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, [topic, gradeLevel]);

  const progress = slides.length ? ((currentIndex + 1) / slides.length) * 100 : 0;

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Progress Bar */}
      {!loading && slides.length > 0 && (
        <div className="w-full max-w-3xl mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-blue-400">
              Card {currentIndex + 1} of {slides.length}
            </span>
            <span className="text-xs text-slate-400">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Carousel */}
      {loading ? (
        <SkeletonCarousel />
      ) : (
        <Carousel
          opts={{ align: "start" }}
          className="w-full max-w-3xl mb-20 relative"
          onSlideChange={(index) => setCurrentIndex(index)}
        >
          <CarouselContent className="space-x-4">
            {slides.map((slide, i) => (
              <CarouselItem key={i} className="w-full">
                <Card className="border border-slate-700 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-8 rounded-lg relative overflow-hidden">
                    {/* Decorative gradients */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full -ml-20 -mb-20 blur-2xl" />

                    {/* Slide content */}
                    <div className="relative z-10 text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                        <span className="text-3xl">📖</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white">{slide.Topic}</h2>
                      <p className="text-lg text-slate-300 leading-relaxed max-w-md">{slide.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border-0 transition-all" />
          <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border-0 transition-all" />
        </Carousel>
      )}
    </div>
  );
}

function SkeletonCarousel() {
  return (
    <Carousel className="w-full max-w-3xl mb-20">
      <CarouselContent>
        {[...Array(10)].map((_, i) => (
          <CarouselItem key={i} className="w-full">
            <div className="p-2">
              <Card className="w-full border-0 shadow-lg">
                <CardContent className="flex flex-col aspect-square items-center justify-center p-8 bg-slate-800/50 rounded-lg">
                  <Skeleton height={40} width={150} style={{ backgroundColor: "#1e293b", borderRadius: "8px" }} />
                  <Skeleton count={3} height={20} style={{ backgroundColor: "#0f172a", borderRadius: "8px", margin: "12px 0" }} />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}