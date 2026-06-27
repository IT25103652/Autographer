"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useApp } from "../../../context/AppContext";
import { 
  Sparkles, 
  Wallet, 
  TrendingUp, 
  Heart, 
  Gift, 
  ArrowRight, 
  Zap,
  Image as ImageIcon,
  Clock,
  Download,
  Star,
  Shuffle,
  Loader2
} from "lucide-react";

export default function DashboardOverview() {
  const { user } = useAuth();
  const { credits, generations, themes, spendCredits, saveGeneration } = useApp();
  const [surpriseMode, setSurpriseMode] = useState(false);
  const [surpriseProgress, setSurpriseProgress] = useState(0);
  const [surpriseStatus, setSurpriseStatus] = useState("");

  const stats = [
    {
      label: "Total Generations",
      value: generations.length,
      icon: ImageIcon,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20"
    },
    {
      label: "Active Favorites",
      value: themes.filter(t => t.isFavorite).length,
      icon: Heart,
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20"
    },
    {
      label: "Referral Earnings",
      value: "$0.00",
      icon: Gift,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20"
    }
  ];

  const handleSurpriseMe = async () => {
    if (credits < 3) {
      alert("Not enough credits! You need 3 credits to generate.");
      return;
    }

    setSurpriseMode(true);
    setSurpriseProgress(0);

    const steps = [
      "Selecting random theme...",
      "Uploading your selfie...",
      "Extracting facial features...",
      "Injecting AI theme prompt...",
      "Polishing studio lighting...",
      "Final studio render..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setSurpriseStatus(steps[i]);
      setSurpriseProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Deduct credits
    await spendCredits(3, "Surprise Me AI Generation");

    // Save mock generation
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    await saveGeneration(
      "generator",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
      randomTheme.image,
      randomTheme.name
    );

    setSurpriseMode(false);
    setSurpriseProgress(0);
    setSurpriseStatus("");
  };

  return (
    <div className="w-full space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-slate-400 text-sm">
                  Ready to create stunning studio-quality photos? You have {credits} credits available.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/tools/generator"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
                >
                  <Zap className="h-4 w-4" />
                  <span>Start Generating</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/credits"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-200"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Buy Credits</span>
                </Link>
              </div>
            </div>

            <div className="glass-panel border border-white/5 rounded-2xl p-6 min-w-[200px]">
              <div className="text-center space-y-2">
                <div className="text-4xl font-black text-indigo-400 font-display">{credits}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Credits Available</div>
                <div className="pt-2 border-t border-white/5">
                  <Link
                    href="/pricing"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View Plans →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`glass-card border ${stat.borderColor} rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <Icon className={`h-5 w-5 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                <div className={`text-2xl font-black text-white font-display`}>
                  {stat.value}
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Surprise Me Widget */}
      <div className="glass-card border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-xl">
                <Shuffle className="h-5 w-5 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white">Surprise Me</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Let AI pick a random theme and style for you. Perfect for when you want to explore creative possibilities without choosing.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Zap className="h-3.5 w-3.5" />
              <span>Costs 3 credits per generation</span>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            {surpriseMode ? (
              <div className="glass-panel border border-white/5 rounded-2xl p-6 min-w-[300px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm mb-2">{surpriseStatus}</p>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                        style={{ width: `${surpriseProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSurpriseMe}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2"
              >
                <Shuffle className="h-5 w-5" />
                <span>Generate Random</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Generations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">Recent Generations</h2>
            <p className="text-slate-400 text-sm mt-1">Your latest AI-generated photos</p>
          </div>
          <Link
            href="/dashboard/history"
            className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {generations.length === 0 ? (
          <div className="glass-card border border-white/10 rounded-2xl p-12 text-center">
            <ImageIcon className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-white mb-2">No generations yet</h3>
            <p className="text-slate-400 text-sm mb-6">Start creating amazing photos with our AI tools</p>
            <Link
              href="/dashboard/tools/generator"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200"
            >
              <Zap className="h-4 w-4" />
              <span>Create Your First Photo</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {generations.slice(0, 8).map((gen) => (
              <div
                key={gen.id}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/5"
              >
                <div className="relative aspect-square">
                  <img
                    src={gen.afterUrl}
                    alt={gen.themeName || "Generated Photo"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full hover:translate-y-0 transition-transform duration-200">
                    <div className="space-y-2">
                      <button className="w-full py-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1">
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {gen.tool}
                    </span>
                    <div className="flex items-center space-x-1 text-slate-400 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(gen.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {gen.themeName && (
                    <p className="text-white text-sm font-medium truncate">{gen.themeName}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass-card border border-white/10 rounded-2xl p-8">
        <h2 className="font-display font-bold text-2xl text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/tools/generator"
            className="p-4 bg-white/5 border border-white/5 hover:border-indigo-500/30 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">AI Generator</div>
                <div className="text-slate-500 text-xs">3 credits</div>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/tools/style-transfer"
            className="p-4 bg-white/5 border border-white/5 hover:border-purple-500/30 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <Shuffle className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Style Transfer</div>
                <div className="text-slate-500 text-xs">2 credits</div>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/tools/enhancer"
            className="p-4 bg-white/5 border border-white/5 hover:border-teal-500/30 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-500/10 rounded-lg group-hover:bg-teal-500/20 transition-colors">
                <Star className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Photo Enhancer</div>
                <div className="text-slate-500 text-xs">1 credit</div>
              </div>
            </div>
          </Link>

          <Link
            href="/marketplace"
            className="p-4 bg-white/5 border border-white/5 hover:border-pink-500/30 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                <Heart className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Browse Themes</div>
                <div className="text-slate-500 text-xs">Marketplace</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
