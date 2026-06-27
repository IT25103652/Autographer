"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { Sparkles, Menu, X, Wallet, LogOut, LayoutDashboard, User } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { credits } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Photographers", href: "/photographers" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                AUTOGRAPHER
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium text-sm transition-colors duration-250 ${
                  isActive(link.href)
                    ? "text-indigo-400 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Credit Pill */}
                <Link
                  href="/dashboard/credits"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 rounded-full text-xs font-semibold text-indigo-300 transition-all duration-200"
                >
                  <Wallet className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{credits} Credits</span>
                </Link>

                {/* Dashboard Button */}
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/15"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={() => logout()}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-all duration-200"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/5 py-4 px-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-base font-medium ${
                isActive(link.href)
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-white/5 my-2" />
          {user ? (
            <div className="space-y-3 px-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </span>
                <span className="text-xs bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                  {credits} Credits
                </span>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white text-sm font-semibold shadow-lg shadow-indigo-500/15"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-semibold border border-rose-500/20"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-semibold"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
