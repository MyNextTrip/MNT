"use client";

import React from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Download, 
  FileText, Calendar, Filter, ArrowUpRight,
  Sparkles, CheckCircle2, Clock, IndianRupee
} from 'lucide-react';
import { cn } from "@/lib/utils";

export const HousekeepingReports = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Housekeeping Intelligence</h1>
          <p className="text-slate-500 mt-1 font-medium">Enterprise-grade analytics and operational performance reports.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-2xl mr-2">
            {['Weekly', 'Monthly', 'Quarterly'].map(v => (
              <button key={v} className={cn("px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", v === 'Monthly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>{v}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all text-xs uppercase tracking-widest">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </header>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Avg Cleaning Time", value: "14.2m", change: "-8%", trend: "up", color: "text-emerald-500" },
          { label: "Staff Efficiency", value: "94.8%", change: "+2.4%", trend: "up", color: "text-blue-500" },
          { label: "Maintenance Cost", value: "₹4,250", change: "+12%", trend: "down", color: "text-rose-500" },
          { label: "Room Turnaround", value: "28m", change: "-5%", trend: "up", color: "text-indigo-500" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500">
             <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black", kpi.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                   {kpi.change} <ArrowUpRight className={cn("w-2.5 h-2.5", kpi.trend === 'down' && "rotate-90")} />
                </div>
             </div>
             <p className={cn("text-3xl font-black", kpi.color)}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Efficiency Chart Placeholder */}
        <div className="xl:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Cleaning Performance Trends</h3>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Standard Room</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">VIP Suite</span>
                 </div>
              </div>
           </div>
           
           <div className="h-[300px] flex items-end justify-between gap-4">
              {[65, 45, 75, 55, 85, 40, 95, 60, 70, 50, 80, 90].map((h, i) => (
                 <div key={i} className="flex-1 group relative">
                    <div className="w-full bg-slate-50 rounded-t-xl relative h-[300px] overflow-hidden">
                       <div 
                         className="absolute bottom-0 w-full bg-indigo-500 rounded-t-xl group-hover:bg-indigo-600 transition-all duration-500" 
                         style={{ height: `${h}%` }} 
                       />
                       <div 
                         className="absolute bottom-0 w-full bg-amber-400/40 rounded-t-xl group-hover:bg-amber-400 transition-all duration-500" 
                         style={{ height: `${h * 0.6}%` }} 
                       />
                    </div>
                    <div className="text-center mt-3 text-[9px] font-black text-slate-400 uppercase tracking-tighter">Day {i + 1}</div>
                 </div>
              ))}
           </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                 <Sparkles className="w-6 h-6 text-amber-400" />
                 <h3 className="text-sm font-black uppercase tracking-widest">AI Operational Insights</h3>
              </div>
              
              <div className="space-y-6">
                 {[
                    { title: 'Staff Balancing', desc: 'Shift staff from Floor 1 to Floor 3 between 11 AM - 1 PM to handle peak checkouts.', icon: <Users className="w-4 h-4" /> },
                    { title: 'Inventory Alert', desc: 'Linen usage is 15% higher than usual. Check for wastage or unrecorded laundry.', icon: <CheckCircle2 className="w-4 h-4" /> },
                    { title: 'Predictive Repair', desc: 'Room 204 AC is showing power fluctuations. Schedule engineer before guest complaint.', icon: <Clock className="w-4 h-4" /> },
                 ].map((insight, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-[2rem] hover:bg-white/10 transition-all group">
                       <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">{insight.icon}</div>
                          <p className="text-xs font-black uppercase tracking-widest">{insight.title}</p>
                       </div>
                       <p className="text-xs font-medium text-slate-400 leading-relaxed">{insight.desc}</p>
                    </div>
                 ))}
              </div>
              
              <button className="w-full mt-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:scale-105 transition-all text-xs uppercase tracking-widest">Execute AI Plan</button>
           </div>
           <BarChart3 className="absolute right-[-40px] bottom-[-40px] w-64 h-64 text-white/5 -rotate-12" />
        </div>
      </div>

      {/* Detailed Reports List */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
         <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8">Recent Generated Reports</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
               { name: 'Weekly Efficiency Audit', date: 'May 07, 2024', size: '2.4 MB', type: 'PDF' },
               { name: 'Staff Productivity Monthly', date: 'Apr 30, 2024', size: '1.8 MB', type: 'Excel' },
               { name: 'Maintenance Cost Analysis', date: 'May 01, 2024', size: '4.2 MB', type: 'PDF' },
               { name: 'Linen & Inventory Log', date: 'May 06, 2024', size: '0.9 MB', type: 'CSV' },
            ].map((report, i) => (
               <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 border border-slate-100 transition-colors">
                     <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                     <p className="text-xs font-black text-slate-900 truncate">{report.name}</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{report.date} • {report.size}</p>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Download className="w-4 h-4" /></button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const Users = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
