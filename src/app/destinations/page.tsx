import { Metadata } from "next";
import Image from "next/image";
import { MapPin, Building2, Star, TreePine, Map, Camera, Briefcase, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top Tourist Destinations in Bihar, Jharkhand & Nepal | MyNextTrip",
  description: "Discover the best tourist places in Patna, Ranchi, and Nepal. Explore heritage sites, stunning waterfalls, and premium holiday destinations with MyNextTrip. Your local travel guide for Bihar & Jharkhand.",
  keywords: ["tourist places in patna", "waterfalls in ranchi", "bihar tourism", "jharkhand destinations", "nepal sightseeing", "heritage sites bihar", "ranchi tourism", "mynexttrip destinations"],
  openGraph: {
    title: "Explore Extraordinary Travel Destinations | MyNextTrip",
    description: "Curated experiences and premium stays across Bihar, Jharkhand, Nepal and beyond. Find your next adventure.",
    images: [{ url: "/images/goa.png" }],
  }
};

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Header */}
      <div className="pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/goa.png" alt="Travel Destinations in Bihar and Jharkhand" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-6">Discover Extraordinary Destinations</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl font-light">
            Explore curated experiences, top-rated cities, and safe premium stays tailored just for you across Bihar, Jharkhand, and beyond.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-20 space-y-12 max-w-7xl">
        {/* Featured Cities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Patna Card */}
           <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col sm:flex-row group">
             <div className="sm:w-2/5 h-64 sm:h-auto relative overflow-hidden">
                <Image src="/images/goa.png" alt="Luxury Hotels in Patna" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-black text-white leading-tight">Patna</h3>
                  <p className="text-sm text-white/80">The Heritage Capital</p>
                </div>
             </div>
             <div className="p-8 sm:w-3/5 flex flex-col">
                <div className="flex items-center gap-2 flex-wrap mb-6">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-md border border-blue-100 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> 6 Premium Hotels
                  </span>
                  <span className="bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1.5 rounded-md border border-amber-100 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500" /> Popular Choice
                  </span>
                </div>
                <div className="space-y-4 flex-grow mb-6">
                  <Link href="/hotels" className="text-sm font-bold text-slate-700 hover:text-primary flex items-center justify-between border-b pb-4 transition-colors">
                    Hotels near Patna Airport <ArrowRight className="w-4 h-4 text-slate-300" />
                  </Link>
                  <Link href="/hotels" className="text-sm font-bold text-slate-700 hover:text-primary flex items-center justify-between border-b pb-4 transition-colors">
                    Top Tourist Spots in Patna <ArrowRight className="w-4 h-4 text-slate-300" />
                  </Link>
                </div>
                <Link href="/hotels" className="mt-auto block w-full bg-slate-900 text-white text-center font-bold py-3.5 rounded-xl hover:bg-primary transition-colors">
                  Explore Patna
                </Link>
             </div>
           </div>

           {/* Ranchi Card */}
           <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col sm:flex-row group">
             <div className="sm:w-2/5 h-64 sm:h-auto relative overflow-hidden">
                <Image src="/images/dubai.png" alt="Luxury Hotels in Ranchi" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-black text-white leading-tight">Ranchi</h3>
                  <p className="text-sm text-white/80">City of Waterfalls</p>
                </div>
             </div>
             <div className="p-8 sm:w-3/5 flex flex-col">
                <div className="flex items-center gap-2 flex-wrap mb-6">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-md border border-emerald-100 flex items-center gap-1">
                    <TreePine className="w-3 h-3" /> 3 Premium Hotels
                  </span>
                  <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-md border border-teal-100 flex items-center gap-1">
                    <Map className="w-3 h-3" /> Nature & Leisure
                  </span>
                </div>
                <div className="space-y-4 flex-grow mb-6">
                  <Link href="/hotels" className="text-sm font-bold text-slate-700 hover:text-primary flex items-center justify-between border-b pb-4 transition-colors">
                    Centrally located in Ranchi <ArrowRight className="w-4 h-4 text-slate-300" />
                  </Link>
                  <Link href="/hotels" className="text-sm font-bold text-slate-700 hover:text-primary flex items-center justify-between border-b pb-4 transition-colors">
                    Best Time to Visit Ranchi <ArrowRight className="w-4 h-4 text-slate-300" />
                  </Link>
                </div>
                <Link href="/hotels" className="mt-auto block w-full bg-slate-900 text-white text-center font-bold py-3.5 rounded-xl hover:bg-primary transition-colors">
                  Explore Ranchi
                </Link>
             </div>
           </div>

        </div>

        {/* Categories Section */}
        <div className="pt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <Camera className="w-6 h-6 text-primary" /> Find by Experience
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             <Link href="/hotels" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all group flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex justify-center items-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Business Stays</h4>
                   <p className="text-sm text-slate-500">Corporate-ready properties</p>
                </div>
             </Link>

             <Link href="/hotels" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all group flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex justify-center items-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <TreePine className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Weekend Getaways</h4>
                   <p className="text-sm text-slate-500">Relaxing nature retreats</p>
                </div>
             </Link>

             <Link href="/hotels" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all group flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex justify-center items-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Pilgrimage & Culture</h4>
                   <p className="text-sm text-slate-500">Hotels near heritage sites</p>
                </div>
             </Link>
          </div>
        </div>

        {/* Safety Assured Component */}
        <div className="mt-12 bg-gradient-to-r from-indigo-900 to-blue-900 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none -translate-y-1/4 translate-x-1/4">
            <ShieldCheck className="w-64 h-64 text-white" />
          </div>
          <div className="max-w-xl relative z-10 mb-6 md:mb-0">
             <div className="flex items-center justify-center md:justify-start gap-3 text-indigo-200 font-bold mb-3 uppercase tracking-widest text-sm">
               <ShieldCheck className="w-5 h-5 fill-current" /> Safety First Protocol
             </div>
             <h3 className="text-2xl md:text-3xl font-black text-white mb-3">100% Sanitized & Safe Stays</h3>
             <p className="text-indigo-100/80 leading-relaxed font-medium">
                All our partner properties in Bihar & Jharkhand undergo strict hygiene protocols ensuring a premium and secure experience for every traveler.
             </p>
          </div>
          <Link href="/hotels" className="relative z-10 bg-white text-indigo-900 font-black px-8 py-4 rounded-xl shadow-lg hover:shadow-white/20 hover:-translate-y-1 transition-all whitespace-nowrap">
             Book Safe Stay
          </Link>
        </div>
      </div>
    </main>
  );
}
