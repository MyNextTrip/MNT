import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Admin | Property Management",
  robots: { index: false, follow: false },
};

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, MapPin, IndianRupee, 
  LayoutDashboard, Calendar, BedDouble, 
  Settings, LogOut, Trash2, Pencil,
  ChevronDown, ChevronUp, Wifi, Coffee, 
  Clock, CheckCircle2, AlertCircle, Menu, X, 
  PlusCircle, Save, Loader2, User, Users, Bed,
  LayoutGrid, DoorOpen, CalendarCheck, Tags, Globe, UserCheck, Wallet, Sparkles, Moon, ShoppingBag, Key, BarChart3, FileDown,
  ChevronRight, Wand2, Gift, Slash, FileSearch, Contact, CreditCard, Backpack, Briefcase, Compass, UserPlus, Building, Receipt, Monitor, CheckSquare, Hammer, ListTodo, History, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HotelAdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [hotelName, setHotelName] = useState("");
  
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [hotelData, setHotelData] = useState<any>(null);
  
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingHotel, setLoadingHotel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === "hotel_admin" && user.hotelId) {
          setIsAuthorized(true);
          setHotelId(user.hotelId);
          setHotelName(user.name?.replace(" Admin", "") || "Hotel");
        } else if (user.role === "admin") {
            router.push("/admin");
        } else {
          router.push("/login");
        }
      } catch (e) {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (isAuthorized && hotelId) {
      if (activeTab === 'dashboard') {
        fetchStats();
      } else if (activeTab === 'bookings') {
        fetchBookings();
      } else if (activeTab === 'inventory') {
        fetchHotelData();
      }
    }
  }, [isAuthorized, hotelId, activeTab]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch(`/api/hotel-admin/stats?hotelId=${hotelId}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch stats failed with status ${res.status}: ${text.substring(0, 100)}`);
      }
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setHotelName(data.stats.hotelName);
      }
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await fetch(`/api/hotel-admin/bookings?hotelId=${hotelId}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch bookings failed with status ${res.status}: ${text.substring(0, 100)}`);
      }
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error("Failed to fetch bookings:", e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchHotelData = async () => {
    try {
      setLoadingHotel(true);
      const res = await fetch(`/api/hotel-admin/hotels/${hotelId}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch hotel data failed with status ${res.status}: ${text.substring(0, 100)}`);
      }
      const data = await res.json();
      if (data.success) {
        setHotelData(data.hotel);
      }
    } catch (e) {
      console.error("Failed to fetch hotel data:", e);
    } finally {
      setLoadingHotel(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch('/api/hotel-admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update booking status failed with status ${res.status}: ${text.substring(0, 100)}`);
      }
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, reservationStatus: status } : b));
      }
    } catch (e) {
      console.error("Failed to update booking:", e);
    }
  };

  const handleAddRoom = () => {
    if (!hotelData) return;
    const newRooms = [...hotelData.rooms, { type: "Standard Room", price: "2500", count: 1 }];
    setHotelData({ ...hotelData, rooms: newRooms });
  };

  const handleUpdateRoom = (index: number, field: string, value: any) => {
    if (!hotelData) return;
    const newRooms = [...hotelData.rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setHotelData({ ...hotelData, rooms: newRooms });
  };

  const handleRemoveRoom = (index: number) => {
    if (!hotelData) return;
    const newRooms = hotelData.rooms.filter((_: any, i: number) => i !== index);
    setHotelData({ ...hotelData, rooms: newRooms });
  };

  const handleUpdateRoomImage = (index: number, file: File) => {
    if (!hotelData) return;
    const newRooms = [...hotelData.rooms];
    newRooms[index] = { ...newRooms[index], roomImageFile: file };
    setHotelData({ ...hotelData, rooms: newRooms });
  };

  const handleSaveInventory = async () => {
    try {
      setIsSaving(true);
      
      const submitData = new FormData();
      // Remove File objects before stringifying JSON
      const roomsForJson = hotelData.rooms.map(({ roomImageFile, ...rest }: any) => rest);
      submitData.append('rooms', JSON.stringify(roomsForJson));

      // Append files
      hotelData.rooms.forEach((room: any, idx: number) => {
        if (room.roomImageFile) {
          submitData.append(`roomImage_${idx}`, room.roomImageFile);
        }
      });

      const res = await fetch(`/api/hotel-admin/hotels/${hotelId}`, {
        method: 'PUT',
        body: submitData
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save inventory failed with status ${res.status}: ${text.substring(0, 100)}`);
      }
      const data = await res.json();
      if (data.success) {
        alert("Inventory updated successfully!");
      }
    } catch (e) {
      console.error("Failed to save inventory:", e);
      alert("Error saving inventory.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="text-white font-black tracking-widest text-xl animate-pulse flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
            VERIFYING HOTEL ADMIN...
        </div>
      </div>
    );
  }

  const PMSBadge = ({ label, count, color, icon }: { label: string, count: number, color: string, icon: any }) => (
    <div className="flex flex-col items-center min-w-[70px] px-3 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-default">
      <div className="flex items-center gap-1.5 mb-0.5">
        <div className={cn("w-2 h-2 rounded-full", color || "bg-slate-400")} />
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-sm font-black">{count || 0}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* PROFESSIONAL PMS NAVBAR */}
      <nav className="bg-indigo-900 text-white shadow-xl z-[70] sticky top-0 border-b border-indigo-800">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo/Hotel Info */}
            <div className="flex items-center gap-3">
              <div className="bg-amber-400 p-2 rounded-xl text-indigo-900 shadow-lg shadow-amber-400/20">
                <Building2 className="w-5 h-5 font-black" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-black tracking-tighter uppercase leading-none">
                  {hotelName || "PMS Portal"}
                </h1>
                <p className="text-[9px] font-black tracking-[.2em] text-amber-400 uppercase opacity-80 mt-1">Property Management</p>
              </div>
            </div>

            {/* Date Display */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-indigo-950/50 rounded-xl border border-indigo-700/50">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold tracking-tight text-indigo-100">{formattedDate}</span>
            </div>
          </div>

          {/* PMS Indicators */}
          <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar py-2">
            <div className="h-8 w-[1px] bg-indigo-800 mx-2 hidden sm:block" />
            <PMSBadge label="Vacant" count={stats?.pms?.vacant} color="bg-emerald-400" icon={<Bed className="w-3.5 h-3.5 text-emerald-400" />} />
            <PMSBadge label="Occupied" count={stats?.pms?.occupied} color="bg-rose-400" icon={<Users className="w-3.5 h-3.5 text-rose-400" />} />
            <PMSBadge label="Reserve" count={stats?.pms?.reserve} color="bg-amber-400" icon={<Calendar className="w-3.5 h-3.5 text-amber-400" />} />
            <PMSBadge label="Blocked" count={stats?.pms?.blocked} color="bg-slate-400" icon={<AlertCircle className="w-3.5 h-3.5 text-slate-400" />} />
            <PMSBadge label="Due Out" count={stats?.pms?.dueOut} color="bg-purple-400" icon={<LogOut className="w-3.5 h-3.5 text-purple-400" />} />
            <PMSBadge label="Dirty" count={stats?.pms?.dirty} color="bg-orange-400" icon={<Trash2 className="w-3.5 h-3.5 text-orange-400" />} />
          </div>

          {/* Mobile Menu Toggle (Replaces the old mobile header) */}
          <div className="lg:hidden ml-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-indigo-800 rounded-xl hover:bg-amber-400 hover:text-indigo-900 transition-all border border-indigo-700"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 flex-row">
        {/* Sidebar */}
        <aside className={cn(
          "bg-slate-900 text-white w-72 h-[calc(100vh-64px)] fixed lg:sticky top-16 z-[60] transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto shadow-2xl border-r border-slate-800 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-8 border-b border-slate-800 hidden lg:block bg-indigo-950/20">
            <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">Logged in as</p>
            <h2 className="text-xl font-black tracking-tight text-white mt-1">Admin Panel</h2>
            <p className="text-[10px] text-amber-400/70 mt-1 font-bold truncate">{hotelName}</p>
          </div>
        
        <div className="p-4 space-y-1 flex-1 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-3">Operations</p>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'bookings', label: 'Manage Bookings', icon: Calendar },
            { id: 'inventory', label: 'Room Inventory', icon: BedDouble },
            { id: 'stayview', label: 'Stayview', icon: LayoutGrid },
            { id: 'roomview', label: 'Room View', icon: DoorOpen },
            { id: 'reservation', label: 'Reservation', icon: CalendarCheck },
            { 
              id: 'rates', 
              label: 'Rates & Availability', 
              icon: Tags,
              subItems: [
                { id: 'ratewizard', label: 'Rate Wizard', icon: Wand2 },
                { id: 'packages', label: 'Packages & Promotions', icon: Gift }
              ]
            },
            { 
              id: 'distribution', 
              label: 'Distribution', 
              icon: Globe,
              subItems: [
                { id: 'stopsell', label: 'Auto Stopsell', icon: Slash },
                { id: 'channellogs', label: 'Channel Logs', icon: FileSearch }
              ]
            },
            { 
              id: 'guest', 
              label: 'Guest', 
              icon: UserCheck,
              subItems: [
                { id: 'guestdb', label: 'Guest Database', icon: Contact },
                { id: 'unsettled', label: 'UnSettled Folios', icon: CreditCard },
                { id: 'lostfound', label: 'Lost & Found', icon: Backpack }
              ]
            },
            { 
              id: 'cashiering', 
              label: 'Cashiering', 
              icon: Wallet,
              subItems: [
                { id: 'travelagent', label: 'Travel Agent Database', icon: Briefcase },
                { id: 'businesssource', label: 'Business Source', icon: Compass },
                { id: 'salesperson', label: 'Sales Person Database', icon: UserPlus },
                { id: 'companydb', label: 'Company Database', icon: Building },
                { id: 'expensevoucher', label: 'Expense Voucher', icon: Receipt },
                { id: 'pos', label: 'POS', icon: Monitor }
              ]
            },
            { 
              id: 'housekeeping', 
              label: 'Housekeeping', 
              icon: Sparkles,
              subItems: [
                { id: 'housestatus', label: 'House Status', icon: CheckSquare },
                { id: 'maintenanceblock', label: 'Maintenance Block', icon: Hammer },
                { id: 'workorder', label: 'Work Order / Task', icon: ListTodo }
              ]
            },
            { 
              id: 'nightaudit', 
              label: 'Night Audit', 
              icon: Moon,
              subItems: [
                { id: 'nightaudit_main', label: 'Night Audit', icon: Moon },
                { id: 'nightauditlog', label: 'Night Audit Log', icon: History },
                { id: 'inserttransaction', label: 'Insert Transaction', icon: Plus }
              ]
            },
            { id: 'b2b', label: 'B2B Market Place', icon: ShoppingBag },
            { id: 'netlocks', label: 'Net Locks', icon: Key },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'exported', label: 'Exported Reports', icon: FileDown },
          ].map((tab: any) => (
            <div key={tab.id}>
              {tab.subItems ? (
                <div>
                  <button 
                    onClick={() => {
                      setExpandedMenus(prev => 
                        prev.includes(tab.id) ? prev.filter(i => i !== tab.id) : [...prev, tab.id]
                      );
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all group",
                      activeTab.startsWith(tab.id) || expandedMenus.includes(tab.id)
                        ? "text-white" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <tab.icon className={cn("w-5 h-5", (activeTab.startsWith(tab.id) || expandedMenus.includes(tab.id)) ? "text-amber-400" : "text-slate-500")} />
                      <span className="font-bold tracking-tight text-sm">{tab.label}</span>
                    </div>
                    {expandedMenus.includes(tab.id) ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  </button>
                  
                  {expandedMenus.includes(tab.id) && (
                    <div className="mt-1 ml-4 border-l border-slate-800 space-y-1 animate-in slide-in-from-top-2">
                       {tab.subItems.map((sub: any) => (
                         <button 
                           key={sub.id}
                           onClick={() => {
                             setActiveTab(sub.id);
                             setIsSidebarOpen(false);
                           }}
                           className={cn(
                             "w-full flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all text-xs font-bold",
                             activeTab === sub.id 
                               ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                               : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                           )}
                         >
                           <sub.icon className={cn("w-3.5 h-3.5", activeTab === sub.id ? "text-amber-400" : "text-slate-600")} />
                           {sub.label}
                         </button>
                       ))}
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group",
                    activeTab === tab.id 
                      ? "bg-amber-500 text-white font-black shadow-lg shadow-amber-500/20 scale-[1.02]" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <tab.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-white" : "text-slate-500")} />
                  <span className="tracking-tight text-sm font-bold">{tab.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 mt-auto border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all mb-2">
            <Settings className="w-5 h-5 text-slate-500" /> <span className="font-bold tracking-tight">Hotel Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" /> <span className="font-bold tracking-tight text-sm">Logout Panel</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Backdrop Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 w-full min-h-screen p-6 md:p-8 lg:p-12 overflow-x-hidden">
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-900">Hospitality Overview</h1>
              <p className="text-slate-500 mt-2 font-medium">Performance summary for <span className="text-amber-600 font-bold">{hotelName}</span>.</p>
            </header>

            {loadingStats ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-amber-500 w-10 h-10" /></div>
            ) : stats && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Bookings</p>
                            <p className="text-2xl font-black text-slate-900">{stats.totalBookings}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <IndianRupee className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
                            <p className="text-2xl font-black text-slate-900">₹{stats.totalRevenue?.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Clock className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending</p>
                            <p className="text-2xl font-black text-slate-900">{stats.pendingBookings}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirmed</p>
                            <p className="text-2xl font-black text-slate-900">{stats.confirmedBookings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-2">Welcome Back, Partner!</h3>
                        <p className="text-amber-50 max-w-xl">Your property is currently live and receiving bookings. Use the management tools to update room availability or confirm pending check-ins.</p>
                    </div>
                    <Building2 className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 -rotate-12" />
                </div>
                </>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Manage Bookings</h1>
                <p className="text-slate-500 mt-2 font-medium">Review and update guest reservations.</p>
              </div>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Booking ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Guest Info</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dates / Room</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loadingBookings ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500"><Loader2 className="animate-spin w-6 h-6 inline-block mr-2"/>Loading bookings...</td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No bookings yet for your property.</td></tr>
                            ) : (
                                bookings.map((b) => (
                                    <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 uppercase">{b.bookingId || b._id.substring(b._id.length - 8)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{b.userName}</p>
                                            <p className="text-[10px] font-medium text-slate-500">{b.userEmail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-slate-800">{new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-slate-500 mt-1">{b.roomType} × {b.roomsCount || 1}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border",
                                                b.reservationStatus === 'Confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                b.reservationStatus === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                "bg-red-50 text-red-600 border-red-100"
                                            )}>
                                                {b.reservationStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {b.reservationStatus === 'Pending' && (
                                                    <button 
                                                        onClick={() => handleUpdateBookingStatus(b._id, 'Confirmed')}
                                                        className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                                                        title="Confirm Booking"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleUpdateBookingStatus(b._id, 'Cancelled')}
                                                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-100"
                                                    title="Cancel Booking"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Room Inventory</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage pricing and availability for your property rooms.</p>
              </div>
              <button 
                onClick={handleSaveInventory}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-xl shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </header>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-800">Available Room Types</h3>
                    <button 
                        onClick={handleAddRoom}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 font-bold rounded-xl hover:bg-amber-100 transition-colors text-sm"
                    >
                        <PlusCircle className="w-4 h-4" /> Add Room Type
                    </button>
                </div>

                {loadingHotel ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-500 w-10 h-10" /></div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {hotelData?.rooms?.map((room: any, idx: number) => (
                            <div key={idx} className="flex flex-col lg:flex-row gap-6 items-end lg:items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-amber-200 transition-colors group relative">
                                <div className="flex-1 w-full space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Category</label>
                                    <div className="relative">
                                        <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input 
                                            type="text"
                                            value={room.type}
                                            onChange={(e) => handleUpdateRoom(idx, 'type', e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-48 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-emerald-600">Price (INR)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4" />
                                        <input 
                                            type="number"
                                            value={room.price}
                                            onChange={(e) => handleUpdateRoom(idx, 'price', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-black text-slate-800"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-40 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-blue-600">Quantity</label>
                                    <input 
                                        type="number"
                                        value={room.count}
                                        onChange={(e) => handleUpdateRoom(idx, 'count', Number(e.target.value))}
                                        className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div className="w-full lg:w-48 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-600">Room Photo</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                                            {room.roomImageFile ? (
                                                <img src={URL.createObjectURL(room.roomImageFile)} className="w-full h-full object-cover" />
                                            ) : room.image ? (
                                                <img src={room.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <BedDouble className="w-5 h-5 text-slate-300 m-auto mt-3.5" />
                                            )}
                                        </div>
                                        <label className="flex-1 cursor-pointer">
                                            <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-amber-50 hover:border-amber-400 transition-all text-center">
                                                {room.image || room.roomImageFile ? 'Change' : 'Upload'}
                                            </div>
                                            <input 
                                                type="file" accept="image/*" className="hidden" 
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) handleUpdateRoomImage(idx, e.target.files[0]);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleRemoveRoom(idx)}
                                    className="p-3.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        {hotelData?.rooms?.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl">
                                <BedDouble className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No room types listed for this property yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
        )}

        {['stayview', 'roomview', 'reservation', 'rates', 'distribution', 'guest', 'cashiering', 'housekeeping', 'nightaudit', 'b2b', 'netlocks', 'reports', 'exported', 
          'ratewizard', 'packages', 'stopsell', 'channellogs', 'guestdb', 'unsettled', 'lostfound', 'travelagent', 'businesssource', 'salesperson', 'companydb', 'expensevoucher', 'pos', 'housestatus', 'maintenanceblock', 'workorder', 'nightaudit_main', 'nightauditlog', 'inserttransaction'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 animate-in fade-in zoom-in-95">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-xl">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">Module Initialization</h2>
              <p className="mt-3 text-slate-500 font-medium text-center max-w-sm px-4">
                The <span className="text-amber-600 font-bold uppercase">{activeTab.replace('_main', '').replace(/([A-Z])/g, ' $1').trim()}</span> dashboard is currently being synchronized with your property data.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <div className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">Priority Feature</div>
                <div className="px-4 py-2 bg-indigo-50 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-500 underline cursor-pointer">View Roadmap</div>
              </div>
          </div>
        )}
      </main>
    </div>
  </div>
  );
}
