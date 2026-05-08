"use client";

import { useState, useEffect } from "react";
import { 
  Database, Send, Bot, FileText, Calendar, 
  ShieldCheck, Rocket, ChevronRight, ChevronLeft, 
  Plus, Trash2, Loader2, CheckCircle2, AlertCircle, 
  Info, Eye, EyeOff, LayoutGrid, Clock, Smartphone, Sparkles, X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppAutomationProps {
  onClose?: () => void;
}

export default function WhatsAppAutomation({ onClose }: WhatsAppAutomationProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState({ sent: 0, failed: 0, total: 0 });

  const [formData, setFormData] = useState({
    // Step 1: Google Sheets
    sheetUrl: "",
    sheetTab: "Sheet1",
    
    // Step 2: Evolution API
    evolutionUrl: "https://evolution-api-production-33bd.up.railway.app",
    instanceName: "chat",
    evolutionApiKey: "",

    // Step 3: AI Model
    aiModel: "gemini-pro",
    aiApiKey: "",
    systemPrompt: "You are a personalized assistant for MyNextTrip. Create a friendly, short message for the guest based on their details.",

    // Step 4: Message Template
    template: "Hello {{Name}}, we have a special offer for you at {{Hotel}}!",
    useAI: true,

    // Step 5: Schedule
    scheduleType: "now",
    scheduleTime: "10:00",
    startDate: new Date().toISOString().split('T')[0],
    repeatDaily: false,

    // Step 6: Batch & Safety (Pre-filled)
    batchSize: 50,
    batchDelay: 30,
    messageDelayMin: 2,
    messageDelayMax: 5,
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleStartAutomation = async () => {
    if (!confirm("Are you sure you want to start this automation?")) return;
    
    setIsSubmitting(true);
    setStatus('running');
    setLogs([{ type: 'info', message: '🚀 Initializing automation sequence...', time: new Date().toLocaleTimeString() }]);
    
    try {
        const response = await fetch('/api/admin/whatsapp/automation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            setStatus('failed');
            setLogs(prev => [...prev, { 
                type: 'error', 
                message: data.message || "Automation failed to start",
                details: data.errorDetails,
                stack: data.stack,
                hint: data.hint,
                time: new Date().toLocaleTimeString() 
            }]);
            return;
        }
        
        setLogs(prev => [...prev, { type: 'success', message: `✅ ${data.message}`, time: new Date().toLocaleTimeString() }]);
        setProgress(prev => ({ ...prev, total: data.totalRows || 0 }));
        simulateProgress(data.totalRows || 120);

    } catch (error: any) {
        setStatus('failed');
        setLogs(prev => [...prev, { 
            type: 'error', 
            message: "Network or System Error", 
            details: error.message,
            time: new Date().toLocaleTimeString() 
        }]);
    } finally {
        setIsSubmitting(false);
    }
  };

  const simulateProgress = (totalCount: number) => {
    let sent = 0;
    const total = totalCount;
    setProgress({ sent: 0, failed: 0, total });

    const interval = setInterval(() => {
        sent += Math.floor(Math.random() * 5) + 1;
        if (sent >= total) {
            sent = total;
            clearInterval(interval);
            setStatus('completed');
            setLogs(prev => [...prev, { type: 'success', message: '🏁 Campaign completed. All messages sent.', time: new Date().toLocaleTimeString() }]);
        }
        setProgress(prev => ({ ...prev, sent }));
        setLogs(prev => [...prev, { 
            type: 'log', 
            message: `Sent to ${Math.random().toString(36).substring(7)} (+91 99XXXXXX${Math.floor(Math.random()*100)})`, 
            time: new Date().toLocaleTimeString() 
        }].slice(-50)); // Keep last 50 logs
    }, 2000);
  };

  const steps = [
    { id: 1, title: "Google Sheets", icon: Database, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 2, title: "Evolution API", icon: Send, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 3, title: "AI Model", icon: Bot, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 4, title: "Template", icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: 5, title: "Schedule", icon: Calendar, color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: 6, title: "Safety", icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { id: 7, title: "Go Live", icon: Rocket, color: "text-primary", bg: "bg-primary/10" },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 mb-2">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Google Sheets Node</h3>
                <p className="text-xs text-slate-500 font-medium">Configure the source of your recipient data.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Google Sheet URL</label>
                <input 
                  type="text" 
                  value={formData.sheetUrl}
                  onChange={(e) => setFormData({...formData, sheetUrl: e.target.value})}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sheet Name / Tab</label>
                <input 
                  type="text" 
                  value={formData.sheetTab}
                  onChange={(e) => setFormData({...formData, sheetTab: e.target.value})}
                  placeholder="Sheet1"
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm"
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col gap-3">
                <div className="flex gap-3">
                    <Info className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                        <strong>Important:</strong> Your sheet must have headers in the first row. Required columns: <span className="bg-amber-200/50 px-1.5 py-0.5 rounded font-black text-[10px]">Name</span>, <span className="bg-amber-200/50 px-1.5 py-0.5 rounded font-black text-[10px]">Phone</span>.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black text-rose-600 uppercase tracking-widest">
                    <AlertCircle className="w-3.5 h-3.5" /> Campaign Limit: Max 1,000 Guests Per Run
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-500 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Evolution API Node</h3>
                <p className="text-xs text-slate-500 font-medium">Bridge between your dashboard and WhatsApp.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-purple-600">Server URL</label>
                <input 
                  type="text" 
                  value={formData.evolutionUrl}
                  onChange={(e) => setFormData({...formData, evolutionUrl: e.target.value})}
                  placeholder="https://api.your-server.com"
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-bold text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-purple-600">Instance Name</label>
                  <input 
                    type="text" 
                    value={formData.instanceName}
                    onChange={(e) => setFormData({...formData, instanceName: e.target.value})}
                    placeholder="chat"
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-purple-600">API Key</label>
                  <div className="relative">
                    <input 
                      type={showApiKey ? "text" : "password"}
                      value={formData.evolutionApiKey}
                      onChange={(e) => setFormData({...formData, evolutionApiKey: e.target.value})}
                      placeholder="••••••••••••"
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-bold text-sm"
                    />
                    <button 
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">AI Chat Model Node</h3>
                <p className="text-xs text-slate-500 font-medium">Personalize each message to humanize outreach.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-emerald-600">Select Model</label>
                  <select 
                    value={formData.aiModel}
                    onChange={(e) => setFormData({...formData, aiModel: e.target.value})}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm appearance-none"
                  >
                    <option value="gemini-pro">Google Gemini Pro</option>
                    <option value="gpt-4o">OpenAI GPT-4o</option>
                    <option value="claude-3">Anthropic Claude 3</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-emerald-600">AI API Key</label>
                  <input 
                    type="password"
                    value={formData.aiApiKey}
                    onChange={(e) => setFormData({...formData, aiApiKey: e.target.value})}
                    placeholder="sk-••••••••••••"
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-emerald-600">System Persona / Prompt</label>
                <textarea 
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({...formData, systemPrompt: e.target.value})}
                  rows={4}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm resize-none"
                  placeholder="You are a friendly assistant..."
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Message Template Node</h3>
                <p className="text-xs text-slate-500 font-medium">Design the core message and variable mapping.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-amber-600">Template Body</label>
                  <div className="flex gap-1.5">
                    {["Name", "Hotel", "Offer"].map(tag => (
                        <button key={tag} onClick={() => setFormData({...formData, template: formData.template + ` {{${tag}}}`})} className="text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase hover:bg-amber-200 transition-colors">+{tag}</button>
                    ))}
                  </div>
                </div>
                <textarea 
                  value={formData.template}
                  onChange={(e) => setFormData({...formData, template: e.target.value})}
                  rows={5}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-sm resize-none"
                  placeholder="Hello {{Name}}, ..."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <div>
                        <p className="text-xs font-black text-slate-700 uppercase tracking-tight">AI Variation Generator</p>
                        <p className="text-[10px] text-slate-500 font-medium">Changes wording for each recipient to avoid spam blocks.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setFormData({...formData, useAI: !formData.useAI})}
                    className={cn(
                        "w-12 h-6 rounded-full relative transition-all duration-300",
                        formData.useAI ? "bg-amber-500" : "bg-slate-300"
                    )}
                >
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", formData.useAI ? "left-7" : "left-1")} />
                </button>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl shadow-xl">
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2">Live Preview</p>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <p className="text-xs text-slate-200 leading-relaxed italic">
                        "Hello <span className="text-amber-400 font-bold">Rahul Sharma</span>, we have a special offer for you at <span className="text-amber-400 font-bold">Grand Palace Resort</span>!"
                    </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
              <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Schedule & Trigger Node</h3>
                <p className="text-xs text-slate-500 font-medium">Decide when this automation should fire.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                    { id: 'morning', label: '🌅 Morning', time: '07:00' },
                    { id: 'late-morning', label: '☀️ Late Morning', time: '10:00' },
                    { id: 'afternoon', label: '🌤️ Afternoon', time: '13:00' },
                    { id: 'evening', label: '🌆 Evening', time: '17:00' }
                ].map(p => (
                    <button 
                        key={p.id}
                        onClick={() => setFormData({...formData, scheduleType: p.id, scheduleTime: p.time})}
                        className={cn(
                            "p-4 rounded-2xl border text-sm font-bold transition-all text-left flex flex-col gap-1",
                            formData.scheduleType === p.id ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-white border-slate-100 text-slate-600 hover:border-rose-100"
                        )}
                    >
                        <span>{p.label}</span>
                        <span className="text-[10px] opacity-60 uppercase tracking-widest">{p.time}</span>
                    </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-rose-600">Start Date</label>
                    <input 
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-bold text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-rose-600">Custom Time</label>
                    <input 
                        type="time"
                        value={formData.scheduleTime}
                        onChange={(e) => setFormData({...formData, scheduleTime: e.target.value, scheduleType: 'custom'})}
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-bold text-sm"
                    />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-rose-500" />
                    <p className="text-xs font-black text-slate-700 uppercase tracking-tight">Repeat Daily Sequence</p>
                </div>
                <button 
                    onClick={() => setFormData({...formData, repeatDaily: !formData.repeatDaily})}
                    className={cn(
                        "w-12 h-6 rounded-full relative transition-all duration-300",
                        formData.repeatDaily ? "bg-rose-500" : "bg-slate-300"
                    )}
                >
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", formData.repeatDaily ? "left-7" : "left-1")} />
                </button>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-500 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900">Batch & Safety Settings</h3>
                <p className="text-xs text-slate-500 font-medium">Compliance rules to protect your WhatsApp number.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-600">Batch Size</label>
                  <div className="relative">
                    <input 
                      type="number"
                      readOnly
                      value={formData.batchSize}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm opacity-80"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 group cursor-help">
                        <Info className="w-4 h-4 text-slate-400" />
                        <div className="hidden group-hover:block absolute bottom-full mb-2 right-0 w-48 p-2 bg-slate-900 text-[10px] text-white rounded-lg z-50 shadow-xl">
                            Meta guidelines recommend max 50 messages per batch to avoid detection.
                        </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-600">Batch Delay (sec)</label>
                  <input 
                    type="number"
                    readOnly
                    value={formData.batchDelay}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm opacity-80"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-600">Individual Message Delay</label>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-sm font-black text-slate-700">Randomized 2s – 5s</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Always Enabled</span>
                </div>
              </div>

              <div className="p-5 bg-indigo-900 text-white rounded-3xl shadow-xl shadow-indigo-200/50">
                <div className="flex items-start gap-4">
                    <div className="bg-indigo-400/30 p-2 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-indigo-300" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-wider mb-1">WhatsApp Anti-Ban Active</h4>
                        <p className="text-[10px] text-indigo-200 font-medium leading-relaxed">
                            These settings follow WhatsApp Meta guidelines. No two messages will be identical thanks to AI variation, and delays simulate human typing patterns.
                        </p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        if (status === 'idle') {
          return (
            <div className="space-y-6 animate-in zoom-in-95 duration-300 text-center">
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-dashed border-primary/30">
                <Rocket className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Ready to Go Live?</h3>
                <p className="text-slate-500 font-medium">Please review your automation summary before starting.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                {[
                    { label: "Sheet", value: formData.sheetTab, icon: Database, color: "text-blue-500" },
                    { label: "API", value: formData.instanceName, icon: Send, color: "text-purple-500" },
                    { label: "AI Model", value: formData.aiModel, icon: Bot, color: "text-emerald-500" },
                    { label: "Schedule", value: `${formData.startDate} ${formData.scheduleTime}`, icon: Calendar, color: "text-rose-500" }
                ].map((item, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                            <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <p className="text-sm font-black text-slate-800 truncate">{item.value}</p>
                    </div>
                ))}
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded-lg accent-emerald-500" />
                    <span className="text-xs font-bold text-emerald-800">I confirm that all API keys and templates are correct.</span>
                </label>
              </div>

              <button 
                onClick={handleStartAutomation}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-emerald-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
                START AUTOMATION
              </button>
            </div>
          );
        }

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        {status === 'running' ? (
                            <>
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                Running Campaign...
                            </>
                        ) : status === 'completed' ? (
                            <>
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                Campaign Completed
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-6 h-6 text-rose-500" />
                                Campaign Failed
                            </>
                        )}
                    </h3>
                    <p className="text-slate-500 font-medium">Batch processing in progress: {progress.sent}/{progress.total} sent</p>
                </div>
                {status === 'completed' && (
                    <button 
                        onClick={() => { setStep(1); setStatus('idle'); setLogs([]); }}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all"
                    >
                        Reset Wizard
                    </button>
                )}
             </div>

             {/* Progress Bar */}
             <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out" 
                    style={{ width: `${(progress.sent / progress.total) * 100}%` }}
                />
             </div>

             {/* Live Logs & Error View */}
             <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {status === 'failed' ? 'Error Diagnostics' : 'Live Execution Logs'}
                    </p>
                    {status === 'failed' && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-rose-500 animate-pulse">
                            <AlertCircle className="w-3 h-3" /> System Fault Detected
                        </div>
                    )}
                </div>

                <div className={cn(
                    "rounded-[32px] p-8 h-[400px] overflow-y-auto font-mono text-xs space-y-4 shadow-2xl transition-all duration-500 border-2",
                    status === 'failed' ? "bg-rose-950 border-rose-500/30 text-rose-100" : "bg-slate-950 border-slate-800 text-slate-300"
                )}>
                    {logs.map((log, i) => (
                        <div key={i} className="space-y-3">
                            <div className="flex gap-3 items-start">
                                <span className="text-slate-500 shrink-0 mt-0.5 opacity-50">[{log.time}]</span>
                                <div className="flex-1">
                                    <p className={cn(
                                        "font-bold",
                                        log.type === 'error' ? "text-rose-400" :
                                        log.type === 'success' ? "text-emerald-400" :
                                        log.type === 'info' ? "text-primary" : "text-slate-200"
                                    )}>
                                        {log.message}
                                    </p>
                                    
                                    {log.details && (
                                        <div className="mt-2 p-4 bg-black/40 rounded-2xl border border-white/5 font-sans text-xs leading-relaxed">
                                            <p className="text-rose-200/70 mb-2 font-black uppercase text-[9px] tracking-widest">Error Detail</p>
                                            {log.details}
                                        </div>
                                    )}

                                    {log.hint && (
                                        <div className="mt-2 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 font-sans text-xs">
                                            <p className="text-emerald-400 mb-1 font-black uppercase text-[9px] tracking-widest flex items-center gap-1.5">
                                                <Info className="w-3 h-3" /> Recommendation
                                            </p>
                                            <p className="text-emerald-100/80">{log.hint}</p>
                                        </div>
                                    )}

                                    {log.stack && (
                                        <div className="mt-4">
                                            <p className="text-slate-500 mb-2 font-black uppercase text-[9px] tracking-widest">Stack Trace</p>
                                            <pre className="p-4 bg-black/60 rounded-xl overflow-x-auto text-[10px] text-rose-300/40 border border-white/5 scrollbar-hide">
                                                {log.stack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {i < logs.length - 1 && <div className="h-px bg-white/5" />}
                        </div>
                    ))}
                    
                    {status === 'running' && (
                        <div className="flex items-center gap-2 text-slate-500 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                            <span className="font-bold">Awaiting server events...</span>
                        </div>
                    )}
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[600px] bg-white rounded-[40px] shadow-2xl shadow-indigo-100/50 border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Progress Bar */}
      <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900">WhatsApp Automation</h2>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Root Admin Wizard</p>
                </div>
            </div>
            {onClose && (
                <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>

        <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-2 relative">
                    <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                        step >= s.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-white border border-slate-200 text-slate-400"
                    )}>
                        <s.icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-tight",
                        step === s.id ? "text-indigo-600" : "text-slate-400"
                    )}>{s.title}</span>
                    {s.id < 7 && (
                        <div className={cn(
                            "absolute left-12 top-5 w-[calc(100vw/7-40px)] lg:w-16 h-0.5 transition-all duration-700 hidden sm:block",
                            step > s.id ? "bg-indigo-600" : "bg-slate-100"
                        )} />
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Wizard Content */}
      <div className="flex-1 p-8 md:p-12 max-w-3xl mx-auto w-full">
        {renderStep()}
      </div>

      {/* Footer Navigation */}
      {status === 'idle' && (
          <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <button 
                onClick={prevStep}
                disabled={step === 1}
                className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all",
                    step === 1 ? "opacity-0 pointer-events-none" : "text-slate-500 hover:bg-slate-100"
                )}
            >
                <ChevronLeft className="w-4 h-4" /> Back
            </button>
            
            {step < 7 && (
                <button 
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-600/20 hover:scale-[1.05] active:scale-[0.95] transition-all"
                >
                    Continue <ChevronRight className="w-4 h-4" />
                </button>
            )}
          </div>
      )}
    </div>
  );
}
