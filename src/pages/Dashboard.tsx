import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { StatCard } from "@/components/StatCard";
import { Flame, Dumbbell, TrendingUp, Camera, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";

const Dashboard = () => {
  const recentAnalyses = [
    { name: "Flexões", accuracy: 92, issues: 1, time: "2 horas atrás" },
    { name: "Agachamento", accuracy: 78, issues: 3, time: "Ontem" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card p-6 pb-8 rounded-b-3xl border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Bem-vindo de volta!</h1>
            <p className="text-sm text-muted-foreground">Pronto para o seu próximo treino?</p>
          </div>
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-glow">
            <img src={logoIcon} alt="FitAR" className="w-8 h-8" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={Flame} value="12" label="days Streak" />
          <StatCard icon={Dumbbell} value="47" label="total Exercises" />
          <StatCard icon={TrendingUp} value="89%" label="Accuracy" />
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* CTA Button */}
        <Link to="/record">
          <Button variant="hero" size="lg" className="w-full h-14 text-base">
            <Camera className="w-5 h-5 mr-2" />
            Iniciar Gravação
            <span className="ml-auto text-xs opacity-80">Capture a sua execução</span>
          </Button>
        </Link>

        {/* Recent Analyses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Análises Recentes</h2>
            <Link to="/history" className="text-sm text-primary hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="space-y-3">
            {recentAnalyses.map((analysis, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-smooth cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{analysis.name}</h3>
                  <span className="text-2xl font-bold text-success">{analysis.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {analysis.accuracy}% accuracy
                    </span>
                    <span className="flex items-center gap-1 text-warning">
                      <AlertCircle className="w-4 h-4" />
                      {analysis.issues} issues
                    </span>
                  </div>
                  <span className="text-muted-foreground">{analysis.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
