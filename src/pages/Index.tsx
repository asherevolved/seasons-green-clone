import { Search, Sprout, TreeDeciduous, Scissors, Droplet } from "lucide-react";
import { LocationHeader } from "@/components/LocationHeader";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { services } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import gardeningToolsImg from "@/assets/gardening-tools.jpg";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const addToCart = useStore((state) => state.addToCart);

  const popularServices = services.slice(0, 3);

  const handleAddService = (service: any) => {
    addToCart(service);
    toast.success(`${service.title} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <LocationHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 md:space-y-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search for services..."
            className="pl-10 h-12 bg-card"
          />
        </div>

        {/* Categories */}
        <section className="animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Categories</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
            <CategoryIcon
              icon={Sprout}
              label="Lawn Mowing"
              onClick={() => navigate("/services?category=lawn-care")}
            />
            <CategoryIcon
              icon={TreeDeciduous}
              label="Garden Design"
              onClick={() => navigate("/services?category=garden-maintenance")}
            />
            <CategoryIcon
              icon={Scissors}
              label="Tree Trimming"
              onClick={() => navigate("/services?category=tree-trimming")}
            />
            <CategoryIcon
              icon={Droplet}
              label="Irrigation"
              onClick={() => navigate("/services")}
            />
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="bg-secondary rounded-2xl p-6 md:p-8 flex items-center gap-4 md:gap-6 animate-fade-in hover-scale cursor-pointer transition-all duration-300">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">
              Exclusive essential landscaping bundle
            </h3>
            <p className="text-sm md:text-base text-secondary-foreground mb-4">
              Mowing, trimming and weeding with a single booking!
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 active:scale-95 transition-all duration-200">
              Know more
            </Button>
          </div>
          <img
            src={gardeningToolsImg}
            alt="Gardening tools"
            className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-xl"
          />
        </section>

        {/* Most Popular */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Most Popular</h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80 hover:scale-105 transition-all duration-200"
              onClick={() => navigate("/services")}
            >
              See all
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {popularServices.map((service, index) => (
              <div key={service.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ServiceCard
                  image={service.image}
                  title={service.title}
                  description={service.description}
                  badge={service.badge}
                  onAdd={() => handleAddService(service)}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
