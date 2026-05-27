"use client";

import { PHQ9ScoreResult } from "@/lib/phq9-scoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SafetyBanner } from "./safety-banner";
import { CheckCircle, AlertCircle, XCircle, Home, Phone, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PHQ9ResultProps {
  result: PHQ9ScoreResult;
  onClose: () => void;
}

export function PHQ9Result({ result, onClose }: PHQ9ResultProps) {
  const { totalScore, severity, item9Score, severityLevel } = result;

  const getIcon = () => {
    if (severityLevel === 'minimal') return <CheckCircle className="text-green-500" size={64} />;
    if (severityLevel === 'ringan') return <AlertCircle className="text-amber-500" size={64} />;
    return <XCircle className="text-red-500" size={64} />;
  };

  const getMessage = () => {
    switch (severityLevel) {
      case 'minimal':
        return "Kondisi mentalmu baik! Pertahankan ya. 🎉";
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

  const getGradient = () => {
    if (severityLevel === 'minimal') return "from-green-400 to-green-500";
    if (severityLevel === 'ringan') return "from-amber-400 to-amber-500";
    return "from-red-400 to-red-500";
  };

  const getBgColor = () => {
    if (severityLevel === 'minimal') return "bg-green-50";
    if (severityLevel === 'ringan') return "bg-amber-50";
    return "bg-red-50";
  };

  return (
    <Card className="w-full max-w-md mx-auto card-canva bg-white shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${getGradient()} text-white p-8 text-center`}>
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            {severityLevel === 'minimal' ? (
              <span className="text-5xl">🎉</span>
            ) : severityLevel === 'ringan' ? (
              <span className="text-5xl">💪</span>
            ) : (
              <span className="text-5xl">🤗</span>
            )}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Hasil PHQ-9 Anda</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Score Display */}
        <div className={`${getBgColor()} rounded-2xl p-6 text-center`}>
          <p className="text-sm text-gray-600 mb-2">Skor Total</p>
          <p className="text-5xl font-bold text-gray-800">{totalScore}</p>
          <p className={cn(
            "text-lg font-semibold mt-2",
            severityLevel === 'minimal' && "text-green-600",
            severityLevel === 'ringan' && "text-amber-600",
            (severityLevel === 'sedang' || severityLevel === 'sedang-berat' || severityLevel === 'berat') && "text-red-600"
          )}>
            {severity}
          </p>
        </div>

        {/* Message */}
        <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
          <Heart className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-gray-700">{getMessage()}</p>
        </div>

        {/* Safety Banner for high risk */}
        {item9Score >= 1 && (
          <SafetyBanner />
        )}

        {/* Score Breakdown Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Interpretasi Skor:</h4>
          <div className="space-y-2 text-sm">
            {[
              { range: "0-4", label: "Minimal", color: "bg-green-100 text-green-700" },
              { range: "5-9", label: "Ringan", color: "bg-yellow-100 text-yellow-700" },
              { range: "10-14", label: "Sedang", color: "bg-orange-100 text-orange-700" },
              { range: "15-19", label: "Sedang-berat", color: "bg-red-100 text-red-700" },
              { range: "20-27", label: "Berat", color: "bg-red-200 text-red-800" },
            ].map((item) => (
              <div key={item.range} className="flex items-center justify-between">
                <span className="text-gray-600">{item.range}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.color}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={onClose} 
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl btn-canva"
          >
            <Home className="w-5 h-5 mr-2" />
            Kembali ke Dashboard
          </Button>
          
          {(severityLevel === 'sedang' || severityLevel === 'sedang-berat' || severityLevel === 'berat' || item9Score >= 1) && (
            <Button 
              variant="outline"
              className="w-full h-12 border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-xl"
              onClick={() => window.open('tel:119')}
            >
              <Phone className="w-5 h-5 mr-2" />
              Hubungi Hotline: 119 ext 8
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
