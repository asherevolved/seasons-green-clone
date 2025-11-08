import { Home, Calendar, Scissors, User, ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Calendar, label: "Bookings", path: "/bookings" },
  { icon: Scissors, label: "Services", path: "/services" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const BottomNav = () => {
  const cart = useStore((state) => state.cart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 animate-fade-in">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-200 relative ${
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:scale-105 active:scale-95"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
            {item.path === "/cart" && cartCount > 0 && (
              <Badge className="absolute top-0 right-1/4 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-primary animate-pulse">
                {cartCount}
              </Badge>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
