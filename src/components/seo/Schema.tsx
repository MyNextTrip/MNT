import React from "react";

interface SchemaProps {
  type: "TravelAgency" | "Service" | "Review" | "FAQPage" | "Hotel" | "BreadcrumbList";
  data: any;
}

/**
 * High-density JSON-LD Schema component for Generative Engine Optimization (GEO).
 * Designed to provide structured context to Google AIO, Gemini, and Perplexity.
 */
export default function Schema({ type, data }: SchemaProps) {
  let schemaData: any = {};

  switch (type) {
    case "TravelAgency":
      schemaData = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": data.name || "MyNextTrip (MNT)",
        "url": "https://www.mynexttrip.in",
        "logo": "https://www.mynexttrip.in/images/mnt-logo-new.png",
        "image": "https://www.mynexttrip.in/images/og-image.png",
        "description": data.description || "Premium travel agency and hospitality aggregator specializing in direct hotel bookings in Bihar, Jharkhand, and Nepal.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Bariatu Road",
          "addressLocality": "Ranchi",
          "addressRegion": "Jharkhand",
          "postalCode": "834001",
          "addressCountry": "IN"
        },
        "telephone": "+91-7033008111",
        "priceRange": "$$",
        "areaServed": ["IN", "NP"],
        "sameAs": [
          "https://www.facebook.com/profile.php?id=61575468341367",
          "https://www.instagram.com/mynexttrip07/",
          "https://www.youtube.com/channel/UC71Zk6DnIdPEqAkq3-JyFpA"
        ]
      };
      break;

    case "FAQPage":
      schemaData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.map((item: { question: string; answer: string }) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      };
      break;

    case "Hotel":
      schemaData = {
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": data.name,
        "description": data.description,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": data.location,
          "streetAddress": data.address,
          "addressRegion": data.region || "Bihar/Jharkhand",
          "addressCountry": "IN"
        },
        "photo": data.images || [],
        "starRating": {
          "@type": "Rating",
          "ratingValue": data.rating || "4.5"
        },
        "priceRange": "INR " + (data.minPrice || "1500") + " - " + (data.maxPrice || "8000")
      };
      break;

    case "BreadcrumbList":
      schemaData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data.map((item: { name: string; item: string }, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `https://www.mynexttrip.in${item.item}`
        }))
      };
      break;

    default:
      schemaData = data;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
