"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, MapPin, IndianRupee, Image as ImageIcon, Link2, 
  CheckSquare, LayoutDashboard, PlusCircle, Settings, 
  LogOut, Users, Calendar, BedDouble, Trash2, Pencil,
  ChevronDown, ChevronUp, Wifi, Coffee, Clock, Shirt, 
  Smartphone, Sparkles, Dumbbell, Waves, Heart, Baby, 
  Briefcase, Utensils, ConciergeBell, Dog, Map, Leaf,
  Navigation, Monitor, Zap, Menu, X, Key, Copy, Check, Save, Loader2, MessageSquareText, Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Essential (Basic) Amenities"]);
  const [allHotels, setAllHotels] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allHotelInquiries, setAllHotelInquiries] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [allChatbotUsers, setAllChatbotUsers] = useState<any[]>([]);
  const [loadingChatbotUsers, setLoadingChatbotUsers] = useState(false);
  const [editHotelId, setEditHotelId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState<string | null>(null);
  const [showCreds, setShowCreds] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState({ email: '', password: '' });
  const [selectedHotelForCreds, setSelectedHotelForCreds] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [isLoadingCreds, setIsLoadingCreds] = useState(false);
  const [isExistingCreds, setIsExistingCreds] = useState(false);
  
  // Form State
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [currentUrlInput, setCurrentUrlInput] = useState("");

  const [formData, setFormData] = useState({
    hotelName: "",
    location: "",
    address: "",
    rooms: [] as { type: string, price: string, count: string, image?: string, roomImageFile?: File }[],
    amenities: [] as string[],
    images: [] as string[],
    owner: "MyNextTrip",
    mapUrl: ""
  });

  const handleAddUrl = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (currentUrlInput.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, currentUrlInput.trim()] }));
      setCurrentUrlInput("");
    }
  };

  const handleRemoveUrl = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };
  
  const handleRemoveFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const availableRoomTypes = [
    "Standard Room", "Classic Room", "Deluxe Room", "Super Deluxe Room", "Suite Room", "Executive Suite Room", "Family Suite", "Presidential Suite", "Resturant", "Premium"
  ];

  const handleAddRoom = () => {
    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, { type: "Deluxe Room", price: "", count: "1", image: "" }]
    }));
  };

  const handleUpdateRoom = (index: number, field: 'type'|'price'|'count'|'image'|'roomImageFile', value: any) => {
    const newRooms = [...formData.rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setFormData(prev => ({ ...prev, rooms: newRooms }));
  };

  const handleRemoveRoom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index)
    }));
  };

  const amenitiesCategories = [
    {
      name: "Essential (Basic) Amenities",
      icon: <Wifi className="w-5 h-5" />,
      items: ["Complimentary Wi-Fi", "Toiletries", "In-room Coffee/Tea Maker", "Housekeeping: 24/7"]
    },
    {
      name: "Luxury & Comfort Amenities",
      icon: <Sparkles className="w-5 h-5" />,
      items: ["Pillow Menu", "Bathrobes & Slippers", "Smart Room Controls", "Mini Bar"]
    },
    {
      name: "Wellness & Recreation",
      icon: <Heart className="w-5 h-5" />,
      items: ["Fitness Center/Gym", "Swimming Pool", "Spa & Wellness Center", "Kids' Zone"]
    },
    {
      name: "Business & Tech Amenities",
      icon: <Briefcase className="w-5 h-5" />,
      items: ["Co-working Spaces", "Meeting & Conference Rooms", "Charging Stations", "Business Center"]
    },
    {
      name: "Food & Beverage (F&B) Amenities",
      icon: <Utensils className="w-5 h-5" />,
      items: ["Free Breakfast Buffet", "24-hour Room Service", "Executive Lounges"]
    },
    {
      name: "Unique & Personalized Amenities",
      icon: <Leaf className="w-5 h-5" />,
      items: ["Pet-Friendly Services", "Local Experience Kits", "Sustainability Features"]
    }
  ];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);
    }
  };

  const fetchHotelInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch("/api/hotel-listings");
      const data = await res.json();
      if (data.success) {
        setAllHotelInquiries(data.listings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const fetchChatbotUsers = async () => {
    setLoadingChatbotUsers(true);
    try {
      const res = await fetch("/api/admin/chatbot-users");
      const data = await res.json();
      if (data.success) {
        setAllChatbotUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChatbotUsers(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payloadData = {
        hotelName: formData.hotelName,
        location: formData.location,
        address: formData.address,
        rooms: formData.rooms.map(({ roomImageFile, ...rest }) => rest),
        amenities: formData.amenities,
        images: imageMode === 'url' ? formData.images : [],
        owner: formData.owner,
        googleMapUrl: formData.mapUrl
      };

      const submitData = new FormData();
      submitData.append('data', JSON.stringify(payloadData));

      if (imageMode === 'upload') {
        imageFiles.forEach(file => {
          submitData.append('imageFiles', file);
        });
      }

      // Append room-specific images
      formData.rooms.forEach((room, idx) => {
        if (room.roomImageFile) {
          submitData.append(`roomImage_${idx}`, room.roomImageFile);
        }
      });

      const url = editHotelId ? `/api/admin/hotels/${editHotelId}` : '/api/admin/hotels';
      const method = editHotelId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: submitData
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert(editHotelId ? "Success! Hotel listing successfully updated." : "Success! Hotel listing successfully saved to MongoDB Database.");
      
      // Reset Form securely upon successful payload
      setFormData({
        hotelName: "", location: "", address: "", rooms: [],
        amenities: [], images: [], owner: "MyNextTrip", mapUrl: ""
      });
      setImageFiles([]);
      setCurrentUrlInput("");
      setEditHotelId(null);
      if (editHotelId) setActiveTab('all-properties');
      
    } catch (err: any) {
      console.error(err);
      alert("Error saving hotel securely: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === "admin") {
          setIsAuthorized(true);
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
    if (isAuthorized) {
      if (activeTab === 'dashboard') {
        fetchHotels();
        fetchBookings();
        fetchUsers();
        fetchHotelInquiries();
        fetchChatbotUsers();
      } else if (activeTab === 'all-properties') {
        fetchHotels();
      } else if (activeTab === 'bookings') {
        fetchBookings();
      } else if (activeTab === 'users') {
        fetchUsers();
      } else if (activeTab === 'inquiries') {
        fetchHotelInquiries();
      } else if (activeTab === 'chatbot-users') {
        fetchChatbotUsers();
      }
    }
  }, [isAuthorized, activeTab]);

  const fetchHotels = async () => {
    try {
      setLoadingHotels(true);
      const res = await fetch('/api/hotels');
      const data = await res.json();
      if (data.success) {
        setAllHotels(data.hotels);
      }
    } catch (e) {
      console.error("Failed to fetch hotels:", e);
    } finally {
      setLoadingHotels(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      if (data.success) {
        setAllBookings(data.bookings);
      }
    } catch (e) {
      console.error("Failed to fetch bookings:", e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setAllUsers(data.users);
      }
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleEditHotel = (hotel: any) => {
    setEditHotelId(hotel._id);
    setFormData({
      hotelName: hotel.hotelName || "",
      location: hotel.location || "",
      address: hotel.address || "",
      rooms: hotel.rooms ? hotel.rooms.map((r: any) => ({ 
        ...r, 
        count: r.count?.toString() || "1",
        image: r.image || ""
      })) : [],
      amenities: hotel.amenities || [],
      images: hotel.images || [],
      owner: hotel.owner || "MyNextTrip",
      mapUrl: hotel.googleMapUrl || ""
    });
    setImageMode('url');
    setActiveTab('add-hotel');
    setIsSidebarOpen(false);
  };

  const initiateDelete = (id: string) => {
    setHotelToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteHotel = async () => {
    if (!hotelToDelete) return;
    try {
      setLoadingHotels(true);
      setShowDeleteConfirm(false);
      const res = await fetch(`/api/admin/hotels/${hotelToDelete}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert("Hotel deleted successfully.");
        fetchHotels();
      } else {
        alert(data.message || "Failed to delete hotel.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error deleting hotel.");
    } finally {
      setLoadingHotels(false);
      setHotelToDelete(null);
    }
  };

  const handleGenerateCreds = async (hotel: any) => {
    setSelectedHotelForCreds(hotel._id);
    setIsLoadingCreds(true);
    setShowCreds(true);
    setIsExistingCreds(false);
    
    try {
      const res = await fetch(`/api/admin/hotels/${hotel._id}/generate-id`);
      const data = await res.json();
      
      if (data.success && data.credentials) {
        setGeneratedCreds({
          email: data.credentials.email,
          password: data.credentials.password
        });
        setIsExistingCreds(true);
      } else {
        // Suggest new ones if none exist
        setGeneratedCreds({ 
            email: `hotel_${hotel.hotelName.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '')}_${hotel._id.substring(hotel._id.length - 4)}@nextmytrip.com`, 
            password: Math.random().toString(36).slice(-8) 
        });
        setIsExistingCreds(false);
      }
    } catch (err) {
      console.error("Error fetching existing credentials:", err);
      // Fallback to suggestions
      setGeneratedCreds({ 
          email: `hotel_${hotel.hotelName.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '')}_${hotel._id.substring(hotel._id.length - 4)}@nextmytrip.com`, 
          password: Math.random().toString(36).slice(-8) 
      });
    } finally {
      setIsLoadingCreds(false);
    }
  };

  const handleSaveCreds = async () => {
    if (!selectedHotelForCreds) return;
    try {
      setIsSavingCreds(true);
      const res = await fetch(`/api/admin/hotels/${selectedHotelForCreds}/generate-id`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedCreds)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setShowCreds(false);
      } else {
        alert(data.message || "Failed to generate ID.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error generating credentials.");
    } finally {
      setIsSavingCreds(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="text-white font-black tracking-widest text-xl animate-pulse">VERIFYING ROOT...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Navbar */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
         <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <span className="text-primary border-2 border-primary rounded-md px-1.5 py-0.5 bg-primary/10 text-sm">MNT</span> Admin
         </h2>
         <button 
           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
           className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
         >
           {isSidebarOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-slate-400" />}
         </button>
      </div>

      {/* Admin Sidebar (Responsive Drawer) */}
      <aside className={cn(
        "bg-slate-900 text-white w-72 fixed lg:static inset-y-0 left-0 z-[60] transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto shadow-2xl border-r border-slate-800 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-slate-800 hidden lg:block">
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="text-primary border-2 border-primary rounded-md px-1.5 py-0.5 bg-primary/10">MNT</span> Admin
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-black uppercase tracking-widest opacity-60">Root Control</p>
        </div>
        
        <div className="p-6 space-y-2 flex-1">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">Management</p>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'add-hotel', label: editHotelId ? 'Edit Hotel' : 'Add Hotel', icon: PlusCircle },
            { id: 'all-properties', label: 'All Properties', icon: Building2 },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'inquiries', label: 'Hotel Inquiries', icon: Building2 },
            { id: 'chatbot-users', label: 'Chatbot Users', icon: MessageSquareText }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {
                if (tab.id === 'add-hotel') {
                  if (!editHotelId) {
                    setEditHotelId(null);
                    setFormData({
                      hotelName: "", location: "", address: "", rooms: [],
                      amenities: [], images: [], owner: "MyNextTrip", mapUrl: ""
                    });
                  }
                }
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group",
                activeTab === tab.id 
                  ? "bg-primary text-white font-black shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <tab.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-white" : "text-slate-500")} />
              <span className="tracking-tight">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 mt-auto border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all mb-2">
            <Settings className="w-5 h-5 text-slate-500" /> <span className="font-bold tracking-tight">Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" /> <span className="font-bold tracking-tight text-sm">Exit Root Panel</span>
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

      {/* Main Content Area */}
      <main className="flex-1 w-full min-h-screen p-6 md:p-8 lg:p-12 overflow-x-hidden">
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-500 mt-2 font-medium">Platform statistics and quick actions.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Properties</p>
                  <p className="text-3xl font-black text-slate-900">{allHotels.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Bookings</p>
                  <p className="text-3xl font-black text-slate-900">{allBookings.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Signed Users</p>
                  <p className="text-3xl font-black text-slate-900">{allUsers.length}</p>
                </div>
              </div>
              <div 
                 onClick={() => setActiveTab('inquiries')}
                 className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-amber-500"
              >
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Hotel Inquiries</p>
                  <p className="text-3xl font-black text-slate-900">{allHotelInquiries.length}</p>
                </div>
              </div>
              <div 
                 onClick={() => setActiveTab('chatbot-users')}
                 className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-primary"
              >
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <MessageSquareText className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Chatbot Leads</p>
                  <p className="text-3xl font-black text-slate-900">{allChatbotUsers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Welcome back to MyNextTrip Root</h3>
              <p className="text-slate-600">The administration dashboard is running smoothly. All services and MongoDB connections are deeply integrated and functioning perfectly. Select 'All Properties' from the left panel to manage listings or 'Add Hotel' to push new inventory live.</p>
            </div>
          </div>
        )}

        {activeTab === 'all-properties' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-slate-900">All Properties</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage and review your active MongoDB listings.</p>
              </div>
              <button onClick={() => {
                setEditHotelId(null);
                setFormData({ hotelName: "", location: "", address: "", rooms: [], amenities: [], images: [], owner: "MyNextTrip", mapUrl: "" });
                setActiveTab('add-hotel');
                setIsSidebarOpen(false);
              }} className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <PlusCircle className="w-5 h-5" /> Add New Hotel
              </button>
            </header>

            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Image</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Hotel Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Pricing</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingHotels ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading properties from MongoDB...</td></tr>
                    ) : allHotels.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500">No properties found. List a new one above.</td></tr>
                    ) : (
                      allHotels.map((h: any) => (
                        <tr key={h._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative">
                              {h.images && h.images.length > 0 ? (
                                <img src={h.images[0]} alt={h.hotelName} className="object-cover w-full h-full" />
                              ) : (
                                <Building2 className="w-6 h-6 text-slate-400 m-auto mt-5" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900 text-base">{h.hotelName}</p>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-1"><MapPin className="w-3 h-3 text-slate-400"/> {h.location}</span>
                          </td>
                          <td className="px-6 py-4">
                            {h.rooms && h.rooms.length > 0 ? (
                               <p className="font-bold text-slate-800 flex items-center">
                                 <IndianRupee className="w-4 h-4 text-emerald-500" />{Math.min(...h.rooms.map((r: any) => r.price))} <span className="text-xs font-medium text-slate-500 ml-1">starting</span>
                               </p>
                            ) : (
                               <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">No Pricing</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleGenerateCreds(h)}
                                className={cn(
                                    "p-2 rounded-lg transition-colors border shadow-sm relative group",
                                    allUsers.some(u => u.hotelId === h._id && u.role === 'hotel_admin')
                                        ? "text-emerald-500 border-emerald-100 hover:bg-emerald-500 hover:text-white"
                                        : "text-amber-500 border-amber-100 hover:bg-amber-500 hover:text-white"
                                )}
                                title={allUsers.some(u => u.hotelId === h._id && u.role === 'hotel_admin') ? "Manage Credentials" : "Generate Credentials"}
                              >
                                <Key className="w-4 h-4" />
                                {allUsers.some(u => u.hotelId === h._id && u.role === 'hotel_admin') && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
                                )}
                              </button>
                              <button 
                                onClick={() => handleEditHotel(h)}
                                className="p-2 text-blue-500 hover:text-white hover:bg-blue-500 rounded-lg transition-colors border border-blue-100 shadow-sm"
                                title="Edit Property"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => initiateDelete(h._id)}
                                className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-red-100 shadow-sm"
                                title="Delete Property"
                              >
                                <Trash2 className="w-4 h-4" />
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

        {activeTab === 'add-hotel' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-900">{editHotelId ? 'Edit Property' : 'List New Property'}</h1>
              <p className="text-slate-500 mt-2 font-medium">{editHotelId ? 'Update existing property details.' : 'Add a new hotel or resort to the MyNextTrip ecosystem.'}</p>
            </header>

            <form onSubmit={handleSubmit} className="max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Basic Information</h2>
              <p className="text-sm text-slate-500 font-medium">Core details about the property.</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Grid 1: Name */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                   Hotel Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" required
                    value={formData.hotelName} onChange={e=>setFormData({...formData, hotelName: e.target.value})}
                    placeholder="e.g. The Taj Mahal Palace"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Grid 2: Location Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                   City / Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                  <input 
                    type="text" required
                    value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                   Google Maps URL
                </label>
                <div className="relative">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <input 
                    type="url" required
                    value={formData.mapUrl} onChange={e=>setFormData({...formData, mapUrl: e.target.value})}
                    placeholder="https://maps.google.com/..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                   Full Street Address
                </label>
                <textarea 
                  required rows={2}
                  value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})}
                  placeholder="e.g. Apollo Bunder, Colaba, Mumbai, 400001"
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700 resize-none"
                />
              </div>
            </div>

            {/* Pricing & Rooms Matrix */}
            <div className="bg-slate-50/50 p-6 sm:p-8 rounded-2xl border border-slate-100 flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                     Room Categories & Pricing
                  </label>
                  <p className="text-xs text-slate-500 font-medium mt-1">Assign specific INR rates to available room designations.</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddRoom}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors text-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Add Room Type
                </button>
              </div>

              {formData.rooms.length === 0 ? (
                <div className="text-center py-8 bg-white border border-dashed border-slate-300 rounded-xl">
                  <BedDouble className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-500">No rooms added. Click "Add Room Type" to assign pricing.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.rooms.map((room, idx) => (
                    <div key={idx} className="flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-200 relative group">
                      <div className="w-full lg:w-1/3 space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Room Category</label>
                        <div className="relative">
                          <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <select 
                            value={room.type} 
                            onChange={(e) => handleUpdateRoom(idx, 'type', e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-700"
                          >
                            {availableRoomTypes.map(rt => (
                              <option key={rt} value={rt}>{rt}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="w-full lg:w-1/3 space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price (Per Night)</label>
                        <div className="relative">
                           <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
                           <input 
                            type="number" required min="0" placeholder="Price"
                            value={room.price} 
                            onChange={(e) => handleUpdateRoom(idx, 'price', e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-black text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="w-full lg:w-1/4 space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">No. of Rooms</label>
                        <div className="relative">
                           <LayoutDashboard className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4" />
                           <input 
                            type="number" required min="1" placeholder="Quantity"
                            value={room.count} 
                            onChange={(e) => handleUpdateRoom(idx, 'count', e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-700"
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-1/4 space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Room Photo</label>
                        <div className="flex items-center gap-3">
                          <div className="relative group/img w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                            {room.roomImageFile ? (
                              <img src={URL.createObjectURL(room.roomImageFile)} className="w-full h-full object-cover" />
                            ) : room.image ? (
                              <img src={room.image} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-300 m-auto mt-3.5" />
                            )}
                          </div>
                          <label className="flex-1 cursor-pointer">
                            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-primary/5 hover:border-primary/30 transition-all text-center">
                              {room.roomImageFile || room.image ? 'Change' : 'Upload'}
                            </div>
                            <input 
                              type="file" accept="image/*" className="hidden" 
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleUpdateRoom(idx, 'roomImageFile', e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => handleRemoveRoom(idx)}
                        className="p-3.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-100 mb-[2px]"
                        title="Remove Category"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Media Upload */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                     Primary Image
                  </label>
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button 
                      type="button" 
                      onClick={() => setImageMode('url')}
                      className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${imageMode === 'url' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                    >
                      URL
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setImageMode('upload')}
                      className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${imageMode === 'upload' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                    >
                      Upload
                    </button>
                  </div>
                </div>

                {imageMode === 'url' ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 w-5 h-5" />
                        <input 
                          type="text" 
                          value={currentUrlInput} onChange={e=>setCurrentUrlInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
                          placeholder="https://example.com/image1.jpg"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700 text-sm"
                        />
                      </div>
                      <button type="button" onClick={handleAddUrl} className="px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shrink-0 text-sm">Add URL</button>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="flex flex-col gap-2 bg-white border border-slate-100 p-3 rounded-xl max-h-40 overflow-y-auto">
                        {formData.images.map((imgUrl, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <span className="text-xs font-medium text-slate-600 truncate mr-2" title={imgUrl}>{imgUrl}</span>
                            <button type="button" onClick={() => handleRemoveUrl(idx)} className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-xs transition-colors shrink-0">Remove</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <input 
                        type="file" multiple accept="image/*"
                        onChange={handleFileChange}
                        className="w-full py-2 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                    </div>
                    {imageFiles.length > 0 && (
                      <div className="flex flex-col gap-2 bg-white border border-slate-100 p-3 rounded-xl max-h-40 overflow-y-auto">
                        {imageFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <span className="text-xs font-medium text-slate-600 truncate mr-2" title={file.name}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                            <button type="button" onClick={() => handleRemoveFile(idx)} className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-xs transition-colors shrink-0">Remove</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4 block">
                 Property Amenities
              </label>
              
              <div className="space-y-4">
                {amenitiesCategories.map((category) => (
                  <div key={category.name} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all hover:border-slate-200">
                    {/* Category Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-slate-100">
                          {category.icon}
                        </div>
                        <span className="font-bold text-slate-800 text-sm sm:text-base">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 uppercase tracking-tighter">
                          {category.items.filter(item => formData.amenities.includes(item)).length} selected
                        </span>
                        {expandedCategories.includes(category.name) ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </div>
                    </button>

                    {/* Category Items (Checkboxes) */}
                    {expandedCategories.includes(category.name) && (
                      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white animate-in slide-in-from-top-2 duration-300">
                        {category.items.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleAmenityToggle(item)}
                            className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-semibold transition-all border group ${
                              formData.amenities.includes(item)
                                ? "bg-primary/5 border-primary text-primary shadow-sm"
                                : "bg-slate-50/50 border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                              formData.amenities.includes(item) 
                                ? "bg-primary border-primary text-white" 
                                : "bg-white border-slate-300 group-hover:border-primary/50"
                            }`}>
                              {formData.amenities.includes(item) && <CheckSquare className="w-4 h-4" />}
                            </div>
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {formData.amenities.length === 0 && (
                <p className="text-xs text-red-500 font-medium mt-4">* Please select at least one amenity for the listing.</p>
              )}
            </div>

            {/* Owner Section (Read Only conceptually as requested) */}
            <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between border border-blue-100">
              <div>
                <p className="text-xs font-bold text-blue-800 uppercase tracking-widest">Listing Owner</p>
                <p className="font-medium text-blue-900">{formData.owner} (System Default)</p>
              </div>
              <div className="bg-white px-3 py-1 rounded text-xs font-bold text-blue-600 shadow-sm border border-blue-100">
                Verified Partner
              </div>
            </div>

          </div>

          <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-100 flex items-center justify-between">
            <button 
              type="button" 
              onClick={() => {
                setEditHotelId(null);
                setFormData({ hotelName: "", location: "", address: "", rooms: [], amenities: [], images: [], owner: "MyNextTrip", mapUrl: "" });
                setActiveTab('all-properties');
              }}
              className="text-slate-500 font-bold hover:text-slate-700 transition-colors px-4 py-2"
            >
              Cancel Draft
            </button>
            <button 
              type="submit" disabled={isSubmitting}
              className="px-8 py-3.5 bg-slate-900 hover:bg-primary text-white font-black rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LayoutDashboard className="w-5 h-5" /> 
              {isSubmitting ? (editHotelId ? "Updating..." : "Publishing Data...") : (editHotelId ? "Update Property" : "Publish Property")}
            </button>
            </div>
          </form>
        </div>
        )}
        {activeTab === 'bookings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-slate-900">Bookings Management</h1>
              <p className="text-slate-500 mt-2 font-medium">Manage and review all customer transactions.</p>
            </header>

            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Booking ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Property</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Stay Duration</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Payment & Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Booking Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingBookings ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500">Fetching bookings...</td></tr>
                    ) : allBookings.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500">No bookings recorded yet.</td></tr>
                    ) : (
                      allBookings.map((b: any) => (
                        <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-black text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">{b.bookingId}</span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <p className="font-black text-slate-900 leading-tight">{b.guestName || b.userName}</p>
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest">{b.guestPhone || 'No Phone'}</p>
                                {b.guestName && b.guestName !== b.userName && (
                                   <div className="mt-1 flex flex-col opacity-60">
                                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Booked by: {b.userName}</p>
                                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{b.userEmail}</p>
                                   </div>
                                )}
                             </div>
                          </td>
                          <td className="px-6 py-4 max-w-[200px]">
                            <p className="font-bold text-slate-900 truncate" title={b.hotelName}>{b.hotelName}</p>
                            <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium truncate" title={b.hotelAddress}>
                               <MapPin className="w-3 h-3 text-primary/60" /> {b.hotelAddress}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                               <p className="text-xs font-bold text-slate-700 whitespace-nowrap">
                                  IN: {b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : 'N/A'}
                               </p>
                               <p className="text-xs font-bold text-slate-700 whitespace-nowrap">
                                  OUT: {b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : 'N/A'}
                               </p>
                               <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-black text-slate-500">{b.numberOfNights || 1} NIGHTS</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                               <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${b.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                     {b.paymentStatus}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                    b.reservationStatus === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                    b.reservationStatus === 'No-show' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                     {b.reservationStatus || 'Confirmed'}
                                  </span>
                               </div>
                               <div className="text-[10px] font-bold text-slate-700">
                                  <span>₹{b.paidAmount || b.totalAmount} paid</span>
                                  {b.balanceAmount > 0 && <span className="text-amber-600"> • ₹{b.balanceAmount} due</span>}
                               </div>
                               <div className="text-[9px] font-bold text-slate-400 italic">
                                  Source: {b.bookingSource || (b.paymentType === 'Partial' ? 'online 30% paid' : b.paymentType)}
                               </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-bold text-slate-700 text-sm">{new Date(b.createdAt).toLocaleDateString()}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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

        {activeTab === 'users' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-slate-900">User Management</h1>
              <p className="text-slate-500 mt-2 font-medium">View and manage registered platform users.</p>
            </header>

            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Credentials</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Joined On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingUsers ? (
                      <tr><td colSpan={3} className="p-8 text-center text-slate-500">Loading user database...</td></tr>
                    ) : allUsers.length === 0 ? (
                      <tr><td colSpan={3} className="p-8 text-center text-slate-500">No registered users found.</td></tr>
                    ) : (
                      allUsers.map((u: any) => (
                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase transition-transform group-hover:scale-110">
                                {u.name.charAt(0)}
                              </div>
                              <p className="font-bold text-slate-900">{u.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-600 mb-1 flex items-center gap-2">
                               <span className="w-4 h-4 text-slate-400 font-bold">@</span> {u.email}
                            </p>
                            <p className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded inline-block border border-red-100">
                               PW: {u.password}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-700">{new Date(u.createdAt).toLocaleDateString()}</p>
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

        {activeTab === 'inquiries' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-slate-900">Hotel Inquiries</h1>
              <p className="text-slate-500 mt-2 font-medium">Review property listing requests from users.</p>
            </header>

            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
              {loadingInquiries ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  Fetching inquiries...
                </div>
              ) : allHotelInquiries.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-medium tracking-tight">No hotel listing inquiries found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-xs uppercase tracking-widest text-slate-500 font-bold">
                      <tr>
                        <th className="px-6 py-4 border-b border-slate-100">Hotel Name</th>
                        <th className="px-6 py-4 border-b border-slate-100">Owner Mob No</th>
                        <th className="px-6 py-4 border-b border-slate-100">Address</th>
                        <th className="px-6 py-4 border-b border-slate-100">WhatsApp</th>
                        <th className="px-6 py-4 border-b border-slate-100">Received On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allHotelInquiries.map((inquiry: any) => (
                        <tr key={inquiry._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-black flex items-center gap-3">
                             <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black">
                                <Building2 className="w-5 h-5"/>
                             </div>
                             {inquiry.hotelName}
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-bold">{inquiry.ownerMobNo}</td>
                          <td className="px-6 py-4 text-slate-500 font-medium">
                             <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary"/> {inquiry.hotelAddress}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-emerald-600">
                             <a href={`https://wa.me/${inquiry.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {inquiry.whatsappNumber}
                             </a>
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-slate-800 font-bold">{new Date(inquiry.createdAt).toLocaleDateString('en-GB')}</p>
                             <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-0.5">{new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chatbot-users' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <header className="mb-8">
              <h1 className="text-3xl font-black text-slate-900">Chatbot Leads</h1>
              <p className="text-slate-500 mt-2 font-medium">View users who shared their details with MNT Chatbot.</p>
            </header>

            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User Detail</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">WhatsApp Contact</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Captured On</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingChatbotUsers ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500 flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 animate-spin text-primary" /> Loading leads...</td></tr>
                    ) : allChatbotUsers.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-medium">No leads captured via chatbot yet.</td></tr>
                    ) : (
                      allChatbotUsers.map((u: any) => (
                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                {u.name.charAt(0)}
                              </div>
                              <p className="font-black text-slate-900">{u.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <a 
                              href={`https://wa.me/${u.whatsapp.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                              {u.whatsapp}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-700">{new Date(u.timestamp).toLocaleDateString()}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(u.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={async () => {
                                if (window.confirm("Are you sure you want to delete this lead?")) {
                                  try {
                                    const res = await fetch("/api/admin/chatbot-users", {
                                      method: "DELETE",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ id: u._id })
                                    });
                                    const data = await res.json();
                                    if (data.success) {
                                      fetchChatbotUsers();
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                              }}
                              className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      </main>

      {/* Credentials Modal */}
      {showCreds && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Key className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2">
              {isExistingCreds ? "Manage Credentials" : "Generate Credentials"}
            </h3>
            <p className="text-slate-500 text-center mb-8 font-medium">
              {isExistingCreds ? "Viewing existing login details for this property." : "Auto-generated suggestion for this property."}
            </p>
            
            {isLoadingCreds ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Checking records...</p>
                </div>
            ) : (
              <>
                <div className="space-y-4 mb-8 pulse-in">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                    <span className={cn(
                        "absolute -top-2 right-4 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-sm",
                        isExistingCreds ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                    )}>
                        {isExistingCreds ? "ACTIVE" : "SUGGESTED"}
                    </span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email ID</p>
                    <div className="flex items-center gap-2">
                      <input 
                        type="email"
                        value={generatedCreds.email}
                        onChange={(e) => setGeneratedCreds({ ...generatedCreds, email: e.target.value })}
                        className="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 text-sm p-0 focus:ring-0"
                      />
                      <button onClick={() => copyToClipboard(generatedCreds.email)} className="text-primary hover:text-primary-dark transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Password</p>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text"
                        value={generatedCreds.password}
                        onChange={(e) => setGeneratedCreds({ ...generatedCreds, password: e.target.value })}
                        className="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 text-sm p-0 focus:ring-0"
                      />
                      <button onClick={() => copyToClipboard(generatedCreds.password)} className="text-primary hover:text-primary-dark transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {copied && <div className="text-center text-xs font-bold text-emerald-500 animate-bounce flex items-center justify-center gap-1"><Check className="w-3 h-3"/> Copied to clipboard!</div>}
                  <button 
                    onClick={handleSaveCreds}
                    disabled={isSavingCreds}
                    className="w-full py-4 bg-amber-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSavingCreds ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isExistingCreds ? "Update & Notify" : "Save & Activate"}
                  </button>
                  <button 
                    onClick={() => setShowCreds(false)}
                    className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2">Delete Property?</h3>
            <p className="text-slate-500 text-center mb-8 font-medium">This action cannot be undone. This property and all its rooms will be permanently removed.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteHotel}
                className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-500/20 hover:bg-red-600 hover:-translate-y-0.5 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
