"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Send, Bot, User, Sparkles, 
  X, MessageSquare, Phone, Globe, ShieldCheck, 
  ArrowRight, CreditCard, Star, Clock, MapPin
} from 'lucide-react';
import MNTAIAvatar from '@/components/MNTAIAvatar';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Message {
  role: 'user' | 'bot';
  content: string;
  type?: 'text' | 'hotel-card' | 'quick-actions';
  data?: any;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: "Welcome to the future of hospitality. I am your MNT AI Avatar Assistant. How can I help you book your next luxury escape today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = "en-IN";
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleSend(transcript);
          setIsListening(false);
        };
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: text } as Message];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (data.text) {
        const botMsg = { role: 'bot', content: data.text } as Message;
        setMessages((prev) => [...prev, botMsg]);
        speak(data.text);
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-primary/30">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] min-h-[600px]">
          
          {/* Left Side: 3D Avatar Area */}
          <div className="lg:col-span-5 relative flex flex-col justify-center items-center bg-gradient-to-b from-slate-900/50 to-transparent rounded-[40px] border border-white/5 overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,59,149,0.1),transparent)] pointer-events-none" />
            
            <div className="relative z-10 w-full h-full">
              <MNTAIAvatar isSpeaking={isSpeaking} />
            </div>

            {/* AI Info Overlay */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-10 left-10 right-10 p-6 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">MNT AI ASSISTANT</h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">High Performance Mode</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Chat Section */}
          <div className="lg:col-span-7 flex flex-col bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 overflow-hidden relative">
            
            {/* Chat Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Hospitality Desk</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">+12 Online Experts</p>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    className={cn(
                      "flex items-end gap-3",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                      msg.role === 'user' ? "bg-primary/20 border-primary/30" : "bg-white/10 border-white/10"
                    )}>
                      {msg.role === 'user' ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    
                    <div className={cn(
                      "max-w-[80%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-xl",
                      msg.role === 'user' 
                        ? "bg-primary text-white rounded-br-none" 
                        : "bg-white/10 text-slate-200 border border-white/5 rounded-bl-none backdrop-blur-md"
                    )}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Carousel */}
            <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5">
              {[
                "🏨 Find Hotels", "💎 Luxury Stays", "💑 Couple Friendly", 
                "👨‍👩‍👧 Family Rooms", "✈️ Airport Stays", "📞 Support"
              ].map((action) => (
                <button
                  key={action}
                  onClick={() => handleSend(action.split(' ').slice(1).join(' '))}
                  className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/5 border-t border-white/5">
              <div className="flex items-center gap-4 bg-white/10 p-2 pl-4 rounded-[24px] border border-white/10 focus-within:border-primary/50 transition-all shadow-2xl">
                <button 
                  onClick={toggleListening}
                  className={cn(
                    "p-3 rounded-full transition-all relative overflow-hidden",
                    isListening ? "bg-red-500 text-white scale-110" : "text-white/40 hover:text-white"
                  )}
                >
                  {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                  {isListening && <span className="absolute inset-0 bg-white/20 animate-ping rounded-full" />}
                </button>
                
                <input 
                  type="text"
                  placeholder="Ask MNT AI about your next trip..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 font-medium"
                />

                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-4 bg-primary text-white rounded-2xl hover:bg-primary/80 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 transform active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Hotel Cards Section (Smart Recommendations) */}
        <div className="mt-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
                Smart Recommendations <Sparkles className="w-6 h-6 text-primary" />
              </h2>
              <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Based on your preferences</p>
            </div>
            <button className="text-primary font-black flex items-center gap-2 group">
              View All <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Gharonda Hotel", location: "Patna, Bihar", price: "₹2,000", tag: "Luxury" },
              { name: "Hotel La Vista", location: "Ranchi, Jharkhand", price: "₹1,400", tag: "Nature" },
              { name: "Hotels Ichchha", location: "Bara, Nepal", price: "₹4,000", tag: "Elite" },
              { name: "Siddhi Vinayak", location: "Motihari, Bihar", price: "₹1,600", tag: "Premium" }
            ].map((hotel, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 p-6 group cursor-pointer hover:bg-white/10 transition-all"
              >
                <div className="w-full aspect-[4/3] bg-slate-800 rounded-2xl mb-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary rounded-full text-[10px] font-black uppercase tracking-wider">
                    {hotel.tag}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-xl text-white group-hover:text-primary transition-colors">{hotel.name}</h3>
                      <div className="flex items-center gap-1 text-white/40 text-sm mt-1">
                        <MapPin className="w-3 h-3" /> {hotel.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Starting from</p>
                      <p className="text-xl font-black text-primary">{hotel.price}<span className="text-xs text-white/40 font-medium">/night</span></p>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/30 blur-[150px] rounded-full" />
      </div>
    </div>
  );
}
