import { Metadata } from "next";
import PackagesClient from "@/components/PackagesClient";

export const metadata: Metadata = {
  title: "Exclusive Holiday Packages & Nepal Tour Deals | My Next Trip (MNT)",
  description: "Book custom Nepal tour packages, Goa holiday deals, and Kashmir packages. Your trusted tour operator in Patna and Ranchi for premium vacation planning and direct bookings.",
  keywords: [
    "nepal tour packages", "goa holiday packages", "kashmir tour from patna", 
    "kerala honeymoon packages", "MNT packages", "holiday deals india", 
    "custom travel packages", "tour operator patna", "tour operator ranchi"
  ],
  alternates: {
    canonical: "https://www.mynexttrip.in/packages",
  },
  openGraph: {
    title: "Plan Your Dream Holiday | Best Tour Packages | MNT Brand",
    description: "Curated travel packages across India, Nepal and the World. Explore custom vacation deals today.",
    images: [{ url: "/images/goa.png" }],
    url: "https://www.mynexttrip.in/packages",
    type: "website",
  }
};

export default function PackagesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.mynexttrip.in"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Packages",
                "item": "https://www.mynexttrip.in/packages"
              }
            ]
          })
        }}
      />
      <PackagesClient />
    </main>
  );
}
