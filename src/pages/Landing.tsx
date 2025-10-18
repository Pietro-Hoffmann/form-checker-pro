import { Button } from "@/components/ui/button";
import { Camera, Brain, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-glow">
            <img src={logoIcon} alt="FitAR Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold">
            Fit<span className="text-primary">AR</span>
          </h1>
        </div>

        {/* Description */}
        <p className="text-lg text-muted-foreground">
          Aperfeiçoe-se utilizando IA
        </p>
        <p className="text-sm text-muted-foreground">
          Envie seus vídeos de treinos e receba feedback instantâneo sobre a sua forma, técnica e segurança
        </p>

        {/* Features */}
        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Grave o exercício</h3>
              <p className="text-sm text-muted-foreground">Capture seu treino</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Analise com IA</h3>
              <p className="text-sm text-muted-foreground">Receba um feedback instantâneo</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Acompanhe seu progresso</h3>
              <p className="text-sm text-muted-foreground">Monitore toda a sua evolução</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Link to="/login">
            <Button variant="hero" size="lg" className="w-full">
              Começar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
