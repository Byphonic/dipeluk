"use client";

import { PHQ9ScoreResult } from "@/lib/phq9-scoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SafetyBanner } from "./SafetyBanner";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PHQ9ResultDisplayProps {
  result: PHQ9ScoreResult;
  onClose: () => void;
}

export function PHQ9ResultDisplay({ result, onClose }: PHQ9ResultDisplayProps) {
  const { totalScore, severity, item9Score, severityLevel } = result;

  const getIcon = () => {
    if (severityLevel === 'minimal') return <CheckCircle className="text-green-500" size={48} />;
    if (severityLevel === 'ringan') return <AlertCircle className="text-amber-500" size={48} />;
    return <XCircle className="text-red-500" size={48} />;
  };

  const getMessage = () => {
    switch (severityLevel) {
      case 'minimal':
        return "Kondisi mentalmu baik! Pertahankan ya.";
      case 'ringan':
        return "Kamu mungkin perlu perhatian lebih. Coba bicara dengan petugas Puskesmas.";
      case 'sedang':
      case 'sedang-berat':
      case 'berat':
        return "Kondisi mentalmu membutuhkan perhatian serius. Kami telah memberitahu Puskesmas Anda untuk tindak lanjut.";
      default:
        return "Terima kasih telah mengisi survei.";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader className="flex flex-col items-center space-y-4">
        {getIcon()}
        <CardTitle className="text-2xl font-bold">Hasil PHQ-9 Anda</CardTitle>
        <p className="text-lg font-semibold">Skor Total: {totalScore}</p>
        <p className={cn(
          "text-md font-medium",
          severityLevel === 'minimal' && "text-green-600",
          severityLevel === 'ringan' && "text-amber-600",
          (severityLevel === 'sedang' || severityLevel === 'sedang-berat' || severityLevel === 'berat') && "text-red-600"
        )}>
          {severity}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{getMessage()}</p>
        {item9Score >= 1 && (
          <SafetyBanner />
        )}
        <Button onClick={onClose} className="w-full bg-sky-600 hover:bg-sky-700">Selesai</Button>
      </CardContent>
    </Card>
  );
}