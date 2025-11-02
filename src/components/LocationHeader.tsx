import { MapPin, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const LocationHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 bg-card border-b border-border z-40 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="w-5 h-5 text-primary" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <h2 className="text-base font-semibold">10 Sector 55</h2>
              <ChevronDown className="w-4 h-4" />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              Sector 55, Gurugram, Haryana, In...
            </p>
          </div>
        </div>
        <Button
          size="icon"
          className="rounded-full bg-primary hover:bg-primary/90"
          onClick={() => navigate("/profile")}
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
