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
      <div className="relative w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
        {image ? (
          <img 
            src={image} 
            alt={label} 
            className="w-full h-full object-contain drop-shadow-xl"
          />
        ) : Icon ? (
          <Icon className="w-10 h-10 text-primary drop-shadow-lg" />
        ) : null}
      </div>
      <span className="text-[11px] font-display font-semibold text-center leading-tight max-w-[70px]">{label}</span>
    </button>
  );
};
