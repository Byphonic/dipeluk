"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const { user } = useAppStore();

  // If user is already logged in and onboarded, redirect to dashboard
  if (user?.isOnboarded) {
    router.push("/dashboard");
    return null;
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: "2s" }} />
        </div>

        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="dipeluk logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold text-blue-700">dipeluk</span>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => router.push("/login")}
            >
              Masuk
            </Button>
          </nav>
        </header>

        {/* Hero Content */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Platform Kesehatan Mental #1 Indonesia
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-blue-600">Dukungan Intensif</span>
                <br />
                Pendampingan dan Layanan
                <br />
                <span className="text-yellow-500">Kesehatan Mental</span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-lg">
                dipeluk membantu Anda memantau kesehatan mental dan kepatuhan pengobatan dengan mudah. Terintegrasi dengan BPJS Kesehatan untuk layanan yang lebih baik.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="btn-canva bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl"
                  onClick={() => router.push("/login")}
                >
                  Mulai Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="btn-canva border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50 px-8 py-6 text-lg rounded-xl"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Terintegrasi BPJS</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm">10,000+ Pengguna</span>
                </div>
              </div>
            </div>

            {/* Hero illustration/card */}
            <div className="relative">
              <Card className="card-canva bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <CardTitle className="text-xl">Selamat Datang di dipeluk! 👋</CardTitle>
                  <CardDescription className="text-blue-100">
                    Pantau kesehatan mentalmu setiap hari
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Mini mood tracker preview */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Bagaimana perasaanmu hari ini?</p>
                    <div className="flex justify-center gap-6">
                      <button className="mood-button text-5xl p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-all">
                        😊
                      </button>
                      <button className="mood-button text-5xl p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 transition-all">
                        😐
                      </button>
                      <button className="mood-button text-5xl p-4 rounded-2xl bg-red-50 hover:bg-red-100 transition-all">
                        😢
                      </button>
                    </div>
                  </div>

                  {/* Mini medication preview */}
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                          💊
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Obat Hari Ini</p>
                          <p className="text-sm text-gray-600">2 dari 3 sudah diminum</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">67%</div>
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <span className="text-3xl">🔥</span>
                    <span className="text-lg font-semibold">7 hari berturut-turut!</span>
                  </div>
                </CardContent>
              </Card>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-2xl rotate-12 flex items-center justify-center text-3xl shadow-lg animate-float">
                ✨
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500 rounded-2xl -rotate-12 flex items-center justify-center text-2xl shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                💪
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur <span className="text-blue-600">Unggulan</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk menjaga kesehatan mental dan kepatuhan pengobatan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Mood Tracker Harian",
                description: "Pantau perasaan Anda setiap hari dengan emoji yang mudah dipahami",
                color: "bg-green-50 border-green-200",
              },
              {
                icon: "💊",
                title: "Pengingat Obat",
                description: "Notifikasi tepat waktu untuk minum obat sesuai jadwal",
                color: "bg-blue-50 border-blue-200",
              },
              {
                icon: "📝",
                title: "Survei PHQ-9",
                description: "Skrining depresi berkala dengan hasil yang mudah dipahami",
                color: "bg-yellow-50 border-yellow-200",
              },
              {
                icon: "🏥",
                title: "Koneksi Puskesmas",
                description: "Terhubung langsung dengan petugas kesehatan Anda",
                color: "bg-purple-50 border-purple-200",
              },
              {
                icon: "🔔",
                title: "Notifikasi Pintar",
                description: "Pengingat otomatis yang disesuaikan dengan jadwal Anda",
                color: "bg-orange-50 border-orange-200",
              },
              {
                icon: "📈",
                title: "Laporan Progres",
                description: "Lihat perkembangan kesehatan Anda dalam grafik yang jelas",
                color: "bg-pink-50 border-pink-200",
              },
            ].map((feature, index) => (
              <Card 
                key={index} 
                className={`card-canva ${feature.color} border-2 rounded-2xl p-6 hover:shadow-lg`}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Memulai Perjalanan Kesehatan Anda?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna lain yang sudah merasakan manfaat dipeluk
          </p>
          <Button 
            size="lg" 
            className="btn-canva bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-12 py-6 text-lg rounded-xl font-bold"
            onClick={() => router.push("/login")}
          >
            Daftar Sekarang - Gratis!
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="dipeluk logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold">dipeluk</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 dipeluk. Dukungan Intensif Pendampingan dan Layanan Kesehatan Mental.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Hotline Kesehatan Jiwa:</span>
              <span className="text-yellow-400 font-bold">119 ext 8</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
