import connectToDatabase from "@/lib/mongodb";
import { Hotel } from "@/lib/models/Hotel";
import HotelDetailsClient from "@/components/HotelDetailsClient";
import { Metadata } from "next";
import Link from "next/link";
import { cache } from 'react';

// Use React cache to prevent redundant DB calls within the same request lifecycle (Metadata + Page)
const getHotel = cache(async (id: string) => {
  await connectToDatabase();
  return Hotel.findById(id).lean();
});

// Pre-render hotel pages for better performance (SSG)
export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const hotels = await Hotel.find({}, '_id').limit(50).lean();
    return hotels.map((hotel) => ({
      id: (hotel._id as any).toString(),
    }));
  } catch (error) {
    console.error("Static Params Error:", error);
    return [];
  }
}

// ─── Mountain View Resort special SEO data ──────────────────────────────────
const MOUNTAIN_VIEW_RESORT_ID = "69c7f7dfbdcdb69782645343";

const mountainViewKeywords = [
  // Generic hotel searches
  "hotels near me", "hotel booking online", "budget hotels in India",
  "best hotels in Ranchi", "cheap hotels near me", "hotel deals today",
  "luxury hotels India", "hotel room booking", "hotels with free breakfast",
  "hotel with pool near me", "couple friendly hotels", "deluxe room hotel",
  "premium hotel rooms", "hotel suite booking", "hotel with AC room",
  "best price hotel booking", "direct hotel booking no OTA", "hotel WiFi free",
  "hotel with parking", "hotel co-working space",
  // Ranchi location-specific
  "hotels in Bariatu Ranchi", "hotel near DAV School Bariatu", "Ranchi hotels best",
  "hotel Ranchi Railway Station", "hotels near Ranchi Airport",
  "Jharkhand hotels booking", "resort Ranchi Jharkhand",
  "hotel near Dassam Falls Ranchi", "hotel near Pahari Mandir Ranchi",
  "hotel near Tagore Hill Ranchi", "hotel near Birsa Zoo Ranchi",
  "hotel near Kanke Dam Ranchi", "hotel near Hundru Falls",
  "Malabar Enclave hotel Ranchi", "hotel near Hatia Station Ranchi",
  "3 star hotels Ranchi", "hotel Bariatu Road Ranchi",
  "Mountain View Resort Ranchi", "Ranchi hotel under 1000",
  "hotel booking Ranchi today",
  // Long-tail specific
  "best hotel in Bariatu Ranchi with WiFi and AC",
  "budget hotel near DAV School Ranchi",
  "hotel in Ranchi with free parking and breakfast",
  "hotel near Ranchi Railway Station under 1500",
  "couple friendly hotel Bariatu Ranchi",
  "hotel with meeting room Ranchi",
  "hotel with co-working space Ranchi Jharkhand",
  "family hotel near Dassam Falls Ranchi",
  "hotel room with mountain view Ranchi",
  "safe hotel for couples Ranchi",
  "hotel check-in today Ranchi",
  "1 night stay hotel Ranchi cheap",
  "hotel with 24 hour room service Ranchi",
  "pet friendly hotel Ranchi Jharkhand",
  "hotel with conference room Ranchi",
  "eco friendly hotel Ranchi",
  "hotel pillow menu Ranchi luxury",
  "hotel with smart room controls Jharkhand",
  // Booking intent
  "book hotel online now", "hotel book karein",
  "hotel booking with free cancellation",
  "last minute hotel booking Ranchi",
  "hotel near me check in today",
  "pay at hotel booking India",
  "direct booking hotel no commission",
  "hotel best price guarantee",
  "hotel booking UPI payment",
  "hotel booking EMI option India",
  "hotel booking with GST invoice",
  "hotel room available tonight Ranchi",
  "WhatsApp hotel booking India",
  "hotel classic room booking cheap",
  "suite room booking Ranchi affordable",
  // Occasion & traveller type
  "honeymoon hotel Ranchi Jharkhand",
  "couple hotel anniversary stay",
  "family hotel Jharkhand vacation",
  "birthday celebration hotel Ranchi",
  "weekend getaway hotel Ranchi",
  "hotel for office party Ranchi",
  "business travel hotel Ranchi",
  "hotel for UPSC aspirants Ranchi",
  "hotel near AIIMS Ranchi",
  "hotel near Ranchi medical college",
  "hotel for wedding guests Ranchi",
  "hotel group booking Jharkhand",
  "staycation hotel Ranchi 2026",
  "hotel Diwali offer Jharkhand",
  "New Year hotel package Ranchi",
  "summer vacation hotel Ranchi",
  // Hindi / vernacular
  "रांची होटल", "बरियातू होटल", "झारखंड होटल बुकिंग", "सस्ता होटल रांची",
];
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const hotel = await getHotel(id);

    if (!hotel) {
      return { title: "Hotel Not Found | MyNextTrip" };
    }

    const hotelUrl = `https://www.mynexttrip.in/hotels/${id}`;

    // ── Special metadata for Mountain View Resort ──
    if (id === MOUNTAIN_VIEW_RESORT_ID) {
      const mvTitle = "Mountain View Resort Bariatu Ranchi | Budget to Premium Rooms ₹900 — Book Direct | MNT";
      const mvDescription = "Book Mountain View Resort in Bariatu, Ranchi — Classic ₹900, Deluxe ₹1100, Suite ₹1549, Premium ₹1989. Free WiFi · AC · Parking · 24/7 Room Service. Direct booking, best price guarantee. mynexttrip.in";
      const ogTitle = "Mountain View Resort | Best Hotel near DAV School Bariatu Ranchi | MNT";

      return {
        title: mvTitle,
        description: mvDescription,
        keywords: mountainViewKeywords,
        alternates: {
          canonical: hotelUrl,
        },
        openGraph: {
          title: ogTitle,
          description: mvDescription,
          url: hotelUrl,
          siteName: "My Next Trip (MNT)",
          images: hotel.images?.[0]
            ? [{ url: hotel.images[0], width: 1200, height: 630, alt: "Mountain View Resort exterior — best hotel in Bariatu Ranchi Jharkhand near DAV School" }]
            : [],
          type: "website",
          locale: "en_IN",
        },
        twitter: {
          card: "summary_large_image",
          title: ogTitle,
          description: mvDescription,
          images: hotel.images?.[0] ? [hotel.images[0]] : [],
        },
      };
    }

    // ── Generic metadata for all other hotels ──
    const title = `${hotel.hotelName} | Best Hotel in ${hotel.location} | MNT Brand`;
    const description = `Book your stay at ${hotel.hotelName} in ${hotel.location}. ${hotel.address}. Direct booking available via My Next Trip (MNT) — best price guarantee, free WiFi, verified property.`;
    const genericKeywords = [
      `${hotel.hotelName}`, `hotel in ${hotel.location}`, `best hotel ${hotel.location}`,
      "direct hotel booking", "MNT hotels", "hotel booking India",
      "hotels near me", "cheap hotels near me", "hotel deals today",
      "budget hotels India", "luxury hotels India", "hotel WiFi free",
      "couple friendly hotels", "hotel with AC room", "hotel with parking",
    ];

    return {
      title,
      description,
      keywords: genericKeywords,
      alternates: { canonical: hotelUrl },
      openGraph: {
        title,
        description,
        url: hotelUrl,
        siteName: "My Next Trip (MNT)",
        images: hotel.images?.[0] ? [{ url: hotel.images[0], width: 800, height: 600 }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: hotel.images?.[0] ? [hotel.images[0]] : [],
      },
    };
  } catch (error) {
    return { title: "Hotel Details | MyNextTrip" };
  }
}

