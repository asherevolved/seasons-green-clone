import { Service, Booking, Address } from "./types";
import lawnMowingImg from "@/assets/lawn-mowing.jpg";
import gardenWeedingImg from "@/assets/garden-weeding.jpg";
import hedgeTrimmingImg from "@/assets/hedge-trimming.jpg";
import gardenMaintenanceImg from "@/assets/garden-maintenance.jpg";

export const services: Service[] = [
  {
    id: "1",
    title: "Lawn Mowing",
    description: "Perfectly manicured lawns",
    price: 1500,
    image: lawnMowingImg,
    category: "lawn-care",
  },
  {
    id: "2",
    title: "Garden Weeding",
    description: "Keep your garden pristine",
    price: 1200,
    image: gardenWeedingImg,
    category: "garden-maintenance",
  },
  {
    id: "3",
    title: "Hedge Trimming",
    description: "Shaping and maintenance",
    price: 1800,
    image: hedgeTrimmingImg,
    category: "tree-trimming",
    badge: "₹50 OFF",
  },
  {
    id: "4",
    title: "Precision Lawn Mowing",
    description: "Includes mowing, edging, and blowing clippings for a pristine finish.",
    price: 45,
    image: lawnMowingImg,
    category: "lawn-care",
  },
  {
    id: "5",
    title: "Hedge Trimming & Shaping",
    description: "Expert trimming and shaping for healthy, beautiful hedges.",
    price: 60,
    image: hedgeTrimmingImg,
    category: "tree-trimming",
  },
  {
    id: "6",
    title: "Seasonal Flower Planting",
    description: "Beautify your garden with vibrant, seasonal flowers.",
    price: 50,
    image: gardenWeedingImg,
    category: "garden-maintenance",
  },
  {
    id: "7",
    title: "Garden Maintenance",
    description: "Complete garden care and upkeep",
    price: 2500,
    image: gardenMaintenanceImg,
    category: "garden-maintenance",
  },
];

export const bookings: Booking[] = [
  {
    id: "1",
    serviceName: "Lawn Mowing",
    date: "Oct 26, 2023",
    status: "completed",
  },
  {
    id: "2",
    serviceName: "Garden Weeding",
    date: "Nov 15, 2023",
    status: "upcoming",
  },
];

export const addresses: Address[] = [
  {
    id: "1",
    label: "Home",
    address: "123 Green Valley Rd, Meadowbrook",
    icon: "home",
  },
  {
    id: "2",
    label: "Work",
    address: "456 Business Park Ave, Commerce City",
    icon: "work",
  },
];
