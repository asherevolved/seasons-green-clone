import { useState } from "react";
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
import { toast } from "sonner";
import { useStore } from "@/lib/store";

interface ManualLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualLocationDialog = ({
  open,
  onOpenChange,
}: ManualLocationDialogProps) => {
  const setLocation = useStore((state) => state.setLocation);
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const handleSave = () => {
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

    toast.success("Location updated successfully!");
    onOpenChange(false);
    
    // Clear form
    setHouseNumber("");
    setStreet("");
    setArea("");
    setCity("");
    setPincode("");
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
