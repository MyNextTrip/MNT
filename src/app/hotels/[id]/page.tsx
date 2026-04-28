import connectToDatabase from "@/lib/mongodb";
import { Hotel } from "@/lib/models/Hotel";
import HotelDetailsClient from "@/components/HotelDetailsClient";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    await connectToDatabase();
    const hotel = await Hotel.findById(id).lean();

    if (!hotel) {
      console.warn(`[SEO] Hotel with ID ${id} not found in database.`);
      return {
        title: "Hotel Not Found | MyNextTrip",
      };
    }

    const title = `${hotel.hotelName} | Best Hotel in ${hotel.location} | MNT Brand`;
    const description = `Book your stay at ${hotel.hotelName} in ${hotel.location}. ${hotel.address}. Direct booking available via My Next Trip (MNT) for premium hospitality and verified stays.`;
    const hotelUrl = `https://www.mynexttrip.in/hotels/${id}`;

    return {
      title,
      description,
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
    return {
      title: "Hotel Details | MyNextTrip",
    };
  }
}

export default async function HotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    await connectToDatabase();
    // Validate ID format for MongoDB to prevent unnecessary crashes
    if (id.length !== 24 && !/^[0-9a-fA-F]{24}$/.test(id)) {
       console.error(`[HotelPage] Invalid Hotel ID format: ${id}`);
       return (
         <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-slate-500">
           <h1 className="text-2xl font-bold italic">Invalid Property Link</h1>
           <p>The link you followed appears to be broken. Please go back to the hotel list.</p>
           <Link href="/hotels" className="mt-4 text-primary font-bold">Browse Hotels</Link>
         </div>
       );
    }

    const hotel = await Hotel.findById(id).lean();

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

    // Convert mongoose _id to string for client-side serialization
    const serializedHotel = JSON.parse(JSON.stringify(hotel));

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": hotel.hotelName,
      "description": `Luxury stay at ${hotel.hotelName} in ${hotel.location}`,
      "image": hotel.images,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": hotel.address,
        "addressLocality": hotel.location,
        "addressCountry": "IN"
      },
      "starRating": {
        "@type": "Rating",
        "ratingValue": hotel.owner === "MyNextTrip" ? "5" : "4"
      }
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
