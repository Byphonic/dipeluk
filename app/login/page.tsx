"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, Shield, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/lib/store";
import { DISEASES, PUSKESMAS_LIST, DiseaseId } from "@/lib/constants";

type Step = "bpjs" | "disease" | "puskesmas";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, user } = useAppStore();
  
  const [step, setStep] = useState<Step>("bpjs");
  const [bpjsNumber, setBpjsNumber] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedDiseases, setSelectedDiseases] = useState<DiseaseId[]>([]);
  const [selectedPuskesmas, setSelectedPuskesmas] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user?.isOnboarded) {
    router.push("/dashboard");
    return null;
  }

  const validateBPJS = (number: string) => {
    return /^\d{13}$/.test(number);
  };

  const handleBPJSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateBPJS(bpjsNumber)) {
      setError("Nomor BPJS harus 13 digit angka");
      return;
    }

    if (!name.trim()) {
      setError("Nama lengkap harus diisi");
      return;
    }

    if (!dateOfBirth) {
      setError("Tanggal lahir harus diisi");
      return;
    }

    setIsLoading(true);
    // Simulate API verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    setStep("disease");
  };

  const handleDiseaseToggle = (diseaseId: DiseaseId) => {
    setSelectedDiseases((prev) =>
      prev.includes(diseaseId)
        ? prev.filter((d) => d !== diseaseId)
        : [...prev, diseaseId]
    );
  };

  const handleDiseaseSubmit = () => {
    if (selectedDiseases.length === 0) {
      setError("Pilih minimal satu jenis penyakit");
      return;
    }
    setError("");
    setStep("puskesmas");
  };

  const handleFinalSubmit = () => {
    if (!selectedPuskesmas) {
      setError("Pilih Puskesmas terdaftar");
      return;
    }

    // Get medications based on selected diseases
    const medications = selectedDiseases.flatMap((diseaseId) => {
      const disease = DISEASES.find((d) => d.id === diseaseId);
      if (!disease) return [];
      return disease.medications.map((med, index) => ({
        id: `${diseaseId}-med-${index}`,
        name: med,
        dosage: "Sesuai resep dokter",
        frequency: "1x/hari",
        times: ["pagi"],
        diseaseId,
      }));
    });

    setUser({
      bpjsNumber,
      name,
      dateOfBirth,
      puskesmasId: selectedPuskesmas,
      diseases: selectedDiseases,
      medications,
      isOnboarded: true,
    });

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
      </div>

      <div className="w-full max-w-2xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="dipeluk logo"
              width={56}
              height={56}
              className="rounded-xl shadow-lg"
            />
            <h1 className="text-3xl font-bold text-blue-700">dipeluk</h1>
          </div>
          <p className="text-gray-600">Masuk dengan akun BPJS Kesehatan Anda</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { key: "bpjs", label: "Data BPJS" },
            { key: "disease", label: "Pilih Penyakit" },
            { key: "puskesmas", label: "Puskesmas" },
          ].map((s, index) => (
            <div key={s.key} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step === s.key
                    ? "bg-blue-600 text-white"
                    : index < ["bpjs", "disease", "puskesmas"].indexOf(step)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < ["bpjs", "disease", "puskesmas"].indexOf(step) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div
                  className={`w-16 h-1 mx-2 transition-all ${
                    index < ["bpjs", "disease", "puskesmas"].indexOf(step)
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="card-canva bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          {/* Step 1: BPJS Login */}
          {step === "bpjs" && (
            <>
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Login dengan BPJS Kesehatan
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Masukkan data BPJS Anda untuk verifikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleBPJSSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="bpjs" className="text-gray-700 font-medium">
                      Nomor BPJS Kesehatan
                    </Label>
                    <Input
                      id="bpjs"
                      type="text"
                      placeholder="Masukkan 13 digit nomor BPJS"
                      value={bpjsNumber}
                      onChange={(e) => setBpjsNumber(e.target.value.replace(/\D/g, "").slice(0, 13))}
                      className="h-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                    />
                    <p className="text-sm text-gray-500">{bpjsNumber.length}/13 digit</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Nama Lengkap (sesuai KTP)
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-gray-700 font-medium">
                      Tanggal Lahir
                    </Label>
                    <div className="relative">
                      <Input
                        id="dob"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="h-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl btn-canva"
                  >
                    {isLoading ? (
                      "Memverifikasi..."
                    ) : (
                      <>
                        Lanjutkan
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* Step 2: Disease Selection */}
          {step === "disease" && (
            <>
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 p-6">
                <CardTitle className="text-xl flex items-center gap-2">
                  🏥 Pilih Jenis Penyakit
                </CardTitle>
                <CardDescription className="text-yellow-800">
                  Pilih penyakit yang memerlukan pengobatan rutin
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {DISEASES.map((disease) => (
                    <div
                      key={disease.id}
                      onClick={() => handleDiseaseToggle(disease.id)}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedDiseases.includes(disease.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mt-0.5 ${
                          selectedDiseases.includes(disease.id)
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedDiseases.includes(disease.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{disease.icon}</span>
                          <span className="font-semibold text-gray-900">{disease.name}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Obat: {disease.medications.slice(0, 2).join(", ")}
                          {disease.medications.length > 2 && `, +${disease.medications.length - 2} lainnya`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep("bpjs")}
                    className="flex-1 h-12 rounded-xl border-2"
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={handleDiseaseSubmit}
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl btn-canva"
                  >
                    Lanjutkan
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Puskesmas Selection */}
          {step === "puskesmas" && (
            <>
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                <CardTitle className="text-xl flex items-center gap-2">
                  🏥 Pilih Puskesmas Terdaftar
                </CardTitle>
                <CardDescription className="text-green-100">
                  Pilih Puskesmas tempat Anda terdaftar
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {PUSKESMAS_LIST.map((puskesmas) => (
                    <div
                      key={puskesmas.id}
                      onClick={() => setSelectedPuskesmas(puskesmas.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPuskesmas === puskesmas.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{puskesmas.name}</p>
                        <p className="text-sm text-gray-500">{puskesmas.region}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPuskesmas === puskesmas.id
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPuskesmas === puskesmas.id && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {/* Summary */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">Ringkasan Data Anda</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><span className="font-medium">Nama:</span> {name}</p>
                    <p><span className="font-medium">No. BPJS:</span> {bpjsNumber}</p>
                    <p><span className="font-medium">Penyakit:</span> {selectedDiseases.length} terpilih</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep("disease")}
                    className="flex-1 h-12 rounded-xl border-2"
                  >
                    Kembali
                  </Button>
                  <Button
                    onClick={handleFinalSubmit}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl btn-canva"
                  >
                    Selesai & Masuk
                    <Check className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Help text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Butuh bantuan? Hubungi hotline <span className="text-blue-600 font-medium">119 ext 8</span>
        </p>
      </div>
    </main>
  );
}
