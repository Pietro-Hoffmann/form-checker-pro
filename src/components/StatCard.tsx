import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  className?: string;
}

export const StatCard = ({ icon: Icon, value, label, className }: StatCardProps) => {
  return (
    <div className={cn("bg-card rounded-xl p-4 flex flex-col items-center gap-2 border border-border", className)}>
      <Icon className="w-6 h-6 text-primary" />
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};
