import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

interface ManualLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export const ManualLocationDialog = ({
  open,
  onOpenChange,
  onSaved,
}: ManualLocationDialogProps) => {
  const setLocation = useStore((state) => state.setLocation);
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [label, setLabel] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleSave = async () => {
    if (!houseNumber || !street || !area || !city || !pincode) {
      toast.error("Please fill in all fields");
      return;
    }

    const fullAddress = `${houseNumber}, ${street}`;
    const fullArea = `${area}, ${city} - ${pincode}`;

    setLocation({
      address: fullAddress,
      area: fullArea,
      isLoading: false,
    });

    // Save to database if user is logged in and wants to save
    if (user && saveAddress) {
      const { error } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          house_number: houseNumber,
          street: street,
          area: area,
          city: city,
          pincode: pincode,
          label: label || `${houseNumber}, ${street}`,
          address_line: fullAddress,
          lat: 0, // Will be geocoded later if needed
          lng: 0,
          is_default: false,
        });

      if (error) {
        toast.error("Failed to save address");
        console.error(error);
      } else {
        toast.success("Address saved successfully!");
        onSaved?.();
      }
    } else {
      toast.success("Location updated successfully!");
    }

    onOpenChange(false);
    
    // Clear form
    setHouseNumber("");
    setStreet("");
    setArea("");
    setCity("");
    setPincode("");
    setLabel("");
    setSaveAddress(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Your Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="houseNumber">House/Flat Number</Label>
            <Input
              id="houseNumber"
              placeholder="e.g., 123, 2nd Floor"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street">Street/Locality</Label>
            <Input
              id="street"
              placeholder="e.g., MG Road"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Area</Label>
            <Input
              id="area"
              placeholder="e.g., Vijayanagara"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g., Mysore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                placeholder="570001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>
          {user && (
            <>
              <div className="space-y-2">
                <Label htmlFor="label">Address Label (Optional)</Label>
                <Input
                  id="label"
                  placeholder="e.g., Home, Office"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveAddress"
                  checked={saveAddress}
                  onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                />
                <label
                  htmlFor="saveAddress"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Save this address for future use
                </label>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Location</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
