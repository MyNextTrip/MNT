import { Metadata } from "next";
import { Phone, MapPin, Clock, ShieldCheck, MessageCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support & Contact Us | 24/7 Travel Assistance | MyNextTrip",
  description: "Get 24/7 support for your travel bookings, hotel reservations, and holiday packages. Contact MyNextTrip for expert assistance and peace of mind.",
  openGraph: {
    title: "How can we help you? | Support | MyNextTrip",
    description: "Our expert support team is always ready to assist with your travel inquiries.",
  }
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Hero Header Section */}
      <section className="relative w-full bg-gradient-to-br from-blue-700 via-primary to-indigo-900 py-24 px-6 overflow-hidden flex flex-col items-center">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white opacity-5"></div>
        
        <div className="relative z-10 max-w-3xl text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">How can we help you?</h1>
          <p className="text-lg md:text-xl text-blue-100 font-medium">
            Our expert support team is always ready to assist with your travel bookings, packages, and inquiries.
          </p>
        </div>
      </section>

      {/* Main Content Cards */}
      <div className="w-full max-w-6xl px-4 md:px-8 -mt-12 z-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Phone Card */}
          <article className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center text-center border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Call Us Directly</h3>
            <p className="text-slate-500 mb-6 text-sm flex-grow">
              Speak with our friendly team. We're here to answer all your questions immediately.
            </p>
            <a href="tel:+919263554855" className="text-xl font-extrabold text-primary hover:text-primary/80 transition-colors">
              Tel. +91 9263554855
            </a>
          </article>

          {/* Location Card */}
          <article className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center text-center border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Visit Our Office</h3>
            <p className="text-slate-500 mb-6 text-sm flex-grow">
              Come by for an in-person consultation about your next dream vacation.
            </p>
            <address className="not-italic text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
              Walmi, Khagaul, Patna,<br/> Bihar 801505
            </address>
          </article>

          {/* Email / Hours Card */}
          <article className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center text-center border border-slate-100 hover:-translate-y-1 transition-transform duration-300 md:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Working Hours</h3>
            <p className="text-slate-500 mb-6 text-sm flex-grow">
              We are available round the clock to ensure your journey is smooth and secure.
            </p>
            <div className="w-full flex justify-between items-center text-sm text-slate-600 border-b border-slate-100 pb-2 mb-2">
              <span className="font-medium">Monday - Friday:</span>
              <span className="font-bold text-slate-900">9:00 AM - 8:00 PM</span>
            </div>
            <div className="w-full flex justify-between items-center text-sm text-slate-600">
              <span className="font-medium">Saturday & Sunday:</span>
              <span className="font-bold text-slate-900">10:00 AM - 4:00 PM</span>
            </div>
          </article>
          
        </div>

        {/* Support Highlights */}
        <section className="mt-20 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Dedicated to your Peace of Mind.</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Travel should be an experience, not a hassle. MyNextTrip provides 24/7 dedicated assistance to ensure you get the absolute best out of every booking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Secure Bookings
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MessageCircle className="w-5 h-5 text-blue-400" /> Fast Responses
                </div>
              </div>
            </div>
            <Link 
              href="/login"
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 hover:shadow-xl hover:shadow-white/10 transition-all active:scale-95 whitespace-nowrap"
            >
              Contact Support Login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
