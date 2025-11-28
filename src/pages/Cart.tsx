import { ArrowLeft, Minus, Plus, MoreVertical, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, getCartTotal } = useStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");

  const itemTotal = getCartTotal();
  const serviceCharges = 200;
  const totalAmount = itemTotal + serviceCharges;

  const handleProceed = async () => {
    if (!date || !time) {
      toast.error("Please select date and time");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to book");
      navigate("/auth");
      return;
    }

    try {
      // Compose start_time from selected date and time
      const [hh, mm] = time.split(":").map(Number);
      const start = new Date(date);
      start.setHours(hh || 0, mm || 0, 0, 0);
      const startIso = start.toISOString();

      // Create one booking per cart item
      let successCount = 0;
      for (const item of cart) {
        // Find matching service in DB by title
        const { data: svc } = await supabase
          .from("services")
          .select("id, duration_minutes")
          .eq("title", item.service.title)
          .maybeSingle();

        if (!svc) {
          toast.error(`Service not available: ${item.service.title}`);
          continue;
        }

        const duration = typeof svc.duration_minutes === "number" && svc.duration_minutes > 0 ? svc.duration_minutes : 60;
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + duration);
        const endIso = end.toISOString();

        const total = item.service.price * item.quantity;

        const { error } = await supabase
          .from("bookings")
          .insert({
            user_id: user.id,
            service_id: svc.id,
            start_time: startIso,
            end_time: endIso,
            status: "confirmed",
            total_price: total,
            notes: `Quantity: ${item.quantity}`,
          });

        if (error) {
          toast.error(`Failed to book ${item.service.title}: ${error.message}`);
        } else {
          successCount += 1;
        }
      }

      if (successCount > 0) {
        toast.success("Booking confirmed!");
        navigate("/bookings");
      } else {
        toast.error("No booking was created");
      }
    } catch {
      toast.error("Could not create booking");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add services to get started</p>
          <Button onClick={() => navigate("/services")}>Browse Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-6">
      <header className="sticky top-0 bg-card border-b border-border z-40 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:scale-110 active:scale-95 transition-transform duration-200">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold flex-1">Your Cart</h1>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-3">
          {cart.map((item, index) => (
            <Card key={item.service.id} className="p-3 animate-fade-in hover:shadow-md transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center gap-3">
                <img
                  src={item.service.image}
                  alt={item.service.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.service.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    ₹{item.service.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg border-2 hover:scale-110 active:scale-95 transition-transform duration-200"
                    onClick={() =>
                      updateQuantity(item.service.id, item.quantity - 1)
                    }
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <Button
                    size="icon"
                    className="h-8 w-8 rounded-lg bg-primary hover:scale-110 active:scale-95 transition-transform duration-200"
                    onClick={() =>
                      updateQuantity(item.service.id, item.quantity + 1)
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {/* Schedule Service */}
          <Card className="p-6 transition-all duration-300 hover:shadow-md">
          <h2 className="text-xl font-bold mb-4">Schedule Service</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>

        {/* Select Time */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">Select Time</h3>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="time"
              placeholder="e.g. 10:30 AM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button className="w-full mt-3 bg-primary hover:bg-primary/90">
            Set Time
          </Button>
        </Card>

        {/* Bill Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Bill Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Item Total</span>
              <span>₹{itemTotal}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Service Charges</span>
              <span>₹{serviceCharges}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-lg font-bold">
              <span>To Pay</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </Card>
        </div>
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            className="w-full h-14 text-lg bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
            onClick={handleProceed}
          >
            Proceed to Book
          </Button>
        </div>
      </div>

      {/* Desktop Button */}
      <div className="hidden md:block max-w-4xl mx-auto px-4 md:px-6 pb-6">
        <Button
          className="w-full h-14 text-lg bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
          onClick={handleProceed}
        >
          Proceed to Book
        </Button>
      </div>
    </div>
  );
};

export default Cart;
