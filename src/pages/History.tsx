import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Flame, TrendingUp, Clock, Calendar } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";
import { useExerciseHistory } from "@/hooks/useExerciseHistory";

const filters = ["Todos", "Essa semana", "Esse mês"];

const History = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const { history } = useExerciseHistory();
  
  const exercises = history.length > 0 ? history : [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card p-6 pb-8 rounded-b-3xl border-b border-border">
        <h1 className="text-2xl font-bold mb-6">Histórico de Exercícios</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border col-span-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Treinos</span>
              </div>
              <span className="text-3xl font-bold">47</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">Pontuação total</span>
              </div>
              <span className="text-3xl font-bold">86%</span>
            </div>
          </div>
          <StatCard icon={Clock} value="12h" label="Tempo total" />
          <StatCard icon={Calendar} value="12 Dias" label="Sequência" />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-smooth",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise List */}
      <div className="px-6 py-6 space-y-3">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-smooth cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <p className="text-xs text-muted-foreground">{exercise.date}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-2xl font-bold",
                    exercise.accuracy >= 90 ? "text-success" : 
                    exercise.accuracy >= 80 ? "text-warning" : 
                    "text-destructive"
                  )}>
                    {exercise.accuracy}%
                  </span>
                  {exercise.reps && <p className="text-xs text-muted-foreground">{exercise.reps} reps</p>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum exercício no histórico</p>
            <p className="text-sm mt-1">Comece gravando e salvando seus exercícios!</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default History;
