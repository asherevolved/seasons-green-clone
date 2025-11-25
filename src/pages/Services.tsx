import { Search, ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate, useSearchParams } from "react-router-dom";
import { services } from "@/lib/data";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import lawnWideImg from "@/assets/lawn-wide.jpg";
import hedgeWideImg from "@/assets/hedge-wide.jpg";
import flowersWideImg from "@/assets/flowers-wide.jpg";
import gardenMaintenanceImg from "@/assets/garden-maintenance.jpg";
import lawnMowingImg from "@/assets/lawn-mowing.jpg";
import hedgeTrimmingImg from "@/assets/hedge-trimming.jpg";
import allServicesIcon from "@/assets/categories/all-services-3d.png";
import lawnCareIcon from "@/assets/categories/lawn-care-3d.png";
import gardenMaintenanceIcon from "@/assets/categories/garden-maintenance-3d.png";
import treeShrubIcon from "@/assets/categories/tree-shrub-3d.png";

const Services = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addToCart = useStore((state) => state.addToCart);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "lawn-care"
  );

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = [
    { id: "all", label: "All", icon: allServicesIcon },
    { id: "lawn-care", label: "Lawn Care", icon: lawnCareIcon },
    { id: "garden-maintenance", label: "Garden Maintenance", icon: gardenMaintenanceIcon },
    { id: "tree-trimming", label: "Tree & Shrub", icon: treeShrubIcon },
  ];

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter((s) => s.category === activeCategory);

  const handleAddToCart = (service: any, event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart(service);
    toast.success(
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        <span>{service.title} added to cart</span>
      </div>,
      {
        action: {
          label: "View Cart",
          onClick: () => navigate("/cart"),
        },
      }
    );
  };

  const toggleFavorite = (serviceId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(serviceId)) {
        newFavorites.delete(serviceId);
      } else {
        newFavorites.add(serviceId);
      }
      return newFavorites;
    });
  };

  const getServiceImage = (index: number) => {
    const images = [lawnMowingImg, hedgeTrimmingImg, gardenMaintenanceImg, lawnWideImg, hedgeWideImg, flowersWideImg];
    return images[index % images.length];
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border/50 z-40 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-display font-bold">Our Services</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Categories */}
        <aside className="hidden md:block w-32 lg:w-36 border-r border-border/50 min-h-screen pt-6 pb-6">
          <div className="sticky top-24 space-y-3 px-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex flex-col items-center gap-2 px-2 py-3 rounded-2xl transition-all duration-300 group ${
                  activeCategory === cat.id
                    ? "bg-primary/10"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  activeCategory === cat.id ? "bg-primary/5 scale-105" : "bg-muted/30 group-hover:scale-110"
                }`}>
                  <img 
                    src={cat.icon} 
                    alt={cat.label}
                    className="w-14 h-14 object-contain transition-transform duration-300 group-hover:rotate-6 group-hover:animate-pulse-scale"
                  />
                </div>
                <span className={`text-xs text-center font-medium leading-tight transition-colors ${
                  activeCategory === cat.id ? "text-primary font-semibold" : "text-foreground"
                }`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-6 py-6">
          {/* Mobile Category Tabs */}
          <div className="md:hidden flex flex-col gap-2 pb-4 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  activeCategory === cat.id
                    ? "bg-primary/10"
                    : "bg-card border border-border/50"
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  activeCategory === cat.id ? "bg-primary/5 scale-105" : "bg-muted/30 group-active:scale-95"
                }`}>
                  <img 
                    src={cat.icon} 
                    alt={cat.label}
                    className="w-12 h-12 object-contain transition-transform duration-300 group-active:rotate-6 group-active:animate-pulse-scale"
                  />
                </div>
                <span className={`text-base font-medium transition-colors ${
                  activeCategory === cat.id ? "text-primary font-semibold" : "text-foreground"
                }`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          {/* Hero Banner */}
          <Card className="mb-6 overflow-hidden gradient-primary shadow-3d">
            <div className="relative p-8 md:p-10">
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                UP TO 30% OFF
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-2">
                Season's Best
              </h2>
              <p className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
                Garden Services
              </p>
              <Button className="bg-background text-foreground hover:bg-background/90 rounded-xl px-6 font-semibold">
                Explore now
              </Button>
            </div>
          </Card>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredServices.map((service, index) => (
              <Card 
                key={service.id} 
                className="overflow-hidden flex flex-col card-3d animate-fade-in group relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(service.id)}
                  className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:scale-110 transition-transform"
                >
                  <Heart 
                    className={`w-4 h-4 ${favorites.has(service.id) ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
                  />
                </button>

                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={getServiceImage(index)}
                    alt={service.title}
                    className="w-full h-36 md:h-44 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-3 md:p-4 flex-1 flex flex-col">
                  {/* ADD Button */}
                  <div className="flex justify-end mb-2">
                    <Button
                      variant="outline"
                      className="rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 md:px-8 font-bold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
                      onClick={(e) => handleAddToCart(service, e)}
                    >
                      ADD
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg md:text-xl font-bold text-primary">₹{service.price}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{Math.round(service.price * 1.3)}</span>
                  </div>

                  {/* Discount Badge */}
                  <div className="mb-2">
                    <span className="text-xs font-bold text-green-600">₹{Math.round(service.price * 0.3)} OFF</span>
                  </div>

                  {/* Service Name */}
                  <h3 className="text-sm md:text-base font-bold mb-1 line-clamp-2">{service.title}</h3>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground">Per session</p>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default Services;
