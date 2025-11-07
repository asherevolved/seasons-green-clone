import { MapPin, ChevronDown, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DesktopNav } from "@/components/DesktopNav";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

export const LocationHeader = () => {
  const navigate = useNavigate();
  const location = useStore((state) => state.location);
  const fetchLocation = useStore((state) => state.fetchLocation);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return (
    <header className="sticky top-0 bg-card border-b border-border z-40 px-4 md:px-6 py-3 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 flex-1 hover:scale-105 transition-transform duration-200 cursor-pointer"
          onClick={() => fetchLocation()}
        >
          {location.isLoading ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <MapPin className="w-5 h-5 text-primary" />
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <h2 className="text-base font-semibold">{location.address}</h2>
              <ChevronDown className="w-4 h-4" />
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-none">
              {location.area}
            </p>
          </div>
        </div>
        <DesktopNav />
        <Button
          size="icon"
          className="md:hidden rounded-full bg-primary hover:bg-primary/90 hover:scale-110 active:scale-95 transition-transform duration-200"
          onClick={() => navigate("/profile")}
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
