"use client";

import { useState } from "react";
import { PHQ9_QUESTIONS, calculatePHQ9Score, PHQ9Answers, PHQ9ScoreResult } from "@/lib/phq9-scoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PHQ9Result } from "./phq9-result";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export function PHQ9Survey() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PHQ9Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<PHQ9ScoreResult | null>(null);

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [`q${currentQuestionIndex + 1}`]: parseInt(value),
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < PHQ9_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const scoreResult = calculatePHQ9Score(answers);
    setResult(scoreResult);

    try {
      const response = await fetch('/api/phq9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, ...scoreResult }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit PHQ-9 results');
      }
    } catch (error) {
      console.error("Error submitting PHQ-9:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return <PHQ9Result result={result} onClose={() => router.push('/dashboard')} />;
  }

  const currentAnswer = answers[`q${currentQuestionIndex + 1}`]?.toString();
  const progress = ((currentQuestionIndex + 1) / PHQ9_QUESTIONS.length) * 100;

  const answerOptions = [
    { value: "0", label: "Tidak pernah", color: "bg-green-50 hover:bg-green-100 border-green-200" },
    { value: "1", label: "Beberapa hari", color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200" },
    { value: "2", label: "Lebih dari separuh waktu", color: "bg-orange-50 hover:bg-orange-100 border-orange-200" },
    { value: "3", label: "Hampir setiap hari", color: "bg-red-50 hover:bg-red-100 border-red-200" },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto card-canva bg-white shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <CardTitle className="text-xl font-bold text-center">Survei PHQ-9</CardTitle>
        <p className="text-blue-100 text-center text-sm mt-1">
          Skrining kesehatan mental berkala
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-blue-100">
            <span>Pertanyaan {currentQuestionIndex + 1} dari {PHQ9_QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-blue-800/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Question */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <p className="text-lg font-semibold text-gray-800 leading-relaxed">
            <span className="text-blue-600">{currentQuestionIndex + 1}.</span> {PHQ9_QUESTIONS[currentQuestionIndex]}
          </p>
        </div>

        {/* Answer Options */}
        <RadioGroup onValueChange={handleAnswerChange} value={currentAnswer} className="space-y-3">
          {answerOptions.map((option) => (
            <div
              key={option.value}
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                currentAnswer === option.value 
                  ? "border-blue-500 bg-blue-50 shadow-md" 
                  : `${option.color} border-2`
              }`}
              onClick={() => handleAnswerChange(option.value)}
            >
              <RadioGroupItem value={option.value} id={`q${option.value}`} className="sr-only" />
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                currentAnswer === option.value 
                  ? "bg-blue-600 border-blue-600" 
                  : "border-gray-300"
              }`}>
                {currentAnswer === option.value && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
              <Label htmlFor={`q${option.value}`} className="flex-1 cursor-pointer font-medium text-gray-700">
                <span className="font-bold text-blue-600 mr-2">{option.value}</span>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 pt-4">
          <Button 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0} 
            variant="outline"
            className="flex-1 h-12 rounded-xl border-2 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sebelumnya
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={currentAnswer === undefined || isSubmitting} 
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl btn-canva disabled:opacity-50"
          >
            {currentQuestionIndex === PHQ9_QUESTIONS.length - 1 ? (
              <>
                Selesai
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Selanjutnya
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1 pt-2">
          {PHQ9_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentQuestionIndex
                  ? "w-6 bg-blue-600"
                  : answers[`q${index + 1}`] !== undefined
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
