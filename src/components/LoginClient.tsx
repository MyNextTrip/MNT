"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Mail, Lock, AlertCircle, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (searchParams?.get("registered") === "true") {
      setSuccessMsg("Account created successfully! Please log in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Login failed: ${text.substring(0, 100)}`);
      }
      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data.user));
      
      if (data.user.role === 'admin') {
        window.location.href = "/admin";
      } else if (data.user.role === 'hotel_admin') {
        window.location.href = "/hotel-admin";
      } else {
        const callbackUrl = searchParams?.get('callbackUrl');
        window.location.href = callbackUrl ? decodeURIComponent(callbackUrl) : "/";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-indigo-200/80">Login to access your dashboard.</p>
          </div>

          {successMsg && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-4 flex items-center gap-3 text-emerald-200">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              <p className="text-sm">{successMsg}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-200">
              <AlertCircle size={20} className="text-red-400 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-indigo-100 mb-1.5" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-0"><Mail className="h-5 w-5 text-indigo-300/70" /></div>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/20 text-white placeholder-indigo-200/50 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="you@example.com" />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-indigo-100" htmlFor="password">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-0"><Lock className="h-5 w-5 text-indigo-300/70" /></div>
                <input id="password" name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} className="block w-full pl-10 pr-12 py-3 border border-white/10 rounded-xl bg-black/20 text-white placeholder-indigo-200/50 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-300/70 hover:text-indigo-200">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-70 group">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (<>Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>)}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-indigo-200/70">Don't have an account? <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Sign up</Link></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex justify-center items-center"><Loader2 className="animate-spin text-white w-8 h-8"/></div>}>
      <LoginContent />
    </Suspense>
  );
}
