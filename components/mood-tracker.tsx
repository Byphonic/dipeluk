"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore, MoodLog } from "@/lib/store";
import { MOOD_OPTIONS, MoodId } from "@/lib/constants";

interface MoodTrackerProps {
  todayMood: MoodLog | undefined;
  weekMoods: MoodLog[];
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

export function MoodTracker({ todayMood, weekMoods, showModal, setShowModal }: MoodTrackerProps) {
  const { addMoodLog } = useAppStore();
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    addMoodLog(selectedMood, note || undefined);
    setIsSubmitting(false);
    setShowModal(false);
    setSelectedMood(null);
    setNote("");
  };

  return (
    <>
      {/* Mood Trigger Card */}
      <Card 
        className="card-canva bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 shadow-lg rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => !todayMood && setShowModal(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">
                {todayMood ? "Mood Hari Ini Tercatat! ✨" : "Bagaimana Perasaanmu Hari Ini?"}
              </h3>
              <p className="text-green-100 text-sm">
                {todayMood 
                  ? `Kamu merasa ${MOOD_OPTIONS.find(m => m.id === todayMood.mood)?.label.toLowerCase()}`
                  : "Tap untuk mencatat mood harianmu"
                }
              </p>
            </div>
            <div className="flex gap-2">
              {todayMood ? (
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                  {MOOD_OPTIONS.find(m => m.id === todayMood.mood)?.emoji}
                </div>
              ) : (
                MOOD_OPTIONS.map((mood) => (
                  <div
                    key={mood.id}
                    className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl hover:bg-white/30 transition-all"
                  >
                    {mood.emoji}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mood Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <CardTitle className="text-2xl text-center">
                Bagaimana Harimu Hari Ini?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Mood Selection */}
              <div className="flex justify-center gap-6">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                      selectedMood === mood.id
                        ? `${mood.bgColor} ${mood.borderColor} border-2 scale-110`
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    <span className="text-5xl mood-button">{mood.emoji}</span>
                    <span className={`font-medium ${selectedMood === mood.id ? mood.textColor : "text-gray-600"}`}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Optional Note */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Ceritakan lebih lanjut (opsional)
                </label>
                <Textarea
                  placeholder="Apa yang membuatmu merasa seperti ini hari ini?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[100px] rounded-xl border-2 border-gray-200 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!selectedMood || isSubmitting}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl btn-canva disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Mood 💾"}
              </Button>

              {/* Encouragement */}
              <p className="text-center text-sm text-gray-500">
                Mencatat mood setiap hari membantu memantau kesehatan mentalmu 💪
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
