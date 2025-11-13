import { Home, Calendar, Scissors, User, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Scissors, label: "Services", path: "/services" },
  { icon: Calendar, label: "Bookings", path: "/bookings" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const DesktopNav = () => {
  const cart = useStore((state) => state.cart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path}>
          {({ isActive }) => (
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`gap-2 hover:scale-105 active:scale-95 transition-all duration-200 rounded-2xl font-display font-semibold ${
              isActive ? 'shadow-3d' : ''
            }`}
          >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Button>
          )}
        </NavLink>
      ))}
      <NavLink to="/cart">
        {({ isActive }) => (
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`gap-2 relative hover:scale-105 active:scale-95 transition-all duration-200 rounded-2xl font-display font-semibold ${
              isActive ? 'shadow-3d' : ''
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs gradient-accent text-accent-foreground animate-pulse border-0">
                {cartCount}
              </Badge>
            )}
          </Button>
        )}
      </NavLink>
    </nav>
  );
};
