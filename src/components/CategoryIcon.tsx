import { LucideIcon } from "lucide-react";

interface CategoryIconProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export const CategoryIcon = ({ icon: Icon, label, onClick }: CategoryIconProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 group"
    >
      <div className="relative w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-3d group-hover:shadow-3d-lg">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent" />
        <Icon className="w-9 h-9 text-primary-foreground relative z-10 drop-shadow-lg" />
      </div>
      <span className="text-xs font-semibold text-center leading-tight max-w-[80px]">{label}</span>
    </button>
  );
};
