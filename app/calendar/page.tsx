"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Circle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { DISEASES } from "@/lib/constants";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore } from "date-fns";
import { id } from "date-fns/locale";

export default function CalendarPage() {
  const router = useRouter();
  const { user, medicationLogs } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user || !user.isOnboarded) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);

  const getDayStatus = (date: Date) => {
    const dateStr = date.toDateString();
    const dayLogs = medicationLogs.filter(
      (log) => new Date(log.scheduledAt).toDateString() === dateStr
    );

    if (dayLogs.length === 0) {
      return isBefore(date, new Date()) && !isToday(date) ? "none" : "future";
    }

    const takenCount = dayLogs.filter((log) => log.isTaken).length;
    if (takenCount === dayLogs.length) return "complete";
    if (takenCount > 0) return "partial";
    return "missed";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-500";
      case "partial":
        return "bg-yellow-500";
      case "missed":
        return "bg-red-500";
      case "none":
        return "bg-gray-300";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "partial":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "missed":
        return <Circle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="dipeluk logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold">Kalender Obat</h1>
                <p className="text-blue-200 text-sm">dipeluk</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Legend */}
        <div className="flex justify-center gap-4 flex-wrap">
          {[
            { color: "bg-green-500", label: "Semua diminum" },
            { color: "bg-yellow-500", label: "Sebagian" },
            { color: "bg-red-500", label: "Tidak diminum" },
            { color: "bg-gray-300", label: "Tidak ada data" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <Card className="card-canva bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <CardTitle className="text-lg">
                {format(currentMonth, "MMMM yyyy", { locale: id })}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Padding days */}
              {paddingDays.map((_, index) => (
                <div key={`pad-${index}`} className="aspect-square" />
              ))}

              {/* Actual days */}
              {daysInMonth.map((date) => {
                const status = getDayStatus(date);
                const isSelected = selectedDate?.toDateString() === date.toDateString();

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      isToday(date)
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : ""
                    } ${
                      isSelected
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isToday(date)
                          ? "text-blue-600"
                          : isSameMonth(date, currentMonth)
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {format(date, "d")}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        {selectedDate && (
          <Card className="card-canva bg-white shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 p-4">
              <CardTitle className="text-lg">
                📅 {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {user.medications.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Belum ada obat yang ditambahkan
                </p>
              ) : (
                <div className="space-y-3">
                  {user.medications.map((med) => {
                    const log = medicationLogs.find(
                      (l) =>
                        l.medicationId === med.id &&
                        new Date(l.scheduledAt).toDateString() === selectedDate.toDateString()
                    );
                    const disease = DISEASES.find((d) => d.id === med.diseaseId);

                    return (
                      <div
                        key={med.id}
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          log?.isTaken ? "bg-green-50" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{disease?.icon}</span>
                          <div>
                            <p className="font-medium text-gray-800">{med.name}</p>
                            <p className="text-sm text-gray-500">{med.dosage}</p>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            log?.isTaken
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {log?.isTaken ? "✓ Sudah" : "○ Belum"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Card */}
        <Card className="card-canva bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Kepatuhan Bulan Ini</p>
                <p className="text-3xl font-bold">
                  {(() => {
                    const monthLogs = medicationLogs.filter((log) => {
                      const logDate = new Date(log.scheduledAt);
                      return (
                        logDate.getMonth() === currentMonth.getMonth() &&
                        logDate.getFullYear() === currentMonth.getFullYear()
                      );
                    });
                    if (monthLogs.length === 0) return "-%";
                    const taken = monthLogs.filter((l) => l.isTaken).length;
                    return `${Math.round((taken / monthLogs.length) * 100)}%`;
                  })()}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                📊
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
