import { useState, useEffect } from "react";

export interface ExerciseRecord {
  id: string;
  name: string;
  accuracy: number;
  issues: number;
  reps?: number;
  date: string;
  timestamp: number;
}

const STORAGE_KEY = "exercise_history";

export const useExerciseHistory = () => {
  const [history, setHistory] = useState<ExerciseRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const addExercise = (exercise: Omit<ExerciseRecord, "id" | "timestamp">) => {
    const newExercise: ExerciseRecord = {
      ...exercise,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updated = [newExercise, ...history];
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getRecentAnalyses = (limit: number = 2) => {
    return history.slice(0, limit);
  };

  return {
    history,
    addExercise,
    getRecentAnalyses,
  };
};
