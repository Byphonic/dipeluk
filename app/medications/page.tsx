"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Clock, 
  Pill,
  ChevronRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore, Medication } from "@/lib/store";
import { DISEASES, MEDICATION_FREQUENCIES, MEDICATION_TIMES, DiseaseId } from "@/lib/constants";

export default function MedicationsPage() {
  const router = useRouter();
  const { user, updateUser } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("1x/hari");
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["pagi"]);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseId | "">("");

  // Redirect if not logged in
  useEffect(() => {
    if (!user || !user.isOnboarded) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const userDiseases = user.diseases.map((id) => DISEASES.find((d) => d.id === id)).filter(Boolean);

  const resetForm = () => {
    setName("");
    setDosage("");
    setFrequency("1x/hari");
    setSelectedTimes(["pagi"]);
    setSelectedDisease("");
    setEditingMed(null);
    setShowForm(false);
  };

  const handleTimeToggle = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time)
        : [...prev, time]
    );
  };

  const handleSubmit = () => {
    if (!name || !dosage || !selectedDisease || selectedTimes.length === 0) {
      return;
    }

    const newMed: Medication = {
      id: editingMed?.id || crypto.randomUUID(),
      name,
      dosage,
      frequency,
      times: selectedTimes,
      diseaseId: selectedDisease,
    };

    const updatedMedications = editingMed
      ? user.medications.map((m) => (m.id === editingMed.id ? newMed : m))
      : [...user.medications, newMed];

    updateUser({ medications: updatedMedications });
    resetForm();
  };

  const handleEdit = (med: Medication) => {
    setEditingMed(med);
    setName(med.name);
    setDosage(med.dosage);
    setFrequency(med.frequency);
    setSelectedTimes(med.times);
    setSelectedDisease(med.diseaseId as DiseaseId);
    setShowForm(true);
  };

  const handleDelete = (medId: string) => {
    const updatedMedications = user.medications.filter((m) => m.id !== medId);
    updateUser({ medications: updatedMedications });
  };

  const handleQuickAdd = (disease: typeof DISEASES[number], medName: string) => {
    const newMed: Medication = {
      id: crypto.randomUUID(),
      name: medName,
      dosage: "Sesuai resep dokter",
      frequency: "1x/hari",
      times: ["pagi"],
      diseaseId: disease.id,
    };
    updateUser({ medications: [...user.medications, newMed] });
  };

  // Group medications by disease
  const medsByDisease = user.diseases.reduce((acc, diseaseId) => {
    const disease = DISEASES.find((d) => d.id === diseaseId);
    if (disease) {
      acc[diseaseId] = {
        disease,
        medications: user.medications.filter((m) => m.diseaseId === diseaseId),
      };
    }
    return acc;
  }, {} as Record<string, { disease: typeof DISEASES[number]; medications: Medication[] }>);

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
                <h1 className="text-xl font-bold">Kelola Obat</h1>
                <p className="text-blue-200 text-sm">dipeluk</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <Pill className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-700">{user.medications.length}</p>
              <p className="text-sm text-blue-600">Total Obat</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🏥</div>
              <p className="text-2xl font-bold text-yellow-700">{user.diseases.length}</p>
              <p className="text-sm text-yellow-600">Penyakit</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Medication Button */}
        <Button 
          onClick={() => setShowForm(true)}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl btn-canva"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Obat Baru
        </Button>

        {/* Medications by Disease */}
        {Object.entries(medsByDisease).map(([diseaseId, { disease, medications }]) => (
          <Card key={diseaseId} className="card-canva bg-white shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">{disease.icon}</span>
                {disease.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {medications.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="mb-3">Belum ada obat untuk penyakit ini</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {disease.medications.slice(0, 3).map((medName, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAdd(disease, medName)}
                        className="text-xs"
                      >
                        + {medName.length > 20 ? medName.substring(0, 20) + "..." : medName}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                medications.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{med.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{med.dosage}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {med.times.join(", ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(med)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(med.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}

        {/* Recommended Medications */}
        <Card className="card-canva bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-lg">💡 Rekomendasi Obat</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-4">
              Berdasarkan penyakit Anda, berikut obat yang mungkin diresepkan:
            </p>
            <div className="space-y-3">
              {userDiseases.map((disease) => (
                <div key={disease?.id} className="bg-blue-50 rounded-xl p-3">
                  <p className="font-medium text-blue-800 flex items-center gap-2">
                    {disease?.icon} {disease?.name}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {disease?.medications.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <Card className="w-full max-w-lg bg-white rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <CardTitle className="text-xl">
                {editingMed ? "Edit Obat" : "Tambah Obat Baru"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Penyakit</Label>
                <Select value={selectedDisease} onValueChange={(v) => setSelectedDisease(v as DiseaseId)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Pilih penyakit" />
                  </SelectTrigger>
                  <SelectContent>
                    {userDiseases.map((disease) => (
                      <SelectItem key={disease?.id} value={disease?.id || ""}>
                        {disease?.icon} {disease?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nama Obat</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Metformin"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Dosis</Label>
                <Input
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="Contoh: 500mg"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Frekuensi</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDICATION_FREQUENCIES.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Waktu Minum</Label>
                <div className="flex flex-wrap gap-2">
                  {MEDICATION_TIMES.map((time) => (
                    <button
                      key={time.value}
                      type="button"
                      onClick={() => handleTimeToggle(time.value)}
                      className={`px-4 py-2 rounded-xl border-2 transition-all ${
                        selectedTimes.includes(time.value)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {selectedTimes.includes(time.value) && (
                        <Check className="w-4 h-4 inline mr-1" />
                      )}
                      {time.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 h-12 rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!name || !dosage || !selectedDisease || selectedTimes.length === 0}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl btn-canva"
                >
                  {editingMed ? "Simpan Perubahan" : "Tambah Obat"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
