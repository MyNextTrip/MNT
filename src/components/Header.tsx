"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Menu, Phone, Globe, ChevronDown, LogOut, MapPin, Building2, TreePine, Briefcase, ShieldCheck, Map, Camera, Star, ArrowRight, X, Plane, LayoutDashboard, Ticket } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { languages } from "@/lib/translations";
import { cn } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDestinationsOpen, setIsMobileDestinationsOpen] = useState(false);
  const [isMobileHotelsOpen, setIsMobileHotelsOpen] = useState(false);
  const [isMobileFlightsOpen, setIsMobileFlightsOpen] = useState(false);
  const [user, setUser] = useState<{name: string, email: string, role?: string} | null>(null);

  // Hotel Listing Form States
  const [showListingModal, setShowListingModal] = useState(false);
  const [isSubmittingListing, setIsSubmittingListing] = useState(false);
  const [listingForm, setListingForm] = useState({
    hotelName: "", ownerMobNo: "", hotelAddress: "", whatsappNumber: ""
  });

  // Grab the user from localStorage when the component mounts on the client
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    router.push("/");
  };

  const handleListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingListing(true);
    try {
      const res = await fetch('/api/hotel-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingForm)
      });
      if (res.ok) {
        alert('Thank you! Your hotel inquiry has been submitted. Our team will contact you shortly.');
        setShowListingModal(false);
        setListingForm({ hotelName: "", ownerMobNo: "", hotelAddress: "", whatsappNumber: "" });
      } else {
        alert('Failed to submit listing request. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Error submitting listing request.');
    } finally {
      setIsSubmittingListing(false);
    }
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3" aria-label="Go to MyNextTrip home">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-white flex items-center justify-center">
                <Image 
                  src="/images/MNT logo.png" 
                  alt="MyNextTrip - Premium Travel and Hotel Booking" 
                  fill 
                  className="object-cover" 
                  priority
                />
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 h-16">
              <Link href="/destinations" className="text-sm font-medium hover:text-primary transition-colors text-slate-700 h-full flex items-center">{t('nav.destinations')}</Link>

              <Link href="/packages" className="text-sm font-medium hover:text-primary transition-colors text-slate-700 h-full flex items-center">{t('nav.packages')}</Link>
              
              {/* Hotels Mega Menu */}
              <div className="group/hotels relative h-full flex items-center">
                <Link href="/hotels" className="flex items-center gap-1 text-sm font-bold hover:text-primary transition-colors h-full text-slate-700">
                  {t('nav.hotels')}
                  <ChevronDown className="h-3 w-3 transition-transform group-hover/hotels:rotate-180" />
                </Link>
                
                <div className="absolute top-full right-0 w-[900px] lg:w-[1100px] bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover/hotels:opacity-100 group-hover/hotels:visible transition-all duration-300 grid grid-cols-4 gap-8 p-8 overflow-hidden cursor-default translate-y-2 group-hover/hotels:translate-y-0 z-50">
                  
                  {/* Column 1: Patna (1-3) */}
                  <div className="flex flex-col gap-5">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-widest border-b pb-2 mb-2">Patna Properties</h3>
                    
                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Gharonda Hotel Restaurant Banquet</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Walmi Branch, AIIMS Patna Rd</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">10km from airport • 8km from station</p>
                    </div>

                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Hotel The Dev Regency</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Anisabad, Patna</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">3km from airport • 7km from station</p>
                    </div>

                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Princess Home</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Near Energy Park, Rajbansi Nagar, Patna</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">4km from airport • 5.2km from station</p>
                    </div>
                  </div>

                  {/* Column 2: Patna (4-6) */}
                  <div className="flex flex-col gap-5">
                    <h3 className="text-[10px] font-black text-transparent opacity-0 uppercase tracking-widest border-b pb-2 mb-2">Spacer</h3>

                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Hotel Friends Inn</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Near Patliputra ISBT, VIP Colony, Jakariyapur</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">12km from airport • 8.7km from station</p>
                    </div>

                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Hotel Chandrashila</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Opp Metro Pillar No. 169, Bairiya Zero Mile</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">0.5km from Patna Bus Stand</p>
                    </div>

                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Hotel Nandak Grand</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Saguna More, Danapur, Patna</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">7-8km from airport • 5-6km from station</p>
                    </div>
                  </div>

                  {/* Column 3: Ranchi */}
                  <div className="flex flex-col gap-5">
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b pb-2 mb-2">Ranchi Properties</h3>

                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Hotel La Vista</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Opp Central University, Ring Road, Manatu</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">20km from airport • 16km from station</p>
                    </div>

                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Hotel Harsh Regency</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Subarnarekha Pul, Hatia, Ranchi</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">8km from airport • 1km from station</p>
                    </div>

                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Mountain View Resort</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Near DAV School, Bariatu, Ranchi</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">13km from airport • 8km from station</p>
                    </div>
                  </div>

                  {/* Column 4: Motihari & Nepal */}
                  <div className="flex flex-col gap-5">
                    <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest border-b pb-2 mb-2">Motihari & Nepal</h3>

                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Siddhi Vinayak Hotel & Banquet</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Primary Narega Bal Udyan, Chhatauni, Motihari</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">57km from Simara Airport • 2km from station</p>
                    </div>

                    <div className="group/hotel cursor-pointer">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Siddhi Vinayak Hotel & Banquet</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Station Rd, Near Aditya Vision, Belbawana</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">10km from airport • 3km from station</p>
                    </div>

                    <div className="group/hotel cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-800 group-hover/hotel:text-primary transition-colors leading-tight">Hotels Ichchha (Nepal)</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug"><MapPin className="inline w-3 h-3 mr-0.5 text-primary/50" />Bara District, Madhesh Province, Nepal</p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded w-fit">2km from Simara Airport • 15km from railway</p>
                    </div>
                  </div>

                </div>
              </div>

              <Link href="/flights" className="text-sm font-medium hover:text-primary transition-colors text-slate-700 h-full flex items-center">{t('nav.flights')}</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 border-r pr-4 border-gray-200">
              <button 
                onClick={() => setShowListingModal(true)}
                className="hidden lg:flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full transition-all mr-2"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>List Your Property</span>
              </button>

              {/* Language Selection Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  <Globe className="h-4 w-4" />
                  <span className="uppercase">{currentLang.code}</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", showLangMenu && "rotate-180")} />
                </button>

                {showLangMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                      Select Language
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setShowLangMenu(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors",
                          language === lang.code ? "text-primary bg-primary/5 font-bold" : "text-gray-600"
                        )}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {language === lang.code && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Link href="/support" className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span>{t('nav.support')}</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full md:hidden">
                <Search className="h-5 w-5" />
              </button>
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-all border border-primary/20 shadow-sm"
                  >
                    <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", showUserMenu && "rotate-180")} />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 mb-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium border-b border-gray-50"
                        >
                          <LayoutDashboard className="h-4 w-4 text-primary" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium border-b border-gray-50"
                      >
                        <Ticket className="h-4 w-4 text-primary" />
                        <span>My Bookings</span>
                      </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md transition-all shadow-sm">
                    <User className="h-4 w-4" />
                    <span>{t('nav.login')}</span>
                  </button>
                </Link>
              )}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-[85%] max-w-[320px] h-full bg-white/95 backdrop-blur-xl shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col pointer-events-auto overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <span className="font-black text-primary text-xl tracking-tight uppercase">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-3 space-y-1">
                {/* Mobile Destinations Accordion */}
                <div className="mb-2">
                  <button 
                    onClick={() => setIsMobileDestinationsOpen(!isMobileDestinationsOpen)}
                    className="w-full flex items-center justify-between p-4 font-black text-slate-800 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all"
                  >
                    <span className="flex items-center gap-4"><MapPin className="w-5 h-5 text-primary" /> {t('nav.destinations')}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform text-slate-400", isMobileDestinationsOpen && "rotate-180")} />
                  </button>
                  
                  {isMobileDestinationsOpen && (
                    <div className="px-4 py-3 space-y-4 bg-gray-50/80 border-l-2 border-primary/30 ml-3 mt-1 rounded-r-xl">
                      <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-2 bg-primary/10 text-primary font-bold rounded-lg text-xs tracking-wider uppercase">
                        Explore Destinations Page
                      </Link>
                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3"/> Featured Cities</span>
                        <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">
                          Patna <span className="text-xs text-gray-400 font-normal ml-1 border-l pl-1">Heritage Capital</span>
                        </Link>
                        <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">
                          Ranchi <span className="text-xs text-gray-400 font-normal ml-1 border-l pl-1">City of Waterfalls</span>
                        </Link>
                      </div>
                      <div className="space-y-3 pt-3 border-t border-gray-200">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Camera className="w-3 h-3"/> Experiences</span>
                        <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">Business Stays</Link>
                        <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">Weekend Getaways</Link>
                        <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">Pilgrimage & Culture</Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link href="/packages" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 font-bold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                  <Globe className="w-4 h-4 text-primary" /> {t('nav.packages')}
                </Link>

                {/* Mobile Hotels Accordion */}
                <div className="mb-2">
                  <button 
                    onClick={() => setIsMobileHotelsOpen(!isMobileHotelsOpen)}
                    className="w-full flex items-center justify-between p-3 font-bold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                  >
                    <span className="flex items-center gap-3"><Building2 className="w-4 h-4 text-primary" /> {t('nav.hotels')}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform text-gray-400", isMobileHotelsOpen && "rotate-180")} />
                  </button>
                  
                  {isMobileHotelsOpen && (
                    <div className="px-4 py-3 space-y-5 bg-gray-50/80 border-l-2 border-primary/30 ml-3 mt-1 rounded-r-xl max-h-[400px] overflow-y-auto">
                      <Link href="/hotels" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-2 bg-primary/10 text-primary font-bold rounded-lg text-xs tracking-wider uppercase">
                        View Complete Directory
                      </Link>
                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">Patna</span>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Gharonda Hotel Restaurant Banquet</h4>
                           <p className="text-[9px] text-gray-500">Walmi Branch, AIIMS Patna Rd (10km from airport)</p>
                        </div>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Hotel The Dev Regency</h4>
                           <p className="text-[9px] text-gray-500">Anisabad (3km from airport)</p>
                        </div>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Princess Home</h4>
                           <p className="text-[9px] text-gray-500">Near Energy Park, Rajbansi Nagar (4km from airport)</p>
                        </div>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Hotel Friends Inn</h4>
                           <p className="text-[9px] text-gray-500">Near Patliputra ISBT (12km from airport)</p>
                        </div>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Hotel Chandrashila</h4>
                           <p className="text-[9px] text-gray-500">Bairiya Zero Mile (0.5km from Bus Stand)</p>
                        </div>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Hotel Nandak Grand</h4>
                           <p className="text-[9px] text-gray-500">Saguna More, Danapur (7-8km from airport)</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">Ranchi</span>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Hotel La Vista</h4>
                           <p className="text-[9px] text-gray-500">Ring Road, Manatu (20km from airport)</p>
                        </div>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Hotel Harsh Regency</h4>
                           <p className="text-[9px] text-gray-500">Subarnarekha Pul, Hatia (8km from airport)</p>
                        </div>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Mountain View Resort</h4>
                           <p className="text-[9px] text-gray-500">Near DAV School, Bariatu (13km from airport)</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">Motihari & Nepal</span>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Siddhi Vinayak Hotel (Chhatauni)</h4>
                           <p className="text-[9px] text-gray-500">Primary Narega Bal Udyan (57km from Simara Airport)</p>
                        </div>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Siddhi Vinayak Hotel (Belbawana)</h4>
                           <p className="text-[9px] text-gray-500">Near Aditya Vision (10km from airport)</p>
                        </div>
                        <div className="border-b pb-2 mb-2 border-gray-200">
                           <h4 className="text-xs font-bold text-gray-800">Hotels Ichchha</h4>
                           <p className="text-[9px] text-gray-500">Bara District, Nepal (2km from Simara Airport)</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Flights Accordion */}
                <div className="mb-2">
                  <button 
                    onClick={() => setIsMobileFlightsOpen(!isMobileFlightsOpen)}
                    className="w-full flex items-center justify-between p-3 font-bold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                  >
                    <span className="flex items-center gap-3"><Plane className="w-4 h-4 text-primary" /> {t('nav.flights')}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform text-gray-400", isMobileFlightsOpen && "rotate-180")} />
                  </button>
                  
                  {isMobileFlightsOpen && (
                    <div className="px-4 py-3 space-y-4 bg-gray-50/80 border-l-2 border-primary/30 ml-3 mt-1 rounded-r-xl">
                      <Link href="/flights" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-2 bg-primary/10 text-primary font-bold rounded-lg text-xs tracking-wider uppercase">
                        Book a Flight
                      </Link>
                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Plane className="w-3 h-3"/> Discover</span>
                        <Link href="/flights" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">Domestic Flights</Link>
                        <Link href="/flights" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">International Flights</Link>
                        <Link href="/flights" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">Charter Flights</Link>
                      </div>
                      <div className="space-y-3 pt-3 border-t border-gray-200">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Briefcase className="w-3 h-3"/> Services</span>
                        <Link href="/flights" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">Web Check-in</Link>
                        <Link href="/flights" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">Flight Status</Link>
                        <Link href="/flights" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-primary">Fare Calendar</Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto px-4 py-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-3">Language</span>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg border transition-all text-left",
                          language === lang.code 
                            ? "bg-primary/10 border-primary/30 text-primary font-bold shadow-sm" 
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {!user && (
                   <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 font-bold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors bg-white border border-gray-100 shadow-sm mt-2">
                     <User className="w-4 h-4 text-primary" /> {t('nav.login')}
                   </Link>
                )}

                <Link href="/support" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 font-bold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors bg-white border border-gray-100 shadow-sm">
                  <Phone className="w-4 h-4 text-primary" /> {t('nav.support')}
                </Link>
                
                {user && (
                   <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors bg-white border border-red-100 shadow-sm">
                     <LogOut className="w-4 h-4" /> Logout
                   </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hotel Listing Modal */}
      {showListingModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isSubmittingListing && setShowListingModal(false)}></div>
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                 <Building2 className="w-5 h-5 text-primary" /> Hotel Listing Inquiry
               </h3>
               <button 
                 onClick={() => setShowListingModal(false)}
                 disabled={isSubmittingListing}
                 className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-700"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            <form onSubmit={handleListingSubmit} className="p-6 space-y-4 text-left pointer-events-auto">
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel Name</label>
                  <input 
                    type="text" 
                    required 
                    value={listingForm.hotelName}
                    onChange={(e) => setListingForm({...listingForm, hotelName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                    placeholder="Enter hotel name"
                  />
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Owner Mobile No</label>
                  <input 
                    type="tel" 
                    required 
                    value={listingForm.ownerMobNo}
                    onChange={(e) => setListingForm({...listingForm, ownerMobNo: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                    placeholder="Enter 10-digit mobile number"
                  />
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel Address</label>
                  <input 
                    type="text" 
                    required 
                    value={listingForm.hotelAddress}
                    onChange={(e) => setListingForm({...listingForm, hotelAddress: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                    placeholder="Enter full hotel address"
                  />
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={listingForm.whatsappNumber}
                    onChange={(e) => setListingForm({...listingForm, whatsappNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                    placeholder="Enter WhatsApp number"
                  />
               </div>

               <div className="pt-4">
                 <button 
                   type="submit" 
                   disabled={isSubmittingListing}
                   className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70"
                 >
                   {isSubmittingListing ? "Submitting..." : "Submit Inquiry"}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
