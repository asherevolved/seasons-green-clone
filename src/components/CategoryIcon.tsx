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
      className="flex flex-col items-center gap-2 group"
    >
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/80 transition-all duration-300 hover-scale">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <span className="text-sm font-medium text-center leading-tight">{label}</span>
    </button>
  );
};
