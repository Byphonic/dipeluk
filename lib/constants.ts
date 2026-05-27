// Disease types with their recommended medications
export const DISEASES = [
  {
    id: "diabetes-tipe-1",
    name: "Diabetes Mellitus Tipe 1",
    icon: "💉",
    medications: ["Insulin (rapid acting, long acting)"],
  },
  {
    id: "diabetes-tipe-2",
    name: "Diabetes Mellitus Tipe 2",
    icon: "💊",
    medications: ["Metformin", "Glimepiride", "Insulin", "Empagliflozin"],
  },
  {
    id: "hipertensi",
    name: "Hipertensi",
    icon: "❤️",
    medications: ["Amlodipine", "Captopril", "Valsartan", "Bisoprolol"],
  },
  {
    id: "tuberkulosis",
    name: "Tuberkulosis",
    icon: "🫁",
    medications: ["Rifampicin", "Isoniazid", "Pyrazinamide", "Ethambutol (selama regimen terapi)"],
  },
  {
    id: "hiv-aids",
    name: "HIV/AIDS",
    icon: "🛡️",
    medications: ["Tenofovir", "Lamivudine", "Dolutegravir (ARV)"],
  },
  {
    id: "epilepsi",
    name: "Epilepsi",
    icon: "⚡",
    medications: ["Asam valproat", "Carbamazepine", "Levetiracetam"],
  },
  {
    id: "skizofrenia",
    name: "Skizofrenia",
    icon: "🧠",
    medications: ["Risperidone", "Olanzapine", "Clozapine"],
  },
  {
    id: "gangguan-bipolar",
    name: "Gangguan Bipolar",
    icon: "🎭",
    medications: ["Lithium", "Valproate", "Quetiapine"],
  },
  {
    id: "depresi-mayor",
    name: "Depresi Mayor",
    icon: "😔",
    medications: ["Fluoxetine", "Sertraline", "Escitalopram"],
  },
  {
    id: "asma",
    name: "Asma",
    icon: "🌬️",
    medications: ["Salbutamol inhaler", "Budesonide", "Fluticasone"],
  },
  {
    id: "ppok",
    name: "Penyakit Paru Obstruktif Kronik",
    icon: "🫁",
    medications: ["Tiotropium", "Salmeterol", "Budesonide"],
  },
  {
    id: "gagal-ginjal",
    name: "Penyakit Ginjal Kronik",
    icon: "🫘",
    medications: ["Furosemide", "Erythropoietin", "Antihipertensi"],
  },
  {
    id: "hipotiroidisme",
    name: "Hipotiroidisme",
    icon: "🦋",
    medications: ["Levothyroxine"],
  },
  {
    id: "jantung-koroner",
    name: "Penyakit Jantung Koroner",
    icon: "💔",
    medications: ["Aspirin", "Clopidogrel", "Atorvastatin"],
  },
  {
    id: "gagal-jantung",
    name: "Gagal Jantung",
    icon: "❤️‍🩹",
    medications: ["Bisoprolol", "Spironolactone", "Furosemide"],
  },
  {
    id: "lupus",
    name: "Lupus Eritematosus Sistemik",
    icon: "🦋",
    medications: ["Hydroxychloroquine", "Methylprednisolone"],
  },
  {
    id: "rheumatoid-arthritis",
    name: "Rheumatoid Arthritis",
    icon: "🦴",
    medications: ["Methotrexate", "Sulfasalazine"],
  },
  {
    id: "malaria",
    name: "Malaria",
    icon: "🦟",
    medications: ["Biasanya tidak kontinu seumur hidup, tetapi pada profilaksis tertentu dapat menggunakan doxycycline atau atovaquone-proguanil"],
  },
  {
    id: "dislipidemia",
    name: "Dislipidemia",
    icon: "🩸",
    medications: ["Simvastatin", "Atorvastatin"],
  },
  {
    id: "parkinson",
    name: "Parkinson",
    icon: "🧠",
    medications: ["Levodopa-carbidopa"],
  },
  {
    id: "glaukoma",
    name: "Glaukoma",
    icon: "👁️",
    medications: ["Timolol tetes mata", "Latanoprost"],
  },
] as const;

export type DiseaseId = typeof DISEASES[number]["id"];

export const MOOD_OPTIONS = [
  {
    id: "baik",
    emoji: "😊",
    label: "Baik",
    color: "#22c55e",
    bgColor: "bg-green-100",
    borderColor: "border-green-500",
    textColor: "text-green-700",
  },
  {
    id: "sedang",
    emoji: "😐",
    label: "Sedang",
    color: "#f59e0b",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-500",
    textColor: "text-amber-700",
  },
  {
    id: "buruk",
    emoji: "😢",
    label: "Buruk",
    color: "#ef4444",
    bgColor: "bg-red-100",
    borderColor: "border-red-500",
    textColor: "text-red-700",
  },
] as const;

export type MoodId = typeof MOOD_OPTIONS[number]["id"];

export const MEDICATION_FREQUENCIES = [
  { value: "1x/hari", label: "1x sehari" },
  { value: "2x/hari", label: "2x sehari" },
  { value: "3x/hari", label: "3x sehari" },
  { value: "4x/hari", label: "4x sehari" },
] as const;

export const MEDICATION_TIMES = [
  { value: "pagi", label: "Pagi (06:00 - 09:00)" },
  { value: "siang", label: "Siang (12:00 - 14:00)" },
  { value: "sore", label: "Sore (17:00 - 18:00)" },
  { value: "malam", label: "Malam (20:00 - 21:00)" },
  { value: "sebelum-tidur", label: "Sebelum Tidur (22:00)" },
] as const;

// Sample Puskesmas data
export const PUSKESMAS_LIST = [
  { id: "pks-001", name: "Puskesmas Kecamatan Menteng", region: "Jakarta Pusat" },
  { id: "pks-002", name: "Puskesmas Kecamatan Tebet", region: "Jakarta Selatan" },
  { id: "pks-003", name: "Puskesmas Kecamatan Kebayoran Baru", region: "Jakarta Selatan" },
  { id: "pks-004", name: "Puskesmas Kecamatan Tanah Abang", region: "Jakarta Pusat" },
  { id: "pks-005", name: "Puskesmas Kecamatan Kemang", region: "Jakarta Selatan" },
] as const;
