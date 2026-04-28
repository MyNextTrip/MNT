"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  User as UserIcon, Mail, Calendar, MapPin, Building2, 
  ChevronRight, ArrowLeft, Loader2,
  Ticket, CheckCircle2, AlertCircle, 
  Coffee, CreditCard, Banknote, HelpCircle, Clock,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const uid = parsedUser._id || parsedUser.id;
      if (uid && uid !== "undefined") {
        setUser(parsedUser);
        fetchBookings(uid);
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchBookings = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/bookings?userId=${userId}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch user bookings failed with status ${res.status}: ${text.substring(0, 100)}`);
      }
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError("Failed to load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = (booking: any) => {
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [37, 99, 235]; 

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("MNT | NEXTMYTRIP", 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("Premium Travel & Hotel Bookings", 20, 32);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BOOKING RECEIPT", 140, 25);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt ID: ${booking.bookingId}`, 140, 32);

    doc.setDrawColor(230);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Details", 20, 55);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Booking Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 20, 62);
    doc.text(`Transaction Status: ${booking.paymentStatus || 'Confirmed'}`, 140, 62);

    autoTable(doc, {
      startY: 70,
      head: [['Guest Information', 'Property Details']],
      body: [[
        `Name: ${booking.guestName || booking.userName}\nPhone: ${booking.guestPhone || 'N/A'}\nEmail: ${booking.userEmail || user?.email}`,
        `Hotel: ${booking.hotelName}\nRoom: ${booking.roomType}\nLocation: ${booking.hotelAddress || 'N/A'}`
      ]],
      theme: 'plain',
      headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { fontSize: 9, cellPadding: 5 }
    });

    autoTable(doc, {
       startY: (doc as any).lastAutoTable.finalY + 10,
       head: [['Check-in Date', 'Check-out Date', 'Stay Duration', 'Meal Plan']],
       body: [[
         new Date(booking.checkInDate).toLocaleDateString('en-GB'),
         new Date(booking.checkOutDate).toLocaleDateString('en-GB'),
         `${booking.numberOfNights || 1} Night(s)`,
         booking.mealPlan || 'EP'
       ]],
       headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
       styles: { halign: 'center' }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary", 20, finalY);

    autoTable(doc, {
       startY: finalY + 5,
       body: [
         ['Total Booking Amount', `INR ${booking.totalAmount?.toLocaleString()}`],
         ['Amount Paid Online', `INR ${(booking.paidAmount || 0)?.toLocaleString()}`],
         ['Balance Due at Property', `INR ${(booking.balanceAmount || 0)?.toLocaleString()}`]
       ],
       theme: 'grid',
       styles: { fontSize: 9, cellPadding: 5 },
       columnStyles: { 0: { cellWidth: 100, fontStyle: 'bold' }, 1: { halign: 'right' } }
    });

    const footerY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for choosing MyNextTrip!", 105, footerY, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont("helvetica", "normal");
    doc.text("This is a computer-generated receipt and does not require a physical signature.", 105, footerY + 8, { align: "center" });
    doc.text("Contact us at support@mynexttrip.com for any assistance.", 105, footerY + 13, { align: "center" });

    doc.save(`Receipt_NextMyTrip_${booking.bookingId}.pdf`);
  };

  if (!user && !loading) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container mx-auto px-4 py-12 pt-28 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/3">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden sticky top-28">
              <div className="h-24 bg-gradient-to-r from-primary to-indigo-600"></div>
              <div className="px-8 pb-8 -mt-12 text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg mx-auto">
                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-primary font-black text-3xl uppercase">
                      {user?.name?.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <h1 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
                <p className="text-slate-500 font-medium flex items-center justify-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </p>
                <div className="mt-8 pt-8 border-t border-slate-100 text-left space-y-4">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Account Type</span>
                      <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-[10px] uppercase">{user?.role || "Guest"}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Total Bookings</span>
                      <span className="font-bold text-slate-900">{bookings.length}</span>
                   </div>
                </div>
                 <Button variant="outline" className="w-full mt-8 rounded-2xl border-slate-200 text-slate-600 font-bold h-12">Edit Profile</Button>
                 
                 {/* Admin Management Sections */}
                 {(user?.role === "hotel_admin" || user?.role === "admin") && (
                   <div className="mt-8 p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden relative group transition-all hover:shadow-xl hover:border-indigo-200 text-left">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                     <div className="relative z-10">
                         <div className="flex items-center gap-4 mb-6">
                             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                                 <LayoutDashboard className="w-6 h-6" />
                             </div>
                             <div>
                                 <h3 className="font-black text-slate-900 tracking-tight text-sm">Admin Portal</h3>
                                 <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Management Suite</p>
                             </div>
                         </div>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                             Access your {user?.role === "admin" ? "site" : "property"} management dashboard to handle bookings and system settings.
                         </p>
                         <Link href={user?.role === "admin" ? "/admin" : "/hotel-admin"}>
                             <Button className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl h-12 flex items-center justify-center gap-2 transition-all">
                                 Launch Dashboard <ChevronRight className="w-4 h-4" />
                             </Button>
                         </Link>
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Bookings</h2>
              <Link href="/hotels" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                Book Next Trip <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold animate-pulse">Loading your journeys...</p>
              </div>
            ) : error ? (
              <div className="p-8 bg-red-50 rounded-[32px] border border-red-100 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-900">{error}</h3>
                <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700">Try Again</Button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Ticket className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Bookings Yet</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto">Your travel history is empty. Start exploring our beautiful hotels!</p>
                <Link href="/hotels"><Button className="rounded-2xl px-10 h-14 font-black shadow-lg">Explore Hotels</Button></Link>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all overflow-hidden">
                    <div className="p-6 sm:p-8">
                       <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-3">
                             <div className="bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-xl"><span className="text-xs font-black text-primary tracking-widest">{booking.bookingId}</span></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                             {booking.hasBreakfast && <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-wider"><Coffee className="w-3.5 h-3.5" /> Breakfast Included</div>}
                             <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider", booking.paymentStatus === 'Paid' ? "bg-indigo-50 text-indigo-700 border-indigo-100" : "bg-amber-50 text-amber-700 border-amber-100")}>
                                {booking.paymentStatus === 'Paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                <span className="mr-1 opacity-60">Payment:</span>
                                {booking.paymentType === 'Partial' ? '30% Online / 70% @Hotel' : booking.paymentType === 'PayAtHotel' ? '100% @Hotel' : 'Prepaid (100% Online)'}
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="flex-1">
                             <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight mb-2">{booking.hotelName}</h3>
                             <div className="space-y-2 mt-4">
                                 <p className="flex items-center gap-2 text-slate-500 font-medium text-sm"><Building2 className="w-4 h-4 text-primary/60" /> {booking.roomType}</p>
                                 <p className="flex items-center gap-2 text-slate-500 font-medium text-[11px] mt-2 bg-slate-50/50 p-2 rounded-xl border border-slate-100"><UserIcon className="w-3.5 h-3.5 text-primary/40" /> <span className="font-bold text-slate-700">Guest:</span> {booking.guestName || booking.userName}</p>
                             </div>
                          </div>
                          <div className="w-full md:w-auto flex flex-col gap-3">
                             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-row md:flex-col justify-between items-center text-center gap-2 min-w-[140px]"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid Amount</p><p className="text-2xl font-black text-slate-900">₹{booking.paidAmount || booking.totalAmount}</p></div>
                             {(booking.paymentType === 'Partial' || booking.paymentType === 'PayAtHotel') && (
                               <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50 flex flex-row md:flex-col justify-between items-center text-center gap-2 min-w-[140px]"><p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Due @ Property</p><p className="text-2xl font-black text-amber-700">₹{booking.balanceAmount || booking.totalAmount}</p></div>
                             )}
                          </div>
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
                          <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Check-in</p><p className="text-sm font-bold text-slate-900">{new Date(booking.checkInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p></div>
                          <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Check-out</p><p className="text-sm font-bold text-slate-900">{new Date(booking.checkOutDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p></div>
                          <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3" /> Duration</p><p className="text-sm font-bold text-slate-900">{booking.numberOfNights || 1} Night(s)</p></div>
                          <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Status</p><p className={cn("text-sm font-black", booking.reservationStatus === 'Cancelled' ? "text-red-500" : "text-emerald-600")}>{booking.reservationStatus || 'Confirmed'}</p></div>
                       </div>
                       <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                          <Link href={`/hotels/${booking.hotelId}`} className="text-xs font-black text-slate-400 hover:text-primary uppercase tracking-widest">View Hotel</Link>
                          <Button variant="ghost" className="text-primary font-black text-sm gap-2" onClick={() => generateReceipt(booking)}>Download Receipt <ArrowLeft className="w-4 h-4 rotate-180" /></Button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
