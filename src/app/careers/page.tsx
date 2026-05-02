"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Briefcase, Building, Contact, Sparkles, Hand, 
  UtensilsCrossed, CookingPot, GlassWater, ShieldCheck, 
  Mail, ArrowRight, Star, CheckCircle2, TrendingUp, Users
} from "lucide-react";
import Link from "next/link";

const positions = [
  { 
    title: "GM (General Manager)", 
    icon: <Briefcase className="w-6 h-6" />, 
    type: "Full-Time", 
    desc: "Lead our overall property operations and strategic growth." 
  },
  { 
    title: "Front Office Manager", 
    icon: <Building className="w-6 h-6" />, 
    type: "Full-Time", 
    desc: "Oversee guest services and front desk operations." 
  },
  { 
    title: "Front Office Executive", 
    icon: <Contact className="w-6 h-6" />, 
    type: "Full-Time", 
    desc: "Handle guest check-ins, inquiries and reservations." 
  },
  { 
    title: "House Keeping Manager", 
    icon: <Sparkles className="w-6 h-6" />, 
    type: "Full-Time", 
    desc: "Maintain the highest standards of cleanliness across the property." 
  },
  { 
    title: "House Keeping Executive", 
    icon: <Hand className="w-6 h-6" />, 
    type: "Full-Time", 
    desc: "Support cleaning operations and room maintenance." 
  },
  { 
    title: "Head Chef / Kitchen Manager", 
    icon: <UtensilsCrossed className="w-6 h-6" />, 
    type: "Full-Time", 
    desc: "Direct culinary strategy and manage kitchen efficiency." 
  },
  { 
    title: "Chef", 
    icon: <CookingPot className="w-6 h-6" />, 
    type: "Full-Time/Part-Time", 
    desc: "Prepare exceptional dishes for our diverse guests." 
  },
  { 
    title: "Service Staff", 
    icon: <GlassWater className="w-6 h-6" />, 
    type: "Full-Time", 
    desc: "Deliver premium dining and room service experiences." 
  },
  { 
    title: "Security Guard", 
    icon: <ShieldCheck className="w-6 h-6" />, 
    type: "Shift-Based", 
    desc: "Ensure the safety and security of all guests and staff." 
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900 to-slate-950"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <Star className="w-3 h-3 fill-primary" /> Join Our Elite Team
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Build Your Future <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">At MyNextTrip</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              We are looking for passionate individuals who strive for excellence in hospitality. Join a workplace that values creativity, integrity, and growth.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="#openings" className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                Explore Openings
              </Link>
              <Link href="mailto:mnt.mynexttrip@gmail.com" className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all">
                Contact HR
              </Link>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4 p-8 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Career Growth</h3>
                <p className="text-slate-500 text-sm leading-relaxed">We provide structured paths for advancement and professional development training.</p>
              </div>
              <div className="space-y-4 p-8 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Diverse Culture</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Work with a team from various backgrounds in an inclusive and supportive environment.</p>
              </div>
              <div className="space-y-4 p-8 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Staff Benefits</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Enjoy competitive salaries, health coverage, and exclusive travel discounts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Current Openings */}
        <section id="openings" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Current Openings</h2>
              <p className="text-slate-500 font-medium">Find the role that matches your passion and expertise.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {positions.map((job, index) => (
                <div key={index} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors"></div>
                  
                  <div className="w-14 h-14 bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
                    {job.icon}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">{job.type}</span>
                      <h3 className="text-xl font-bold text-slate-900 mt-3">{job.title}</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{job.desc}</p>
                    
                    <Link href="mailto:mnt.mynexttrip@gmail.com" className="inline-flex items-center gap-2 text-primary text-sm font-black uppercase tracking-widest group/btn">
                      Apply Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Call to Action */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-indigo-600 to-primary rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Ready to start your <br /> journey with us?</h2>
                <p className="text-white/80 text-lg font-medium leading-relaxed">
                  Even if you don't see a perfect match above, we're always looking for talent. Send your resume and a brief cover letter to our HR team.
                </p>
                
                <div className="pt-8">
                  <Link 
                    href="mailto:mnt.mynexttrip@gmail.com" 
                    className="inline-block px-10 py-5 bg-white text-primary font-black text-xl rounded-2xl shadow-xl hover:bg-slate-50 transition-all hover:-translate-y-1"
                  >
                    mnt.mynexttrip@gmail.com
                  </Link>
                  <p className="mt-6 text-white/60 text-xs font-bold uppercase tracking-widest">Mention the position name in the subject line</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
