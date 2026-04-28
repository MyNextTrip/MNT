"use client";

import { useState } from "react";
import { 
  ShieldCheck, FileText, XCircle, CreditCard, Users, 
  Headphones, Gavel, Ban, MessageSquare, RefreshCw,
  ChevronRight, Lock, Shield, CheckCircle2, AlertTriangle
} from "lucide-react";

const policySections = [
  {
    id: "privacy",
    title: "Privacy Policy",
    icon: <ShieldCheck className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
          <p className="text-slate-700 leading-relaxed font-medium">
            At MyNextTrip, we value your privacy and are committed to protecting your personal information.
          </p>
        </div>
        
        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">1</div>
            Information We Collect
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Name, email, phone number",
              "Booking details (hotel, dates, guests)",
              "Payment details (secure gateways)",
              "Device & browsing data (cookies, IP)"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-600 font-medium">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-500 italic bg-slate-50 p-3 rounded-lg border-l-4 border-primary">
            👉 OTA platforms भी यही data collect करते हैं bookings fulfill करने के लिए
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">2</div>
            How We Use Information
          </h3>
          <div className="space-y-2">
            {[
              "Booking confirmation & processing",
              "Customer support",
              "Sending updates/offers",
              "Fraud prevention"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 text-slate-600 font-medium hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">3</div>
            Sharing of Data
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Hotels", desc: "Property owners" },
              { label: "Payments", desc: "Trusted partners" },
              { label: "Legal", desc: "If required by law" }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                <p className="font-bold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Lock className="w-32 h-32" />
          </div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Data Security & Rights
          </h3>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            We use encryption & secure servers to protect your data. You have the right to request data access, modify/delete your data, or opt-out of marketing anytime.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">Encryption</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">SSL Secure</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">GDPR Ready</span>
          </div>
        </section>
      </div>
    )
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    icon: <FileText className="w-5 h-5" />,
    content: (
      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Acceptance & Services</h3>
          <p className="text-slate-600 leading-relaxed">
            By using our website, you agree to all terms. We act as an intermediary between users and hotels.
          </p>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> User Responsibility
            </h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>• Provide accurate information</li>
              <li>• Follow hotel rules</li>
              <li>• Use platform legally</li>
            </ul>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Booking & Pricing
            </h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>• Confirmation after payment success</li>
              <li>• Email/SMS confirmation required</li>
              <li>• Prices may change until confirmed</li>
            </ul>
          </div>
        </div>

        <section className="p-6 border-l-4 border-red-500 bg-red-50 rounded-r-2xl">
          <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Liability Disclaimer
          </h4>
          <p className="text-sm text-red-700">
            We are not responsible for hotel service quality or delays/cancellations by the property owner.
          </p>
        </section>
      </div>
    )
  },
  {
    id: "cancellation",
    title: "Cancellation & Refund",
    icon: <XCircle className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
              <Ban className="w-5 h-5 text-red-500" /> Cancellation
            </h3>
            <ul className="space-y-3 text-slate-600 text-sm font-medium">
              <li className="flex gap-2"><span>-</span> Each hotel has its own rules</li>
              <li className="flex gap-2"><span>-</span> Free cancellation if explicitly mentioned</li>
              <li className="flex gap-2"><span>-</span> Last-minute cancellation = partial/no refund</li>
            </ul>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
              <RefreshCw className="w-5 h-5 text-emerald-500" /> Refund Policy
            </h3>
            <ul className="space-y-3 text-slate-600 text-sm font-medium">
              <li className="flex gap-2"><span>-</span> Processed within 5–10 business days</li>
              <li className="flex gap-2"><span>-</span> Depends on hotel & gateway policy</li>
              <li className="flex gap-2 text-red-500 font-bold"><span>-</span> No-show bookings = no refund</li>
            </ul>
          </div>
        </div>
        <p className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-sm font-medium">
          👉 OTA industry में refund अक्सर service provider policy पर depend करता है
        </p>
      </div>
    )
  },
  {
    id: "payment",
    title: "Payment Policy",
    icon: <CreditCard className="w-5 h-5" />,
    content: (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Payment Terms</h3>
            <p className="text-slate-600">100% advance or partial payment depending on the hotel policy.</p>
            <div className="flex flex-wrap gap-3">
              {["UPI", "Debit Card", "Credit Card", "Net Banking"].map(m => (
                <span key={m} className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-700 border border-slate-200">{m}</span>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-amber-50 p-6 rounded-3xl border border-amber-100">
             <h4 className="font-bold text-amber-900 mb-2">Failed Payments</h4>
             <p className="text-sm text-amber-800">Booking is not confirmed if payment fails. We reserve the right to cancel suspicious bookings for fraud prevention.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "partner",
    title: "Hotel Partner Policy",
    icon: <Users className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">Owner Eligibility</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Registration</p>
              <p className="text-sm text-slate-500">Valid business registration is mandatory for all partners.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Property Info</p>
              <p className="text-sm text-slate-500">Must provide 100% accurate property details & availability.</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-2">Commission</h4>
            <p className="text-sm text-slate-600">Platform commission may apply per successful booking processed through MNT.</p>
          </div>
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
            <h4 className="font-bold text-red-900 mb-2">Termination</h4>
            <p className="text-sm text-red-700">Listings can be removed for fake info, poor service, or policy violations.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "legal",
    title: "Legal & Compliance",
    icon: <Gavel className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Governing Law</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              All disputes are governed by Indian law. Jurisdiction falls under the courts of your business location (e.g., Jharkhand/Patna).
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Dispute Resolution</h3>
            <ol className="text-sm text-slate-600 space-y-2">
              <li className="font-bold text-primary">1. Customer Support First</li>
              <li className="font-bold text-slate-800">2. Legal Escalation Second</li>
            </ol>
          </div>
        </section>

        <section className="bg-slate-50 p-6 rounded-3xl">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Review Policy
          </h3>
          <p className="text-sm text-slate-600">
            Users can post reviews. No fake or abusive content is allowed. We reserve the right to remove inappropriate content without notice.
          </p>
        </section>
      </div>
    )
  }
];

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState("privacy");

  const activePolicy = policySections.find(p => p.id === activeTab) || policySections[0];

  return (
    <div className="min-h-screen bg-white">
      
      <main className="max-w-7xl mx-auto px-4 py-20">
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter sm:text-6xl uppercase">
            Legal <span className="text-primary">&</span> Policies
          </h1>
          <p className="mt-4 text-slate-500 font-medium max-w-2xl mx-auto">
            Your trust is our priority. Read about our commitment to security, transparency, and high-quality travel services.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4 animate-in fade-in slide-in-from-left-4 duration-700">
            <nav className="flex flex-col gap-2 sticky top-24">
              {policySections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-left ${
                    activeTab === section.id
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={activeTab === section.id ? "text-white" : "text-primary"}>
                    {section.icon}
                  </span>
                  {section.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <section className="lg:w-3/4 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 min-h-[600px] relative">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12 scale-150">
                {activePolicy.icon}
              </div>
              
              <div key={activePolicy.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                     {activePolicy.icon}
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                     {activePolicy.title}
                   </h2>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  {activePolicy.content}
                </div>
              </div>
            </div>

            {/* Bottom Help Section */}
            <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div>
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-primary" /> Still have questions?
                </h3>
                <p className="text-slate-400 text-sm">Our support team is available 24/7 to assist with your legal or policy concerns.</p>
              </div>
              <div className="flex gap-4">
                <a 
                  href="mailto:mnt.mynexttrip@gmail.com" 
                  className="px-6 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg"
                >
                  Email Support
                </a>
                <a 
                  href="https://wa.me/919263554855" 
                  target="_blank"
                  className="px-6 py-3 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-all shadow-lg"
                >
                  WhatsApp Expert
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
