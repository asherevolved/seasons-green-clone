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
      className="flex flex-col items-center gap-2 group"
    >
      <div className="relative w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
        {image ? (
          <img 
            src={image} 
            alt={label} 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        ) : Icon ? (
          <Icon className="w-12 h-12 text-primary drop-shadow-lg" />
        ) : null}
      </div>
      <span className="text-xs font-display font-semibold text-center leading-tight max-w-[80px]">{label}</span>
    </button>
  );
};
