"use client";

import { useState } from "react";
import { PHQ9_QUESTIONS, calculatePHQ9Score, PHQ9Answers, PHQ9ScoreResult } from "@/lib/phq9-scoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PHQ9ResultDisplay } from "./PHQ9ResultDisplay";
import { useRouter } from "next/navigation";

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
      // Simulate API call to save PHQ-9 results
      const response = await fetch('/api/phq9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, ...scoreResult }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit PHQ-9 results');
      }
      // Optionally, handle success (e.g., show a toast)
    } catch (error) {
      console.error("Error submitting PHQ-9:", error);
      // Handle error (e.g., show error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return <PHQ9ResultDisplay result={result} onClose={() => router.push('/dashboard')} />;
  }

  const currentAnswer = answers[`q${currentQuestionIndex + 1}`]?.toString();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Survei PHQ-9</CardTitle>
        <Progress value={((currentQuestionIndex + 1) / PHQ9_QUESTIONS.length) * 100} className="h-2 mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-semibold">
          {currentQuestionIndex + 1}. {PHQ9_QUESTIONS[currentQuestionIndex]}
        </p>
        <RadioGroup onValueChange={handleAnswerChange} value={currentAnswer}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="q0" />
            <Label htmlFor="q0">0 = Tidak pernah</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="q1" />
            <Label htmlFor="q1">1 = Beberapa hari</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="q2" />
            <Label htmlFor="q2">2 = Lebih dari separuh waktu</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="q3" />
            <Label htmlFor="q3">3 = Hampir setiap hari</Label>
          </div>
        </RadioGroup>
        <div className="flex justify-between mt-6">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
            Sebelumnya
          </Button>
          <Button onClick={handleNext} disabled={currentAnswer === undefined || isSubmitting} className="bg-sky-600 hover:bg-sky-700">
            {currentQuestionIndex === PHQ9_QUESTIONS.length - 1 ? "Selesai" : "Selanjutnya"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}