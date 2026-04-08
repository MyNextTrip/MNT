"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  MapPin, Star, Building2, IndianRupee, Loader2, Check, 
  ArrowLeft, ChevronLeft, ChevronRight, UploadCloud, MessageSquare, PlayCircle,
  BedDouble, Calendar, Coffee, Info, X, LogIn, Lock, Phone, CreditCard, Wallet, User as UserIcon, Clock, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { HotelDetailsSkeleton } from "./Skeletons";

const MEAL_PLANS = [
  { id: 'EP', label: 'EP – European Plan', desc: 'Room Only', price: 0, detail: 'No meals included. Best for guests who prefer eating outside.', tip: 'Only stay 🛏️' },
  { id: 'CP', label: 'CP – Continental Plan', desc: 'Room + Breakfast', price: 249, detail: 'Includes daily breakfast. Lunch & dinner not included.', tip: 'Stay + Morning 🍳' },
  { id: 'MAP', label: 'MAP – Modified American Plan', desc: 'Room + Breakfast + One Meal', price: 599, detail: 'Breakfast included. Choose either lunch or dinner.', tip: 'Stay + 2 meals 🍽️' },
  { id: 'AP', label: 'AP – American Plan', desc: 'Room + Breakfast + Lunch + Dinner', price: 999, detail: 'All meals included. Best for full-stay convenience.', tip: 'Stay + All meals 🍴' },
];

interface HotelDetailsClientProps {
  id: string;
  initialHotel: any;
}

