"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star, Building2, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

export default function Services() {
  const { t } = useLanguage();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  const DESTINATIONS = [
    { city: "Patna", state: "Bihar", image: "/images/destinations/patna.png", landmark: "Golghar" },
    { city: "Ranchi", state: "Jharkhand", image: "/images/destinations/ranchi.png", landmark: "Dassam Falls" },
    { city: "Motihari", state: "Bihar", image: "/images/destinations/motihari.png", landmark: "Kesaria Stupa" },
    { city: "Jamshedpur", state: "Jharkhand", image: "/images/destinations/jamshedpur.png", landmark: "Jubilee Park" },
    { city: "Kolkata", state: "West Bengal", image: "/images/destinations/kolkata.png", landmark: "Howrah Bridge" },
    { city: "Nepal", state: "Country", image: "/images/destinations/nepal.png", landmark: "Pashupatinath" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(window.innerWidth < 768 ? 1 : (window.innerWidth < 1024 ? 2 : 3));
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const maxIndex = Math.max(0, DESTINATIONS.length - itemsToShow);
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [itemsToShow]);

  const maxIndex = Math.max(0, DESTINATIONS.length - itemsToShow);
  const nextSlide = () => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
              {t('services.tag') || "Featured"}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Trending Destinations for Your <span className="text-primary italic">Next Journey</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={prevSlide}
              className="p-2 border border-slate-200 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 border border-slate-200 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link href="/hotels" className="hidden sm:flex items-center gap-2 font-bold text-primary hover:text-indigo-600 transition-all border-b-2 border-primary/20 pb-1 group ml-4">
              {t('services.view_all') || "View All Properties"} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div 
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
          >
            {DESTINATIONS.map((dest, idx) => (
              <div 
                key={idx} 
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <Link href={`/hotels?location=${encodeURIComponent(dest.city)}`} className="group relative block bg-white rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-[450px]">
                  {/* Background Image */}
                  <Image 
                    src={dest.image}
                    alt={dest.city}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/20 opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Content Area */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                        {dest.landmark}
                      </span>
                      <h3 className="text-3xl font-black mb-1 drop-shadow-md">
                        {dest.city}
                      </h3>
                      <p className="text-white/70 font-medium flex items-center gap-1.5 mb-6">
                        <MapPin className="w-4 h-4 text-secondary" /> {dest.state}
                      </p>
                      
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="px-5 py-2.5 bg-secondary text-gray-900 font-bold rounded-xl text-sm transition-all hover:bg-white flex items-center gap-2">
                          Explore Hotels <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-6 left-6 flex flex-col gap-1">
                     <span className="text-[10px] font-black bg-primary text-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                       Top Dest.
                     </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
