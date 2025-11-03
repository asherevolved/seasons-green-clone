import { ArrowLeft, Search } from "lucide-react";
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
      <header className="sticky top-0 bg-card border-b border-border z-40 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold flex-1">Our Services</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 md:space-y-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for services"
            className="pl-10 h-12 bg-card"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              className={
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground rounded-full shrink-0"
                  : "rounded-full shrink-0"
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
            <Card key={service.id} className="overflow-hidden flex flex-col">
              <img
                src={getServiceImage(index)}
                alt={service.title}
                className="w-full h-48 md:h-56 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 flex-1">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-base font-medium">
                    Starting at ${service.price}
                  </span>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                    onClick={() => handleBook(service)}
                  >
                    Book Service
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
