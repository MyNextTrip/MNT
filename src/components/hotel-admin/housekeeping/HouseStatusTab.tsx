"use client";

import React, { useState, useEffect } from 'react';
import { 
  BedDouble, CheckCircle2, Clock, AlertCircle, 
  Sparkles, Hammer, Trash2, User, Search,
  Filter, ArrowRight, ShieldCheck, MoreVertical
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface HouseStatusTabProps {
  virtualRooms: any[];
  bookings: any[];
}

export const HouseStatusTab = ({ virtualRooms, bookings }: HouseStatusTabProps) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [roomStatuses, setRoomStatuses] = useState<Record<string, string>>({});

  // Mock status initialization if not present in virtualRooms
  useEffect(() => {
    const initialStatuses: Record<string, string> = {};
    virtualRooms.forEach(room => {
      // Determine initial status based on bookings
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const currentBooking = bookings.find(b => {
        if (['Cancelled', 'Checked-Out', 'No-Show'].includes(b.reservationStatus)) return false;
        const ci = new Date(b.checkInDate); ci.setHours(0,0,0,0);
        const co = new Date(b.checkOutDate); co.setHours(0,0,0,0);
        return today >= ci && today < co && (b.assignedRoomNumber === room.roomNumber);
      });

      if (currentBooking) {
        initialStatuses[room.id] = 'Occupied';
      } else {
        // Randomly assign some dirty/ready for demo if not occupied
        const random = Math.random();
        if (random > 0.8) initialStatuses[room.id] = 'Dirty';
        else if (random > 0.6) initialStatuses[room.id] = 'Inspection Pending';
        else initialStatuses[room.id] = 'Ready';
      }
    });
    setRoomStatuses(initialStatuses);
  }, [virtualRooms, bookings]);

  const statusColors: Record<string, string> = {
    'Ready': 'bg-emerald-500',
    'Dirty': 'bg-rose-500',
    'Occupied': 'bg-blue-500',
    'Upcoming': 'bg-amber-500',
    'Out of Order': 'bg-slate-500',
    'Inspection Pending': 'bg-orange-500',
    'Deep Cleaning': 'bg-purple-500'
  };

  const statusTextColors: Record<string, string> = {
    'Ready': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    'Dirty': 'text-rose-600 bg-rose-50 border-rose-100',
    'Occupied': 'text-blue-600 bg-blue-50 border-blue-100',
    'Upcoming': 'text-amber-600 bg-amber-50 border-amber-100',
    'Out of Order': 'text-slate-600 bg-slate-50 border-slate-100',
    'Inspection Pending': 'text-orange-600 bg-orange-50 border-orange-100',
    'Deep Cleaning': 'text-purple-600 bg-purple-50 border-purple-100'
  };

  const filteredRooms = virtualRooms.filter(room => {
    const status = roomStatuses[room.id] || 'Ready';
    const matchesFilter = filter === 'All' || status === filter;
    const matchesSearch = room.roomNumber.toLowerCase().includes(search.toLowerCase()) || 
                          room.roomType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">House Status Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Real-time room readiness and cleaning operations.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search room..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> AI Optimize
          </button>
        </div>
      </header>

      {/* Status Filter Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
        {['All', 'Ready', 'Dirty', 'Occupied', 'Upcoming', 'Inspection Pending', 'Out of Order', 'Deep Cleaning'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
              filter === s 
                ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
            )}
          >
            {s}
            {filter === s && <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-md text-[8px]">{filteredRooms.length}</span>}
          </button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredRooms.map((room) => {
          const status = roomStatuses[room.id] || 'Ready';
          const currentBooking = bookings.find(b => b.assignedRoomNumber === room.roomNumber && b.reservationStatus === 'Checked-In');
          
          return (
            <div 
              key={room.id}
              className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden relative"
            >
              {/* Status Indicator Bar */}
              <div className={cn("h-1.5 w-full", statusColors[status])} />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                    status === 'Ready' ? "bg-emerald-50 text-emerald-600" :
                    status === 'Dirty' ? "bg-rose-50 text-rose-600" :
                    status === 'Occupied' ? "bg-blue-50 text-blue-600" :
                    "bg-slate-50 text-slate-400"
                  )}>
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900">Room {room.roomNumber}</h3>
                    {status === 'Ready' && <ShieldCheck className="w-4 h-4 text-emerald-500" title="Sanitized" />}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{room.roomType}</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    statusTextColors[status]
                  )}>
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", statusColors[status])} />
                    {status}
                  </div>

                  {status === 'Occupied' && currentBooking ? (
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        <p className="text-xs font-bold text-slate-700 truncate">{currentBooking.guestName || currentBooking.userName}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Checkout</span>
                        <span className="text-[10px] font-black text-rose-500">{new Date(currentBooking.checkOutDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Floor</p>
                        <p className="text-xs font-black text-slate-700">{room.roomNumber.charAt(0)}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Type</p>
                        <p className="text-xs font-black text-slate-700">STD</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions Footer */}
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        H
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all group/btn">
                    Details <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
