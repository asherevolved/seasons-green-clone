import { create } from "zustand";
import { CartItem, Service } from "./types";

interface LocationState {
  address: string;
  area: string;
  coordinates: { lat: number; lng: number } | null;
  isLoading: boolean;
}

interface StoreState {
  cart: CartItem[];
  location: LocationState;
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  setLocation: (location: Partial<LocationState>) => void;
  fetchLocation: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  location: {
    address: "Select your address",
    area: "Click above to add your location",
    coordinates: null,
    isLoading: false,
  },
  
  addToCart: (service) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.service.id === service.id);
    
    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { service, quantity: 1 }] });
    }
  },
  
  removeFromCart: (serviceId) => {
    set({ cart: get().cart.filter((item) => item.service.id !== serviceId) });
  },
  
  updateQuantity: (serviceId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(serviceId);
    } else {
      set({
        cart: get().cart.map((item) =>
          item.service.id === serviceId ? { ...item, quantity } : item
        ),
      });
    }
  },
  
  clearCart: () => set({ cart: [] }),
  
  getCartTotal: () => {
    return get().cart.reduce(
      (total, item) => total + item.service.price * item.quantity,
      0
    );
  },

  setLocation: (location) => {
    set({ location: { ...get().location, ...location } });
  },

  fetchLocation: async () => {
    set({ location: { ...get().location, isLoading: true } });
    
    if (!navigator.geolocation) {
      set({
        location: {
          address: "Location not supported",
          area: "Enable location services",
          coordinates: null,
          isLoading: false,
        },
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use Nominatim for reverse geocoding with high zoom for detailed address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=20&addressdetails=1`
          );
          const data = await response.json();
          
          const addr = data.address;
          
          // Try to build the most complete address possible
          const houseNumber = addr.house_number || addr.building || '';
          const road = addr.road || addr.street || '';
          const suburb = addr.suburb || addr.neighbourhood || addr.quarter || '';
          const city = addr.city || addr.town || addr.village || addr.municipality || '';
          const state = addr.state || '';
          const postcode = addr.postcode || '';
          
          // Build primary address line
          let displayAddress = '';
          if (houseNumber && road) {
            displayAddress = `${houseNumber}, ${road}`;
          } else if (road) {
            displayAddress = road;
          } else if (suburb) {
            displayAddress = suburb;
          } else {
            displayAddress = "Your Location";
          }
          
          // Build area line
          const areaComponents = [suburb, city, state, postcode]
            .filter(Boolean)
            .filter((item, index, arr) => arr.indexOf(item) === index); // Remove duplicates
          const area = areaComponents.join(", ") || "Location found";

          set({
            location: {
              address: displayAddress,
              area: area,
              coordinates: { lat: latitude, lng: longitude },
              isLoading: false,
            },
          });
          
          // Show message if house number wasn't detected
          if (!houseNumber) {
            // Import toast dynamically to avoid circular dependencies
            import('sonner').then(({ toast }) => {
              toast.info("House number not detected. You can add it manually from the location menu.");
            });
          }
        } catch (error) {
          set({
            location: {
              address: "Location found",
              area: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              coordinates: { lat: latitude, lng: longitude },
              isLoading: false,
            },
          });
          
          import('sonner').then(({ toast }) => {
            toast.warning("Couldn't fetch detailed address. Please add manually.");
          });
        }
      },
      (error) => {
        set({
          location: {
            address: "Location unavailable",
            area: "Please enable location services",
            coordinates: null,
            isLoading: false,
          },
        });
        
        import('sonner').then(({ toast }) => {
          toast.error("Location access denied. Please enable location services.");
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  },
}));
