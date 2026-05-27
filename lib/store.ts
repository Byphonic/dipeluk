import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DiseaseId, MoodId } from "./constants";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  diseaseId: string;
}

export interface MoodLog {
  id: string;
  mood: MoodId;
  note?: string;
  loggedAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  scheduledAt: string;
  takenAt?: string;
  isTaken: boolean;
}

export interface UserProfile {
  bpjsNumber: string;
  name: string;
  dateOfBirth: string;
  puskesmasId: string;
  diseases: DiseaseId[];
  medications: Medication[];
  isOnboarded: boolean;
}

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  
  // Mood
  moodLogs: MoodLog[];
  addMoodLog: (mood: MoodId, note?: string) => void;
  getTodayMood: () => MoodLog | undefined;
  getWeekMoods: () => MoodLog[];
  
  // Medications
  medicationLogs: MedicationLog[];
  addMedicationLog: (medicationId: string, scheduledAt: string, isTaken: boolean) => void;
  getMedicationStreak: () => number;
  getTodayMedications: () => { medication: Medication; log?: MedicationLog }[];
  
  // Reset
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Mood
      moodLogs: [],
      addMoodLog: (mood, note) => {
        const newLog: MoodLog = {
          id: crypto.randomUUID(),
          mood,
          note,
          loggedAt: new Date().toISOString(),
        };
        set((state) => ({ moodLogs: [...state.moodLogs, newLog] }));
      },
      getTodayMood: () => {
        const today = new Date().toDateString();
        return get().moodLogs.find(
          (log) => new Date(log.loggedAt).toDateString() === today
        );
      },
      getWeekMoods: () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return get().moodLogs.filter(
          (log) => new Date(log.loggedAt) >= weekAgo
        );
      },

      // Medications
      medicationLogs: [],
      addMedicationLog: (medicationId, scheduledAt, isTaken) => {
        const newLog: MedicationLog = {
          id: crypto.randomUUID(),
          medicationId,
          scheduledAt,
          takenAt: isTaken ? new Date().toISOString() : undefined,
          isTaken,
        };
        set((state) => {
          // Check if log already exists for this medication and scheduled time
          const existingIndex = state.medicationLogs.findIndex(
            (log) =>
              log.medicationId === medicationId &&
              log.scheduledAt === scheduledAt
          );
          if (existingIndex >= 0) {
            const updated = [...state.medicationLogs];
            updated[existingIndex] = newLog;
            return { medicationLogs: updated };
          }
          return { medicationLogs: [...state.medicationLogs, newLog] };
        });
      },
      getMedicationStreak: () => {
        const logs = get().medicationLogs;
        const user = get().user;
        if (!user || user.medications.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          const dateStr = checkDate.toDateString();

          const dayLogs = logs.filter(
            (log) => new Date(log.scheduledAt).toDateString() === dateStr
          );

          if (dayLogs.length === 0) {
            if (i === 0) continue; // Today might not have logs yet
            break;
          }

          const allTaken = dayLogs.every((log) => log.isTaken);
          if (allTaken) {
            streak++;
          } else {
            break;
          }
        }

        return streak;
      },
      getTodayMedications: () => {
        const user = get().user;
        if (!user) return [];

        const today = new Date().toDateString();
        const logs = get().medicationLogs;

        return user.medications.map((medication) => {
          const log = logs.find(
            (l) =>
              l.medicationId === medication.id &&
              new Date(l.scheduledAt).toDateString() === today
          );
          return { medication, log };
        });
      },

      // Reset
      logout: () =>
        set({
          user: null,
          moodLogs: [],
          medicationLogs: [],
        }),
    }),
    {
      name: "dipeluk-storage",
    }
  )
);
