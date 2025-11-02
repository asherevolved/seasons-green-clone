export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export interface CartItem {
  service: Service;
  quantity: number;
}

export interface Booking {
  id: string;
  serviceName: string;
  date: string;
  status: "completed" | "upcoming" | "cancelled";
}

export interface Address {
  id: string;
  label: string;
  address: string;
  icon: "home" | "work";
}
