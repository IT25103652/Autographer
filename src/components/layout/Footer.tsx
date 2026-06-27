"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Send, Check } from "lucide-react";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-[#07090F] border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Logo & Vision */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                AUTOGRAPHER
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Transform ordinary selfies into professional studio-quality photos. Browse creator presets, buy custom themes, list photographer ads, or earn credits today.
            </p>
            {/* Social handles */}
            <div className="flex space-x-4 text-slate-500 text-sm">
              <span className="hover:text-indigo-400 cursor-pointer transition-colors duration-200">Twitter</span>
              <span className="hover:text-indigo-400 cursor-pointer transition-colors duration-200">Instagram</span>
              <span className="hover:text-indigo-400 cursor-pointer transition-colors duration-200">LinkedIn</span>
              <span className="hover:text-indigo-400 cursor-pointer transition-colors duration-200">Discord</span>
            </div>
          </div>

          {/* Links: Platform */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              <li><Link href="/features" className="hover:text-white transition-colors">AI Photo Gen</Link></li>
              <li><Link href="/features#style-transfer" className="hover:text-white transition-colors">Style Transfer</Link></li>
              <li><Link href="/features#object-replace" className="hover:text-white transition-colors">Object Replacement</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing & Credits</Link></li>
            </ul>
          </div>

          {/* Links: Marketplace */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Ecosystem</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              <li><Link href="/marketplace" className="hover:text-white transition-colors">Theme Marketplace</Link></li>
              <li><Link href="/photographers" className="hover:text-white transition-colors">Photographer Directory</Link></li>
              <li><Link href="/marketplace#sell" className="hover:text-white transition-colors">Become a Seller</Link></li>
              <li><Link href="/photographers#ad" className="hover:text-white transition-colors">Advertise with Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Stay Updated</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Subscribe to get notified of new visual themes, creator features, and pricing discounts.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200"
              >
                {subscribed ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-teal-400 text-[10px] font-semibold animate-pulse-slow">
                Subscription successful! Check your inbox soon.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Autographer. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Licensing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
