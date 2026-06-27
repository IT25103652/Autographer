"use client";

import React, { useState, useEffect } from "react";
import { useAuth, UserRole } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Lock, User, ArrowRight, UserCheck, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const { user, login, register, switchRole, loading } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user && !submitting) {
      router.push("/dashboard");
    }
  }, [user, router, submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
        // Set their custom selected role on register
        await switchRole(selectedRole);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please verify credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] bg-grid-pattern relative flex items-center justify-center p-4">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md glass-card rounded-2xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

        {/* Logo and Greeting */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center space-x-2 group mb-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-white">
              AUTOGRAPHER
            </span>
          </Link>
          <p className="text-xs text-slate-400 text-center">
            {isLogin
              ? "Access your studio, check credits, and generate high-end portraits."
              : "Create a free studio account and receive 5 free credits."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center space-x-2 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl mb-6">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input (Register Only) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <User className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  type="text"
                  placeholder="Chanidu Mendis"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Mail className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="email"
                placeholder="studio@autographer.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              {isLogin && (
                <span className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer">
                  Forgot?
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Lock className="h-4 w-4 text-slate-500" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Role Selection (Register Only) */}
          {!isLogin && (
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Choose Account Type
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(["user", "seller", "photographer"] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`py-2 px-1 text-center rounded-xl border text-[10px] font-bold capitalize transition-all duration-200 ${
                      selectedRole === role
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/10"
                        : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {role === "user" ? "Client" : role === "seller" ? "Creator" : "Photog"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20"
          >
            <span>{submitting ? "Processing..." : isLogin ? "Sign In" : "Register Now"}</span>
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-xs text-slate-400 hover:text-indigo-300 font-medium transition-colors"
          >
            {isLogin ? (
              <span>
                Don't have an account? <strong className="text-indigo-400">Create Account</strong>
              </span>
            ) : (
              <span>
                Already have an account? <strong className="text-indigo-400">Sign In</strong>
              </span>
            )}
          </button>
        </div>

        {/* Sandbox Notice */}
        <div className="mt-4 flex items-center justify-center space-x-1.5 text-[9px] text-slate-500">
          <UserCheck className="h-3 w-3 text-emerald-500" />
          <span>Sandbox Mode Enabled: Instantly registers & logs in via LocalStorage.</span>
        </div>
      </div>
    </div>
  );
}
