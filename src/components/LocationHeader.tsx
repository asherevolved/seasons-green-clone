import { MapPin, ChevronDown, User, Loader2, MapPinPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DesktopNav } from "@/components/DesktopNav";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ManualLocationDialog } from "@/components/ManualLocationDialog";

export const LocationHeader = () => {
  const navigate = useNavigate();
  const location = useStore((state) => state.location);
  const fetchLocation = useStore((state) => state.fetchLocation);
  const [isManualLocationOpen, setIsManualLocationOpen] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return (
    <header className="sticky top-0 bg-card border-b border-border z-40 px-4 md:px-6 py-3 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div 
          className="flex items-center gap-2 flex-1 min-w-0"
        >
          {location.isLoading ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
          ) : (
            <MapPin className="w-5 h-5 text-primary shrink-0" />
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h2 className="text-base font-semibold truncate">{location.address}</h2>
              <ChevronDown className="w-4 h-4 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {location.area}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-secondary"
            onClick={() => setIsManualLocationOpen(true)}
            title="Enter location manually"
          >
            <MapPinPlus className="w-5 h-5" />
          </Button>
          <DesktopNav />
          <Button
            size="icon"
            className="md:hidden rounded-full bg-primary hover:bg-primary/90 hover:scale-110 active:scale-95 transition-transform duration-200"
            onClick={() => navigate("/profile")}
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <ManualLocationDialog 
        open={isManualLocationOpen} 
        onOpenChange={setIsManualLocationOpen} 
      />
    </header>
  );
};
