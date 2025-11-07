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
    address: "Getting location...",
    area: "Please wait...",
    coordinates: null,
    isLoading: true,
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
          // Use Nominatim for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          const address = data.address;
          const displayAddress = 
            address.house_number && address.road
              ? `${address.house_number} ${address.road}`
              : address.road || address.suburb || "Your Location";
          
          const area = [
            address.suburb,
            address.city || address.town || address.village,
            address.state,
          ]
            .filter(Boolean)
            .join(", ");

          set({
            location: {
              address: displayAddress,
              area: area || "Location found",
              coordinates: { lat: latitude, lng: longitude },
              isLoading: false,
            },
          });
        } catch (error) {
          set({
            location: {
              address: "Location found",
              area: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              coordinates: { lat: latitude, lng: longitude },
              isLoading: false,
            },
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
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  },
}));
