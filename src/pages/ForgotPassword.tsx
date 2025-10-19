import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoIcon from "@/assets/logo-icon.png";
import { supabase } from "@/lib/supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <Link to="/login" className="mb-8">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto">
        <div className="w-full space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-glow">
              <img src={logoIcon} alt="FitAR Logo" className="w-14 h-14" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-center">Recuperar Senha</h1>
              <p className="text-sm text-muted-foreground text-center">
                Digite seu email para receber o link de recuperação
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleResetRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </Button>

            <Link to="/login" className="w-full">
              <Button type="button" variant="outline" size="lg" className="w-full">
                Voltar ao Login
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
