"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

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
              <Link href="#" className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all text-white shadow-lg shadow-black/20" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://www.instagram.com/mynexttrip07/" className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all text-white shadow-lg shadow-black/20" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all text-white shadow-lg shadow-black/20" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
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
          
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm">{t('footer.contact')}</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4 text-slate-400 group">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <span className="leading-snug pt-1">123 Travel Lane, Jharkhand,<br/> India</span>
              </li>
              <li className="flex items-center gap-4 text-slate-400 group">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <span className="pt-1">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-4 text-slate-400 group">
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <span className="pt-1">mnt.mynexttrip@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 tracking-wide text-sm">{t('footer.newsletter')}</h4>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              {t('footer.newsletter_desc')}
            </p>
            <div className="flex bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-inner">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-transparent text-sm px-3 flex-1 focus:outline-none text-white placeholder-slate-500 w-full"
              />
              <button className="bg-gradient-to-r from-primary to-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all font-medium whitespace-nowrap">
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
            <span className="text-white font-bold ml-1 tracking-wider uppercase bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg shadow-sm">
              MD ATAUR ANSARI
            </span>
          </div>

          <div className="flex gap-6 font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
