import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ChevronRight,
  Home,
  Briefcase,
  Edit,
  Plus,
  CreditCard,
  Bell,
  Mail,
  Lock,
  ArrowRight,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { bookings, addresses } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    setProfile(profileData);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-center">My Profile</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="space-y-6 animate-fade-in">
          {/* Profile Header */}
          <Card className="p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
              <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile?.full_name || "User"}</h2>
              <p className="text-muted-foreground">{user?.phone || user?.email || "No contact info"}</p>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
          <Card className="p-4 hover:shadow-md transition-all duration-300">
            <button className="flex items-center gap-3 w-full text-left hover:bg-accent rounded-lg p-2 -m-2 transition-colors">
              <User className="w-5 h-5" />
              <span className="flex-1">Edit Profile</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </section>

        {/* Saved Addresses */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Saved Addresses</h3>
          <Card className="p-4 space-y-3 hover:shadow-md transition-all duration-300">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start gap-3 pb-3 last:pb-0 border-b last:border-b-0"
              >
                {address.icon === "home" ? (
                  <Home className="w-5 h-5 mt-0.5" />
                ) : (
                  <Briefcase className="w-5 h-5 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{address.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.address}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-center text-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          </Card>
        </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
          {/* Booking History */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Booking History</h3>
          <Card className="p-4 space-y-3 hover:shadow-md transition-all duration-300">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between pb-3 last:pb-0 border-b last:border-b-0"
              >
                <div>
                  <p className="font-semibold">{booking.serviceName}</p>
                  <p className="text-sm text-muted-foreground">{booking.date}</p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    booking.status === "completed"
                      ? "text-primary"
                      : "text-blue-600"
                  }`}
                >
                  {booking.status === "completed" ? "Completed" : "Upcoming"}
                </span>
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-center text-primary"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </section>

        {/* Payment Methods */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
          <Card className="p-4 space-y-3 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-semibold">Visa **** 1234</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-center text-primary bg-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Payment Method
            </Button>
          </Card>
        </section>

        {/* App Settings */}
        <section>
          <h3 className="text-lg font-semibold mb-3">App Settings</h3>
          <Card className="p-4 space-y-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <span>Push Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>Email Notifications</span>
              </div>
              <Switch />
            </div>
            <button className="flex items-center gap-3 w-full text-left pt-2 border-t">
              <Lock className="w-5 h-5" />
              <span className="flex-1">Privacy Policy</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </section>

        {/* Log Out */}
        <Button
          variant="outline"
          className="w-full h-12 text-destructive border-destructive/20 bg-destructive/5"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>
        </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
