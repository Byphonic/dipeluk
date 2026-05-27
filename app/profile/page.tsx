"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  LogOut,
  User,
  Shield,
  Heart,
  Bell,
  ChevronRight,
  Edit,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { DISEASES, PUSKESMAS_LIST } from "@/lib/constants";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, getMedicationStreak, moodLogs } = useAppStore();

  // Redirect if not logged in
  useEffect(() => {
    if (!user || !user.isOnboarded) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const streak = getMedicationStreak();
  const userDiseases = user.diseases.map((id) => DISEASES.find((d) => d.id === id)).filter(Boolean);
  const puskesmas = PUSKESMAS_LIST.find((p) => p.id === user.puskesmasId);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
                <h1 className="text-xl font-bold">Profil Saya</h1>
                <p className="text-blue-200 text-sm">dipeluk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="container mx-auto px-4 pb-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-4xl shadow-lg">
                  👤
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-blue-200 text-sm">Pasien BPJS Kesehatan</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      🔥 {streak} hari streak
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      📊 {moodLogs.length} mood logs
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* BPJS Info */}
        <Card className="card-canva bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Informasi BPJS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Nomor BPJS</span>
              <span className="font-mono font-semibold">{user.bpjsNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tanggal Lahir</span>
              <span className="font-semibold">
                {new Date(user.dateOfBirth).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Puskesmas Info */}
        <Card className="card-canva bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-600" />
              Puskesmas Terdaftar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{puskesmas?.name}</p>
                <p className="text-sm text-gray-500">{puskesmas?.region}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-blue-600">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Diseases */}
        <Card className="card-canva bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Kondisi Kesehatan
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {userDiseases.map((disease) => (
                <div
                  key={disease?.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <span className="text-2xl">{disease?.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{disease?.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.medications.filter((m) => m.diseaseId === disease?.id).length} obat aktif
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="card-canva bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-lg">Pengaturan</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {[
              { icon: Bell, label: "Notifikasi", desc: "Kelola pengingat obat" },
              { icon: User, label: "Edit Profil", desc: "Ubah nama dan foto" },
            ].map((item, index) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all ${
                  index < 1 ? "border-b" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-14 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Keluar dari Akun
        </Button>

        {/* App Info */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>dipeluk v1.0.0</p>
          <p>Dukungan Intensif Pendampingan dan Layanan Kesehatan Mental</p>
          <p className="text-yellow-600 font-medium">Hotline: 119 ext 8</p>
        </div>
      </div>
    </main>
  );
}
