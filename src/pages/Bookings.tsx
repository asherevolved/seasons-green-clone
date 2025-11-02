import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bookings } from "@/lib/data";

const Bookings = () => {
  const upcomingBookings = bookings.filter((b) => b.status === "upcoming");
  const pastBookings = bookings.filter((b) => b.status === "completed");

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border px-4 py-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold">My Bookings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Upcoming Bookings */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
          {upcomingBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No upcoming bookings</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                      <Calendar className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">
                        {booking.serviceName}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{booking.date} • 10:30 AM</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>10 Sector 55, Gurugram</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-destructive"
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
        <section>
          <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
          <div className="space-y-3">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">
                      {booking.serviceName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{booking.date}</span>
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
      </main>

      <BottomNav />
    </div>
  );
};

export default Bookings;
