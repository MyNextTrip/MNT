"use client";

import { useState } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Settings, User, X } from "lucide-react";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    {
      name: "MNT Support Team",
      number: "917033008111",
      icon: <User className="w-4 h-4" />,
      color: "bg-emerald-500"
    },
    {
      name: "Technical Team",
      number: "919263554855",
      icon: <Settings className="w-4 h-4" />,
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-3">
      {/* Options Menu */}
      <div className={cn(
        "flex flex-col gap-2 transition-all duration-300 origin-bottom-left",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-10 pointer-events-none"
      )}>
        {contacts.map((contact, idx) => (
          <Link
            key={idx}
            href={`https://wa.me/${contact.number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-100 hover:bg-white hover:scale-105 transition-all group/item"
          >
            <div className={cn("p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20 transition-transform group-hover/item:rotate-12", contact.color)}>
              {contact.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">WhatsApp Chat</span>
              <span className="text-sm font-bold text-slate-800 whitespace-nowrap">{contact.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden border border-slate-100 relative group/main",
          isOpen ? "shadow-emerald-500/40 rotate-90" : "shadow-slate-400/20"
        )}
        aria-label="Toggle WhatsApp Options"
      >
        <div className="relative w-full h-full p-2 flex items-center justify-center">
           {isOpen ? (
             <X className="w-8 h-8 text-slate-800" />
           ) : (
              <img
                 src="/images/whatsapp-icon.png"
                 alt="WhatsApp"
                 className="absolute inset-0 w-full h-full object-contain p-2"
               />
           )}
        </div>
        
        {/* Pulse Ring */}
        {!isOpen && <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping pointer-events-none"></div>}
      </button>
    </div>
  );
}
