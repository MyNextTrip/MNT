"use client";

import { useState, useEffect, Suspense, useMemo } from "react";

import { Link2, MapPin, Star, Building2, IndianRupee, Loader2, Search, Newspaper } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HotelsGridSkeleton } from "./Skeletons";
import { getHotelImage, getHotelWhatsApp, getHotelBlog } from "@/lib/utils";

interface HotelsListClientProps {
  initialHotels?: any[];
}

function HotelsList({ initialHotels }: HotelsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParam = searchParams?.get('q') || "";
  const locationParam = searchParams?.get('location') || "";
  
  const [hotels, setHotels] = useState<any[]>(initialHotels || []);
  const [loading, setLoading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If it's the first render and we have initial hotels, skip the fetch
    if (isFirstRender && initialHotels && initialHotels.length > 0) {
      setIsFirstRender(false);
      return;
    }

    if (!searchParam && !locationParam) {
      setHotels([]);
      return;
    }

    const fetchHotels = async () => {
      try {
        setLoading(true);
        let url = '/api/hotels';
        if (searchParam) {
          url = `/api/hotels?q=${encodeURIComponent(searchParam)}`;
        } else if (locationParam) {
          url = `/api/hotels?location=${encodeURIComponent(locationParam)}`;
        }
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
  }, [locationParam, searchParam]);

  if (loading || !mounted) {
    return <HotelsGridSkeleton />;
  }

  // If no search is active
  if (!searchParam && !locationParam) {
    return (
      <div className="flex flex-col justify-center items-center py-32 text-slate-500 w-full col-span-full bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 animate-in fade-in slide-in-from-bottom-8">
        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-8">
          <Search className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-4">Start Your Search</h3>
        <p className="max-w-md text-center text-slate-500 text-lg font-medium leading-relaxed px-8">
          Enter a <span className="text-primary font-bold">hotel name</span>, <span className="text-primary font-bold">location</span>, or <span className="text-primary font-bold">phone number</span> in the search bar above to find your perfect stay.
        </p>
        <div className="mt-12 flex gap-4">
           <span className="px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-100">#QuickBooking</span>
           <span className="px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-100">#DirectContact</span>
        </div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-32 text-slate-500 w-full col-span-full bg-white rounded-[3rem] shadow-xl border border-slate-100">
        <Building2 className="w-20 h-20 text-slate-200 mb-6" />
        <h3 className="text-2xl font-black text-slate-900">
          No matches found
        </h3>
        <p className="max-w-md text-center mt-3 text-slate-500 font-medium px-8 leading-relaxed">
          We couldn't find any properties matching "{searchParam || locationParam}". Try searching for something else or check the spelling.
        </p>
        <button 
          onClick={() => router.push('/hotels')}
          className="mt-8 px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary transition-all active:scale-95 shadow-lg"
        >
          Clear Search
        </button>
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
            <img 
              src={(hotel.images && hotel.images.filter((img: any) => img && img.trim() !== "").length > 0) 
                ? hotel.images.filter((img: any) => img && img.trim() !== "")[0] 
                : getHotelImage(hotel.hotelName)} 
              alt={hotel.hotelName} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              suppressHydrationWarning
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

            <div className="mt-4 mb-4 flex flex-col gap-3">
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

              {/* Quick Actions: WhatsApp & Blog */}
              <div className="flex items-center gap-2 mt-2">
                {getHotelWhatsApp(hotel.hotelName, hotel.address) && (
                  <Link 
                    href={`https://wa.me/${getHotelWhatsApp(hotel.hotelName, hotel.address)}?text=Hi, I'm interested in booking a stay at ${hotel.hotelName}. Please provide more details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-100 hover:bg-emerald-100 transition-all"
                    suppressHydrationWarning
                  >
                    <div className="relative w-3.5 h-3.5">
                      <img src="/images/whatsapp-icon.png" alt="WhatsApp" className="absolute inset-0 w-full h-full object-contain" />
                    </div>
                    Chat
                  </Link>
                )}
                {(hotel.blog || getHotelBlog(hotel.hotelName)) && (
                  <Link 
                    href={(hotel.blog || getHotelBlog(hotel.hotelName))!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-100 hover:bg-blue-100 transition-all"
                  >
                    <Newspaper className="w-3.5 h-3.5" />
                    Blog
                  </Link>
                )}
              </div>
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
                suppressHydrationWarning
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
