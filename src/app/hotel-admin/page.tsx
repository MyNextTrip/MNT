"use client";

import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, MapPin, IndianRupee, 
  LayoutDashboard, Calendar, BedDouble, 
  Settings, LogOut, Trash2, Pencil,
  ChevronDown, ChevronUp, Wifi, Coffee, 
  Clock, CheckCircle2, AlertCircle, Menu, X, 
  PlusCircle, Save, Loader2, User, Users, Bed,
  LayoutGrid, DoorOpen, CalendarCheck, Tags, Globe, UserCheck, Wallet, Sparkles, Moon, ShoppingBag, Key, BarChart3, FileDown,
  ChevronRight, Wand2, Gift, Slash, FileSearch, Contact, CreditCard, Backpack, Briefcase, Compass, UserPlus, Building, Receipt, Monitor, CheckSquare, Hammer, ListTodo, History, Plus,
  MoveHorizontal, Replace, ArrowLeftRight, Ban, LayoutList, Printer, Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const [virtualRooms, setVirtualRooms] = useState<any[]>([]);
  const [roomAssignments, setRoomAssignments] = useState<Record<string, string>>({}); // bookingId -> roomId
  const [checkInForm, setCheckInForm] = useState<{ bookingId: string, roomNumber: string, paymentMethod: string } | null>(null);
  const [resFilter, setResFilter] = useState('All');
  const [resSearch, setResSearch] = useState('');
  const [newResForm, setNewResForm] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkInTime: "12:00",
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    checkOutTime: "11:00",
    roomCount: 1,
    resType: "Confirm Booking",
    bookingSource: "Direct",
    businessSource: "Walk In",
    companyName: "",
    guestName: "",
    mobile: "",
    email: "",
    roomType: "Standard Room",
    roomCharges: "0",
    taxes: "0",
    selectedRooms: {} as Record<string, number>,
    rooms: [{ type: "", rate: 0 }]
  });
  const [editingBooking, setEditingBooking] = useState<any>(null);

  
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
      } else if (activeTab === 'inventory' || activeTab === 'new-reservation') {
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
  
  useEffect(() => {
    if (hotelData?.rooms) {
      const initialRooms: Record<string, number> = {};
      hotelData.rooms.forEach((r: any) => {
        initialRooms[r.type] = 0;
      });
      setNewResForm(prev => ({
        ...prev,
        selectedRooms: initialRooms
      }));
    }
  }, [hotelData]);

  useEffect(() => {
    if (hotelData?.rooms) {
      const rooms: any[] = [];
      let globalRoomCounter = 100;

      hotelData.rooms.forEach((type: any, typeIdx: number) => {
        const assignedNumbers = type.roomNumbers 
          ? type.roomNumbers.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "")
          : [];

        const count = assignedNumbers.length > 0 ? assignedNumbers.length : (type.count || 0);

        for (let i = 1; i <= count; i++) {
          const roomNumber = assignedNumbers.length > 0 
            ? assignedNumbers[i-1] 
            : (globalRoomCounter++).toString();

          rooms.push({
            id: `${type.type}-${i}-${roomNumber}`,
            roomType: type.type,
            roomNumber,
            price: type.price
          });
        }
      });
      setVirtualRooms(rooms);
    }
  }, [hotelData]);

  useEffect(() => {
    if (virtualRooms.length > 0 && bookings.length > 0) {
      const assignments: Record<string, string> = {};
      const sortedBookings = [...bookings].sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());
      
      const roomSchedule: Record<string, Array<{ start: number, end: number }>> = {};
      virtualRooms.forEach(r => roomSchedule[r.id] = []);

      sortedBookings.forEach(booking => {
        const start = new Date(booking.checkInDate).getTime();
        const end = new Date(booking.checkOutDate).getTime();
        
        // Find first available room of the correct type
        const availableRoom = virtualRooms.find(r => {
          if (r.roomType !== booking.roomType) return false;
          return !roomSchedule[r.id].some(s => (start < s.end && end > s.start));
        });

        if (availableRoom) {
          assignments[booking._id] = availableRoom.id;
          roomSchedule[availableRoom.id].push({ start, end });
        }
      });
      setRoomAssignments(assignments);
    }
  }, [virtualRooms, bookings]);


  const handleUpdateBookingStatus = async (bookingId: string, status: string, additionalData: any = {}) => {
    try {
      const res = await fetch('/api/hotel-admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status, ...additionalData })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Update booking status failed with status ${res.status}: ${text.substring(0, 100)}`);
      }
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { 
          ...b, 
          reservationStatus: status,
          ...additionalData,
          paymentStatus: (status === 'Checked-In' && additionalData.paymentMethod) ? 'Paid' : b.paymentStatus
        } : b));
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
    let newValue = value;
    
    // Sync count if roomNumbers is updated
    if (field === 'roomNumbers') {
      const numbers = value.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "");
      if (numbers.length > 0) {
        newRooms[index] = { ...newRooms[index], count: numbers.length };
      }
    }
    
    newRooms[index] = { ...newRooms[index], [field]: newValue };
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
  const generateReservationPDF = (booking: any) => {
    const doc = new jsPDF();
    
    // Header - Modern Design
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("MyNextTrip", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("CONFIRMATION VOUCHER", 150, 25);
    
    // Property Details
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(hotelName || "Your Property", 20, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Property Reservation ID: " + booking.bookingId, 20, 62);
    
    // Guest Information Box
    doc.setDrawColor(241, 245, 249);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, 75, 170, 45, 3, 3, 'FD');
    
    doc.setFont("helvetica", "bold");
    doc.text("GUEST INFORMATION", 25, 85);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${booking.guestName}`, 25, 95);
    doc.text(`Phone: ${booking.guestPhone || 'N/A'}`, 25, 102);
    doc.text(`Email: ${booking.userEmail || 'N/A'}`, 25, 109);
    
    doc.setFont("helvetica", "bold");
    doc.text("STAY DETAILS", 110, 85);
    doc.setFont("helvetica", "normal");
    doc.text(`Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}`, 110, 95);
    doc.text(`Check-out: ${new Date(booking.checkOutDate).toLocaleDateString()}`, 110, 102);
    doc.text(`Room: ${booking.roomType} (x${booking.roomsCount})`, 110, 109);
    
    // Financial Summary Table
    (doc as any).autoTable({
      startY: 130,
      head: [['Description', 'Amount']],
      body: [
        ['Room Charges', `INR ${booking.totalAmount - (booking.totalAmount * 0.12)}`],
        ['Taxes (GST)', `INR ${(booking.totalAmount * 0.12).toFixed(2)}`],
        [{ content: 'Total Paid Amount', styles: { fontStyle: 'bold' } }, { content: `INR ${booking.totalAmount}`, styles: { fontStyle: 'bold' } }]
      ],
      headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      theme: 'grid',
      margin: { left: 20, right: 20 }
    });
    
    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Thank you for choosing MyNextTrip. Please present this voucher at the time of check-in.", 20, finalY);
    doc.text("For support, contact property admin or visit mynexttrip.in", 20, finalY + 5);
    
    doc.save(`Reservation_${booking.bookingId}.pdf`);
  };

  const handleConfirmReservation = async () => {
    try {
      if (!hotelId || !hotelName) {
        alert("Hotel information is missing. Please refresh and try again.");
        return;
      }

      // Process selected rooms
      const selectedEntries = Object.entries(newResForm.selectedRooms || {}).filter(([_, count]) => count > 0);
      if (selectedEntries.length === 0) {
        alert("Please select at least one room.");
        return;
      }

      const roomTypeStr = selectedEntries.map(([type, count]) => `${type} (x${count})`).join(", ");
      const totalRoomsCount = selectedEntries.reduce((sum, [_, count]) => sum + count, 0);

      setIsSaving(true);
      const totalAmount = Number(newResForm.roomCharges) + Number(newResForm.taxes);
      
      const payload = {
        hotelId,
        hotelName,
        guestName: newResForm.guestName,
        guestPhone: newResForm.mobile,
        userEmail: newResForm.email,
        checkInDate: newResForm.checkIn,
        checkOutDate: newResForm.checkOut,
        roomType: roomTypeStr,
        roomsCount: totalRoomsCount,
        totalAmount,
        paymentStatus: 'Paid',
        reservationStatus: newResForm.resType,
        bookingSource: newResForm.bookingSource,
        businessSource: newResForm.businessSource,
        companyName: newResForm.companyName
      };

      const res = await fetch('/api/hotel-admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || errorData.error || "Failed to save reservation");
      }

      const data = await res.json();
      if (data.success) {
        // Update local state
        setBookings(prev => [data.booking, ...prev]);
        
        // Generate PDF
        generateReservationPDF(data.booking);
        
        // Reset form and go back
        setActiveTab('reservation');
        alert("Reservation confirmed and receipt generated!");
      }
    } catch (e) {
      console.error("Error saving reservation:", e);
      alert("Failed to confirm reservation.");
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
            <button 
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
              aria-label="Back to Dashboard"
            >
              <div className="bg-amber-400 p-2 rounded-xl text-indigo-900 shadow-lg shadow-amber-400/20">
                <Building2 className="w-5 h-5 font-black" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-black tracking-tighter uppercase leading-none">
                  {hotelName || "PMS Portal"}
                </h1>
                <p className="text-[9px] font-black tracking-[.2em] text-amber-400 uppercase opacity-80 mt-1">Property Management</p>
              </div>
            </button>

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
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment</th>
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
                                            <div className="flex flex-col gap-1.5">
                                                <span className={cn(
                                                    "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border w-fit",
                                                    b.paymentType === 'Prepaid' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    b.paymentType === 'Partial' ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                    "bg-indigo-50 text-indigo-600 border-indigo-100"
                                                )}>
                                                    {b.paymentType || 'PayAtHotel'}
                                                </span>
                                                <div className="flex flex-col gap-0.5 mt-0.5">
                                                    {(b.paymentType === 'PayAtHotel' || !b.paymentType) && b.reservationStatus !== 'Checked-In' && (
                                                        <span className="text-[10px] font-bold text-indigo-600">Due: ₹{b.totalAmount?.toLocaleString()}</span>
                                                    )}
                                                    {b.paymentType === 'Partial' && (
                                                        <>
                                                            <span className="text-[10px] font-bold text-emerald-600">Paid: ₹{b.paidAmount?.toLocaleString()}</span>
                                                            {b.reservationStatus !== 'Checked-In' && <span className="text-[10px] font-bold text-amber-600">Due: ₹{b.balanceAmount?.toLocaleString()}</span>}
                                                        </>
                                                    )}
                                                    {b.paymentType === 'Prepaid' && (
                                                        <span className="text-[10px] font-bold text-emerald-600">Paid: ₹{b.totalAmount?.toLocaleString()}</span>
                                                    )}
                                                    {b.paymentMethod && (
                                                        <span className="text-[9px] font-black text-emerald-600 uppercase mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">Recvd via: {b.paymentMethod}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border",
                                                b.reservationStatus === 'Confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                b.reservationStatus === 'Checked-In' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                                b.reservationStatus === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                "bg-red-50 text-red-600 border-red-100"
                                            )}>
                                                {b.reservationStatus}
                                            </span>
                                            {b.assignedRoomNumber && (
                                                <p className="text-[9px] font-bold text-indigo-500 mt-1 uppercase tracking-tighter">Room: {b.assignedRoomNumber}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                {checkInForm?.bookingId === b._id && (
                                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 min-w-[180px] animate-in zoom-in-95 duration-200">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase">Room Number</label>
                                                            <input 
                                                                type="text"
                                                                placeholder="e.g. 102, 203"
                                                                value={checkInForm?.roomNumber || ''}
                                                                onChange={(e) => setCheckInForm(prev => prev ? { ...prev, roomNumber: e.target.value } : null)}
                                                                className="w-full text-[10px] font-bold p-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase">Payment Method</label>
                                                            <select 
                                                                value={checkInForm?.paymentMethod || ''}
                                                                onChange={(e) => setCheckInForm(prev => prev ? { ...prev, paymentMethod: e.target.value } : null)}
                                                                className="w-full text-[10px] font-bold p-1.5 bg-white border border-slate-200 rounded-lg outline-none"
                                                            >
                                                                <option value="">Select Method</option>
                                                                <option value="Cash">Cash</option>
                                                                <option value="Partially">Partially</option>
                                                                <option value="Online">Online</option>
                                                                <option value="QR">QR Code</option>
                                                            </select>
                                                        </div>
                                                        {checkInForm?.paymentMethod === 'QR' && (
                                                            <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-indigo-100 mt-1 animate-in zoom-in-95">
                                                                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Scan to Pay</p>
                                                                <div className="w-28 h-28 bg-slate-50 rounded-lg flex items-center justify-center p-1 border border-slate-100">
                                                                    <img 
                                                                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MNT-Booking-Payment" 
                                                                        alt="Payment QR" 
                                                                        className="w-full h-full object-contain"
                                                                    />
                                                                </div>
                                                                <p className="text-[8px] font-bold text-slate-400">Merchant: MyNextTrip</p>
                                                            </div>
                                                        )}
                                                        <div className="flex gap-1.5 pt-1">
                                                            <button 
                                                                onClick={() => {
                                                                    if (!checkInForm?.roomNumber || !checkInForm?.paymentMethod) return alert("Please select both room and payment method");
                                                                    handleUpdateBookingStatus(b._id, 'Checked-In', { 
                                                                        assignedRoomNumber: checkInForm?.roomNumber || '', 
                                                                        paymentMethod: checkInForm?.paymentMethod || '' 
                                                                    });
                                                                    setCheckInForm(null);
                                                                }}
                                                                className="flex-1 bg-indigo-600 text-white text-[9px] font-black py-1.5 rounded-lg hover:bg-indigo-700 uppercase"
                                                            >
                                                                Done
                                                            </button>
                                                            <button onClick={() => setCheckInForm(null)} className="flex-1 bg-slate-200 text-slate-600 text-[9px] font-black py-1.5 rounded-lg hover:bg-slate-300 uppercase">Cancel</button>
                                                        </div>
                                                    </div>
                                                )}
                                                {checkInForm?.bookingId !== b._id && (
                                                    <div className="flex gap-2">
                                                        {(b.reservationStatus === 'Confirmed' || b.reservationStatus === 'Checked-In') && (
                                                            <button 
                                                                onClick={() => {
                                                                    if (b.reservationStatus === 'Checked-In') {
                                                                        if (window.confirm("Are you want to update checkIn?")) {
                                                                            setCheckInForm({ 
                                                                                bookingId: b._id, 
                                                                                roomNumber: b.assignedRoomNumber || '', 
                                                                                paymentMethod: b.paymentMethod || '' 
                                                                            });
                                                                        }
                                                                    } else {
                                                                        setCheckInForm({ bookingId: b._id, roomNumber: '', paymentMethod: '' });
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "px-3 py-1.5 text-[10px] font-black rounded-lg transition-colors shadow-sm uppercase tracking-wider",
                                                                    b.reservationStatus === 'Checked-In' 
                                                                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                                                                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                                )}
                                                            >
                                                                {b.reservationStatus === 'Checked-In' ? 'Update' : 'Check-In'}
                                                            </button>
                                                        )}
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
                                                )}
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
                            <div key={idx} className="flex flex-col lg:flex-row gap-4 items-end lg:items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-amber-200 transition-colors group relative">
                                <div className="flex-1 w-full space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Category</label>
                                    <div className="relative">
                                        <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input 
                                            type="text"
                                            value={room.type}
                                            onChange={(e) => handleUpdateRoom(idx, 'type', e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold text-slate-700"
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
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-black text-slate-800"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-64 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-600">Assign Room Numbers</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 w-4 h-4" />
                                        <input 
                                            type="text"
                                            placeholder="e.g. 101, 102, 105"
                                            value={room.roomNumbers || ''}
                                            onChange={(e) => handleUpdateRoom(idx, 'roomNumbers', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-24 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-blue-600">Qty</label>
                                    <input 
                                        type="number"
                                        value={room.count}
                                        onChange={(e) => handleUpdateRoom(idx, 'count', Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
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

        {activeTab === 'stayview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-slate-900">Stayview</h1>
              <p className="text-slate-500 mt-2 font-medium">Real-time room occupancy timeline.</p>
            </header>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto p-4">
                <div className="min-w-[1200px]">
                  {/* Timeline Header */}
                  <div className="flex border-b border-slate-100">
                    <div className="w-48 p-4 shrink-0 font-black text-xs uppercase tracking-widest text-slate-400 border-r border-slate-100 bg-slate-50/50">
                      Room Details
                    </div>
                    <div className="flex-1 flex">
                      {Array.from({ length: 14 }).map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() + i - 2);
                        const isToday = d.toDateString() === new Date().toDateString();
                        return (
                          <div key={i} className={cn(
                            "flex-1 p-3 text-center border-r border-slate-50 min-w-[80px]",
                            isToday && "bg-amber-50"
                          )}>
                            <p className="text-[10px] font-black text-slate-400 uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p className={cn("text-sm font-black mt-1", isToday ? "text-amber-600" : "text-slate-700")}>{d.getDate()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline Body */}
                  <div className="divide-y divide-slate-50">
                    {virtualRooms.map(room => (
                      <div key={room.id} className="flex group hover:bg-slate-50/30 transition-colors">
                        <div className="w-48 p-4 shrink-0 border-r border-slate-100 flex flex-col justify-center">
                          <p className="font-black text-slate-900 text-sm">Room {room.roomNumber}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{room.roomType}</p>
                        </div>
                        <div className="flex-1 flex relative h-16">
                          {/* Grid Lines */}
                          {Array.from({ length: 14 }).map((_, i) => (
                            <div key={i} className="flex-1 border-r border-slate-50/50" />
                          ))}
                          
                          {/* Booking Bars */}
                          {bookings
                            .filter(b => roomAssignments[b._id] === room.id && b.reservationStatus !== 'Cancelled')
                            .map(booking => {
                              const checkIn = new Date(booking.checkInDate);
                              const checkOut = new Date(booking.checkOutDate);
                              const today = new Date();
                              today.setDate(today.getDate() - 2); // Start timeline 2 days ago
                              
                              const startOffset = Math.max(0, (checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                              const duration = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
                              
                              if (startOffset > 14 || startOffset + duration < 0) return null;

                              const left = `${(startOffset / 14) * 100}%`;
                              const width = `${(duration / 14) * 100}%`;

                              return (
                                <div 
                                  key={booking._id}
                                  style={{ left, width }}
                                  className={cn(
                                    "absolute top-1/2 -translate-y-1/2 h-10 rounded-xl px-3 flex items-center shadow-lg border-2 z-10 cursor-pointer hover:scale-[1.02] transition-transform overflow-hidden",
                                    booking.reservationStatus === 'Confirmed' ? "bg-indigo-600 border-indigo-400 text-white" : "bg-amber-500 border-amber-300 text-white"
                                  )}
                                >
                                  <p className="text-[10px] font-black uppercase tracking-tighter truncate">
                                    {booking.guestName || booking.userName}
                                  </p>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roomview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Room Status Grid</h1>
                <p className="text-slate-500 mt-2 font-medium">Real-time status of all property rooms.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Vacant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Reserved</span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {virtualRooms.map(room => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const currentBooking = bookings.find(b => {
                  if (b.reservationStatus === 'Cancelled') return false;
                  
                  // Check if this room is explicitly assigned to this booking
                  if (b.assignedRoomNumber) {
                    const assignedNumbers = b.assignedRoomNumber.split(',').map((s: string) => s.trim());
                    if (assignedNumbers.includes(room.roomNumber)) {
                      const ci = new Date(b.checkInDate); ci.setHours(0,0,0,0);
                      const co = new Date(b.checkOutDate); co.setHours(0,0,0,0);
                      return today >= ci && today < co;
                    }
                    return false;
                  }

                  // Fallback to automatic room assignment logic
                  if (roomAssignments[b._id] !== room.id) return false;
                  const ci = new Date(b.checkInDate); ci.setHours(0,0,0,0);
                  const co = new Date(b.checkOutDate); co.setHours(0,0,0,0);
                  return today >= ci && today < co;
                });

                const upcomingBooking = !currentBooking && bookings.find(b => {
                  if (b.reservationStatus === 'Cancelled') return false;

                  // Check if this room is explicitly assigned to this booking
                  if (b.assignedRoomNumber) {
                    const assignedNumbers = b.assignedRoomNumber.split(',').map((s: string) => s.trim());
                    if (assignedNumbers.includes(room.roomNumber)) {
                      const ci = new Date(b.checkInDate); ci.setHours(0,0,0,0);
                      return ci.getTime() === today.getTime();
                    }
                    return false;
                  }

                  // Fallback to automatic room assignment logic
                  if (roomAssignments[b._id] !== room.id) return false;
                  const ci = new Date(b.checkInDate); ci.setHours(0,0,0,0);
                  return ci.getTime() === today.getTime();
                });

                const status = currentBooking ? 'Occupied' : upcomingBooking ? 'Reserved' : 'Vacant';
                
                return (
                  <div 
                    key={room.id}
                    className={cn(
                      "bg-white rounded-3xl p-5 shadow-sm border-2 transition-all hover:shadow-md cursor-pointer relative overflow-hidden group",
                      status === 'Occupied' ? "border-rose-100 hover:border-rose-300" :
                      status === 'Reserved' ? "border-amber-100 hover:border-amber-300" :
                      "border-emerald-100 hover:border-emerald-300"
                    )}
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center",
                          status === 'Occupied' ? "bg-rose-50 text-rose-500" :
                          status === 'Reserved' ? "bg-amber-50 text-amber-500" :
                          "bg-emerald-50 text-emerald-500"
                        )}>
                          <BedDouble className="w-5 h-5" />
                        </div>
                        <span className={cn(
                          "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                          status === 'Occupied' ? "bg-rose-100 text-rose-600" :
                          status === 'Reserved' ? "bg-amber-100 text-amber-600" :
                          "bg-emerald-100 text-emerald-600"
                        )}>
                          {status}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Room {room.roomNumber}</h3>
                      <p className="text-[10px] font-bold text-slate-400 capitalize truncate mt-1">{room.roomType}</p>
                      
                      {currentBooking && (
                        <div className="mt-4 pt-4 border-t border-slate-50">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Guest</p>
                          <p className="text-xs font-bold text-slate-800 truncate">{currentBooking.guestName || currentBooking.userName}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Background Icon */}
                    <DoorOpen className={cn(
                      "absolute -right-4 -bottom-4 w-20 h-20 opacity-[0.03] transition-transform group-hover:scale-110",
                      status === 'Occupied' ? "text-rose-900" : "text-emerald-900"
                    )} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'reservation' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Reservation Desk</h1>
                <p className="text-slate-500 mt-2 font-medium">Detailed log of all guest bookings and financial status.</p>
              </div>
              <button 
                onClick={() => setActiveTab('new-reservation')}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-black rounded-xl shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all"
              >
                <PlusCircle className="w-5 h-5" /> New Reservation
              </button>
            </header>

            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  {['All', 'Confirmed', 'Checked-In', 'Pending', 'Cancelled'].map(filter => (
                    <button 
                      key={filter} 
                      onClick={() => setResFilter(filter)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        filter === resFilter ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-white hover:shadow-sm"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="relative w-full lg:w-72">
                  <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search guests, IDs..." 
                    value={resSearch}
                    onChange={(e) => setResSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-bold"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Guest Detail</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stay Duration</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Room / Type</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {bookings
                      .filter(b => {
                        const matchesFilter = resFilter === 'All' || b.reservationStatus === resFilter;
                        const searchStr = resSearch.toLowerCase();
                        const matchesSearch = 
                          (b.bookingId || '').toLowerCase().includes(searchStr) || 
                          (b.guestName || b.userName || '').toLowerCase().includes(searchStr) ||
                          (b.roomType || '').toLowerCase().includes(searchStr);
                        return matchesFilter && matchesSearch;
                      })
                      .map(b => (
                        <Fragment key={b._id}>
                          <tr className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                                  {(b.guestName || b.userName || '?').charAt(0)}
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 text-sm leading-none">{b.guestName || b.userName}</p>
                                  <p className="text-[10px] font-bold text-slate-500 mt-1.5">{b.guestPhone || b.userEmail}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-xs font-black text-slate-700">{new Date(b.checkInDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} — {new Date(b.checkOutDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-wider">{b.numberOfNights} Nights</p>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded">
                                  {roomAssignments[b._id] ? `R${virtualRooms.find(r => r.id === roomAssignments[b._id])?.roomNumber}` : '—'}
                                </span>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase truncate max-w-[150px]">{b.roomType}</span>
                                  {b.bookingSource === 'Direct' && (
                                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest mt-1">Manual Entry</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-xs font-black text-slate-900">₹{b.totalAmount?.toLocaleString()}</p>
                              <p className={cn(
                                "text-[9px] font-black uppercase mt-1",
                                (b.paymentMethod || b.paymentStatus) === 'Paid' || b.paymentMethod ? "text-emerald-500" : "text-amber-500"
                              )}>{b.paymentMethod || b.paymentStatus}</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className={cn(
                                "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] border",
                                b.reservationStatus === 'Confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                b.reservationStatus === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                "bg-red-50 text-red-600 border-red-100"
                              )}>
                                {b.reservationStatus}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setEditingBooking(editingBooking?._id === b._id ? null : b)}
                                  className={cn(
                                    "p-2 rounded-lg transition-all border",
                                    editingBooking?._id === b._id ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-transparent"
                                  )}
                                >
                                  <ChevronRight className={cn("w-5 h-5 transition-transform", editingBooking?._id === b._id && "rotate-90")} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {editingBooking?._id === b._id && (
                            <tr className="bg-slate-50/50">
                              <td colSpan={6} className="px-8 py-6 border-b border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex flex-col gap-6">
                                  <div className="flex flex-wrap gap-3">
                                    {[
                                      { label: 'Add Payment', icon: <Wallet className="w-3.5 h-3.5" /> },
                                      { label: 'Amend Stay', icon: <CalendarCheck className="w-3.5 h-3.5" /> },
                                      { label: 'Add New Booking', icon: <PlusCircle className="w-3.5 h-3.5" /> },
                                      { label: 'Room Move', icon: <MoveHorizontal className="w-3.5 h-3.5" /> },
                                      { label: 'Exchange Room', icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
                                      { label: 'Stop Room Move', icon: <Ban className="w-3.5 h-3.5" /> },
                                      { label: 'Inclusion List', icon: <LayoutList className="w-3.5 h-3.5" /> }
                                    ].map((opt, i) => (
                                      <button key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-sm transition-all">
                                        {opt.icon} {opt.label}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-indigo-700 transition-all">
                                      <Printer className="w-3.5 h-3.5" /> Print
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all">
                                      <Send className="w-3.5 h-3.5" /> Send
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'new-reservation' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab('reservation')}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                >
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add Reservation</h1>
                  <p className="text-slate-500 font-medium text-sm">Create a new booking for your property</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveTab('reservation')}
                  className="rounded-xl font-bold h-11 px-6 border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button className="rounded-xl font-black h-11 px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all text-sm">
                  Confirm Booking
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column: Form */}
              <div className="xl:col-span-2 space-y-8">
                {/* Stay Details */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                   <div className="flex items-center gap-2 mb-8">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                         <Calendar className="w-4 h-4 text-indigo-600" />
                      </div>
                      <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Stay Information</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-in Date</label>
                        <input 
                          type="date" 
                          value={newResForm.checkIn}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setNewResForm({ ...newResForm, checkIn: e.target.value, checkOut: e.target.value > newResForm.checkOut ? e.target.value : newResForm.checkOut })}
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-in Time</label>
                        <input 
                          type="time" 
                          value={newResForm.checkInTime}
                          onChange={(e) => setNewResForm({ ...newResForm, checkInTime: e.target.value })}
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-out Date</label>
                        <input 
                          type="date" 
                          value={newResForm.checkOut}
                          min={newResForm.checkIn}
                          onChange={(e) => setNewResForm({ ...newResForm, checkOut: e.target.value })}
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-out Time</label>
                        <input 
                          type="time" 
                          value={newResForm.checkOutTime}
                          onChange={(e) => setNewResForm({ ...newResForm, checkOutTime: e.target.value })}
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700" 
                        />
                      </div>
                   </div>

                    <div className="mt-8 pt-8 border-t border-slate-50">
                       <div className="flex items-center justify-between mb-6">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Room Quantities</h4>
                          <div className="space-y-1 text-right">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Global Reservation Type</label>
                             <select 
                                value={newResForm.resType}
                                onChange={(e) => setNewResForm({ ...newResForm, resType: e.target.value })}
                                className="h-10 bg-slate-50 border border-slate-100 rounded-lg px-4 text-xs font-bold outline-none text-slate-700"
                             >
                                <option>Confirm Booking</option>
                                <option>Unfirm Booking Inquiry</option>
                                <option>Online failed Booking</option>
                                <option>Hold Confirm Booking</option>
                                <option>Hold Unconfirm Booking</option>
                             </select>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {hotelData?.rooms?.map((room: any) => (
                             <div key={room.type} className={cn(
                               "p-4 rounded-2xl border transition-all flex flex-col gap-3",
                               (newResForm.selectedRooms?.[room.type] || 0) > 0 ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/30 border-slate-100"
                             )}>
                                <div className="flex justify-between items-start">
                                   <div>
                                      <p className="text-xs font-black text-slate-900">{room.type}</p>
                                      <p className="text-[10px] font-bold text-slate-500">₹{room.price}/night</p>
                                   </div>
                                   <Bed className={cn("w-4 h-4", (newResForm.selectedRooms?.[room.type] || 0) > 0 ? "text-indigo-600" : "text-slate-300")} />
                                </div>
                                <div className="flex items-center gap-2 mt-auto">
                                   <button 
                                      onClick={() => {
                                         const current = newResForm.selectedRooms?.[room.type] || 0;
                                         if (current > 0) {
                                            setNewResForm({
                                               ...newResForm,
                                               selectedRooms: { ...newResForm.selectedRooms, [room.type]: current - 1 }
                                            });
                                         }
                                      }}
                                      className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                   >-</button>
                                   <input 
                                      type="number"
                                      min="0"
                                      value={newResForm.selectedRooms?.[room.type] || 0}
                                      onChange={(e) => {
                                         const val = Math.max(0, parseInt(e.target.value) || 0);
                                         setNewResForm({
                                            ...newResForm,
                                            selectedRooms: { ...newResForm.selectedRooms, [room.type]: val }
                                         });
                                      }}
                                      className="flex-1 h-8 bg-white border border-slate-200 rounded-lg text-center text-xs font-black text-slate-700 outline-none focus:border-indigo-400"
                                   />
                                   <button 
                                      onClick={() => {
                                         const current = newResForm.selectedRooms?.[room.type] || 0;
                                         setNewResForm({
                                            ...newResForm,
                                            selectedRooms: { ...newResForm.selectedRooms, [room.type]: current + 1 }
                                         });
                                      }}
                                      className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                                   >+</button>
                                </div>
                             </div>
                          )) || (
                             <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                <p className="text-sm font-bold text-slate-400 italic">No room types configured for this property.</p>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>

                {/* Sources */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                   <div className="flex items-center gap-2 mb-8">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                         <Globe className="w-4 h-4 text-amber-600" />
                      </div>
                      <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Booking Sources</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking Source</label>
                        <div className="relative">
                           <select 
                            value={newResForm.bookingSource}
                            onChange={(e) => setNewResForm({ ...newResForm, bookingSource: e.target.value })}
                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none text-slate-700 appearance-none"
                           >
                              <option>Booking Engine</option>
                              <option>Company</option>
                              <option>Direct</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Source</label>
                        <div className="relative">
                           <select 
                            value={newResForm.businessSource}
                            onChange={(e) => setNewResForm({ ...newResForm, businessSource: e.target.value })}
                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none text-slate-700 appearance-none"
                           >
                              <option value="Walk In">Walk In</option>
                              <option value="OYO">OYO</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Detail (e.g. Company Name)</label>
                        <input 
                          type="text" 
                          value={newResForm.companyName}
                          onChange={(e) => setNewResForm({ ...newResForm, companyName: e.target.value })}
                          placeholder="Type company name or details..." 
                          className="w-full h-12 bg-white border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500/10 transition-all text-slate-900 shadow-sm"
                        />
                      </div>
                   </div>
                </div>

                {/* Guest Details */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                   <div className="flex items-center gap-2 mb-8">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                         <User className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Guest Information</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Name</label>
                        <input 
                          type="text" 
                          value={newResForm.guestName}
                          onChange={(e) => setNewResForm({ ...newResForm, guestName: e.target.value })}
                          placeholder="John Doe" 
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none text-slate-700" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
                        <input 
                          type="tel" 
                          value={newResForm.mobile}
                          onChange={(e) => setNewResForm({ ...newResForm, mobile: e.target.value })}
                          placeholder="+91..." 
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none text-slate-700" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                        <input 
                          type="email" 
                          value={newResForm.email}
                          onChange={(e) => setNewResForm({ ...newResForm, email: e.target.value })}
                          placeholder="john@example.com" 
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none text-slate-700" 
                        />
                      </div>
                   </div>
                </div>
              </div>

              {/* Right Column: Billing & Actions */}
              <div className="space-y-8">
                <div className="bg-slate-900 rounded-[32px] p-8 shadow-2xl text-white sticky top-28">
                   <h3 className="text-xl font-black mb-8">Billing Summary</h3>
                   <div className="space-y-4 pb-8 border-b border-white/10">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Room Charges (INR)</label>
                        <input 
                          type="number" 
                          value={newResForm.roomCharges}
                          onChange={(e) => setNewResForm({ ...newResForm, roomCharges: e.target.value })}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm font-bold outline-none focus:border-indigo-400 transition-all text-white" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Taxes (INR)</label>
                        <input 
                          type="number" 
                          value={newResForm.taxes}
                          onChange={(e) => setNewResForm({ ...newResForm, taxes: e.target.value })}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm font-bold outline-none focus:border-indigo-400 transition-all text-white" 
                        />
                      </div>
                   </div>
                   <div className="pt-8 mb-8 flex justify-between items-center">
                      <span className="text-white/60 font-black uppercase tracking-widest text-xs">Total Amount</span>
                      <span className="text-3xl font-black tracking-tight">₹{(Number(newResForm.roomCharges) + Number(newResForm.taxes)).toLocaleString()}</span>
                   </div>
                   
                   <div className="space-y-3">
                      <button 
                        onClick={handleConfirmReservation}
                        disabled={isSaving}
                        className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black rounded-2xl flex items-center justify-center gap-2 text-base transition-all"
                      >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Confirm & Print</>}
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="h-12 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs">
                          <Printer className="w-4 h-4" /> Print
                        </button>
                        <button className="h-12 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs">
                          <Send className="w-4 h-4" /> Send
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {['rates', 'distribution', 'guest', 'cashiering', 'housekeeping', 'nightaudit', 'b2b', 'netlocks', 'reports', 'exported', 
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
