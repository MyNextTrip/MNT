"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MessageSquare, Mail, MapPin, Clock, ShieldCheck, Headphones, Star, ArrowLeft } from "lucide-react";

export default function ContactExpertPage() {
  const contactNumber = "+91 9263554855";
  const whatsappUrl = `https://wa.me/${contactNumber.replace(/\D/g, '')}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/contact-expert-bg.png"
          alt="Travel Expert Background"
          fill
          className="object-cover transition-transform duration-[10s] hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-slate-50/10" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
            Consult a <span className="text-secondary">Travel Expert</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Your dream vacation starts with a conversation. Get personalized itineraries and expert advice for your next journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 -mt-20 md:-mt-32 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 h-full">
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Get in Touch</span>
                    <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">We're here to help you <span className="text-primary">24/7</span></h2>
                    <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                      Whether you have questions about a specific destination, need help with booking, or want a custom holiday package, our experts are just a call away.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Call Us Directly</p>
                          <a href={`tel:${contactNumber}`} className="text-xl font-black text-slate-900 hover:text-primary transition-colors tracking-tight">
                            {contactNumber}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-gray-900 transition-all duration-300">
                          <MessageSquare className="w-6 h-6 text-secondary-dark group-hover:text-gray-900" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">WhatsApp Chat</p>
                          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xl font-black text-slate-900 hover:text-secondary-dark transition-colors tracking-tight">
                            Available 24/7
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email Support</p>
                          <a href="mailto:support@mynexttrip.com" className="text-xl font-black text-slate-900 hover:text-primary transition-colors tracking-tight">
                            support@mynexttrip.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-4">
                    <a 
                      href={`tel:${contactNumber}`}
                      className="flex flex-col items-center justify-center p-8 bg-primary text-white rounded-[32px] text-center shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95 group"
                    >
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Phone className="w-8 h-8" />
                      </div>
                      <span className="text-2xl font-black mb-1">Call Now</span>
                      <span className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Instant Connection</span>
                    </a>

                    <a 
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-8 bg-emerald-500 text-white rounded-[32px] text-center shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all active:scale-95 group"
                    >
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <span className="text-2xl font-black mb-1">WhatsApp</span>
                      <span className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Chat with Expert</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-8 flex flex-wrap justify-around items-center gap-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <span className="text-white font-bold text-sm">Verified Experts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Headphones className="w-6 h-6 text-secondary" />
                  <span className="text-white font-bold text-sm">24/7 Support</span>
                </div>
                <div className="flex items-center gap-3">
                   <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                   <span className="text-white font-bold text-sm">Top Rated Agency</span>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us / Info Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-slate-100">
               <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                 <ShieldCheck className="w-6 h-6 text-primary" /> Why Consult Us?
               </h3>
               <ul className="space-y-6">
                 <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                   <p className="text-slate-600 text-sm leading-relaxed"><span className="font-bold text-slate-900">Customized Itineraries:</span> We tailor every trip to your specific preferences and budget.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                   <p className="text-slate-600 text-sm leading-relaxed"><span className="font-bold text-slate-900">Exclusive Deals:</span> Access private rates not available on public websites.</p>
                 </li>
                 <li className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                   <p className="text-slate-600 text-sm leading-relaxed"><span className="font-bold text-slate-900">Stress-Free Planning:</span> We handle all the details so you can focus on the memories.</p>
                 </li>
               </ul>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-[40px] shadow-2xl p-8 text-white relative overflow-hidden group">
               <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
               <h3 className="text-xl font-black mb-4 relative z-10">Our Presence</h3>
               <div className="space-y-4 relative z-10">
                 <div className="flex items-start gap-3">
                   <MapPin className="w-5 h-5 text-secondary shrink-0" />
                   <p className="text-white/80 text-sm">Main Office: Patna, Bihar<br/>Operational across India & Nepal</p>
                 </div>
                 <div className="flex items-start gap-3">
                   <Clock className="w-5 h-5 text-secondary shrink-0" />
                   <p className="text-white/80 text-sm">Operational: 09:00 AM - 10:00 PM<br/><span className="text-white font-bold">Emergency Support: 24/7</span></p>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Branding */}
      <footer className="mt-auto py-12 bg-white border-t border-slate-100 text-center">
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em]">MyNextTrip • Premium Travel Partner</p>
      </footer>
    </div>
  );
}
