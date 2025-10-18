import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Flame, TrendingUp, Clock, Calendar } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";

const filters = ["Todos", "Essa semana", "Esse mês"];

const exercises = [
  { name: "Flexões", accuracy: 92, reps: 15, date: "Hoje 14:30" },
  { name: "Agachamento", accuracy: 78, reps: 20, date: "Ontem" },
  { name: "Afundo", accuracy: 95, reps: 10, date: "Ontem 13:00" },
  { name: "Prancha", accuracy: 88, reps: 1, date: "Hoje 14:45" },
  { name: "Flexões", accuracy: 85, reps: 12, date: "2 dias atrás 19:15" },
];

const History = () => {
  const [activeFilter, setActiveFilter] = useState("Todos");

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
        {exercises.map((exercise, index) => (
          <div
            key={index}
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
                <p className="text-xs text-muted-foreground">{exercise.reps} reps</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default History;