export default async function HotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const hotel = await getHotel(id);

    if (!hotel) {
      console.warn(`[HotelPage] Hotel not found for ID: ${id}`);
      return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-slate-500">
          <h1 className="text-2xl font-bold">Property not found</h1>
          <p>The hotel you are looking for does not exist or has been removed.</p>
          <Link href="/hotels" className="mt-4 text-primary font-bold">Find Other Hotels</Link>
        </div>
      );
    }

    const serializedHotel = {
      ...hotel,
      _id: (hotel._id as any).toString(),
      rooms: hotel.rooms?.map((r: any) => ({ ...r, _id: r._id?.toString() })),
      reviews: hotel.reviews?.map((rev: any) => ({ ...rev, _id: rev._id?.toString(), createdAt: rev.createdAt?.toISOString() }))
    };

    // ── Rich JSON-LD Schema: LodgingBusiness ──
    const isMountainView = id === MOUNTAIN_VIEW_RESORT_ID;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": isMountainView ? "Mountain View Resort" : hotel.hotelName,
      "description": isMountainView
        ? "Mountain View Resort in Bariatu Ranchi offers Classic, Deluxe, Suite & Premium rooms from ₹900/night. Amenities: Free WiFi, AC, Parking, 24hr Room Service, Meeting Room, Co-working Space. Direct booking via MyNextTrip — best price guarantee."
        : `Luxury stay at ${hotel.hotelName} in ${hotel.location}`,
      "image": hotel.images,
      "url": `https://www.mynexttrip.in/hotels/${id}`,
      "telephone": hotel.phone || "+91-7033008111",
      "priceRange": isMountainView ? "₹900–₹1989" : "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": isMountainView ? "Bariatu Road" : hotel.address,
        "addressLocality": isMountainView ? "Bariatu, Ranchi" : hotel.location,
        "addressRegion": isMountainView ? "Jharkhand" : "India",
        "postalCode": isMountainView ? "834009" : "",
        "addressCountry": "IN"
      },
      ...(isMountainView && {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "23.3441",
          "longitude": "85.3091"
        }
      }),
      "amenityFeature": isMountainView
        ? [
            { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "24-Hour Room Service", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Meeting Room", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Co-working Space", "value": true },
          ]
        : [],
      "starRating": {
        "@type": "Rating",
        "ratingValue": hotel.owner === "MyNextTrip" ? "5" : "4"
      },
      "checkinTime": "12:00",
      "checkoutTime": "11:00",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, Credit Card, UPI, Net Banking",
    };

    // ── Breadcrumb Schema ──
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.mynexttrip.in" },
        { "@type": "ListItem", "position": 2, "name": "Hotels", "item": "https://www.mynexttrip.in/hotels" },
        { "@type": "ListItem", "position": 3, "name": isMountainView ? "Mountain View Resort" : hotel.hotelName, "item": `https://www.mynexttrip.in/hotels/${id}` },
      ]
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <HotelDetailsClient id={id} initialHotel={serializedHotel} />
      </>
    );
  } catch (err) {
    console.error("[HotelPage] Server Error:", err);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-slate-500">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p>We encountered an error while loading the property details.</p>
        <Link href="/hotels" className="mt-4 text-primary font-bold">Try again later</Link>
      </div>
    );
  }
}

// Revalidate every hour to keep content fresh while fast
export const revalidate = 3600;

