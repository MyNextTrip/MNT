"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { Link2, MapPin, Star, Building2, IndianRupee, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface HotelsListClientProps {
  initialHotels?: any[];
}

function HotelsList({ initialHotels }: HotelsListClientProps) {
  const searchParams = useSearchParams();
  const locationParam = searchParams?.get('location');
  
  const [hotels, setHotels] = useState<any[]>(initialHotels || []);
  const [loading, setLoading] = useState(!initialHotels);

  useEffect(() => {
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
    if (!initialHotels || locationParam) {
      fetchHotels();
    }
  }, [locationParam, initialHotels]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 w-full">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-32 text-slate-500 w-full col-span-full">
        <Building2 className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-2xl font-bold text-slate-700">
          {locationParam ? "Currently Not Available in this city" : "No properties found."}
        </h3>
        <p>
          {locationParam 
            ? `We don't have any listings in ${locationParam} at the moment.` 
            : "We couldn't find any hotels matching your search."}
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
          <div key={hotel._id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 group flex flex-col animate-in fade-in zoom-in-95">
          <Link href={hotelLink} className="h-60 relative overflow-hidden block">
            <Image 
              src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : '/images/hero-bg.png'} 
              alt={hotel.hotelName} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary tracking-wider uppercase flex items-center gap-1">
              <Building2 className="w-3 h-3" /> {hotel.location}
            </div>
            <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3 fill-white" /> {hotel.owner === "MyNextTrip" ? "5.0" : "4.5"}
            </div>
          </Link>
          
          <div className="p-6 flex flex-col flex-1">
            <Link href={hotelLink} className="block group/title">
              <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover/title:text-primary transition-colors">
                {hotel.hotelName}
              </h3>
            </Link>
            <p className="text-sm text-slate-500 mb-4 flex items-start gap-2 h-10">
              <MapPin className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" /> 
              <span className="leading-snug line-clamp-2">{hotel.address}</span>
            </p>
            
            <div className="mt-auto pt-4 border-t border-slate-100 mb-4">
              <div className="flex flex-wrap gap-2">
                 {hotel.amenities && hotel.amenities.slice(0, 3).map((amenity: string, i: number) => (
                   <span key={i} className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase tracking-wider">{amenity}</span>
                 ))}
                 {hotel.amenities && hotel.amenities.length > 3 && (
                   <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase">+{hotel.amenities.length - 3}</span>
                 )}
              </div>
            </div>

            <div className="mt-4 mb-2">
              {hotel.rooms && hotel.rooms.length > 0 ? (
                <div className="flex items-end justify-between">
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Starting Price</p>
                     <p className="text-xl font-black text-slate-900 leading-none">
                       ₹{Math.min(...hotel.rooms.map((r: any) => r.price))}
                       <span className="text-xs font-bold text-slate-500 ml-1 font-normal">/ night</span>
                     </p>
                  </div>
                </div>
              ) : (
                <div className="h-9 flex items-end">
                  <p className="text-sm font-bold text-slate-700">Contact for price</p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <Link 
                href={hotelLink + (hotelLink.includes('?') ? '&' : '?') + 'bookNow=true'}
                className="flex items-center justify-center py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-sm hover:bg-emerald-700 shadow-sm transition-colors whitespace-nowrap"
              >
                Book Now
              </Link>
              <Link 
                href={hotelLink}
                className="flex items-center justify-center py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm shadow-sm hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                View Details
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
    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <HotelsList initialHotels={initialHotels} />
    </Suspense>
  );
}
