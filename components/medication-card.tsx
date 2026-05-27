"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Medication } from "@/lib/store";
import { DISEASES } from "@/lib/constants";

interface MedicationCardProps {
  medication: Medication;
  isTaken: boolean;
  onToggle: () => void;
}

export function MedicationCard({ medication, isTaken, onToggle }: MedicationCardProps) {
  const disease = DISEASES.find((d) => d.id === medication.diseaseId);

  return (
    <div
      onClick={onToggle}
      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isTaken
          ? "bg-green-50 border-green-300"
          : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
      }`}
    >
      {/* Status Icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isTaken ? "bg-green-500" : "bg-gray-200"
        }`}
      >
        {isTaken ? (
          <CheckCircle2 className="w-6 h-6 text-white" />
        ) : (
          <Circle className="w-6 h-6 text-gray-400" />
        )}
      </div>

      {/* Medication Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{medication.name}</span>
          {disease && (
            <span className="text-lg">{disease.icon}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{medication.dosage}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {medication.times.join(", ")}
          </span>
        </div>
      </div>

      {/* Status Label */}
      <div
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          isTaken
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {isTaken ? "Sudah ✓" : "Belum"}
      </div>
    </div>
  );
}
