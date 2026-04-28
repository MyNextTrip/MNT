"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, User, Phone, Bot, Loader2, Sparkles, ShieldCheck, Quote, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function MNTChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "🌟 Welcome to MyNextTrip! I'm your MNT AI Expert. I can help you find premium hotels in Patna, Ranchi, Motihari, and Nepal. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  // Lead form state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", whatsapp: "" });
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Tricky trigger for lead form - Show after 3 bot messages or a specific keyword
  useEffect(() => {
    const botMessagesCount = messages.filter(m => m.role === "bot").length;
    if (!isLeadCaptured && botMessagesCount >= 3 && !showLeadForm) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "bot") {
        setTimeout(() => setShowLeadForm(true), 3000);
      }
    }
  }, [messages, isLeadCaptured, showLeadForm]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-IN";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleSend(transcript, true);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition error:", e);
      }
    }
  };

  const speak = (text: string) => {
    if (!isVoiceEnabled || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string = input, shouldSpeak: boolean = false) => {
    if (!text.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: text } as Message];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, isVoice: shouldSpeak }),
      });

      const data = await response.json();
      if (data.text) {
        const botMsg = { role: "bot", content: data.text } as Message;
        setMessages((prev) => [...prev, botMsg]);
        if (shouldSpeak) {
          speak(data.text);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "I'm having a little trouble connecting. Please try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name || !leadData.whatsapp) return;

    setIsLoading(true);
    try {
      await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadData }),
      });
      setIsLeadCaptured(true);
      setShowLeadForm(false);
      setMessages((prev) => [...prev, { role: "bot", content: `Excellent! Thank you ${leadData.name}. I've sent your request to our priority desk. Our expert will contact you on ${leadData.whatsapp} with a personalized 20% discount offer! 🚀` }]);
    } catch (error) {
      console.error("Lead submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-32px)] md:w-[480px] lg:w-[520px] h-[calc(100dvh-120px)] md:h-[calc(100vh-140px)] max-h-[850px] bg-white/95 backdrop-blur-3xl rounded-[32px] md:rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-white/40 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-700 hover:shadow-[0_50px_120px_rgba(0,0,0,0.35)] transition-shadow">
          {/* Header */}
          <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 via-primary to-indigo-900 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="relative">
                <div className="w-14 h-14 bg-white/10 rounded-[20px] flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-xl group">
                  <Bot className="w-8 h-8 text-secondary fill-secondary/20 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-black text-2xl tracking-tight flex items-center gap-2">
                  MNT ChatBot <Sparkles className="w-5 h-5 text-secondary fill-secondary animate-pulse" />
                </h3>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                   <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Online & Ready</p>
                </div>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }} 
              className="p-3 hover:bg-white/10 rounded-full transition-all hover:rotate-90 text-white/70 hover:text-white group/close relative z-50"
              aria-label="Close Chat"
              suppressHydrationWarning
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/50 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500", msg.role === "user" ? "items-end" : "items-start")}>
                <div className={cn(
                  "max-w-[88%] p-5 md:p-6 rounded-[30px] text-[15px] md:text-base font-medium shadow-sm leading-relaxed",
                  msg.role === "user" 
                    ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-slate-200/50"
                )}>
                  {msg.content}
                </div>
                {msg.role === "bot" && i === 0 && (
                   <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        { label: "🏨 Hotels in Ranchi", val: "Hotels in Ranchi" },
                        { label: "🏙️ Patna Stays", val: "Patna Stays" },
                        { label: "🏔️ Nepal Packages", val: "Nepal Tour Packages" },
                        { label: "🏛️ Motihari Hotels", val: "Motihari Hotels" },
                        { label: "✈️ Flight Deals", val: "Cheap Flights" }
                      ].map((tag) => (
                        <button 
                          key={tag.val} 
                          onClick={() => handleSend(tag.val)} 
                          className="text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                          {tag.label}
                        </button>
                      ))}
                   </div>
                )}
              </div>
            ))}
            {isLoading && !showLeadForm && (
              <div className="flex items-center gap-4 text-slate-400 p-4 bg-white/50 rounded-3xl w-fit">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-xs font-black uppercase tracking-[0.2em] animate-pulse">MNT Expert is thinking...</span>
              </div>
            )}
          </div>

          {/* Lead Form Overlay */}
          {showLeadForm && !isLeadCaptured && (
            <div className="absolute inset-0 z-30 bg-slate-900/70 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-700">
              <div className="bg-white rounded-[50px] p-10 w-full shadow-2xl border border-white/20 relative overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Close Button for Lead Form */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-primary transition-colors z-20 group/close-form"
                  aria-label="Close Chatbot"
                  suppressHydrationWarning
                >
                  <X className="w-6 h-6 group-hover/close-form:rotate-90 transition-transform" />
                </button>
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                
                <div className="text-center mb-10 relative z-10">
                  <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-lg">
                    <Quote className="w-10 h-10 text-primary fill-primary/10" />
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 mb-3">One Step Closer!</h4>
                  <p className="text-slate-500 text-base font-medium leading-relaxed italic">
                    "Collect moments, not things." 🌍
                  </p>
                  <p className="text-slate-400 text-sm mt-4 font-bold uppercase tracking-widest">
                    Enter details for <span className="text-primary">20% Discount</span>
                  </p>
                </div>
                
                <form onSubmit={submitLead} className="space-y-6 relative z-10">
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 group-focus-within:text-primary transition-all">
                      <User className="w-6 h-6" />
                    </div>
                    <input 
                      type="text" 
                      required 
                      placeholder="Your Name"
                      value={leadData.name}
                      onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[30px] focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all font-black text-slate-800 placeholder:text-slate-400 shadow-inner text-lg"
                      suppressHydrationWarning
                    />
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center">
                       <Image src="/images/whatsapp-icon.png" alt="WA" width={26} height={26} className="grayscale opacity-50 group-focus-within:grayscale-0 group-focus-within:opacity-100 transition-all drop-shadow-md" />
                    </div>
                    <input 
                      type="tel" 
                      required 
                      placeholder="WhatsApp Number"
                      value={leadData.whatsapp}
                      onChange={(e) => setLeadData({...leadData, whatsapp: e.target.value})}
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[30px] focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all font-black text-slate-800 placeholder:text-slate-400 shadow-inner text-lg"
                      suppressHydrationWarning
                    />
                  </div>
                  
                  <button type="submit" disabled={isLoading} className="w-full py-6 bg-slate-900 text-white font-black rounded-[30px] hover:bg-primary transition-all transform hover:-translate-y-1.5 active:scale-95 flex items-center justify-center gap-4 shadow-2xl group overflow-hidden relative" suppressHydrationWarning>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin relative z-10" /> : (
                      <>
                        <span className="uppercase tracking-[0.3em] text-sm relative z-10">Get My Discount</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 md:p-8 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 md:gap-4 bg-slate-100 p-2 md:p-3 rounded-[35px] border border-slate-200 focus-within:border-primary focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-primary/10 transition-all">
              <button 
                onClick={toggleListening}
                className={cn(
                  "p-3 md:p-4 rounded-full transition-all relative overflow-hidden group shadow-lg",
                  isListening ? "bg-red-500 text-white scale-110" : "bg-white text-slate-400 hover:text-primary hover:shadow-xl"
                )}
                suppressHydrationWarning
              >
                {isListening ? (
                  <>
                    <Mic className="w-5 h-5 md:w-6 md:h-6 relative z-10 animate-pulse" />
                    <span className="absolute inset-0 bg-white/20 animate-ping"></span>
                  </>
                ) : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
              
              <input 
                type="text"
                placeholder="Ask me..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input, false)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base font-black text-slate-800 placeholder:text-slate-400 px-1 md:px-2"
                suppressHydrationWarning
              />

              <button 
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={cn(
                  "p-2 md:p-3 rounded-2xl transition-all",
                  isVoiceEnabled ? "text-primary bg-primary/10 shadow-inner" : "text-slate-300 hover:text-slate-400"
                )}
                suppressHydrationWarning
              >
                {isVoiceEnabled ? <Volume2 className="w-5 h-5 md:w-6 md:h-6" /> : <VolumeX className="w-5 h-5 md:w-6 md:h-6" />}
              </button>

              <button 
                onClick={() => handleSend(input, false)}
                disabled={!input.trim() || isLoading}
                className="p-3 md:p-5 bg-primary text-white rounded-[20px] md:rounded-[25px] hover:bg-slate-900 transition-all disabled:opacity-50 shadow-2xl shadow-primary/40 transform hover:-translate-y-1 active:scale-95"
                suppressHydrationWarning
              >
                <Send className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative flex items-center gap-5 p-3 rounded-full transition-all duration-700 hover:scale-110 active:scale-90 shadow-[0_20px_50px_rgba(0,0,0,0.2)]",
          isOpen ? "bg-slate-900 text-white rotate-180" : "bg-white text-primary"
        )}
        suppressHydrationWarning
      >
        <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white relative overflow-hidden shadow-2xl group-hover:shadow-primary/60 transition-all border-4 border-white/80">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-primary to-indigo-500 opacity-60"></div>
          {isOpen ? <X className="w-6 h-6 md:w-8 md:h-8 relative z-10" /> : <Bot className="w-6 h-6 md:w-8 md:h-8 relative z-10" />}
          
          {!isOpen && (
            <div className="absolute inset-0 rounded-full border-4 border-primary/40 animate-ping duration-[2000ms]"></div>
          )}
        </div>
        {!isOpen && (
          <div className="pr-10 pl-2 hidden md:block text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              <span className="block text-[11px] font-black text-primary uppercase tracking-[0.4em] leading-none">MNT Travel Expert</span>
            </div>
            <span className="block text-lg font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">Chat with MNT Bot</span>
          </div>
        )}
      </button>
    </div>
  );
}
