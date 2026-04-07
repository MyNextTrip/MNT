import { Metadata } from "next";
import PackagesClient from "@/components/PackagesClient";

export const metadata: Metadata = {
  title: "Holiday Packages | Custom Vacation Deals | MyNextTrip",
  description: "Explore curated holiday packages for Goa, Kerala, Kashmir, and international destinations. Custom travel deals with flights and hotels on MyNextTrip.",
  openGraph: {
    title: "Plan Your Dream Holiday | MyNextTrip",
    description: "Curated travel packages across India and the World.",
    images: [{ url: "/images/goa.png" }],
  }
};

export default function PackagesPage() {
  return <PackagesClient />;
}
