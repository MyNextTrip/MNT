"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function WhatsAppButton() {
  const phoneNumber = "919263554855";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-3 group">
      {/* Tooltip */}
      <div className="bg-white px-4 py-2 rounded-2xl shadow-2xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0 cursor-default pointer-events-none">
        <p className="text-xs font-black text-slate-800 uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
          Chat with an Expert <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </p>
      </div>

      {/* Button */}
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden group/btn border border-slate-100"
        )}
        aria-label="Chat with us on WhatsApp"
        suppressHydrationWarning
      >
        <div className="relative w-full h-full p-2">
          <Image
            src="/images/whatsapp-icon.png"
            alt="WhatsApp"
            fill
            className="object-contain p-2"
          />
        </div>
        
        {/* Pulse Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping pointer-events-none"></div>
      </Link>
    </div>
  );
}
