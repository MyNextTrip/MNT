import { Metadata } from "next";
import PoliciesClient from "./PoliciesClient";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms of Service | MyNextTrip (MNT)",
  description: "Read the Privacy Policy, Terms & Conditions, Cancellation, and Refund policies of MyNextTrip (MNT). We ensure secure and transparent travel bookings for all our guests.",
  keywords: [
    "MNT privacy policy", "MyNextTrip terms and conditions", "hotel cancellation policy india", 
    "refund policy travel", "secure booking policy", "MNT legal"
  ],
  alternates: {
    canonical: "https://www.mynexttrip.in/policies",
  },
  openGraph: {
    title: "Legal & Policies | MyNextTrip (MNT)",
    description: "Transparency and security are our priorities. Read our full legal and privacy policies.",
    url: "https://www.mynexttrip.in/policies",
    type: "website",
  }
};

export default function PoliciesPage() {
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
                "name": "Policies",
                "item": "https://www.mynexttrip.in/policies"
              }
            ]
          })
        }}
      />
      <PoliciesClient />
    </>
  );
}
