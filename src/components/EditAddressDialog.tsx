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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const addressSchema = z.object({
  houseNumber: z.string().trim().min(1, "House number is required").max(50, "House number too long"),
  street: z.string().trim().min(1, "Street is required").max(100, "Street name too long"),
  area: z.string().trim().min(1, "Area is required").max(100, "Area name too long"),
  city: z.string().trim().min(1, "City is required").max(50, "City name too long"),
  pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  label: z.string().trim().max(50, "Label too long").optional(),
});

interface EditAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: any;
  onSaved?: () => void;
}

export const EditAddressDialog = ({
  open,
  onOpenChange,
  address,
  onSaved,
}: EditAddressDialogProps) => {
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [label, setLabel] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (address && open) {
      setHouseNumber(address.house_number || "");
      setStreet(address.street || "");
      setArea(address.area || "");
      setCity(address.city || "");
      setPincode(address.pincode || "");
      setLabel(address.label || "");
      setIsDefault(address.is_default || false);
    }
  }, [address, open]);

  const handleSave = async () => {
    // Validate inputs
    const validation = addressSchema.safeParse({
      houseNumber,
      street,
      area,
      city,
      pincode,
      label,
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    const validData = validation.data;
    const fullAddress = `${validData.houseNumber}, ${validData.street}`;

    const { error } = await supabase
      .from("addresses")
      .update({
        house_number: validData.houseNumber,
        street: validData.street,
        area: validData.area,
        city: validData.city,
        pincode: validData.pincode,
        label: validData.label || fullAddress,
        address_line: fullAddress,
        is_default: isDefault,
      })
      .eq("id", address.id);

    if (error) {
      toast.error("Failed to update address");
      return;
    }

    toast.success("Address updated successfully!");
    onSaved?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
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
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked as boolean)}
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default address
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};