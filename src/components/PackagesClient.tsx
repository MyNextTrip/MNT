"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Calendar, Users, ArrowRight, Heart, Users2, Backpack, Palmtree, Sun, Mountain, Building2, Flame } from "lucide-react";

export default function PackagesClient() {
  const [date, setDate] = useState("");
  const [showGuests, setShowGuests] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Dynamic Hero Search Section */}
      <div className="pt-20 pb-40 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/goa.png" alt="Holiday Cover" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 font-serif">Plan Your Dream Holiday</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg font-medium mb-10">
            Discover curated travel packages across India and the World.
          </p>

          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-4 md:p-8 border border-white/40 text-left relative">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center bg-white shadow-lg rounded-full px-6 py-2 gap-4 border border-blue-100 z-20">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-blue-700 border-b-2 border-blue-600 pb-1">Packages</label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-500 hover:text-slate-800 transition-colors pb-1">Activities</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4 bg-slate-50/50 rounded-2xl p-2 border border-slate-100">
              <div className="relative group/input p-3 bg-white rounded-xl border border-transparent hover:border-blue-200 transition-colors shadow-sm cursor-pointer">
                <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">FROM CITY</p>
                <div className="flex items-center justify-between"><h3 className="text-xl font-black text-slate-800">Patna</h3><MapPin className="w-5 h-5 text-slate-300" /></div>
                <p className="text-xs font-semibold text-slate-500">India</p>
              </div>

              <div className="relative group/input p-3 bg-white rounded-xl border border-transparent hover:border-blue-200 transition-colors shadow-sm cursor-pointer">
                <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">TO CITY/COUNTRY</p>
                <div className="flex items-center justify-between"><input type="text" placeholder="Goa, Kerala, Dubai" className="w-full text-xl font-black text-slate-800 placeholder:text-slate-300 focus:outline-none bg-transparent" /></div>
                <p className="text-xs font-semibold text-slate-500">Anywhere</p>
              </div>

              <div className="relative group/input p-3 bg-white rounded-xl border border-transparent hover:border-blue-200 transition-colors shadow-sm cursor-pointer">
                <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">STARTING DATE</p>
                <div className="flex items-center justify-between relative">
                  <input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={(e) => setDate(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <h3 className="text-xl font-black text-slate-800">{date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : "Select Date"}</h3>
                  <Calendar className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-xs font-semibold text-slate-500">{date ? new Date(date).toLocaleDateString('en-GB', { weekday: 'long' }) : "Or select month"}</p>
              </div>

              <div className="relative group/input p-3 bg-white rounded-xl border border-transparent hover:border-blue-200 transition-colors shadow-sm cursor-pointer select-none" onClick={() => setShowGuests(!showGuests)}>
                <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">ROOMS & GUESTS</p>
                <div className="flex items-center justify-between"><h3 className="text-xl font-black text-slate-800"><span className="text-primary mr-1">{rooms}</span> Room, <span className="text-primary mx-1">{adults + children}</span> Guests</h3><Users className="w-5 h-5 text-slate-300" /></div>
                <p className="text-xs font-semibold text-slate-500">{adults} Adults, {children} Children</p>

                {showGuests && (
                  <div className="absolute top-[105%] right-0 md:-right-4 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between"><div><p className="font-bold text-slate-800">Rooms</p></div><div className="flex items-center gap-4 bg-slate-50 rounded-lg p-1 border border-slate-100"><button onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold">-</button><span className="font-bold text-slate-800 w-4 text-center">{rooms}</span><button onClick={() => setRooms(Math.min(5, rooms + 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold">+</button></div></div>
                      <div className="flex items-center justify-between"><div><p className="font-bold text-slate-800">Adults</p></div><div className="flex items-center gap-4 bg-slate-50 rounded-lg p-1 border border-slate-100"><button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold">-</button><span className="font-bold text-slate-800 w-4 text-center">{adults}</span><button onClick={() => setAdults(Math.min(10, adults + 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold">+</button></div></div>
                      <div className="flex items-center justify-between"><div><p className="font-bold text-slate-800">Children</p></div><div className="flex items-center gap-4 bg-slate-50 rounded-lg p-1 border border-slate-100"><button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold">-</button><span className="font-bold text-slate-800 w-4 text-center">{children}</span><button onClick={() => setChildren(Math.min(6, children + 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold">+</button></div></div>
                      <button onClick={() => setShowGuests(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors mt-2">Apply</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2"><button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl py-3.5 px-16 rounded-full shadow-lg hover:-translate-y-1 transition-all flex items-center gap-3">SEARCH <ArrowRight className="w-5 h-5" /></button></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20 space-y-16 max-w-6xl">
        <div>
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3"><Flame className="w-6 h-6 text-orange-500" /> Holiday By Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[{icon: Heart, label: 'Honeymoon', desc: 'Romantic getaways', color: 'rose'}, {icon: Users2, label: 'Family', desc: 'Kid-friendly tours', color: 'blue'}, {icon: Backpack, label: 'Adventure', desc: 'Trekking & diving', color: 'amber'}, {icon: Palmtree, label: 'Beach', desc: 'Sun & sand', color: 'teal'}].map((theme, i) => (
               <div key={i} className="bg-white p-5 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-100 transition-all cursor-pointer group flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-${theme.color}-50 text-${theme.color}-500 flex justify-center items-center group-hover:bg-${theme.color}-500 group-hover:text-white transition-colors mb-4 border-4 border-white shadow-md`}><theme.icon className="w-7 h-7" /></div>
                  <h4 className="font-black text-slate-800 group-hover:text-primary transition-colors">{theme.label}</h4>
                  <p className="text-xs font-medium text-slate-400 mt-1">{theme.desc}</p>
               </div>
             ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3"><Building2 className="w-6 h-6 text-primary" /> Trending Domestic Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[{name: 'Goa', img: '/images/goa.png', title: 'Romantic Goa Getaway', price: '₹14,999'}, {name: 'Kerala', img: '/images/kerala.png', title: 'Magical Munnar houseboat', price: '₹18,500'}, {name: 'Kashmir', img: '/images/dubai.png', title: 'Paradise on Earth', price: '₹22,900'}].map((pkg, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-md hover:shadow-2xl overflow-hidden border border-slate-100 group transition-all cursor-pointer">
                <div className="relative h-48 overflow-hidden"><Image src={pkg.img} alt={pkg.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" /><div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 text-xs font-bold rounded-full">4N / 5D</div><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4"><h3 className="text-2xl font-black text-white">{pkg.name}</h3></div></div>
                <div className="p-5 flex flex-col gap-3">
                  <p className="text-sm font-bold text-slate-600">{pkg.title}</p>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400"><span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> 3+ Star Hotels</span><span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5" /> Sightseeing</span></div>
                  <div className="mt-4 flex justify-between items-end border-t border-slate-100 pt-4"><div><p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Starting At</p><p className="text-xl font-black text-slate-900">{pkg.price}<span className="text-xs font-medium text-slate-500 ml-1">/person</span></p></div><button className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors p-3 rounded-xl font-black"><ArrowRight className="w-4 h-4" /></button></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
