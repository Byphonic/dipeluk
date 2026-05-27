import { AlertTriangle, Phone, Heart } from "lucide-react";

interface SafetyBannerProps {
  message?: string;
  hotline?: string;
}

export function SafetyBanner({ 
  message = "Jika Anda memiliki pikiran untuk menyakiti diri sendiri, Anda tidak sendirian. Ada bantuan yang tersedia.",
  hotline = "Hotline Kesehatan Jiwa: 119 ext 8"
}: SafetyBannerProps) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 text-red-800 p-5 rounded-2xl shadow-sm" role="alert">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg mb-2">Penting!</p>
          <p className="text-sm leading-relaxed">{message}</p>
          <div className="mt-3 flex items-center gap-2 bg-red-200/50 px-3 py-2 rounded-lg">
            <Phone className="w-4 h-4" />
            <span className="font-semibold">{hotline}</span>
          </div>
          <p className="text-xs mt-3 text-red-600 flex items-center gap-1">
            <Heart className="w-3 h-3" />
            Kami peduli dengan kesejahteraanmu
          </p>
        </div>
      </div>
    </div>
  );
}
