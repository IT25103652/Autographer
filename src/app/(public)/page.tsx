"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, RefreshCw, Sliders, Image, Brush, Star, ArrowUpRight, DollarSign } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  
  // Interactive Slider State
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Only drag on click-hold
      handleMove(e.clientX);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const tools = [
    {
      title: "AI Studio Generator",
      description: "Transform selfies into wedding, graduation, or executive portraits instantly.",
      icon: Zap,
      credits: 3,
      color: "from-indigo-500 to-indigo-600",
      bgGlow: "shadow-indigo-500/10",
      href: "/features#generator"
    },
    {
      title: "AI Style Transfer",
      description: "Clone lighting, colors, and camera mood from any reference snapshot.",
      icon: RefreshCw,
      credits: 2,
      color: "from-purple-500 to-purple-600",
      bgGlow: "shadow-purple-500/10",
      href: "/features#style"
    },
    {
      title: "AI Photo Enhancer",
      description: "Restore blur, reduce image grain, upscale quality, and fix lights.",
      icon: Sliders,
      credits: 1,
      color: "from-teal-500 to-teal-600",
      bgGlow: "shadow-teal-500/10",
      href: "/features#enhancer"
    },
    {
      title: "Background Swap",
      description: "Drape yourself in luxury hotels, sand beaches, or high-rise offices.",
      icon: Image,
      credits: 2,
      color: "from-pink-500 to-pink-600",
      bgGlow: "shadow-pink-500/10",
      href: "/features#background"
    },
    {
      title: "Object Replacement",
      description: "Swap outfits, change hairstyles, or add watches and accessories.",
      icon: Brush,
      credits: 5,
      color: "from-blue-500 to-blue-600",
      bgGlow: "shadow-blue-500/10",
      href: "/features#object"
    }
  ];

  return (
    <div className="w-full relative bg-[#0B0F19]">
      {/* Decorative Gradients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-radial-gradient pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-300 mb-6 animate-float">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Zero Prompts. Pure Studio Quality.</span>
        </div>
        
        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white mb-6 leading-[1.1]">
          Professional Studio Shoots<br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Without Leaving Your Home
          </span>
        </h1>
        
        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          The all-in-one AI creative economy. Generate studio-quality wedding, graduation, and corporate photos, trade presets in the creator marketplace, and advertise photographer services.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href={user ? "/dashboard" : "/login"}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:scale-[1.02] text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2.5"
          >
            <span>Start Generating Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/features"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold rounded-2xl transition-all duration-200 flex items-center justify-center"
          >
            Explore AI Engines
          </Link>
        </div>

        {/* 2. DYNAMIC BEFORE/AFTER SLIDER */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Interactive Showcase: Drag to view transformation
          </div>
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={handleClick}
            className="relative h-[300px] sm:h-[450px] w-full rounded-2xl border border-white/10 overflow-hidden cursor-ew-resize select-none shadow-2xl shadow-indigo-500/5"
          >
            {/* After: Business Headshot (Base Image) */}
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop" 
              alt="Studio Headshot" 
              className="absolute inset-0 h-full w-full object-cover object-top pointer-events-none"
            />
            
            <div className="absolute right-4 bottom-4 z-20 px-3 py-1.5 bg-black/75 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
              Studio Result (Theme: Executive)
            </div>

            {/* Before: Ordinary Selfie (Clipped Overlay) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden z-10"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop" 
                alt="Ordinary Selfie" 
                className="absolute inset-y-0 left-0 h-full object-cover object-top max-w-none pointer-events-none"
                style={{ width: containerRef.current?.getBoundingClientRect().width }}
              />
              <div className="absolute left-4 bottom-4 z-20 px-3 py-1.5 bg-black/75 backdrop-blur-sm border border-indigo-500/30 text-indigo-400 text-[10px] font-bold rounded-lg uppercase tracking-wider whitespace-nowrap">
                Uploaded Selfie
              </div>
            </div>

            {/* Divider Handle */}
            <div 
              className="absolute inset-y-0 z-20 w-[2px] bg-gradient-to-b from-indigo-400 via-white to-purple-400"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-2xl border border-indigo-500/20 font-bold text-sm">
                ↔
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI ENGINES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 relative">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4">
            Five Intelligent AI Engines
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Zero manuals or configurations. Select options from graphical menus and watch our neural nodes carry out professional adjustments in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.title}
                className="glass-card glass-card-hover rounded-2xl p-8 border border-white/5 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Icon Block */}
                  <div className={`inline-flex p-3 bg-gradient-to-tr ${tool.color} rounded-xl shadow-lg ${tool.bgGlow} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  {/* Title & Body */}
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-white">{tool.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{tool.description}</p>
                  </div>
                </div>

                {/* Info and Link */}
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Spend: <strong className="text-indigo-400">{tool.credits} Credits</strong>
                  </span>
                  <Link 
                    href={tool.href}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 group"
                  >
                    <span>Learn More</span>
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. ECOSYSTEM STATEMENT */}
      <section className="bg-gradient-to-b from-transparent to-[#07090F] py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white leading-tight">
              A Complete Creator & Photographer Economy
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We aren't just an AI utility — we host a complete ecosystem. Prompt designers can package and sell themes on our Creator Marketplace, earning real revenue on downloads. 
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Professional photographers can set up premium local listings, generating leads and clients from small business owners and creators looking for premium human photoshoots.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <div className="text-2xl font-black text-white font-display">100%</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Creator Payouts</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                <div className="text-2xl font-black text-white font-display">0 DSN</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">No prompt writing</div>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Visual card represent marketplace / photographer */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-20" />
            
            <div className="relative bg-[#0F1423] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
              {/* Creator preview card */}
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" alt="Creator" className="h-10 w-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Theme: Rose Gold Gala</h4>
                    <p className="text-[10px] text-slate-400">By Creator @NeonVibes</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md">
                  Earned $345.50
                </span>
              </div>

              {/* Photographer preview card */}
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-purple-500/30 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <img src="https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=150" alt="Photog" className="h-10 w-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Amesh Wijesinghe</h4>
                    <p className="text-[10px] text-slate-400">Colombo • 4.9 Stars (56 Reviews)</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-purple-500/15 border border-purple-500/20 text-purple-300 px-2 py-1 rounded-md">
                  $50 - $150 / hr
                </span>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/marketplace"
                  className="py-3 text-center bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/20 rounded-xl text-xs"
                >
                  Explore Marketplace
                </Link>
                <Link 
                  href="/photographers"
                  className="py-3 text-center bg-purple-500/10 hover:bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/20 rounded-xl text-xs"
                >
                  Hire Photographers
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="glass-card border border-white/10 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 leading-tight">
            Ready to Generate Studio-Quality Portraits?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Create your account now, get 5 free credits instantly, and explore our premium selection of themes. No credit card required.
          </p>

          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
