import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar as DatePicker } from "@/components/ui/calendar";

type ProfileRow = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address_line: string | null;
  role: string;
};

type AdminBooking = {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  notes: string | null;
  created_at: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address_line: string | null;
  service_title: string | null;
  service_category: string | null;
};

export default function Admin() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [newDate, setNewDate] = useState<Date | undefined>(new Date());
  const [newTime, setNewTime] = useState("");

  const requiredPasscode = useMemo(() => {
    const envCode = import.meta.env.VITE_ADMIN_PASSCODE as string | undefined;
    return envCode && envCode.length > 0 ? envCode : "seasons@2025_123";
  }, []);

  useEffect(() => {
    const granted = localStorage.getItem("admin_access_granted") === "true";
    setAuthorized(granted);
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      setIsAdmin(profile?.role === "admin");
      setCheckingAuth(false);
    });
  }, [navigate]);

  useEffect(() => {
    if (!authorized || !isAdmin) return;
    setLoading(true);
    supabase
      .from("admin_bookings_view")
      .select("*")
      .order("start_time", { ascending: false })
      .then(({ data }) => {
        setBookings((data as AdminBooking[]) || []);
        setLoading(false);
      });
  }, [authorized, isAdmin]);

  const markCompleted = async (id: string) => {
    await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", id);
    const { data } = await supabase
      .from("admin_bookings_view")
      .select("*")
      .order("start_time", { ascending: false });
    setBookings((data as AdminBooking[]) || []);
  };

  const deleteBooking = async (id: string) => {
    await supabase
      .from("bookings")
      .delete()
      .eq("id", id);
    const { data } = await supabase
      .from("admin_bookings_view")
      .select("*")
      .order("start_time", { ascending: false });
    setBookings((data as AdminBooking[]) || []);
  };

  const openReschedule = (b: AdminBooking) => {
    setSelectedBooking(b);
    const d = new Date(b.start_time);
    setNewDate(d);
    const hh = `${d.getHours()}`.padStart(2, "0");
    const mm = `${d.getMinutes()}`.padStart(2, "0");
    setNewTime(`${hh}:${mm}`);
    setRescheduleOpen(true);
  };

  const submitReschedule = async () => {
    if (!selectedBooking || !newDate || !newTime) return;
    const [hh, mm] = newTime.split(":").map(Number);
    const start = new Date(newDate);
    start.setHours(hh || 0, mm || 0, 0, 0);
    const startIso = start.toISOString();

    const { data: svc } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("title", selectedBooking.service_title)
      .maybeSingle();
    const duration = typeof svc?.duration_minutes === "number" && svc.duration_minutes > 0 ? svc.duration_minutes : 60;
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + duration);
    const endIso = end.toISOString();

    await supabase
      .from("bookings")
      .update({ start_time: startIso, end_time: endIso })
      .eq("id", selectedBooking.id);
    const { data } = await supabase
      .from("admin_bookings_view")
      .select("*")
      .order("start_time", { ascending: false });
    setBookings((data as AdminBooking[]) || []);
    setRescheduleOpen(false);
    setSelectedBooking(null);
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === requiredPasscode) {
      localStorage.setItem("admin_access_granted", "true");
      setAuthorized(true);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-700">Checking access…</div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 font-medium">Access denied</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <form
          onSubmit={handlePasscodeSubmit}
          className="w-full max-w-md bg-white border rounded-xl shadow p-6 space-y-4"
        >
          <div className="text-xl font-semibold">Admin Access</div>
          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Passcode</label>
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-200"
              placeholder="Enter admin passcode"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-4 py-2"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen p-4 md:p-8">
      <div className="mb-6">
        <div className="text-2xl font-bold">Admin Dashboard</div>
        <div className="text-sm text-gray-600">All bookings with customer and service details</div>
      </div>
      {loading ? (
        <div className="text-gray-700">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="text-gray-600">No bookings found</div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Service</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
                <th className="px-4 py-3 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const startDateObj = new Date(b.start_time);
                const startDate = startDateObj.toLocaleDateString();
                const startTime = startDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-3">
                      {b.full_name || b.email || "-"}
                    </td>
                    <td className="px-4 py-3">{b.phone || "-"}</td>
                    <td className="px-4 py-3">{b.address_line || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{b.service_title || "-"}</div>
                      <div className="text-gray-500">{b.service_category || ""}</div>
                    </td>
                    <td className="px-4 py-3">{startDate}</td>
                    <td className="px-4 py-3">{startTime}</td>
                    <td className="px-4 py-3 capitalize">{b.status}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-md border bg-white hover:bg-emerald-50"
                        onClick={() => markCompleted(b.id)}
                        disabled={b.status === "completed"}
                        title="Mark served"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                        Served
                      </button>
                      <button
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-md border bg-white hover:bg-blue-50"
                        onClick={() => openReschedule(b)}
                        title="Reschedule"
                      >
                        <CalendarIcon className="w-4 h-4 text-blue-600" />
                        Reschedule
                      </button>
                      <button
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-md border bg-white hover:bg-red-50"
                        onClick={() => deleteBooking(b.id)}
                        title="Delete booking"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                        Delete
                      </button>
                    </td>
                    <td className="px-4 py-3">{b.total_price?.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
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
          <button className="px-3 py-2 rounded-md border" onClick={() => setRescheduleOpen(false)}>Cancel</button>
          <button className="px-3 py-2 rounded-md bg-emerald-600 text-white" onClick={submitReschedule}>Save</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
