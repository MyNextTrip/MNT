import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const HOTEL_IMAGES: Record<string, string> = {
  "Gharonda Hotel Restaurant Banquet": "/images/Gharonda Hotel Restaurant Banquet.avif",
  "Gharonda Hotel": "/images/Gharonda Hotel.avif",
  "Hotel Chandrashila": "/images/Hotel Chandrashila.avif",
  "Hotel Friends Inn": "/images/Hotel Friends Inn.avif",
  "Hotel Harsh Regency": "/images/Hotel Harsh Regency.avif",
  "Hotel La Vista": "/images/Hotel La Vista.avif",
  "Hotel Nandak Grand": "/images/Hotel Nandak Grand.avif",
  "Hotel The Dev Regency": "/images/Hotel The Dev Regency.avif",
  "Hotels Ichchha": "/images/Hotels Ichchha.avif",
  "Mountain View Resort": "/images/Mountain View Resort.avif",
  "Princess Home": "/images/Princess Home.avif",
  "Siddhi Vinayak Hotel & Banquet": "/images/Siddhi Vinayak Hotel & Banquet1.avif",
  "Gharonda": "/images/Gharonda Hotel.avif",
  "Ichchha": "/images/Hotels Ichchha.avif",
  "Dev Regency": "/images/Hotel The Dev Regency.avif",
  "Chandrashila": "/images/Hotel Chandrashila.avif",
  "La Vista": "/images/Hotel La Vista.avif",
  "Harsh Regency": "/images/Hotel Harsh Regency.avif",
  "Nandak Grand": "/images/Hotel Nandak Grand.avif",
  "Siddhi Vinayak": "/images/Siddhi Vinayak Hotel & Banquet1.avif",
};

export function getHotelImage(hotelName: string, fallback: string = '/images/hero-bg.png') {
  if (!hotelName) return fallback;
  
  const cleanName = hotelName.trim();
  
  // Try direct match
  if (HOTEL_IMAGES[cleanName]) return HOTEL_IMAGES[cleanName];
  
  // Try case-insensitive partial match
  const lowerName = cleanName.toLowerCase();
  
  // Sort keys by length descending to match most specific first
  const sortedKeys = Object.keys(HOTEL_IMAGES).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    if (lowerName.includes(key.toLowerCase())) {
      return HOTEL_IMAGES[key];
    }
  }
  
  return fallback;
}
