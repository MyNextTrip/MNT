"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube, X, ExternalLink, Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-[#0a0f1c] text-slate-300 pt-24 pb-8 overflow-hidden border-t border-slate-800">
      {/* Decorative ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400 tracking-tighter" aria-label="MyNextTrip Home">
              MyNextTrip
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="https://www.facebook.com/profile.php?id=61575468341367" className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all text-white shadow-lg shadow-black/20" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://www.instagram.com/mynexttrip07/" className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all text-white shadow-lg shadow-black/20" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all text-white shadow-lg shadow-black/20" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://www.youtube.com/channel/UC71Zk6DnIdPEqAkq3-JyFpA" className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all text-white shadow-lg shadow-black/20" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm">{t('footer.quick_links')}</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link href="/destinations" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>{t('nav.destinations')}</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>{t('nav.packages')}</Link></li>
              <li><Link href="/hotels" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>{t('nav.hotels')}</Link></li>
              <li><Link href="/flights" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>{t('nav.flights')}</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm">Policies</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link href="/policies" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>Privacy Policy</Link></li>
              <li><Link href="/policies" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>Terms & Conditions</Link></li>
              <li><Link href="/policies" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>Cancellation Policy</Link></li>
              <li><Link href="/policies" className="hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>Payment Policy</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm">{t('footer.contact')}</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4 text-slate-400 group">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <span className="leading-snug pt-1">Bariatu Road, Ranchi,<br/> Jharkhand, India</span>
              </li>
              <li className="flex items-center gap-4 text-slate-400 group">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <span className="pt-1">+91 92635 54855</span>
              </li>
              <li className="flex items-center gap-4 text-slate-400 group">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <span className="pt-1">mnt.mynexttrip@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm">{t('footer.newsletter')}</h4>
            <p className="text-[11px] text-slate-400 mb-5 leading-relaxed">
              {t('footer.newsletter_desc')}
            </p>
            <div className="flex bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-inner">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-transparent text-xs px-2 flex-1 focus:outline-none text-white placeholder-slate-500 w-full"
                suppressHydrationWarning
              />
              <button className="bg-gradient-to-r from-primary to-indigo-600 text-white text-[10px] font-bold px-3 py-2 rounded-lg hover:shadow-lg transition-all" suppressHydrationWarning>
                {t('footer.join')}
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <p>© 2026 MyNextTrip Portal. All rights reserved.</p>
          
          <div className="flex items-center flex-wrap justify-center gap-2">
            <span>{t('footer.developed_by')}</span>
            <span className="text-rose-500 animate-pulse">♥</span> 
            <button 
              onClick={() => setIsAgencyModalOpen(true)}
              className="text-white font-bold ml-1 tracking-wider uppercase bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg shadow-sm hover:bg-primary/20 hover:border-primary/30 transition-all cursor-pointer group flex items-center gap-2"
              suppressHydrationWarning
            >
              MD ATAUR ANSARI
              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="flex gap-6 font-medium">
            <Link href="/policies" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/policies" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      {/* Agency Modal */}
      {isAgencyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsAgencyModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-lg bg-[#0d121f]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsAgencyModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center space-y-6">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">ATAUR AGENCY</h3>
                <p className="text-primary font-bold tracking-widest text-[10px] uppercase mt-1">Premium Digital Solutions</p>
              </div>
              
              <p className="text-slate-400 leading-relaxed text-sm max-w-md mx-auto">
                Transforming ideas into high-performance digital realities. We specialize in premium web engineering, strategic digital growth, and crafting immersive user experiences that drive results.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Link 
                  href="https://www.atauragency.in/" 
                  target="_blank"
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/20 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-primary/20 group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wider">Official Website</span>
                </Link>
                
                <Link 
                  href="https://www.linkedin.com/in/md-ataur-ansari-b18790271" 
                  target="_blank"
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-blue-500/20 group-hover:scale-110 transition-transform">
                    <Linkedin className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wider">LinkedIn Profile</span>
                </Link>
              </div>
              
              <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Crafted with passion in Ranchi, India</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
