import { Metadata } from "next";
import Image from "next/image";
import { Plane, MapPin, ArrowRight, Briefcase, Calendar, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Cheap Flights | Domestic & International Air Tickets | MyNextTrip",
  description: "Find and book the cheapest flights from Patna, Ranchi, and Delhi to destinations worldwide. Fast, secure, and premium flight booking experience on MyNextTrip.",
  openGraph: {
    title: "Book Your Next Flight | MyNextTrip",
    description: "Premium flight booking service with transparent pricing and instant confirmations.",
    images: [{ url: "/images/dubai.png" }],
  }
};

export default function FlightsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Search Section */}
      <div className="pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/dubai.png" alt="Flight booking background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Book Your Next Flight</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg font-light mb-12">
            Enjoy premium service, transparent pricing, and instant confirmations for domestic and international travel.
          </p>

          {/* Search Widget - Kept as simple HTML structure since no state was used externally */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 border border-white/40 text-left">
            <div className="flex gap-6 mb-6 pb-4 border-b border-slate-100">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">
                <input type="radio" name="flight_form_type" className="text-blue-600 accent-blue-600 w-4 h-4" defaultChecked /> One Way
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">
                <input type="radio" name="flight_form_type" className="text-blue-600 accent-blue-600 w-4 h-4" /> Round Trip
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">
                <input type="radio" name="flight_form_type" className="text-blue-600 accent-blue-600 w-4 h-4" /> Multi-City
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative group/input md:col-span-1">
                <p className="text-xs font-bold text-slate-400 mb-1 pl-1">FROM</p>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover/input:text-blue-500 transition-colors" />
                  <input type="text" defaultValue="Patna" className="w-full pl-10 pr-4 py-3.5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-black text-slate-800" />
                </div>
              </div>

              <div className="relative group/input md:col-span-1">
                <p className="text-xs font-bold text-slate-400 mb-1 pl-1">TO</p>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover/input:text-blue-500 transition-colors" />
                  <input type="text" placeholder="Destination" className="w-full pl-10 pr-4 py-3.5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-black text-slate-800" />
                </div>
              </div>

              <div className="relative group/input md:col-span-1">
                <p className="text-xs font-bold text-slate-400 mb-1 pl-1">DEPARTURE</p>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover/input:text-blue-500 transition-colors" />
                  <input 
                    type="date" 
                    className="w-full pl-10 pr-4 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-800" 
                  />
                </div>
              </div>

              <div className="relative group/input md:col-span-1">
                <p className="text-xs font-bold text-slate-400 mb-1 pl-1">TRAVELLERS</p>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover/input:text-blue-500 transition-colors" />
                  <input type="text" defaultValue="1 Adult, Economy" readOnly className="w-full pl-10 pr-4 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none cursor-pointer font-bold text-slate-800" />
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center flex justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg py-4 px-16 rounded-full shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-3 w-full md:w-auto mx-auto group">
                SEARCH FLIGHTS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 max-w-6xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <Plane className="w-6 h-6 text-primary" /> Popular Domestic Routes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {from: 'Patna', to: 'Delhi', price: '₹4,500'},
            {from: 'Ranchi', to: 'Mumbai', price: '₹5,200'},
            {from: 'Patna', to: 'Bangalore', price: '₹6,100'},
            {from: 'Delhi', to: 'Dubai', price: '₹14,500'}
          ].map((route, idx) => (
             <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all cursor-pointer group hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-slate-800">{route.from}</span>
                  <Plane className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  <span className="font-bold text-slate-800">{route.to}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                     <p className="text-xs text-slate-400 font-medium">Starting from</p>
                     <p className="text-lg font-black text-emerald-600">{route.price}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                     <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </main>
  );
}
