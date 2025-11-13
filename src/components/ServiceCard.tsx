import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
  badge?: string;
  onAdd: () => void;
}

export const ServiceCard = ({
  image,
  title,
  description,
  badge,
  onAdd,
}: ServiceCardProps) => {
  return (
    <Card className="relative overflow-hidden card-3d cursor-pointer group">
      <div className="flex items-center gap-4 p-4">
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-300" />
          <img
            src={image}
            alt={title}
            className="relative w-24 h-24 object-cover rounded-2xl shadow-3d"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        <Button
          size="icon"
          className="rounded-full gradient-primary shrink-0 transition-all duration-300 hover:scale-110 active:scale-95 shadow-3d hover:shadow-3d-lg border-0"
          onClick={onAdd}
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </Button>
      </div>
      {badge && (
        <div className="absolute top-3 right-3 gradient-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-3d">
          {badge}
        </div>
      )}
    </Card>
  );
};
