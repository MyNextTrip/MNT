import { Metadata } from "next";
import PackagesClient from "@/components/PackagesClient";

export const metadata: Metadata = {
  title: "Exclusive Holiday Packages & Tour Deals | MyNextTrip",
  description: "Book Nepal tour packages, Goa holiday deals, Kashmir packages, and Kerala honeymoons at best prices. Custom travel plans with MyNextTrip – Your trusted tour operator in Patna and Ranchi.",
  keywords: ["nepal tour packages", "goa holiday packages", "kashmir tour from patna", "kerala honeymoon packages", "tour operator ranchi", "holiday deals india", "custom travel packages"],
  openGraph: {
    title: "Plan Your Dream Holiday | Best Tour Packages | MyNextTrip",
    description: "Curated travel packages across India, Nepal and the World. Explore custom vacation deals today.",
    images: [{ url: "/images/goa.png" }],
  }
};

export default function PackagesPage() {
  return <PackagesClient />;
}
