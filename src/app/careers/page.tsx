import { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers at MyNextTrip | Join Our Hospitality Team | MNT Jobs",
  description: "Join MyNextTrip (MNT) and build your future in the hospitality industry. Explore job openings for GM, Front Office, Housekeeping, and Chefs in Patna and Ranchi. Apply today!",
  keywords: [
    "hospitality jobs patna", "hotel jobs ranchi", "careers in travel", 
    "chef jobs bihar", "front office manager jobs", "MNT careers", 
    "hospitality recruitment india"
  ],
  alternates: {
    canonical: "https://www.mynexttrip.in/careers",
  },
  openGraph: {
    title: "Build Your Future with MyNextTrip | Join Our Elite Team",
    description: "Explore career opportunities in hospitality and travel with MyNextTrip. Join a team dedicated to excellence.",
    url: "https://www.mynexttrip.in/careers",
    type: "website",
  }
};

export default function CareersPage() {
  return (
    <>
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
                "name": "Careers",
                "item": "https://www.mynexttrip.in/careers"
              }
            ]
          })
        }}
      />
      <CareersClient />
    </>
  );
}
