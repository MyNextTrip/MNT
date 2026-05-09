import React from "react";
import { Info, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

interface SummaryBoxProps {
  title: string;
  items: { label: string; value: string; icon?: React.ReactNode }[];
  description?: string;
  citationUrl?: string;
  citationLabel?: string;
}

/**
 * Reusable GEO Summary Box component.
 * Purpose: Provides high-density, easily scannable information for AI agents (Google AIO, Perplexity).
 * Includes the CIT (Citation-Information-Trust) framework markers.
 */
export default function SummaryBox({ 
  title, 
  items, 
  description, 
  citationUrl, 
  citationLabel 
}: SummaryBoxProps) {
  return (
    <section className="my-10 p-8 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-[32px] border border-indigo-100/50 shadow-sm relative overflow-hidden group">
      {/* AI Bot Scoping Marker (Hidden from visual but readable by parsers) */}
      <span className="sr-only">Key Highlights and Summary for {title}</span>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Quick Summary & Highlights</h2>
      </div>

      {description && (
        <p className="text-slate-600 mb-8 leading-relaxed font-medium">
          {description}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:border-indigo-200 transition-all">
            <div className="mt-1 text-indigo-500">
              {item.icon || <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
              <p className="text-sm font-bold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-indigo-100/50">
        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Authoritative Information
        </div>
        
        {citationUrl && (
          <a 
            href={citationUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
          >
            Source: {citationLabel || "Official Tourism Authority"}
            <Info className="w-3 h-3" />
          </a>
        )}
      </div>
    </section>
  );
}
