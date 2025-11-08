import { MapPin, ChevronDown, User, Loader2, MapPinPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DesktopNav } from "@/components/DesktopNav";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ManualLocationDialog } from "@/components/ManualLocationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const LocationHeader = () => {
  const navigate = useNavigate();
  const location = useStore((state) => state.location);
  const fetchLocation = useStore((state) => state.fetchLocation);
  const setLocation = useStore((state) => state.setLocation);
  const [isManualLocationOpen, setIsManualLocationOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      loadSavedAddresses(user.id);
      loadDefaultAddress(user.id);
    }
  };

  const loadSavedAddresses = async (userId: string) => {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading addresses:", error);
      return;
    }

    setSavedAddresses(data || []);
  };

  const loadDefaultAddress = async (userId: string) => {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .eq("is_default", true)
      .single();

    if (data && !error) {
      setLocation({
        address: `${data.house_number}, ${data.street}`,
        area: `${data.area}, ${data.city} - ${data.pincode}`,
        coordinates: { lat: data.lat, lng: data.lng },
        isLoading: false,
      });
    }
  };

  const handleSelectAddress = (address: any) => {
    setLocation({
      address: `${address.house_number}, ${address.street}`,
      area: `${address.area}, ${address.city} - ${address.pincode}`,
      coordinates: { lat: address.lat, lng: address.lng },
      isLoading: false,
    });
    toast.success("Location updated!");
  };

  return (
    <header className="sticky top-0 bg-card border-b border-border z-40 px-4 md:px-6 py-3 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity">
              {location.isLoading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
              ) : (
                <MapPin className="w-5 h-5 text-primary shrink-0" />
              )}
              <div className="flex flex-col min-w-0 flex-1 text-left">
                <div className="flex items-center gap-1">
                  <h2 className="text-base font-semibold truncate">{location.address}</h2>
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {location.area}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80 max-h-96 overflow-y-auto bg-card z-50">
            <DropdownMenuLabel>Your Addresses</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsManualLocationOpen(true)} className="cursor-pointer">
              <MapPinPlus className="w-4 h-4 mr-2" />
              Add New Address
            </DropdownMenuItem>
            
            {savedAddresses.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Saved Addresses</DropdownMenuLabel>
                {savedAddresses.map((address) => (
                  <DropdownMenuItem
                    key={address.id}
                    onClick={() => handleSelectAddress(address)}
                    className="cursor-pointer flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {address.label || `${address.house_number}, ${address.street}`}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {address.area}, {address.city}
                        </p>
                      </div>
                      {address.is_default && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            
            {savedAddresses.length === 0 && (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No saved addresses yet. Add one to get started!
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center gap-2 shrink-0">
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
        onSaved={() => {
          if (user) {
            loadSavedAddresses(user.id);
          }
        }}
      />
    </header>
  );
};
