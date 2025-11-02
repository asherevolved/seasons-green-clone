import { create } from "zustand";
import { CartItem, Service } from "./types";

interface StoreState {
  cart: CartItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  
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
}));
