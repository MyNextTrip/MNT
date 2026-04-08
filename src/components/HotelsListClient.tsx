"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import Image from "next/image";
import { Link2, MapPin, Star, Building2, IndianRupee, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HotelsGridSkeleton } from "./Skeletons";

interface HotelsListClientProps {
  initialHotels?: any[];
}

function HotelsList({ initialHotels }: HotelsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationParam = searchParams?.get('location') || "";
  
  const [hotels, setHotels] = useState<any[]>(initialHotels || []);
  const [loading, setLoading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // If it's the first render and we have initial hotels, skip the fetch
    // unless the location param actually changed from what was rendered on server (not easy to detect here without more complexity)
    // But since the server already handles the initial location query, we can trust it for the first load.
    if (isFirstRender && initialHotels) {
      setIsFirstRender(false);
      return;
    }

    const fetchHotels = async () => {
      try {
        setLoading(true);
        const url = locationParam ? `/api/hotels?location=${encodeURIComponent(locationParam)}` : '/api/hotels';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setHotels(data.hotels);
        }
      } catch (e) {
        console.error("Failed to fetch hotels from MongoDB:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [locationParam]);

  if (loading) {
    return <HotelsGridSkeleton />;
  }

  if (hotels.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-32 text-slate-500 w-full col-span-full bg-white rounded-3xl border border-dashed border-slate-200">
        <Building2 className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-2xl font-bold text-slate-700">
          {locationParam ? "Currently Not Available in this city" : "No properties found."}
        </h3>
        <p className="max-w-md text-center mt-2 px-4">
          {locationParam 
            ? `We don't have any listings in "${locationParam}" at the moment. Try searching for a different city like Patna or Ranchi.` 
            : "We couldn't find any hotels matching your search. Please check back later."}
        </p>
      </div>
    );
  }

  const checkinParam = searchParams?.get('checkin');
  const checkoutParam = searchParams?.get('checkout');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {hotels.map((hotel) => {
        const hotelLink = `/hotels/${hotel._id}${checkinParam && checkoutParam ? `?checkin=${checkinParam}&checkout=${checkoutParam}` : ''}`;
        return (
          <div key={hotel._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 group flex flex-col animate-in fade-in zoom-in-95 fill-mode-both">
          <Link href={hotelLink} className="h-64 relative overflow-hidden block">
            <Image 
              src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : '/images/hero-bg.png'} 
              alt={hotel.hotelName} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-primary tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
              <Building2 className="w-3 h-3" /> {hotel.location}
            </div>
            <div className="absolute top-4 right-4 bg-amber-500/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-xs font-black text-white flex items-center gap-1.5 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-white" /> {hotel.owner === "MyNextTrip" ? "5.0" : "4.5"}
            </div>
          </Link>
          
          <div className="p-6 flex flex-col flex-1">
            <Link href={hotelLink} className="block group/title">
              <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover/title:text-primary transition-colors line-clamp-1">
                {hotel.hotelName}
              </h3>
            </Link>
            <p className="text-sm text-slate-500 mb-4 flex items-start gap-2 h-10">
              <MapPin className="w-4 h-4 text-primary/60 shrink-0 mt-1" /> 
              <span className="leading-snug line-clamp-2 font-medium">{hotel.address}</span>
            </p>
            
            <div className="mt-auto pt-4 border-t border-slate-100 mb-4">
              <div className="flex flex-wrap gap-2">
                 {hotel.amenities && hotel.amenities.slice(0, 3).map((amenity: string, i: number) => (
                   <span key={i} className="text-[10px] font-black px-2.5 py-1.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-100 uppercase tracking-wider">{amenity}</span>
                 ))}
                 {hotel.amenities && hotel.amenities.length > 3 && (
                   <span className="text-[10px] font-black px-2.5 py-1.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 uppercase">+{hotel.amenities.length - 3}</span>
                 )}
              </div>
            </div>

            <div className="mt-4 mb-4">
              {hotel.rooms && hotel.rooms.length > 0 ? (
                <div className="flex items-end justify-between">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">Starts from</p>
                     <p className="text-2xl font-black text-slate-900 leading-none">
                       ₹{Math.min(...hotel.rooms.map((r: any) => r.price))}
                       <span className="text-xs font-bold text-slate-400 ml-1.5 lowercase">per night</span>
                     </p>
                  </div>
                </div>
              ) : (
                <div className="h-10 flex items-end">
                  <p className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Contact for pricing</p>
                </div>
              )}
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
              <button 
                onClick={() => {
                  const hotelLink = `/hotels/${hotel._id}${checkinParam && checkoutParam ? `?checkin=${checkinParam}&checkout=${checkoutParam}` : ''}`;
                  const bookingUrl = hotelLink + (hotelLink.includes('?') ? '&' : '?') + 'bookNow=true';
                  
                  const storedUser = localStorage.getItem("user");
                  if (!storedUser) {
                    const callbackUrl = encodeURIComponent(window.location.origin + bookingUrl);
                    router.push(`/login?callbackUrl=${callbackUrl}`);
                    return;
                  }
                  router.push(bookingUrl);
                }}
                className="flex items-center justify-center py-3 bg-emerald-600 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-md hover:shadow-emerald-200 transition-all active:scale-95"
              >
                Book Now
              </button>
              <Link 
                href={hotelLink}
                className="flex items-center justify-center py-3 bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 shadow-md hover:shadow-slate-200 transition-all active:scale-95"
              >
                Details
              </Link>
            </div>
          </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HotelsListClient({ initialHotels }: HotelsListClientProps) {
  return (
    <Suspense fallback={<HotelsGridSkeleton />}>
      <HotelsList initialHotels={initialHotels} />
    </Suspense>
  );
}
