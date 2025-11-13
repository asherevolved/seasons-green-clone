import { LucideIcon } from "lucide-react";

interface CategoryIconProps {
  icon?: LucideIcon;
  image?: string;
  label: string;
  onClick?: () => void;
}

export const CategoryIcon = ({ icon: Icon, image, label, onClick }: CategoryIconProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 group"
    >
      <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-white to-secondary/50 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-3d-lg group-hover:shadow-3d-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        {image ? (
          <img 
            src={image} 
            alt={label} 
            className="w-14 h-14 object-contain relative z-10 drop-shadow-2xl"
          />
        ) : Icon ? (
          <Icon className="w-9 h-9 text-primary relative z-10 drop-shadow-lg" />
        ) : null}
      </div>
      <span className="text-xs font-semibold text-center leading-tight max-w-[80px]">{label}</span>
    </button>
  );
};
