import { AlertTriangle } from "lucide-react";

interface SafetyBannerProps {
  message?: string;
  hotline?: string;
}

export function SafetyBanner({ 
  message = "Jika Anda memiliki pikiran untuk menyakiti diri sendiri, Anda tidak sendirian. Ada bantuan yang tersedia.",
  hotline = "Hotline Kesehatan Jiwa: 119 ext 8"
}: SafetyBannerProps) {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm flex items-start space-x-3" role="alert">
      <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold">Penting!</p>
        <p className="text-sm">{message}</p>
        <p className="text-sm font-semibold mt-1">{hotline}</p>
      </div>
    </div>
  );
}