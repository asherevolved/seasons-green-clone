import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const Services = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addToCart = useStore((state) => state.addToCart);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "lawn-care"
  );

  const categories = [
    { id: "lawn-care", label: "Lawn Care" },
    { id: "garden-maintenance", label: "Garden Maintenance" },
    { id: "tree-trimming", label: "Tree & Shrub" },
  ];

  const filteredServices = services.filter(
    (s) => s.category === activeCategory
  );

  const handleBook = (service: any) => {
    addToCart(service);
    toast.success(`${service.title} added to cart`);
    navigate("/cart");
  };

  const getServiceImage = (index: number) => {
    const images = [lawnWideImg, hedgeWideImg, flowersWideImg];
    return images[index % images.length];
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
    <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/50 z-40 px-4 md:px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="hidden md:flex rounded-2xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-display font-bold">Our Services</h1>
      </div>
    </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 md:space-y-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for services"
            className="pl-12 h-14 bg-card rounded-2xl shadow-3d border-0 text-base focus-visible:shadow-3d-lg transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              className={
                activeCategory === cat.id
                  ? "gradient-primary text-primary-foreground rounded-2xl shrink-0 shadow-3d border-0 h-11 px-6 font-semibold"
                  : "rounded-2xl shrink-0 bg-card shadow-3d hover:shadow-3d-lg border-border/50 h-11 px-6 font-semibold"
              }
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredServices.map((service, index) => (
            <Card key={service.id} className="overflow-hidden flex flex-col card-3d animate-fade-in group" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                <img
                  src={getServiceImage(index)}
                  alt={service.title}
                  className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-auto gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground block">Starting at</span>
                    <span className="text-xl font-bold text-primary">₹{service.price}</span>
                  </div>
                  <Button
                    className="gradient-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all duration-300 shadow-3d hover:shadow-3d-lg rounded-xl border-0 px-6"
                    onClick={() => handleBook(service)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Services;
