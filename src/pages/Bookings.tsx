import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar as DatePicker } from "@/components/ui/calendar";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>(new Date());
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("bookings")
      .select(`
        *,
        services (
          title,
          category
        )
      `)
      .eq("user_id", user.id)
      .order("start_time", { ascending: false });
    
    setBookings(data || []);
    setIsLoading(false);
  };

  const handleCancel = async (bookingId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId)
      .eq("user_id", user.id);
    if (error) return;
    await fetchBookings();
  };

  const openReschedule = (booking: any) => {
    setSelectedBooking(booking);
    setNewDate(new Date(booking.start_time));
    const d = new Date(booking.start_time);
    const hh = `${d.getHours()}`.padStart(2, "0");
    const mm = `${d.getMinutes()}`.padStart(2, "0");
    setNewTime(`${hh}:${mm}`);
    setRescheduleOpen(true);
  };

  const submitReschedule = async () => {
    if (!selectedBooking || !newDate || !newTime) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }

    const [hh, mm] = newTime.split(":").map(Number);
    const start = new Date(newDate);
    start.setHours(hh || 0, mm || 0, 0, 0);
    const startIso = start.toISOString();

    const { data: svc } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", selectedBooking.service_id)
      .maybeSingle();
    const duration = typeof svc?.duration_minutes === "number" && svc.duration_minutes > 0 ? svc.duration_minutes : 60;
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + duration);
    const endIso = end.toISOString();

    const { error } = await supabase
      .from("bookings")
      .update({ start_time: startIso, end_time: endIso, status: "confirmed" })
      .eq("id", selectedBooking.id)
      .eq("user_id", user.id);

    if (!error) {
      setRescheduleOpen(false);
      setSelectedBooking(null);
      await fetchBookings();
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );
  const pastBookings = bookings.filter((b) => b.status === "completed");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <header className="bg-card border-b border-border px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hidden md:flex"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Bookings</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Upcoming Bookings */}
          <section className="animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
          {upcomingBookings.length === 0 ? (
            <Card className="p-8 text-center hover:shadow-md transition-all duration-300">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No upcoming bookings</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking, index) => (
                <Card key={booking.id} className="p-4 hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                      <Calendar className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">
                        {booking.services?.title || "Service"}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(booking.start_time).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })} • {new Date(booking.start_time).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>Your saved address</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openReschedule(booking)}>
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-destructive"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          )}
          </section>

          {/* Past Bookings */}
          <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
          <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
          <div className="space-y-3">
            {pastBookings.map((booking, index) => (
              <Card key={booking.id} className="p-4 hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: `${(index + 2) * 100}ms` }}>
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">
                      {booking.services?.title || "Service"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(booking.start_time).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <span className="inline-flex items-center text-xs font-medium text-primary bg-secondary px-2 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
              </Card>
            ))}
          </div>
          </section>
        </div>
      </main>

      <BottomNav />
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
            <DialogDescription>Select a new date and time</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <DatePicker mode="single" selected={newDate} onSelect={setNewDate} className="rounded-md border" />
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Time</label>
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>Cancel</Button>
            <Button onClick={submitReschedule}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bookings;
