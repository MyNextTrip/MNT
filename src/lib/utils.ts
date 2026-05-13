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

export const HOTEL_WHATSAPP_MAPPING: Record<string, string> = {
  "Mountain View Resort": "918102749739",
  "Hotel La Vista": "918235416130",
  "Hotel The Dev Regency": "919934306111",
  "Gharonda Hotel": "917091383111",
  "Princess Home": "919546633866",
  "Hotel Chandrashila": "918298400222",
  "Hotel Friends Inn": "918102232956",
};

export const getHotelWhatsApp = (hotelName: string, address: string) => {
  if (!hotelName) return null;
  // Direct matches
  for (const [name, phone] of Object.entries(HOTEL_WHATSAPP_MAPPING)) {
    if (hotelName.toLowerCase().includes(name.toLowerCase())) return phone;
  }
  
  // Special handling for Siddhi Vinayak branches
  if (hotelName.toLowerCase().includes("siddhi vinayak")) {
    if (address?.toLowerCase().includes("chatauni") || address?.toLowerCase().includes("narega")) {
      return "916287099704";
    }
    if (address?.toLowerCase().includes("station") || address?.toLowerCase().includes("belbawana")) {
      return "916287099703";
    }
    return "916287099704"; // Default to one of them
  }
  
  return null;
};

export const HOTEL_BLOG_MAPPING: Record<string, string> = {
  "Mountain View": "https://hotel-mountain-view-resort.blogspot.com/2026/05/hotel-mountian-view-resort.html",
  "La Vista": "https://hotel-la-vista.blogspot.com/2026/05/hotel-la-vista-blogger-post-ready-to.html",
  "Gharonda": "https://gharonda-hotel.blogspot.com/2026/05/gharonda-hotel-restaurant-banquet.html",
  "Dev Regency": "https://dev-regency.blogspot.com/2026/05/premium-property-patna-bihar-hotel-dev.html",
  "Chandrashila": "https://hotelchand.blogspot.com/2026/05/hotel-chandrashila-by-mnt.html",
  "Princess Home": "https://hotelprincesshome.blogspot.com/2026/05/hotel-princess-home-by-mnt.html",
  "Siddhi Vinayak": "https://sdhvhr.blogspot.com/2026/05/siddhi-vinayak-hotel-banquet-by-mnt.html",
  "Friends Inn": "https://hotel-friends-inn.blogspot.com/2026/05/hotel-friends-inn-by-mnt.html",
};

export const getHotelBlog = (hotelName: string) => {
  if (!hotelName) return null;
  for (const [name, blogUrl] of Object.entries(HOTEL_BLOG_MAPPING)) {
    if (hotelName.toLowerCase().includes(name.toLowerCase())) return blogUrl;
  }
  return null;
};
