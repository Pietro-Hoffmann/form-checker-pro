import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Camera, Upload, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePoseEstimator } from "@/hooks/usePoseEstimator";
import { Progress } from "@/components/ui/progress";

const exercises = [
  { id: "flexoes", name: "Flexões", subtitle: "Clique para selecionar" },
  { id: "agachamento", name: "Agachamento", subtitle: "Clique para selecionar" },
  { id: "afundos", name: "Afundos", subtitle: "Clique para selecionar" },
  { id: "prancha", name: "Prancha", subtitle: "Clique para selecionar" },
];

const Record = () => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { processVideo, isProcessing, progress } = usePoseEstimator();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast({
        title: "Vídeo carregado",
        description: "Agora selecione o exercício e clique em processar",
      });
    } else {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo de vídeo válido.",
        variant: "destructive",
      });
    }
  };

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
      title: "Gravação pela câmera",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcessVideo = async () => {
    if (!selectedExercise) {
      toast({
        title: "Selecione um exercício",
        description: "Escolha o exercício antes de processar",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedVideo) {
      toast({
        title: "Faça upload de um vídeo",
        description: "Envie um vídeo antes de processar",
        variant: "destructive",
      });
      return;
    }

    try {
      await processVideo(uploadedVideo, (processedUrl) => {
        toast({
          title: "Processamento concluído!",
          description: "Redirecionando para análise...",
        });
        
        // Passar dados para a página de análise
        navigate("/analysis", {
          state: {
            exercise: exercises.find(ex => ex.id === selectedExercise)?.name,
            processedVideoUrl: processedUrl,
            originalVideoUrl: previewUrl,
          }
        });
      });
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o vídeo.",
        variant: "destructive",
      });
    }
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
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Video Preview */}
        <div className="relative aspect-video bg-card rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 overflow-hidden">
          {previewUrl ? (
            <video
              src={previewUrl}
              controls
              className="w-full h-full object-contain rounded-2xl"
            />
          ) : (
            <>
              <Camera className="w-16 h-16 text-muted-foreground" />
              <div className="text-center px-4">
                <p className="text-sm text-muted-foreground">
                  Envie um vídeo do seu exercício
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
            </>
          )}
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

        {/* Processing Progress */}
        {isProcessing && (
          <div className="bg-card rounded-xl p-4 border border-border space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-semibold">Processando vídeo... {progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              Analisando movimentos com IA. Isso pode levar alguns minutos.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          {uploadedVideo ? (
            <Button
              variant="hero"
              size="lg"
              className="w-full h-14"
              onClick={handleProcessVideo}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Processar Vídeo
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                variant="hero"
                size="lg"
                className="w-full h-14"
                onClick={handleStartRecording}
              >
                <Camera className="w-5 h-5 mr-2" />
                Gravar com Câmera
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full h-14"
                onClick={handleUploadClick}
              >
                <Upload className="w-5 h-5 mr-2" />
                Enviar Vídeo
              </Button>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Record;