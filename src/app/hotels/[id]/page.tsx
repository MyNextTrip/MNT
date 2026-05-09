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
  // TIER 1 – Highest Volume (Branded + Location Intent)
  "hotels in Ranchi", "best hotels in Ranchi", "hotel booking Ranchi", "hotels in Bariatu Ranchi", "Mountain View Resort Ranchi",
  "cheap hotels in Ranchi", "budget hotels in Ranchi", "hotels near Bariatu Ranchi", "3 star hotels in Ranchi", "hotel room booking Ranchi",
  
  // TIER 2 – High Volume (Star Rating + Price Intent)
  "affordable hotels in Ranchi", "luxury hotels Ranchi", "hotels in Ranchi under 1000", "hotels in Ranchi under 1500", "rooms in Ranchi",
  "deluxe rooms Ranchi", "suite rooms Ranchi", "classic room hotel Ranchi", "premium hotel rooms Ranchi", "hotel with AC rooms Ranchi",
  
  // TIER 3 – Local Area Keywords (Ranchi Locality)
  "hotels near DAV School Bariatu", "hotels near RIMS Ranchi", "hotels near Tagore Hill Ranchi", "hotels near Ranchi Railway Station",
  "hotels near Ranchi Airport", "hotels near Patratu Valley", "hotels in Malabar Enclave Ranchi", "hotels near Medica Hospital Ranchi",
  "Bariatu road hotels Ranchi", "hotels in Jharkhand",
  
  // TIER 4 – Amenity-Based Keywords
  "hotel with restaurant in Ranchi", "hotel with free wifi Ranchi", "hotel with parking Ranchi", "hotel with room service Ranchi",
  "hotel with conference room Ranchi", "hotel with meeting hall Ranchi", "hotel with co-working space Ranchi", "hotel with housekeeping Ranchi",
  "hotel with breakfast Ranchi", "hotel with continental breakfast Ranchi", "MAP meal plan hotel Ranchi", "American plan hotel Ranchi",
  "hotel with 24 hour service Ranchi", "hotel with business centre Ranchi", "hotel with toiletries Ranchi",
  
  // TIER 5 – Segment-Specific (Couples, Family, Business)
  "couple friendly hotels Ranchi", "hotels for couples in Ranchi", "unmarried couple hotels Ranchi", "family hotels Ranchi",
  "business hotels Ranchi", "hotels for corporate stay Ranchi", "solo traveller hotels Ranchi", "group booking hotels Ranchi",
  "hotels for medical visitors Ranchi", "hotels near hospital Ranchi",
  
  // TIER 6 – Booking Platform Keywords (MakeMyTrip / Booking.com Style)
  "makemytrip hotels Ranchi", "booking.com hotels Ranchi", "direct hotel booking Ranchi", "online hotel booking Ranchi",
  "book hotel Ranchi tonight", "hotel booking with free cancellation Ranchi", "pay later hotels Ranchi", "hotel discount Ranchi",
  "hotel offers Ranchi", "lowest price hotel Ranchi", "best hotel deals Ranchi", "MNT hotel booking", "mynexttrip hotels",
  "MNT brand Ranchi", "hotel booking without OTA Ranchi",
  
  // TIER 7 – Near Me + Voice Search Keywords
  "hotels near me Ranchi", "hotel near me Bariatu", "best hotel near me Jharkhand", "cheap hotel near me Ranchi", "rooms near me Ranchi",
  "hotel near Bariatu Hill", "resort near Ranchi", "mountain view hotel Ranchi", "mountain resort Ranchi", "resort in Bariatu",
  
  // TIER 8 – Travel Package + Destination Keywords
  "Ranchi travel packages", "Ranchi tour packages", "Ranchi weekend getaway", "places to stay in Ranchi", "best accommodation Ranchi",
  "Ranchi tourism hotel", "visit Jharkhand stay", "Ranchi trip hotel booking", "Jharkhand hotel booking online", "India best hotels Ranchi",
  
  // TIER 9 – Review & Rating Keywords
  "top rated hotels Ranchi", "highest rated hotel Bariatu", "verified hotels Ranchi", "hotels with good reviews Ranchi",
  "5 star rated hotel Ranchi", "premium hospitality Ranchi", "hotel good management Ranchi", "clean and safe hotels Ranchi",
  "staff friendly hotel Ranchi", "comfortable stay Ranchi",

  // Mountain Biking specialized keywords (Previous Request)
  "what mountain bike should i get", "mountain bike buying guide", "what type of mountain bike should i get", "how do i choose a mountain bike",
  "kinds of mountain bike", "how to choose a mtb", "different kinds of mountain bikes", "different types of mtb", "types of mtb",
  "types of mountain bikes", "mountain bike styles", "mountain bike categories", "types of mountain biking"
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
      const mvTitle = "Mountain View Resort – Best Hotel in Bariatu, Ranchi | Direct Booking @ ₹900 | MynextTrip";
      const mvDescription = "Book direct at Mountain View Resort, Bariatu Ranchi. Best hotel near DAV School with Classic, Deluxe & Suite rooms starting ₹900. Free WiFi, AC, Parking & 24/7 Service. Best price guaranteed on MynextTrip.";
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

