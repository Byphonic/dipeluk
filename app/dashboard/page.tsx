"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Pill, 
  TrendingUp, 
  Bell, 
  User, 
  LogOut, 
  ChevronRight,
  Flame,
  CheckCircle2,
  Circle,
  Sparkles,
  FileText,
  Settings,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { DISEASES, MOOD_OPTIONS, MoodId } from "@/lib/constants";
import { MoodTracker } from "@/components/mood-tracker";
import { MedicationCard } from "@/components/medication-card";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, getTodayMood, getWeekMoods, getMedicationStreak, getTodayMedications, addMedicationLog } = useAppStore();
  const [showMoodModal, setShowMoodModal] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user || !user.isOnboarded) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const todayMood = getTodayMood();
  const weekMoods = getWeekMoods();
  const streak = getMedicationStreak();
  const todayMedications = getTodayMedications();
  const completedMeds = todayMedications.filter((m) => m.log?.isTaken).length;
  const totalMeds = todayMedications.length;

  // Get user's diseases info
  const userDiseases = user.diseases.map((diseaseId) => 
    DISEASES.find((d) => d.id === diseaseId)
  ).filter(Boolean);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleMedicationToggle = (medicationId: string) => {
    const today = new Date().toISOString();
    const currentLog = todayMedications.find((m) => m.medication.id === medicationId)?.log;
    addMedicationLog(medicationId, today, !currentLog?.isTaken);
  };

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="dipeluk logo"
                width={48}
                height={48}
                className="rounded-xl shadow-lg"
              />
              <div>
                <h1 className="text-xl font-bold">dipeluk</h1>
                <p className="text-blue-200 text-sm">Dashboard Kesehatan</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* User Info Card */}
          <Card className="mt-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">{user.name}</h2>
                  <p className="text-blue-200 text-sm">BPJS: {user.bpjsNumber}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userDiseases.slice(0, 3).map((disease) => (
                      <span 
                        key={disease?.id}
                        className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs"
                      >
                        {disease?.icon} {disease?.name}
                      </span>
                    ))}
                    {userDiseases.length > 3 && (
                      <span className="inline-flex items-center bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        +{userDiseases.length - 3} lainnya
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-canva bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-2xl font-bold text-green-700">{streak}</p>
              <p className="text-sm text-green-600">Hari Berturut</p>
            </CardContent>
          </Card>
          <Card className="card-canva bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">💊</div>
              <p className="text-2xl font-bold text-blue-700">{completedMeds}/{totalMeds}</p>
              <p className="text-sm text-blue-600">Obat Hari Ini</p>
            </CardContent>
          </Card>
          <Card className="card-canva bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">
                {todayMood ? MOOD_OPTIONS.find((m) => m.id === todayMood.mood)?.emoji : "❓"}
              </div>
              <p className="text-2xl font-bold text-yellow-700">
                {todayMood ? MOOD_OPTIONS.find((m) => m.id === todayMood.mood)?.label : "-"}
              </p>
              <p className="text-sm text-yellow-600">Mood Hari Ini</p>
            </CardContent>
          </Card>
          <Card className="card-canva bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-2xl font-bold text-purple-700">{weekMoods.length}</p>
              <p className="text-sm text-purple-600">Log Minggu Ini</p>
            </CardContent>
          </Card>
        </div>

        {/* Mood Tracker Section */}
        <MoodTracker 
          todayMood={todayMood} 
          weekMoods={weekMoods}
          showModal={showMoodModal}
          setShowModal={setShowMoodModal}
        />

        {/* Medications Today */}
        <Card className="card-canva bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Pill className="w-6 h-6" />
                <CardTitle className="text-lg">Obat Hari Ini</CardTitle>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {completedMeds}/{totalMeds} selesai
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {todayMedications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada obat yang ditambahkan</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => router.push("/medications")}
                >
                  Tambah Obat
                </Button>
              </div>
            ) : (
              todayMedications.map(({ medication, log }) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  isTaken={log?.isTaken || false}
                  onToggle={() => handleMedicationToggle(medication.id)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Week Mood Chart */}
        <Card className="card-canva bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-lg">Mood Minggu Ini</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">
                Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-end h-32">
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dayLog = weekMoods.find(
                  (log) => new Date(log.loggedAt).toDateString() === date.toDateString()
                );
                const moodOption = dayLog ? MOOD_OPTIONS.find((m) => m.id === dayLog.mood) : null;
                const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                        moodOption
                          ? moodOption.bgColor
                          : "bg-gray-100"
                      }`}
                    >
                      {moodOption ? moodOption.emoji : "○"}
                    </div>
                    <span className="text-xs text-gray-500">
                      {dayNames[date.getDay()]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* PHQ-9 Card */}
        <Card 
          className="card-canva bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => router.push("/phq9")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="text-white">
                  <h3 className="font-bold text-lg">Survei PHQ-9</h3>
                  <p className="text-yellow-100">Cek kesehatan mental Anda</p>
                </div>
              </div>
              <ChevronRight className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            {[
              { icon: Heart, label: "Beranda", path: "/dashboard", active: true },
              { icon: Calendar, label: "Kalender", path: "/calendar", active: false },
              { icon: Pill, label: "Obat", path: "/medications", active: false },
              { icon: FileText, label: "PHQ-9", path: "/phq9", active: false },
              { icon: User, label: "Profil", path: "/profile", active: false },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  item.active
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </main>
  );
}
