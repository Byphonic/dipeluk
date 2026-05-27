export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-4xl font-bold text-sky-600">DIPELUK</h1>
      <p className="mt-4 text-xl text-slate-600">Dukungan Intensif Pendampingan dan Layanan untuk Kesehatan Mental</p>
      <a href="/phq9" className="mt-8 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition">Mulai Survei PHQ-9</a>
    </main>
  );
}