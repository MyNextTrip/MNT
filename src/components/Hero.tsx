"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, Users, MapPin, Plane, Building2, Globe, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "flights", label: "nav.flights", icon: Plane },
  { id: "hotels", label: "nav.hotels", icon: Building2 },
  { id: "packages", label: "nav.packages", icon: Globe },
];

export default function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("flights");
  const [flightDate, setFlightDate] = useState("");
  const [hotelIn, setHotelIn] = useState("");
  const [hotelOut, setHotelOut] = useState("");
  const [pkgDate, setPkgDate] = useState("");

  // Hotel search states
  const [hotelLocation, setHotelLocation] = useState("");
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelAdults, setHotelAdults] = useState(2);
  const [showHotelGuests, setShowHotelGuests] = useState(false);

  // Flight states
  const [flightFrom, setFlightFrom] = useState("Patna");
  const [flightAdults, setFlightAdults] = useState(1);
  const [flightClass, setFlightClass] = useState("Economy");
  const [showFlightTravellers, setShowFlightTravellers] = useState(false);

  // Package states
  const [pkgFrom, setPkgFrom] = useState("Patna");
  const [pkgRooms, setPkgRooms] = useState(1);
  const [pkgAdults, setPkgAdults] = useState(2);
  const [pkgChildren, setPkgChildren] = useState(0);
  const [showPkgGuests, setShowPkgGuests] = useState(false);

  const today = new Date().toLocaleDateString('en-CA');
  const getNextDay = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('en-CA');
  };

  const minCheckOut = hotelIn ? getNextDay(hotelIn) : getNextDay(today);

  const handleHotelInChange = (val: string) => {
    setHotelIn(val);
    // Always default check-out to the next day on check-in selection
    setHotelOut(getNextDay(val));
  };

  const handleSearch = () => {
    if (activeTab === "hotels") {
      const params = new URLSearchParams();
      if (hotelLocation) params.append("location", hotelLocation);
      if (hotelIn) params.append("checkin", hotelIn);
      if (hotelOut) params.append("checkout", hotelOut);
      if (hotelRooms) params.append("rooms", hotelRooms.toString());
      router.push(`/hotels?${params.toString()}`);
    } else {
      // Logic for flights/packages if needed, otherwise default to hotels
      router.push("/hotels");
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-start justify-center pt-24 pb-16">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero-bg.png"
          alt="MyNextTrip - Luxury Hotels and Premium Travel Experiences"
          fill
          className="object-cover animate-subtle-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center mt-12 text-white">
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-serif leading-tight text-white drop-shadow-lg">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md">
               {t('hero.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 border border-white/40 text-left relative mt-16 max-w-5xl mx-auto">
            {/* MakeMyTrip Style Tabs */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center bg-white shadow-xl rounded-full px-2 py-1 gap-1 border border-primary/10 z-20 overflow-x-auto max-w-[95vw]">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-full transition-all font-bold text-sm whitespace-nowrap",
                      activeTab === tab.id 
                        ? "bg-primary/10 text-primary shadow-sm" 
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-slate-400")} />
                    {t(tab.label)}
                  </button>
                );
              })}
            </div>

            {/* FLIGHTS TAB */}
            {activeTab === "flights" && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex gap-6 mb-4 pb-4 border-b border-slate-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">
                    <input type="radio" name="flight_type" className="text-blue-600 w-4 h-4" defaultChecked /> One Way
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">
                    <input type="radio" name="flight_type" className="text-blue-600 w-4 h-4" /> Round Trip
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-100">
                  <div className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer">
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">FROM</p>
                    <div className="flex justify-between items-center">
                      <input 
                        type="text" 
                        value={flightFrom}
                        onChange={(e) => setFlightFrom(e.target.value)}
                        className="w-full text-xl font-black text-slate-800 placeholder:text-slate-300 focus:outline-none bg-transparent" 
                      /> 
                      <Plane className="w-5 h-5 text-slate-300 -rotate-45" />
                    </div>
                    <p className="text-xs font-semibold text-slate-50">{flightFrom === "Patna" ? "PTA, India" : "India"}</p>
                  </div>
                  <div className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer">
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">TO</p>
                    <div className="flex justify-between items-center"><input type="text" placeholder="Destination" className="w-full text-xl font-black text-slate-800 placeholder:text-slate-300 focus:outline-none bg-transparent" /></div>
                    <p className="text-xs font-semibold text-slate-500">Any Worldwide City</p>
                  </div>
                  <div className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer">
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">DEPARTURE</p>
                    <div className="flex items-center justify-between relative">
                      <input type="date" min={today} value={flightDate} onChange={e=>setFlightDate(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <h3 className="text-xl font-black text-slate-800 truncate">{flightDate ? new Date(flightDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : "Select Date"}</h3>
                      <Calendar className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">{flightDate ? new Date(flightDate).toLocaleDateString('en-GB',{weekday:'long'}) : "Tap to open calendar"}</p>
                  </div>
                  <div 
                    className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer select-none"
                    onClick={() => setShowFlightTravellers(!showFlightTravellers)}
                  >
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">TRAVELLERS & CLASS</p>
                    <div className="flex justify-between items-center"><h3 className="text-xl font-black text-slate-800"><span className="text-primary mr-1">{flightAdults}</span> Adult</h3> <Users className="w-5 h-5 text-slate-300" /></div>
                    <p className="text-xs font-semibold text-slate-500 truncate">{flightClass}</p>

                    {showFlightTravellers && (
                      <div 
                        className="absolute top-[105%] right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-800">Adults</p>
                              <p className="text-xs text-slate-400">&gt; 12 Yrs</p>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 rounded-lg p-1 border border-slate-100">
                              <button 
                                onClick={() => setFlightAdults(Math.max(1, flightAdults - 1))} 
                                className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                              >-</button>
                              <span className="font-bold text-slate-800 w-4 text-center">{flightAdults}</span>
                              <button 
                                onClick={() => setFlightAdults(Math.min(9, flightAdults + 1))} 
                                className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                              >+</button>
                            </div>
                          </div>
                          
                          <div className="border-t border-slate-100 pt-4">
                            <p className="font-bold text-slate-800 mb-3 text-sm">Cabin Class</p>
                            <div className="flex flex-wrap gap-2">
                              {['Economy', 'Premium Economy', 'Business', 'First Class'].map(cls => (
                                <button 
                                  key={cls}
                                  onClick={() => setFlightClass(cls)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                                    flightClass === cls ? "bg-primary/10 border-primary text-primary" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                  )}
                                >
                                  {cls}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowFlightTravellers(false); }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors mt-2"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* HOTELS TAB */}
            {activeTab === "hotels" && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex gap-6 mb-4 pb-4 border-b border-slate-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">
                    <input type="radio" name="hotel_type" className="text-blue-600 w-4 h-4" onChange={() => setHotelRooms(1)} checked={hotelRooms === 1} /> 1 Room
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">
                    <input type="radio" name="hotel_type" className="text-blue-600 w-4 h-4" onChange={() => setHotelRooms(5)} checked={hotelRooms > 1 && hotelRooms <= 5} /> Upto 5 Rooms
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">
                    <input type="radio" name="hotel_type" className="text-blue-600 w-4 h-4" /> Group Booking
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-100">
                  <div className="relative group/input md:col-span-2 p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer">
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">CITY, PROPERTY NAME OR LOCATION</p>
                    <div className="flex justify-between items-center">
                      <input 
                        type="text" 
                        placeholder="e.g. Patna, Ranchi" 
                        value={hotelLocation}
                        onChange={(e) => setHotelLocation(e.target.value)}
                        className="w-full text-xl font-black text-slate-800 placeholder:text-slate-300 focus:outline-none bg-transparent" 
                      /> 
                      <Building2 className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">India</p>
                  </div>
                  <div className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer">
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">CHECK-IN</p>
                    <div className="flex items-center justify-between relative">
                      <input type="date" min={today} value={hotelIn} onChange={e=>handleHotelInChange(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <h3 className="text-xl font-black text-slate-800 truncate">{hotelIn ? new Date(hotelIn).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : "Select Date"}</h3>
                      <Calendar className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                  <div className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer">
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">CHECK-OUT</p>
                    <div className="flex items-center justify-between relative">
                      <input type="date" min={minCheckOut} value={hotelOut} onChange={e=>setHotelOut(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <h3 className="text-xl font-black text-slate-800 truncate">{hotelOut ? new Date(hotelOut).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : "Select Date"}</h3>
                      <Calendar className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                  <div 
                    className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer select-none"
                    onClick={() => setShowHotelGuests(!showHotelGuests)}
                  >
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">ROOMS & GUESTS</p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-800 truncate">
                        <span className="text-primary mr-1">{hotelRooms}</span> Room, <span className="text-primary mx-1">{hotelAdults}</span> Guests
                      </h3>
                      <Users className="w-4 h-4 text-slate-300" />
                    </div>
                    {showHotelGuests && (
                      <div 
                        className="absolute top-[105%] right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-5">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-black text-slate-800 text-sm uppercase tracking-wider">Rooms</span>
                              <span className="text-[10px] font-bold text-slate-400">Max 5</span>
                            </div>
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                              <button 
                                onClick={() => setHotelRooms(Math.max(1, hotelRooms - 1))}
                                className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-black"
                              >-</button>
                              <span className="font-black text-lg text-slate-900 w-8 text-center">{hotelRooms}</span>
                              <button 
                                onClick={() => setHotelRooms(Math.min(5, hotelRooms + 1))}
                                className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 transition-all font-black"
                              >+</button>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-black text-slate-800 text-sm uppercase tracking-wider">Adults</span>
                              <span className="text-[10px] font-bold text-slate-400">Above 12 yrs</span>
                            </div>
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                              <button 
                                onClick={() => setHotelAdults(Math.max(1, hotelAdults - 1))}
                                className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-black"
                              >-</button>
                              <span className="font-black text-lg text-slate-900 w-8 text-center">{hotelAdults}</span>
                              <button 
                                onClick={() => setHotelAdults(Math.min(15, hotelAdults + 1))}
                                className="w-10 h-10 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 transition-all font-black"
                              >+</button>
                            </div>
                          </div>

                          <button 
                            onClick={() => setShowHotelGuests(false)}
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-xl text-sm hover:bg-primary transition-all shadow-lg hover:shadow-primary/30"
                          >
                            APPLY CHANGES
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PACKAGES TAB */}
            {activeTab === "packages" && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex gap-6 mb-4 pb-4 border-b border-slate-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">Explore Curated Holiday Packages</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-100">
                  <div className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer">
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">FROM CITY</p>
                    <div className="flex justify-between items-center">
                      <input 
                        type="text" 
                        value={pkgFrom}
                        onChange={(e) => setPkgFrom(e.target.value)}
                        className="w-full text-xl font-black text-slate-800 placeholder:text-slate-300 focus:outline-none bg-transparent" 
                      /> 
                      <MapPin className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500">India</p>
                  </div>
                  <div className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer">
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">TO CITY/DESTINATION</p>
                    <div className="flex justify-between items-center"><input type="text" placeholder="e.g. Goa, Kerala" className="w-full text-xl font-black text-slate-800 placeholder:text-slate-300 focus:outline-none bg-transparent" /></div>
                    <p className="text-xs font-semibold text-slate-500">Anywhere</p>
                  </div>
                  <div className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer">
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">STARTING DATE</p>
                    <div className="flex items-center justify-between relative">
                      <input type="date" min={today} value={pkgDate} onChange={e=>setPkgDate(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <h3 className="text-xl font-black text-slate-800 truncate">{pkgDate ? new Date(pkgDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : "Select Date"}</h3>
                      <Calendar className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                  <div 
                    className="relative group/input p-3 bg-white rounded-xl border hover:border-blue-200 transition-colors cursor-pointer select-none"
                    onClick={() => setShowPkgGuests(!showPkgGuests)}
                  >
                    <p className="text-[10px] font-black tracking-wider text-slate-400 mb-0.5">ROOMS & GUESTS</p>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-slate-800">
                        <span className="text-primary mr-1">{pkgRooms}</span> Room, <span className="text-primary mx-1">{pkgAdults + pkgChildren}</span> Guests
                      </h3>
                      <Users className="w-5 h-5 text-slate-300 group-hover/input:text-blue-500 transition-colors" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 truncate">
                      {pkgAdults} Adults, {pkgChildren} Children
                    </p>

                    {showPkgGuests && (
                      <div 
                        className="absolute top-[105%] right-0 md:-right-4 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-6">
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-800">Rooms</p>
                              <p className="text-xs text-slate-400">Min 1</p>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 rounded-lg p-1 border border-slate-100">
                              <button onClick={() => setPkgRooms(Math.max(1, pkgRooms - 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold hover:bg-slate-100 transition-colors">-</button>
                              <span className="font-bold text-slate-800 w-4 text-center">{pkgRooms}</span>
                              <button onClick={() => setPkgRooms(Math.min(5, pkgRooms + 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold hover:bg-slate-100 transition-colors">+</button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-800">Adults</p>
                              <p className="text-xs text-slate-400">&gt; 12 Yrs</p>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 rounded-lg p-1 border border-slate-100">
                              <button onClick={() => setPkgAdults(Math.max(1, pkgAdults - 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold hover:bg-slate-100 transition-colors">-</button>
                              <span className="font-bold text-slate-800 w-4 text-center">{pkgAdults}</span>
                              <button onClick={() => setPkgAdults(Math.min(10, pkgAdults + 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold hover:bg-slate-100 transition-colors">+</button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-slate-800">Children</p>
                              <p className="text-xs text-slate-400">2 - 12 Yrs</p>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 rounded-lg p-1 border border-slate-100">
                              <button onClick={() => setPkgChildren(Math.max(0, pkgChildren - 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold hover:bg-slate-100 transition-colors">-</button>
                              <span className="font-bold text-slate-800 w-4 text-center">{pkgChildren}</span>
                              <button onClick={() => setPkgChildren(Math.min(6, pkgChildren + 1))} className="w-8 h-8 rounded-md bg-white shadow-sm border text-slate-600 font-bold hover:bg-slate-100 transition-colors">+</button>
                            </div>
                          </div>

                          <button 
                            onClick={() => setShowPkgGuests(false)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors mt-2"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Global Search Button */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
              <button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl py-3.5 px-16 rounded-full shadow-[0_12px_24px_-8px_rgba(37,99,235,0.7)] hover:shadow-[0_16px_32px_-8px_rgba(37,99,235,0.8)] transition-all flex items-center gap-3"
              >
                SEARCH <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
