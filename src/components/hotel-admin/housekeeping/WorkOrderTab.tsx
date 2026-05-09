"use client";

import React, { useState } from 'react';
import { 
  ListTodo, Plus, Search, Filter, 
  Clock, CheckCircle2, User, Users,
  ClipboardList, AlertCircle, Sparkles,
  Timer, Calendar, RefreshCw, ArrowRight
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface WorkOrderTabProps {
  virtualRooms: any[];
  bookings: any[];
}

export const WorkOrderTab = ({ virtualRooms, bookings }: WorkOrderTabProps) => {
  const [activeView, setActiveView] = useState('Board');
  const [search, setSearch] = useState('');

  // Mock staff data
  const staff = [
    { id: 'S1', name: 'Rahul Kumar', role: 'Housekeeper', status: 'Active', tasks: 3 },
    { id: 'S2', name: 'Amit Singh', role: 'Housekeeper', status: 'Busy', tasks: 5 },
    { id: 'S3', name: 'Sita Devi', role: 'Floor Supervisor', status: 'Active', tasks: 2 },
  ];

  // Mock tasks data
  const [tasks, setTasks] = useState([
    { id: 'T1', roomNumber: '101', type: 'Dirty Room Cleaning', priority: 'High', staff: 'Rahul Kumar', status: 'In Progress', startTime: '14:05', estTime: '15m' },
    { id: 'T2', roomNumber: '204', type: 'Laundry Pickup', priority: 'Medium', staff: 'Unassigned', status: 'Pending', startTime: '-', estTime: '10m' },
    { id: 'T3', roomNumber: 'VIP-401', type: 'VIP Room Prep', priority: 'Critical', staff: 'Amit Singh', status: 'Accepted', startTime: '14:15', estTime: '20m' },
    { id: 'T4', roomNumber: 'Floor 1', type: 'Floor Cleaning', priority: 'Low', staff: 'Sita Devi', status: 'Completed', startTime: '13:00', estTime: '25m' },
  ]);

  const priorityColors: Record<string, string> = {
    'Critical': 'border-rose-500 text-rose-600 bg-rose-50',
    'High': 'border-orange-500 text-orange-600 bg-orange-50',
    'Medium': 'border-amber-500 text-amber-600 bg-amber-50',
    'Low': 'border-blue-500 text-blue-600 bg-blue-50'
  };

  const statusColors: Record<string, string> = {
    'Pending': 'bg-slate-100 text-slate-500',
    'Accepted': 'bg-indigo-100 text-indigo-600',
    'In Progress': 'bg-blue-100 text-blue-600',
    'Completed': 'bg-emerald-100 text-emerald-600',
    'Rework Required': 'bg-rose-100 text-rose-600'
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Work Order Assignment</h1>
          <p className="text-slate-500 mt-1 font-medium">Distribute tasks and monitor staff productivity in real-time.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {['Board', 'List', 'Staff'].map(v => (
              <button 
                key={v}
                onClick={() => setActiveView(v)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeView === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-black rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest">
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Column: Task Board / List */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Done</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors">
              <RefreshCw className="w-3 h-3" /> Auto-sync ON
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 p-6 relative group">
                <div className="flex justify-between items-start mb-6">
                   <div className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2",
                    priorityColors[task.priority]
                   )}>
                    {task.priority} Priority
                   </div>
                   <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black">{task.startTime}</span>
                   </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-black text-slate-900">{task.type}</h3>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                    <ClipboardList className="w-3 h-3" /> Room {task.roomNumber}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full border border-slate-200 flex items-center justify-center">
                         <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-900 leading-none">{task.staff}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Assigned</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-900 leading-none">{task.estTime}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Duration</p>
                   </div>
                </div>

                <div className="flex items-center justify-between">
                   <span className={cn(
                    "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest",
                    statusColors[task.status]
                   )}>
                    {task.status}
                   </span>
                   <button className="w-9 h-9 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-slate-900/10">
                      <ArrowRight className="w-4 h-4" />
                   </button>
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[32px] pointer-events-none">
                   <div className="bg-white p-2 rounded-2xl shadow-xl flex gap-2 pointer-events-auto scale-90 group-hover:scale-100 transition-transform">
                      <button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-colors"><Timer className="w-5 h-5" /></button>
                      <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors"><CheckCircle2 className="w-5 h-5" /></button>
                      <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors"><AlertCircle className="w-5 h-5" /></button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Smart Queue */}
          <div className="bg-slate-950 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="bg-amber-400/20 p-6 rounded-[32px] border border-amber-400/20">
                   <Sparkles className="w-12 h-12 text-amber-400 animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">AI Smart Queue Optimization</h3>
                   <p className="text-slate-400 text-lg font-medium">3 Upcoming VIP check-ins detected in next 45 mins. AI has automatically reprioritized <span className="text-amber-400 font-bold underline">Room 401, 402, and 405</span> to the top of the queue.</p>
                </div>
                <button className="px-8 py-4 bg-amber-400 text-indigo-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase text-xs tracking-widest shadow-xl shadow-amber-400/20 whitespace-nowrap">Apply Suggestions</button>
             </div>
          </div>
        </div>

        {/* Right Column: Staff Activity */}
        <div className="space-y-6">
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Staff</h3>
                 <Users className="w-5 h-5 text-slate-300" />
              </div>
              
              <div className="space-y-6">
                 {staff.map((s) => (
                    <div key={s.id} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="relative">
                             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
                                {s.name.charAt(0)}
                             </div>
                             <div className={cn(
                                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                                s.status === 'Active' ? "bg-emerald-500" : "bg-amber-500"
                             )} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-900 leading-none">{s.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{s.role}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-indigo-600">{s.tasks} Tasks</p>
                          <div className="w-12 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                             <div className="bg-indigo-500 h-full" style={{ width: `${(s.tasks / 6) * 100}%` }} />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <button className="w-full mt-8 py-3 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">View All Staff</button>
           </div>

           {/* Efficiency Card */}
           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-600/20">
              <div className="flex items-center gap-3 mb-6">
                 <Timer className="w-5 h-5 text-blue-200" />
                 <h3 className="text-xs font-black uppercase tracking-widest">Efficiency</h3>
              </div>
              <div className="text-4xl font-black mb-1">94%</div>
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest opacity-80">Task completion rate</p>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase opacity-60">Avg Cleaning Time</span>
                    <span className="text-xs font-black">12.5m</span>
                 </div>
                 <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: '85%' }} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
