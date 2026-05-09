"use client";

import React, { useState } from 'react';
import { 
  Hammer, AlertTriangle, Clock, CheckCircle2, 
  Wrench, Plus, Search, Filter, 
  Calendar, User, Tool, Image as ImageIcon,
  History, BarChart3
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface MaintenanceBlockTabProps {
  virtualRooms: any[];
}

export const MaintenanceBlockTab = ({ virtualRooms }: MaintenanceBlockTabProps) => {
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  // Form State
  const [newBlock, setNewBlock] = useState({
    roomNumber: '',
    category: 'Plumbing',
    priority: 'Medium',
    description: '',
    status: 'Reported',
    engineer: ''
  });

  // Mock maintenance data
  const [maintenanceRecords, setMaintenanceRecords] = useState([
    { id: 'M1', roomNumber: '102', category: 'Plumbing', priority: 'Critical', status: 'In Progress', reportedDate: '2024-05-08', engineer: 'John Engineer', description: 'Major leak in bathroom' },
    { id: 'M2', roomNumber: '205', category: 'AC / HVAC', priority: 'High', status: 'Reported', reportedDate: '2024-05-08', engineer: 'Unassigned', description: 'AC not cooling' },
    { id: 'M3', roomNumber: '304', category: 'Electrical', priority: 'Medium', status: 'Waiting Parts', reportedDate: '2024-05-07', engineer: 'Mike Spark', description: 'Light flickering' },
  ]);

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const record = {
      ...newBlock,
      id: `M${maintenanceRecords.length + 1}`,
      reportedDate: new Date().toISOString().split('T')[0]
    };
    setMaintenanceRecords([record, ...maintenanceRecords]);
    setIsAddingBlock(false);
    setNewBlock({ roomNumber: '', category: 'Plumbing', priority: 'Medium', description: '', status: 'Reported', engineer: '' });
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      setMaintenanceRecords(maintenanceRecords.filter(r => r.id !== recordToDelete));
      setRecordToDelete(null);
    }
  };

  const priorityColors: Record<string, string> = {
    'Critical': 'bg-rose-500 text-white shadow-rose-200',
    'High': 'bg-orange-500 text-white shadow-orange-200',
    'Medium': 'bg-amber-500 text-white shadow-amber-200',
    'Low': 'bg-blue-500 text-white shadow-blue-200'
  };

  const statusColors: Record<string, string> = {
    'Reported': 'bg-slate-100 text-slate-600 border-slate-200',
    'Assigned': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
    'Waiting Parts': 'bg-purple-50 text-purple-600 border-purple-100',
    'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 relative">
      {/* DELETE CONFIRMATION POPUP */}
      {recordToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-sm text-center animate-in zoom-in-95 duration-300 border border-slate-100">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Resolve Issue?</h3>
              <p className="text-slate-500 font-medium text-sm mb-8">Are you sure you want to remove this maintenance block? This room will be returned to active inventory.</p>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setRecordToDelete(null)}
                   className="flex-1 py-3 bg-slate-100 text-slate-500 font-black rounded-xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={confirmDelete}
                   className="flex-1 py-3 bg-rose-600 text-white font-black rounded-xl hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-rose-600/20"
                 >
                    Confirm
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* ADD BLOCK MODAL / FORM */}
      {isAddingBlock && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
              <div className="bg-rose-600 p-8 text-white">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <Hammer className="w-8 h-8" />
                       <h2 className="text-2xl font-black uppercase tracking-tight">Block Room for Maintenance</h2>
                    </div>
                    <button onClick={() => setIsAddingBlock(false)} className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/40 transition-all font-black">X</button>
                 </div>
                 <p className="text-rose-100 mt-2 font-medium opacity-80 text-sm">Fill in the details to remove this room from active inventory.</p>
              </div>

              <form onSubmit={handleAddBlock} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Number</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 101"
                      value={newBlock.roomNumber}
                      onChange={(e) => setNewBlock({...newBlock, roomNumber: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700 transition-all"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={newBlock.category}
                      onChange={(e) => setNewBlock({...newBlock, category: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700 appearance-none cursor-pointer"
                    >
                       {['Plumbing', 'AC / HVAC', 'Electrical', 'Carpentry', 'Furniture', 'Civil Works', 'Painting'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                    <div className="flex gap-2">
                       {['Critical', 'High', 'Medium', 'Low'].map(p => (
                          <button 
                            key={p}
                            type="button"
                            onClick={() => setNewBlock({...newBlock, priority: p})}
                            className={cn(
                               "flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all border",
                               newBlock.priority === p 
                               ? priorityColors[p] + " border-transparent"
                               : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                            )}
                          >
                             {p}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Engineer</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                         type="text" 
                         placeholder="Name or ID"
                         value={newBlock.engineer}
                         onChange={(e) => setNewBlock({...newBlock, engineer: e.target.value})}
                         className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700 transition-all"
                       />
                    </div>
                 </div>

                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Description</label>
                    <textarea 
                      required
                      placeholder="Describe the problem in detail..."
                      value={newBlock.description}
                      onChange={(e) => setNewBlock({...newBlock, description: e.target.value})}
                      rows={3}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-700 transition-all resize-none"
                    />
                 </div>

                 <div className="md:col-span-2 flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsAddingBlock(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-4 bg-rose-600 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase text-xs tracking-widest shadow-xl shadow-rose-600/20"
                    >
                       Confirm Block
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Block System</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage property repairs and out-of-order rooms.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <button 
            onClick={() => setIsAddingBlock(true)}
            className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
           >
            <Hammer className="w-4 h-4" /> Block Room
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Blocked Rooms", value: maintenanceRecords.length.toString(), icon: Hammer, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "In Repair", value: maintenanceRecords.filter(r => r.status === 'In Progress').length.toString(), icon: Wrench, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Avg Repair Time", value: "4.2h", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Annual Cost", value: "₹42.5k", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-500">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
              <p className={cn("text-3xl font-black mt-1", card.color)}>{card.value}</p>
            </div>
            <div className={cn("p-4 rounded-2xl", card.bg)}>
              <card.icon className={cn("w-6 h-6", card.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Maintenance List */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-wrap gap-4 items-center justify-between">
           <div className="flex gap-2">
             {['All Issues', 'Critical', 'In Progress', 'Completed'].map(f => (
               <button key={f} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">{f}</button>
             ))}
           </div>
           <div className="relative w-full lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search record..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500/10 font-bold text-sm shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Room / Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Description</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Engineer</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {maintenanceRecords.filter(r => r.roomNumber.includes(search) || r.category.includes(search)).map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black text-xs uppercase">
                        {record.roomNumber}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm leading-none">{record.category}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-tighter">Reported {record.reportedDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                      priorityColors[record.priority]
                    )}>
                      {record.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-600 max-w-xs truncate">{record.description}</p>
                  </td>
                  <td className="px-8 py-6">
                     <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      statusColors[record.status]
                    )}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-indigo-500" />
                       </div>
                       <span className="text-xs font-bold text-slate-700">{record.engineer || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                       <button className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-indigo-100">
                          <Wrench className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => setRecordToDelete(record.id)}
                         className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Smart Suggestion */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-600/20">
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
               </div>
               <h3 className="text-xl font-black uppercase tracking-widest">AI Preventive Maintenance</h3>
            </div>
            <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed">
              Based on historical data, rooms <span className="text-white font-black underline">102</span> and <span className="text-white font-black underline">205</span> have recurring AC issues. We recommend scheduling a comprehensive HVAC audit for the first floor.
            </p>
            <button className="mt-8 px-8 py-3 bg-white text-indigo-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase text-xs tracking-[0.2em]">Schedule Preventive Audit</button>
         </div>
         <Hammer className="absolute right-[-40px] bottom-[-40px] w-80 h-80 text-white/5 -rotate-12" />
      </div>
    </div>
  );
};
