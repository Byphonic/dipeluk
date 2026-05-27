export const PHQ9_QUESTIONS = [
  "Kurang tertarik atau tidak bergairah dalam melakukan apapun",
  "Merasa sedih, tertekan, atau putus asa",
  "Sulit tidur, mudah terbangun, atau terlalu banyak tidur",
  "Merasa lelah atau kurang bertenaga",
  "Kurang nafsu makan atau makan berlebihan",
  "Merasa buruk tentang diri sendiri — atau merasa gagal, atau merasa mengecewakan diri sendiri atau keluarga",
  "Sulit berkonsentrasi pada sesuatu, misalnya membaca koran atau menonton televisi",
  "Bergerak atau berbicara sangat lambat sehingga orang lain memperhatikannya — atau sebaliknya, sangat gelisah atau resah sehingga lebih sering bergerak dari biasanya",
  "Berpikir bahwa lebih baik mati, atau ingin menyakiti diri sendiri dengan cara apapun",
];

export type PHQ9Answers = {
  [key: string]: number; // q1: 0, q2: 1, ... q9: 3
};

export interface PHQ9ScoreResult {
  totalScore: number;
  severity: string;
  item9Score: number;
  severityLevel: 'minimal' | 'ringan' | 'sedang' | 'sedang-berat' | 'berat';
}

export function calculatePHQ9Score(answers: PHQ9Answers): PHQ9ScoreResult {
  let totalScore = 0;
  for (let i = 1; i <= 9; i++) {
    totalScore += answers[`q${i}`] || 0;
  }

  const item9Score = answers['q9'] || 0;

  let severity: string;
  let severityLevel: PHQ9ScoreResult['severityLevel'];

  if (totalScore >= 20) {
    severity = "Depresi berat";
    severityLevel = 'berat';
  } else if (totalScore >= 15) {
    severity = "Depresi sedang-berat";
    severityLevel = 'sedang-berat';
  } else if (totalScore >= 10) {
    severity = "Depresi sedang";
    severityLevel = 'sedang';
  } else if (totalScore >= 5) {
    severity = "Depresi ringan";
    severityLevel = 'ringan';
  } else {
    severity = "Minimal / Tidak ada depresi";
    severityLevel = 'minimal';
  }

  return { totalScore, severity, item9Score, severityLevel };
}