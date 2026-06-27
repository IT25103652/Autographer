"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useApp } from "../../../context/AppContext";
import { 
  Sparkles, 
  Search, 
  Filter, 
  Heart, 
  Download, 
  Star, 
  TrendingUp,
  ArrowRight,
  User,
  Tag,
  DollarSign,
  ChevronDown
} from "lucide-react";

export default function MarketplacePage() {
  const { user } = useAuth();
  const { themes, toggleFavorite } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["All", "Wedding", "Birthday", "Graduation", "Business", "Travel", "Fashion", "Luxury", "Studio", "Nature"];

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || theme.category === selectedCategory;
    const matchesPrice = priceFilter === "all" ||
                         (priceFilter === "free" && theme.creditCost === 0) ||
                         (priceFilter === "paid" && theme.creditCost > 0);
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      case "price-low":
        return a.creditCost - b.creditCost;
      case "price-high":
        return b.creditCost - a.creditCost;
      case "newest":
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  const handleFavorite = async (themeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(themeId);
  };

  return (
    <div className="w-full bg-[#0B0F19] min-h-screen">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Creator Marketplace</span>
          </div>
          
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-tight">
            Discover Premium Themes<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              From Community Creators
            </span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Browse thousands of AI-generated themes crafted by talented creators. Purchase credits to unlock exclusive presets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={user ? "/dashboard/seller" : "/login"}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
            >
              <span>Become a Seller</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search themes, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white transition-all"
            >
              <Filter className="h-5 w-5" />
              <span className="font-semibold">Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Category Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Price
                </label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Count */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">
            Showing <span className="text-white font-semibold">{filteredThemes.length}</span> themes
          </p>
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>Trending: Wedding, Business, Fashion</span>
          </div>
        </div>
      </section>

      {/* Theme Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredThemes.length === 0 ? (
          <div className="glass-card border border-white/10 rounded-2xl p-12 text-center">
            <Search className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-white mb-2">No themes found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredThemes.map((theme) => (
              <Link
                key={theme.id}
                href={user ? "/dashboard" : "/login"}
                className="group"
              >
                <div className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/5">
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={theme.image}
                      alt={theme.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {theme.isPopular && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>Popular</span>
                        </span>
                      </div>
                    )}
                    <button
                      onClick={(e) => handleFavorite(theme.id, e)}
                      className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-all"
                    >
                      <Heart className={`h-4 w-4 ${theme.isFavorite ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-white text-sm truncate">{theme.name}</h3>
                      <p className="text-slate-400 text-xs truncate">{theme.category}</p>
                    </div>

                    {/* Author */}
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-slate-400 text-xs truncate">{theme.authorName}</span>
                    </div>

                    {/* Price & Rating */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="text-indigo-400 font-bold text-sm">{theme.creditCost}</span>
                        <span className="text-slate-500 text-xs">credits</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-400 text-xs">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Become a Creator CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="glass-card border border-white/10 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
                Earn Money Creating Themes
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Join our creator marketplace and earn real revenue by designing and selling AI themes. Top creators earn hundreds of dollars monthly from theme downloads.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="text-2xl font-black text-white font-display">100%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Creator Payout</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="text-2xl font-black text-white font-display">500+</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Active Creators</div>
                </div>
              </div>

              <Link
                href={user ? "/dashboard/seller" : "/login"}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
              >
                <span>Start Selling</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="glass-card border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-semibold">NeonVibes</div>
                    <div className="text-slate-400 text-xs">Top Creator</div>
                  </div>
                  <div className="text-right">
                    <div className="text-indigo-400 font-bold">$345.50</div>
                    <div className="text-slate-500 text-[10px]">This Month</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Themes Sold</span>
                    <span className="text-white font-semibold">127</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Downloads</span>
                    <span className="text-white font-semibold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Avg. Rating</span>
                    <span className="text-white font-semibold">4.9 ★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="glass-card border border-white/10 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 leading-tight">
            Find Your Perfect Theme
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Browse our marketplace or create your own unique themes. Start with 5 free credits.
          </p>

          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
