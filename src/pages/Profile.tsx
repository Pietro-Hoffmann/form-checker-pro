import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { User, Trophy, Settings, Dumbbell, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const stats = [
    { label: "Treinos", value: "47" },
    { label: "Pontuação Total", value: "86%" },
    { label: "Sequência", value: "12 dias" },
  ];

  const achievements = [
    { icon: Trophy, title: "Execução Perfeita", description: "5 exercícios com 100%" },
    { icon: Trophy, title: "Melhorando", description: "Treinou por 7 dias seguidos" },
    { icon: Trophy, title: "Consistência", description: "30 exercícios completados" },
  ];

  const settingsSections = [
    { icon: Dumbbell, title: "Preferências de Treino", link: "#" },
    { icon: Bell, title: "Notificações", link: "#" },
    { icon: Shield, title: "Privacidade e Dados", link: "#" },
    { icon: HelpCircle, title: "Ajuda e Suporte", link: "#" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card p-6 pb-8 rounded-b-3xl border-b border-border">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-sm text-muted-foreground">Entusiasta Fitness</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-3 text-center border border-border">
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Achievements */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Conquistas Recentes</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl p-4 border border-border flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Configurações</h2>
          <div className="space-y-2">
            {settingsSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Link
                  key={index}
                  to={section.link}
                  className="bg-card rounded-xl p-4 border border-border flex items-center gap-3 hover:border-primary/50 transition-smooth"
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="flex-1 font-medium">{section.title}</span>
                  <span className="text-muted-foreground">›</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <Link to="/">
          <Button variant="destructive" size="lg" className="w-full">
            <LogOut className="w-5 h-5 mr-2" />
            Sair
          </Button>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
