import { Metadata } from "next";
import Image from "next/image";
import HotelsListClient from "@/components/HotelsListClient";
import connectToDatabase from "@/lib/mongodb";
import { Hotel } from "@/lib/models/Hotel";

export const metadata: Metadata = {
  title: "Premium Hotels in Patna, Ranchi, Motihari & Nepal",
  description: "Discover curated luxury stays in Patna, Ranchi, Motihari, and Nepal. Book verified hotels with premium amenities at the best prices on MyNextTrip.",
  openGraph: {
    title: "Premium Hotels | MyNextTrip",
    description: "Discover curated luxury stays in Patna, Ranchi, Motihari, and Nepal.",
    url: "https://mynexttrip.onrender.com/hotels",
  }
};

export default async function HotelsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const locationQuery = params.location as string || "";
  
  let initialHotels = [];
  try {
    await connectToDatabase();
    
    let query = {};
    if (locationQuery) {
      query = {
        $or: [
          { location: { $regex: locationQuery, $options: 'i' } },
          { address: { $regex: locationQuery, $options: 'i' } }
        ]
      };
    }

    const hotels = await Hotel.find(query).sort({ createdAt: -1 }).limit(20).lean();
    initialHotels = JSON.parse(JSON.stringify(hotels));
  } catch (error) {
    console.error("Error fetching initial hotels:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Header */}
      <div className="bg-slate-900 pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/hero-bg.png" 
            alt="Hotels Background" 
            fill 
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center mt-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Our Premium Properties</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg font-light">
            Discover handpicked accommodations tailored for ultimate comfort across Patna, Ranchi, Motihari, and Nepal.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <HotelsListClient initialHotels={initialHotels} />
      </div>
    </main>
  );
}
