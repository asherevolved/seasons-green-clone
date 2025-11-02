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
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <img
          src={image}
          alt={title}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-0.5">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          size="icon"
          className="rounded-full bg-primary hover:bg-primary/90 shrink-0"
          onClick={onAdd}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      {badge && (
        <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
          {badge}
        </div>
      )}
    </Card>
  );
};
