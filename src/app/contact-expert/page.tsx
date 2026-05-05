import { Metadata } from "next";
import ContactExpertClient from "./ContactExpertClient";

export const metadata: Metadata = {
  title: "Contact a Travel Expert | Personalized Trip Planning | MNT",
  description: "Get personalized travel advice and custom itineraries from MyNextTrip (MNT) experts. Call +91 9263554855 for immediate assistance with your next dream vacation.",
  keywords: [
    "travel expert consultation", "trip planner patna", "travel agent ranchi", 
    "custom tour packages india", "travel support 24/7", "MNT travel expert"
  ],
  alternates: {
    canonical: "https://www.mynexttrip.in/contact-expert",
  },
  openGraph: {
    title: "Consult a Travel Expert | MyNextTrip (MNT)",
    description: "Start your dream vacation with a professional consultation. Get expert advice for Bihar, Jharkhand, and Nepal travel.",
    url: "https://www.mynexttrip.in/contact-expert",
    type: "website",
  }
};

export default function ContactExpertPage() {
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
                "name": "Contact Expert",
                "item": "https://www.mynexttrip.in/contact-expert"
              }
            ]
          })
        }}
      />
      <ContactExpertClient />
    </>
  );
}
