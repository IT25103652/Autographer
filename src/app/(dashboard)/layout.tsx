"use client";

import React, { useState, useEffect } from "react";
import { useAuth, UserRole } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, Wallet, LogOut, User, Menu, X, ChevronRight,
  Layers, UploadCloud, TrendingUp, Users, CheckSquare, 
  Image, Zap, Sliders, Brush, RefreshCw, Star, MessageSquare,
  Shield, CreditCard, Gift, Clock, Settings
} from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, logout, switchRole } = useAuth();
  const { credits } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if logged out
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center space-y-4">
        <div className="p-3 bg-indigo-500/10 rounded-full animate-bounce">
          <Sparkles className="h-8 w-8 text-indigo-400 animate-pulse" />
        </div>
        <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
        <style jsx global>{`
          @keyframes loading {
            0% { left: -30%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    switchRole(role);
    if (role === "user") router.push("/dashboard");
    if (role === "seller") router.push("/seller");
    if (role === "photographer") router.push("/photographer");
    if (role === "admin") router.push("/admin");
  };

  // Define sidebar navigation items based on current active role
  const getSidebarLinks = () => {
    switch (user.role) {
      case "seller":
        return [
          { name: "Seller Dashboard", href: "/seller", icon: TrendingUp },
          { name: "Upload Themes", href: "/seller/upload", icon: UploadCloud },
          { name: "Earnings & Stats", href: "/seller/analytics", icon: CreditCard },
          { name: "Main Public Site", href: "/", icon: Layers },
        ];
      case "photographer":
        return [
          { name: "My Ad Listing", href: "/photographer", icon: User },
          { name: "Leads Inbox", href: "/photographer/leads", icon: MessageSquare },
          { name: "Main Public Site", href: "/", icon: Layers },
        ];
      case "admin":
        return [
          { name: "Admin Overview", href: "/admin", icon: Shield },
          { name: "User Accounts", href: "/admin/users", icon: Users },
          { name: "Theme Validation", href: "/admin/themes", icon: CheckSquare },
          { name: "Ads Approval", href: "/admin/ads", icon: Star },
          { name: "Main Public Site", href: "/", icon: Layers },
        ];
      case "user":
      default:
        return [
          { name: "Overview", href: "/dashboard", icon: Layers },
          { name: "AI Photo Generator", href: "/dashboard/tools/generator", icon: Zap },
          { name: "AI Style Transfer", href: "/dashboard/tools/style-transfer", icon: RefreshCw },
          { name: "AI Photo Enhancer", href: "/dashboard/tools/enhancer", icon: Sliders },
          { name: "Background Swap", href: "/dashboard/tools/background", icon: Image },
          { name: "Object Replacement", href: "/dashboard/tools/object-replacement", icon: Brush },
          { name: "Credit Wallet", href: "/dashboard/credits", icon: Wallet },
          { name: "Generation History", href: "/dashboard/history", icon: Clock },
          { name: "Referral Center", href: "/dashboard/referral", icon: Gift },
        ];
    }
  };

  const links = getSidebarLinks();
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col md:flex-row relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Sidebar Navigation */}
      <aside className={`w-72 bg-[#07090F] border-r border-white/5 shrink-0 flex flex-col fixed md:sticky top-0 h-screen z-40 transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm tracking-wider text-white">
              AUTOGRAPHER
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 md:hidden text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dashboard Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 scrollbar-thin">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {user.role} Navigation
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-indigo-500/10 text-indigo-300 border-l-2 border-indigo-500 shadow-md shadow-indigo-500/5"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4.5 w-4.5 ${active ? "text-indigo-400" : "text-slate-500"}`} />
                  <span>{link.name}</span>
                </div>
                {active && <ChevronRight className="h-3.5 w-3.5" />}
              </Link>
            );
          })}
        </nav>

        {/* User Card Foot */}
        <div className="p-4 border-t border-white/5 bg-[#0A0D14] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user.role} Account</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 hover:border-rose-500/30 text-rose-400 rounded-xl text-xs font-semibold transition-all duration-150"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Body Wrap */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Controls */}
        <header className="h-20 bg-[#07090F]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 sticky top-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            {/* Breadcrumb / Title */}
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 font-semibold tracking-wider uppercase">
              <span>Studio</span>
              <span className="text-slate-600">/</span>
              <span className="text-indigo-400 capitalize">{pathname.split("/").pop() || "Overview"}</span>
            </div>
          </div>

          {/* Sandbox Role Simulator & Wallet */}
          <div className="flex items-center space-x-4">
            {/* Simulator label */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <span className="text-[10px] font-bold text-yellow-500 tracking-wider uppercase">Sandbox:</span>
              <select
                value={user.role}
                onChange={handleRoleChange}
                className="bg-transparent text-xs font-semibold text-yellow-300 border-none outline-none focus:ring-0 cursor-pointer capitalize"
              >
                <option value="user" className="bg-[#0B0F19] text-white">General Client</option>
                <option value="seller" className="bg-[#0B0F19] text-white">Theme Creator</option>
                <option value="photographer" className="bg-[#0B0F19] text-white">Photographer</option>
                <option value="admin" className="bg-[#0B0F19] text-white">Administrator</option>
              </select>
            </div>

            {/* Credits Counter Pill */}
            {user.role === "user" && (
              <Link
                href="/dashboard/credits"
                className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl text-xs font-semibold text-indigo-300 transition-all duration-200"
              >
                <Wallet className="h-4 w-4 text-indigo-400" />
                <span>{credits} Credits</span>
              </Link>
            )}
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </div>
  );
}
