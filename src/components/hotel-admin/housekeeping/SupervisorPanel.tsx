"use client";

import React from 'react';
import { 
  Monitor, Users, Clock, AlertTriangle, 
  Map, BarChart, Bell, Zap,
  TrendingUp, CheckCircle2, MoreHorizontal,
  ChevronRight, Phone, MessageSquare
} from 'lucide-react';
import { cn } from "@/lib/utils";

export const SupervisorPanel = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Supervisor Control Center</h1>
          <p className="text-slate-500 mt-1 font-medium">Real-time floor monitoring and operational escalation.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-xs font-black text-slate-400">S</div>
             ))}
             <div className="w-10 h-10 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-xs font-black text-white">+5</div>
          </div>
          <div className="h-10 w-[1px] bg-slate-200 mx-2" />
          <button className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400 hover:text-indigo-600 transition-all">
             <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Live Floor Monitoring */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Floor-wise Progress */}
        <div className="xl:col-span-2 space-y-6">
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Floor Operations</h3>
                 <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
                       <CheckCircle2 className="w-3 h-3" /> 12 Done
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase">
                       <Clock className="w-3 h-3" /> 4 Active
                    </div>
                 </div>
              </div>

              <div className="space-y-10">
                 {[1, 2, 3, 4].map((floor) => (
                    <div key={floor} className="relative">
                       <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400">F{floor}</div>
                             <span className="text-sm font-black text-slate-900">Floor {floor}th Operations</span>
                          </div>
                          <span className="text-xs font-black text-indigo-600">{75 + floor * 5}% Complete</span>
                       </div>
                       <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${75 + floor * 5}%` }} 
                          />
                       </div>
                       <div className="mt-4 flex gap-2">
                          {Array.from({ length: 8 }).map((_, i) => (
                             <div 
                                key={i} 
                                className={cn(
                                  "w-full h-8 rounded-lg border-2 transition-all cursor-pointer hover:scale-105",
                                  i % 3 === 0 ? "bg-emerald-500 border-emerald-400" :
                                  i % 5 === 0 ? "bg-rose-500 border-rose-400" :
                                  "bg-indigo-500 border-indigo-400"
                                )}
                                title={`Room ${floor}0${i+1}`}
                             />
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Alerts & Escalations */}
        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-900/20">
              <div className="flex items-center gap-3 mb-8">
                 <div className="bg-rose-500 p-2 rounded-xl">
                    <Zap className="w-5 h-5 text-white" />
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-widest">Critical Alerts</h3>
              </div>

              <div className="space-y-4">
                 {[
                    { type: 'Delay', room: '204', desc: 'Cleaning delayed by 25 mins', time: '5m ago' },
                    { type: 'DND', room: '105', desc: 'Guest reported DND issue', time: '12m ago' },
                    { type: 'Damage', room: '302', desc: 'Broken window reported', time: '1h ago' },
                 ].map((alert, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">{alert.type}</span>
                          <span className="text-[9px] font-bold text-white/40">{alert.time}</span>
                       </div>
                       <p className="text-xs font-bold text-white mb-1">Room {alert.room} — {alert.desc}</p>
                       <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="flex-1 py-2 bg-rose-600 text-white text-[9px] font-black uppercase rounded-lg">Resolve</button>
                          <button className="px-3 py-2 bg-white/10 text-white rounded-lg"><Phone className="w-3 h-3" /></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Staff Connectivity</h3>
              <div className="space-y-6">
                 {[
                    { name: 'Amit Singh', role: 'Housekeeper', status: 'Online', phone: '+91 98765 43210' },
                    { name: 'Priya Verma', role: 'Inspector', status: 'In Meeting', phone: '+91 98765 43211' },
                 ].map((staff, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 font-black">
                             {staff.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-900">{staff.name}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">{staff.role}</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><MessageSquare className="w-4 h-4" /></button>
                          <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"><Phone className="w-4 h-4" /></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
