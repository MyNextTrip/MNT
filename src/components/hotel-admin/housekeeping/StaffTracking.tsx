import React from 'react';
import { 
  Users, MapPin, Clock, Star, 
  BarChart, TrendingUp, Search, 
  UserCheck, Timer, Award, Zap, Loader2
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface StaffTrackingProps {
  staff?: any[];
}

export const StaffTracking = ({ staff = [] }: StaffTrackingProps) => {
  // Use real staff data if available, otherwise fallback to mock for visuals
  const displayStaff = staff.length > 0 ? staff.map(s => ({
    name: s.name,
    role: s.designation,
    location: 'Property Grounds', // Default for now
    status: 'Online',
    time: 'Since shift start',
    task: 'Idle',
    code: s.employeeCode,
    photo: s.photo
  })) : [
    { name: 'Rahul Kumar', role: 'Housekeeper', location: '3rd Floor', status: 'In Progress (RM 304)', time: 'Since 14:05', task: 'Deep Cleaning', code: 'HK001', photo: '' },
    { name: 'Sita Devi', role: 'Supervisor', location: '1st Floor', status: 'Idle', time: 'Since 13:50', task: 'None', code: 'SV001', photo: '' },
    { name: 'Amit Singh', role: 'Housekeeper', location: '4th Floor', status: 'In Progress (RM 401)', time: 'Since 14:15', task: 'Turndown', code: 'HK002', photo: '' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Tracking & Productivity</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitor staff attendance, real-time location, and performance scores.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shadow-sm shadow-emerald-500/10">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
             <span className="text-[10px] font-black uppercase tracking-widest">{displayStaff.length} Staff Online</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productivity Leaderboard */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Top Performers</h3>
                 <Award className="w-5 h-5 text-amber-500" />
              </div>
              
              <div className="space-y-8">
                 {displayStaff.slice(0, 4).map((performer, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="relative">
                             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:scale-110 transition-transform">
                                {i + 1}
                             </div>
                             {i === 0 && <div className="absolute -top-2 -right-2 bg-amber-400 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"><Star className="w-2.5 h-2.5 fill-current" /></div>}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900">{performer.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{10 + (4-i)*5} Tasks Done</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={cn("text-lg font-black", i === 0 ? "text-emerald-500" : "text-slate-400")}>{98 - i*3}</p>
                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Score</p>
                       </div>
                    </div>
                 ))}
              </div>
              
              <button className="w-full mt-8 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">View All Scores</button>
           </div>

           <div className="bg-indigo-900 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-900/20">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 opacity-60">Fleet Efficiency</h3>
              <div className="text-4xl font-black mb-2">14.2m</div>
              <p className="text-xs font-medium text-indigo-200">Average cleaning time per room today</p>
              
              <div className="mt-8 space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span>Performance</span>
                    <span className="text-emerald-400">+12% vs Yesterday</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: '72%' }} />
                 </div>
              </div>
           </div>
        </div>

        {/* Staff Attendance & Location */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Real-time Staff Roster</h3>
                 <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    <input type="text" placeholder="Search staff..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {displayStaff.map((staff, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 p-5 rounded-[2rem] hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all group">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-black border border-slate-100 shadow-sm overflow-hidden">
                                {staff.photo ? (
                                  <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                                ) : (
                                  staff.name.charAt(0)
                                )}
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900">{staff.name}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{staff.role}</p>
                                <p className="text-[8px] font-black text-indigo-500 uppercase tracking-tighter mt-1">Code: {staff.code}</p>
                             </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                             <Zap className={cn("w-3.5 h-3.5", staff.status.includes('Idle') ? "text-slate-300" : "text-amber-500 animate-pulse")} />
                          </div>
                       </div>
                       
                       <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                             <MapPin className="w-3 h-3 text-rose-400" /> {staff.location}
                          </div>
                          <div className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-slate-200/50">
                             <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase">Current Status</p>
                                <p className="text-[10px] font-black text-indigo-600 mt-0.5">{staff.status}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase">{staff.time.includes('Since') ? 'Time' : 'Alert'}</p>
                                <p className="text-[10px] font-black text-slate-600 mt-0.5">{staff.time}</p>
                             </div>
                          </div>
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
