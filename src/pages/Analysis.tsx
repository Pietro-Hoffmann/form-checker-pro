import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";

const Analysis = () => {
  const score = 92;
  const feedbackItems = [
    {
      type: "success",
      title: "Posição perfeita dos braços",
      description: "Seus braços estavam posicionados corretamente durante todas as repetições",
    },
    {
      type: "warning",
      title: "Leve arqueamento das costas",
      description: "Mantenha a core contraído para manter uma linha reta",
    },
    {
      type: "success",
      title: "Bom controle de ritmo",
      description: "Ritmo consistente mantido durante todas as repetições",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card p-6 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Resultado da Análise</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Score Circle */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-40 h-40">
            {/* Circular progress */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
                className="text-success transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-success">{score}</span>
              <span className="text-sm text-muted-foreground">Score</span>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-bold mb-1">Excelente Execução</h2>
            <p className="text-sm text-muted-foreground">Flexões - 15 reps analisadas</p>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div>
          <h3 className="text-lg font-semibold mb-4">FeedBack Detalhado</h3>
          <div className="space-y-3">
            {feedbackItems.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.type === "success" 
                      ? "bg-success/10" 
                      : item.type === "warning" 
                      ? "bg-warning/10" 
                      : "bg-primary/10"
                  }`}>
                    {item.type === "success" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : item.type === "warning" ? (
                      <AlertCircle className="w-5 h-5 text-warning" />
                    ) : (
                      <Info className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Link to="/record" className="block">
            <Button variant="hero" size="lg" className="w-full">
              Tente outro exercício
            </Button>
          </Link>
          <Button variant="secondary" size="lg" className="w-full">
            Salvar no histórico
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Analysis;