export default function HotelDetailsClient({ id, initialHotel }: HotelDetailsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [hotel, setHotel] = useState<any>(initialHotel);
  const [loading, setLoading] = useState(!initialHotel);
  
  // Date State
  const getToday = () => new Date().toLocaleDateString('en-CA');
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('en-CA');
  };

  const [startDate, setStartDate] = useState(searchParams?.get("checkin") || getToday());
  const [endDate, setEndDate] = useState(searchParams?.get("checkout") || getTomorrow());
  
  // Slider State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Review System States
  const [reviewForm, setReviewForm] = useState({ userName: "", text: "", rating: 5 });
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [reviewVideos, setReviewVideos] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState<Record<number, string>>({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<{room: any, idx: number} | null>(null);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Prepaid' | 'Partial' | 'PayAtHotel'>('PayAtHotel');
  const [showAdminAlert, setShowAdminAlert] = useState(false);
  const [isRoomsVisible, setIsRoomsVisible] = useState(true);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        if (!initialHotel) setLoading(true);
        const res = await fetch(`/api/hotels/${id}`);
        const data = await res.json();
        if (data.success) {
          setHotel(data.hotel);
        }
      } catch (e) {
        console.error("Failed to fetch hotel details:", e);
      } finally {
        setLoading(false);
      }
    };
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setGuestName(u.name || "");
      setGuestPhone(u.phone || "");
    }
    
    if (!initialHotel && id) fetchHotel();
  }, [id, initialHotel]);

  useEffect(() => {
    if (searchParams?.get("bookNow") === "true" && hotel && hotel.rooms && hotel.rooms.length > 0) {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        // Redirect to login with current URL as callback
        const callbackUrl = encodeURIComponent(window.location.href);
        router.push(`/login?callbackUrl=${callbackUrl}`);
        return;
      }
      const firstRoom = hotel.rooms[0];
      setSelectedRoomForBooking({ room: firstRoom, idx: 0 });
      setShowPaymentModal(true);
    }
  }, [searchParams, hotel, router]);

  const handleNextImage = () => {
    if (!hotel || !hotel.images) return;
    setCurrentImageIndex((prev) => (prev === hotel.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    if (!hotel || !hotel.images) return;
    setCurrentImageIndex((prev) => (prev === 0 ? hotel.images.length - 1 : prev - 1));
  };

  const renderMap = (mapUrl: string, hotelName: string, address: string) => {
    let finalSrc = "";
    if (mapUrl) {
      if (mapUrl.includes("<iframe") && mapUrl.includes("src=")) {
        const match = mapUrl.match(/src="([^"]+)"/);
        if (match && match[1]) finalSrc = match[1];
      } else if (mapUrl.includes("embed")) {
        finalSrc = mapUrl;
      }
    }
    if (!finalSrc || mapUrl.includes("maps.app.goo.gl")) {
      const query = encodeURIComponent(`${hotelName} ${address}`);
      finalSrc = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    return (
      <iframe 
        src={finalSrc} 
        width="100%" height="450" 
        style={{ border: 0 }} 
        allowFullScreen={true} loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-2xl shadow-sm border border-slate-200 mt-4"
      ></iframe>
    );
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.text) {
      alert("Please enter a review text.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const formData = new FormData();
      formData.append("userName", reviewForm.userName || "Guest User");
      formData.append("text", reviewForm.text);
      formData.append("rating", reviewForm.rating.toString());
      reviewImages.forEach(file => formData.append("reviewImages", file));
      reviewVideos.forEach(file => formData.append("reviewVideos", file));
      const res = await fetch(`/api/hotels/${id}/reviews`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");
      setHotel(data.hotel);
      setReviewForm({ userName: "", text: "", rating: 5 });
      setReviewImages([]);
      setReviewVideos([]);
      alert("Review successfully posted!");
    } catch (err: any) {
      console.error(err);
      alert("Error posting review: " + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBookNow = (room: any, idx: number) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      // Redirect to login with current URL as callback
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }
    setSelectedRoomForBooking({ room, idx });
    setShowPaymentModal(true);
  };

  const calculateNights = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const addDays = (date: string, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-CA');
  };

  const handleNightsChange = (delta: number) => {
    const currentNights = calculateNights(startDate, endDate);
    const newNights = Math.max(1, currentNights + delta);
    setEndDate(addDays(startDate, newNights));
  };

  const executeBooking = async () => {
    if (!selectedRoomForBooking) return;
    const { room, idx } = selectedRoomForBooking;
    const paymentType = selectedPaymentMethod;
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setShowLoginModal(true);
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role === 'admin') {
      setShowPaymentModal(false);
      setShowAdminAlert(true);
      return;
    }
    if (!guestName || !guestPhone) {
      alert("Please fill in Guest details.");
      return;
    }
    try {
      setIsBookingInProgress(true);
      const nights = calculateNights(startDate, endDate);
      const roomPrice = parseInt(room.price);
      const mealPlanId = selectedMealPlan[idx] || 'EP';
      const mealPlanPrice = MEAL_PLANS.find(p => p.id === mealPlanId)?.price || 0;
      const totalAmount = (roomPrice + mealPlanPrice) * nights;
      const bookingSource = paymentType === 'PayAtHotel' ? 'Pay@Hotel' : paymentType === 'Partial' ? 'online 30% paid (partially)' : 'prepaid';
      
      if (paymentType === 'PayAtHotel') {
        const res = await fetch("/api/bookings/direct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id || user.id,
            userName: user.name,
            userEmail: user.email,
            hotelId: id,
            hotelName: hotel.hotelName,
            hotelAddress: hotel.address,
            roomType: room.type,
            mealPlan: mealPlanId,
            hasBreakfast: mealPlanId !== 'EP',
            totalAmount,
            checkInDate: startDate,
            checkOutDate: endDate,
            numberOfNights: nights,
            bookingSource,
            guestName,
            guestPhone
          }),
        });
        const data = await res.json();
        if (data.success) {
          alert(`Booking Confirmed for ${guestName}! ID: ${data.bookingId}.`);
          window.location.href = "/profile";
        } else {
          throw new Error(data.message);
        }
        return;
      }

      const paidAmount = paymentType === 'Partial' ? Math.round(totalAmount * 0.3) : totalAmount;
      const notes = {
        userId: user._id || user.id,
        userName: user.name,
        userEmail: user.email,
        hotelId: id,
        hotelName: hotel.hotelName,
        hotelAddress: hotel.address,
        roomType: room.type,
        mealPlan: mealPlanId,
        hasBreakfast: mealPlanId !== 'EP',
        totalAmount,
        paidAmount,
        paymentType,
        checkInDate: startDate,
        checkOutDate: endDate,
        numberOfNights: nights,
        bookingSource,
        guestName,
        guestPhone
      };

      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: paidAmount, notes }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      const { order } = data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "NextMyTrip",
        description: `${paymentType === 'Partial' ? '30%' : 'Full'} Payment for ${hotel.hotelName}`,
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert(`Payment Successful! ID: ${verifyData.bookingId}`);
            window.location.href = "/profile";
          } else {
            alert("Payment Verification Failed!");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#4f46e5" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Booking Error:", error);
      alert("Booking failed: " + error.message);
    } finally {
      setIsBookingInProgress(false);
      setShowPaymentModal(false);
    }
  };

  if (loading) return <HotelDetailsSkeleton />;

  if (!hotel) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-24 text-slate-500">
      <Building2 className="w-16 h-16 text-slate-300 mb-4" />
      <h3 className="text-2xl font-bold text-slate-700">Hotel not found</h3>
      <Link href="/hotels" className="mt-6 px-6 py-2 bg-primary text-white rounded-lg">Back to Hotels</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-24 pt-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/hotels" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to all properties
        </Link>
        
        {/* Image Slider */}
        {hotel.images && hotel.images.length > 0 && (
          <div className="relative rounded-3xl overflow-hidden shadow-xl mb-8 h-[300px] md:h-[500px] bg-black group">
            <Image 
              src={hotel.images[currentImageIndex]} 
              alt={`${hotel.hotelName} image ${currentImageIndex + 1}`} 
              fill className="object-cover transition-opacity duration-500" priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {hotel.images.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"><ChevronRight className="w-6 h-6" /></button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {hotel.images.map((_: any, idx: number) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={cn("h-2 rounded-full transition-all", currentImageIndex === idx ? "w-8 bg-white" : "w-2 bg-white/50")} />
                  ))}
                </div>
              </>
            )}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-black uppercase">{currentImageIndex + 1} / {hotel.images.length}</div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{hotel.owner === "MyNextTrip" ? "Premium Property" : "Verified Partner"}</span>
            <div className="flex items-center text-amber-500 text-sm font-bold bg-amber-50 px-2 py-1 rounded"><Star className="w-4 h-4 fill-amber-500 mr-1" /> {hotel.owner === "MyNextTrip" ? "5.0" : "4.5"}</div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 mb-2">{hotel.hotelName}</h1>
        </div>

        <div className="space-y-12">
          {/* Overview */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2"><MapPin className="text-primary w-6 h-6" /> Location & Overview</h2>
            <p className="text-lg font-medium text-slate-700 mb-4">{hotel.address}, {hotel.location}</p>
            <hr className="my-6 border-slate-100" />
            <p className="text-slate-600 leading-relaxed text-lg">Experience unparalleled comfort and luxury at {hotel.hotelName}. Located in {hotel.location}, this property offers an unforgettable stay.</p>
          </section>

          {/* Stay Duration */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><Calendar className="w-24 h-24 text-primary" /></div>
             <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Calendar className="text-primary w-6 h-6" /> Stay Duration</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Check-in Date</label>
                   <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                      <input type="date" min={getToday()} value={startDate} onChange={(e) => { setStartDate(e.target.value); if (new Date(e.target.value) >= new Date(endDate)) setEndDate(addDays(e.target.value, 1)); }} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Check-out Date</label>
                   <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                      <input type="date" min={addDays(startDate, 1)} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700" />
                   </div>
                </div>
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex flex-col justify-center items-center text-center">
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Total Stay</p>
                   <p className="text-3xl font-black text-slate-900 leading-none">{calculateNights(startDate, endDate)} <span className="text-sm font-bold text-slate-500">Nights</span></p>
                </div>
             </div>
          </section>

          {/* Rooms */}
          {hotel.rooms && hotel.rooms.length > 0 && (
            <section className="mt-4">
              <div onClick={() => setIsRoomsVisible(!isRoomsVisible)} className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 cursor-pointer bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all">
                <div>
                  <h2 className="text-3xl font-bold font-serif text-slate-900 flex items-center gap-3"><BedDouble className="text-primary w-8 h-8" /> Select your Room</h2>
                  <p className="text-slate-500 font-medium mt-2">Prices for <span className="text-primary font-bold">{calculateNights(startDate, endDate)} night(s)</span>.</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-4 py-2 rounded-full">{isRoomsVisible ? 'Hide' : 'Show Rooms'} <ChevronDown className={cn("w-4 h-4 transition-transform", isRoomsVisible ? "rotate-180" : "")} /></div>
              </div>
              <div className={cn("flex flex-col gap-6 transition-all duration-700 overflow-hidden", isRoomsVisible ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0")}>
                {hotel.rooms.map((room: any, idx: number) => (
                  <div key={idx} className="bg-white/90 backdrop-blur-xl rounded-[24px] shadow-xl border-2 border-transparent hover:border-primary/30 transition-all p-4 md:p-6 group relative">
                    <div 
                      className="relative w-full h-48 md:h-64 rounded-[20px] overflow-hidden mb-6 bg-slate-100 cursor-pointer group/img"
                      onClick={() => setExpandedImage(room.image || (hotel.images && hotel.images.length > 0 ? hotel.images[idx % hotel.images.length] : '/images/hero-bg.png'))}
                    >
                      <Image src={room.image || (hotel.images && hotel.images.length > 0 ? hotel.images[idx % hotel.images.length] : '/images/hero-bg.png')} alt={room.type} fill className="object-cover group-hover/img:scale-105 transition-transform" />
                      <div className="absolute top-4 left-4 bg-white/95 px-4 py-1.5 rounded-full shadow-md"><span className="text-sm font-black text-slate-900 uppercase tracking-widest">{room.type}</span></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center"><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Check-in</p><p className="text-sm font-bold text-slate-800">{new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p></div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center"><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Check-out</p><p className="text-sm font-bold text-slate-800">{new Date(endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p></div>
                      <div className="relative flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Meal Plan</label>
                        <select value={selectedMealPlan[idx] || 'EP'} onChange={(e) => setSelectedMealPlan({ ...selectedMealPlan, [idx]: e.target.value })} className="w-full pl-4 pr-10 py-3 bg-emerald-50/50 border border-emerald-100 rounded-xl outline-none font-bold text-emerald-900 text-xs appearance-none">
                          {MEAL_PLANS.map((plan) => (<option key={plan.id} value={plan.id}>{plan.label} (+₹{plan.price})</option>))}
                        </select>
                      </div>
                      <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-50 flex flex-col justify-center"><p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-1.5">Room Type</p><p className="text-sm md:text-base font-bold text-blue-900 truncate">{room.type}</p></div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between border-t pt-6">
                      <div><p className="text-3xl md:text-4xl font-black text-slate-900">₹{(parseInt(room.price) + (MEAL_PLANS.find(p => p.id === (selectedMealPlan[idx] || 'EP'))?.price || 0)) * calculateNights(startDate, endDate)}</p><p className="text-xs font-bold text-slate-400 mt-2">inclusive of all taxes</p></div>
                      <button onClick={() => handleBookNow(room, idx)} className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-primary text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group">Book Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Check className="text-primary w-6 h-6" /> Property Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center text-slate-700 font-medium"><div className="bg-emerald-100 p-1.5 rounded-full mr-3"><Check className="w-3 h-3 text-emerald-600" /></div>{amenity}</div>
                ))}
              </div>
            </section>
          )}

          {/* Map */}
          {hotel.googleMapUrl && (
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Interactive Map</h2>
              {renderMap(hotel.googleMapUrl, hotel.hotelName, hotel.address)}
            </section>
          )}

          {/* Reviews */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100" id="reviews">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><MessageSquare className="text-primary w-6 h-6" /> Guest Reviews</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-10">
              <h3 className="font-bold text-slate-800 mb-4 text-lg">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" value={reviewForm.userName} onChange={(e) => setReviewForm({...reviewForm, userName: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" />
                  <select value={reviewForm.rating} onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value, 10)})} className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none"><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option><option value="2">2 Stars</option><option value="1">1 Star</option></select>
                </div>
                <textarea required rows={3} placeholder="Tell us about your stay..." value={reviewForm.text} onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none resize-none"></textarea>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Photos</label><input type="file" multiple accept="image/*" onChange={(e) => { if(e.target.files) setReviewImages(Array.from(e.target.files)); }} className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl" /></div>
                  <div className="flex-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Videos</label><input type="file" multiple accept="video/*" onChange={(e) => { if(e.target.files) setReviewVideos(Array.from(e.target.files)); }} className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl" /></div>
                </div>
                <button type="submit" disabled={isSubmittingReview} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-primary transition-colors disabled:opacity-50">{isSubmittingReview ? "Posting..." : "Submit Review"}</button>
              </form>
            </div>
            <div className="space-y-6">
              {hotel.reviews?.slice().reverse().map((review: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg uppercase">{review.userName.charAt(0)}</div><div><p className="font-bold text-slate-900">{review.userName}</p><p className="text-xs text-slate-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</p></div></div>
                    <div className="flex items-center bg-amber-50 px-2 py-1 rounded"><Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" /><span className="text-amber-700 font-bold text-sm">{review.rating}.0</span></div>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-4">{review.text}</p>
                  <div className="flex flex-wrap gap-3">
                    {review.images?.map((img: string, i: number) => (<div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-slate-200"><Image src={img} alt="review" fill className="object-cover" /></div>))}
                    {review.videos?.map((vid: string, i: number) => (<div key={i} className="relative w-48 h-24 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-black"><video src={vid} controls className="w-full h-full object-cover" /></div>))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowLoginModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-8 text-center animate-in fade-in zoom-in">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6"><Lock className="w-8 h-8 text-primary" /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Login Required</h3>
            <p className="text-slate-500 mb-8">Securely book this property and unlock exclusive offers.</p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary transition-all">Sign In Now</Link>
              <button onClick={() => setShowLoginModal(false)} className="w-full py-4 bg-slate-50 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all">Continue Exploring</button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showPaymentModal && selectedRoomForBooking && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isBookingInProgress && setShowPaymentModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in">
            <div className="p-8 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900">Booking Confirmation</h3>
              <button onClick={() => setShowPaymentModal(false)} disabled={isBookingInProgress} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-8">
               <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Guest Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Guest Full Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700" />
                    <input type="tel" placeholder="Guest Mobile No" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700" />
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">2. Stay Duration</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); if (new Date(e.target.value) >= new Date(endDate)) setEndDate(addDays(e.target.value, 1)); }} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700" />
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700" />
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">3. Payment Preference</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     {['PayAtHotel', 'Partial', 'Prepaid'].map((m: any) => (
                       <div key={m} onClick={() => setSelectedPaymentMethod(m)} className={cn("cursor-pointer p-4 rounded-[20px] border-2 transition-all text-center", selectedPaymentMethod === m ? "bg-primary/5 border-primary" : "bg-slate-50 border-transparent")}>
                         <p className={cn("font-black text-xs uppercase tracking-widest", selectedPaymentMethod === m ? "text-primary" : "text-slate-900")}>{m}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
               <div><p className="text-3xl font-black">₹{(parseInt(selectedRoomForBooking.room.price) + (MEAL_PLANS.find(p => p.id === (selectedMealPlan[selectedRoomForBooking.idx] || 'EP'))?.price || 0)) * calculateNights(startDate, endDate)}</p></div>
               <button onClick={executeBooking} disabled={isBookingInProgress} className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-black rounded-[20px]">{isBookingInProgress ? "Confirming..." : "Confirm Booking"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Alert */}
      {showAdminAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAdminAlert(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[32px] p-8 text-center animate-in fade-in zoom-in">
             <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6"><ShieldAlert className="w-10 h-10 text-amber-500" /></div>
             <h3 className="text-2xl font-black text-slate-900 mb-3">Admin Access Only</h3>
             <p className="text-slate-500 mb-8">As a Root Admin, you cannot make personal bookings.</p>
             <button onClick={() => setShowAdminAlert(false)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl">Close</button>
          </div>
        </div>
      )}

      {/* Expanded Image */}
      {expandedImage && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setExpandedImage(null)}></div>
          <div className="relative w-full max-w-5xl h-[80vh] flex flex-col items-center justify-center animate-in fade-in zoom-in">
            <button onClick={() => setExpandedImage(null)} className="absolute -top-12 right-0 text-white"><X className="w-8 h-8" /></button>
            <div className="relative w-full h-full rounded-2xl overflow-hidden"><Image src={expandedImage} alt="Expanded" fill className="object-contain" /></div>
          </div>
        </div>
      )}

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </main>
  );
}
