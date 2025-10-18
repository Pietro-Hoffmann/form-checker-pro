import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const exercises = [
  { id: "flexoes", name: "Flexões", subtitle: "Clique para selecionar" },
  { id: "agachamento", name: "Agachamento", subtitle: "Clique para selecionar" },
  { id: "afundos", name: "Afundos", subtitle: "Clique para selecionar" },
  { id: "prancha", name: "Prancha", subtitle: "Clique para selecionar" },
];

const Record = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartRecording = () => {
    if (!selectedExercise) {
      toast({
        title: "Selecione um exercício",
        description: "Escolha o exercício que deseja gravar",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Gravação iniciada",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleUploadVideo = () => {
    if (!selectedExercise) {
      toast({
        title: "Selecione um exercício",
        description: "Escolha o exercício antes de fazer upload",
        variant: "destructive",
      });
      return;
    }
    // TODO: Implement video upload with Supabase Storage
    toast({
      title: "Upload simulado",
      description: "Redirecionando para análise...",
    });
    setTimeout(() => navigate("/analysis"), 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card p-6 pb-6 border-b border-border">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Gravar Exercício</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Camera Preview */}
        <div className="relative aspect-video bg-card rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 overflow-hidden">
          <Camera className="w-16 h-16 text-muted-foreground" />
          <div className="text-center px-4">
            <p className="text-sm text-muted-foreground">
              Posicione-se dentro do quadro
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Certifique-se de que todo seu corpo esteja visível
            </p>
          </div>
          {/* Recording corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
        </div>

        {/* Exercise Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Selecione o Exercício</h2>
          <div className="grid grid-cols-2 gap-3">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise.id)}
                className={`p-4 rounded-xl border-2 text-left transition-smooth ${
                  selectedExercise === exercise.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <h3 className="font-semibold">{exercise.name}</h3>
                <p className="text-xs text-muted-foreground">{exercise.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            variant="hero"
            size="lg"
            className="w-full h-14"
            onClick={handleStartRecording}
          >
            <Camera className="w-5 h-5 mr-2" />
            Iniciar Gravação
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full h-14"
            onClick={handleUploadVideo}
          >
            <Upload className="w-5 h-5 mr-2" />
            Enviar Vídeo
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Record;
