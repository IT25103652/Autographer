"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useApp } from "../../../context/AppContext";
import { 
  Sparkles, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  DollarSign, 
  Mail, 
  Phone,
  Calendar,
  ChevronDown,
  ArrowRight,
  Camera,
  Award,
  Users
} from "lucide-react";

export default function PhotographersPage() {
  const { user } = useAuth();
  const { photographers } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    photographer: any;
  }>({
    open: false,
    photographer: null
  });

  const locations = ["All", "Colombo", "Kandy", "New York", "Los Angeles", "London", "Tokyo", "Singapore"];
  const priceRanges = [
    { id: "all", label: "All Prices" },
    { id: "budget", label: "Under $50/hr" },
    { id: "mid", label: "$50 - $150/hr" },
    { id: "premium", label: "$150+/hr" }
  ];

  const filteredPhotographers = photographers.filter(photog => {
    const matchesSearch = photog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         photog.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "All" || photog.location.includes(selectedLocation);
    
    let matchesPrice = true;
    if (priceRange === "budget") {
      matchesPrice = photog.price.includes("$30") || photog.price.includes("$40");
    } else if (priceRange === "mid") {
      matchesPrice = photog.price.includes("$50") || photog.price.includes("$100") || photog.price.includes("$150");
    } else if (priceRange === "premium") {
      matchesPrice = photog.price.includes("$150") || photog.price.includes("$300");
    }

    return matchesSearch && matchesLocation && matchesPrice && photog.status === "approved";
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviewCount - a.reviewCount;
      case "price-low":
        return parseInt(a.price.match(/\d+/)?.[0] || "0") - parseInt(b.price.match(/\d+/)?.[0] || "0");
      case "price-high":
        return parseInt(b.price.match(/\d+/)?.[0] || "0") - parseInt(a.price.match(/\d+/)?.[0] || "0");
      default:
        return 0;
    }
  });

  const handleBooking = (photographer: any) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setBookingModal({ open: true, photographer });
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
            <Camera className="h-3.5 w-3.5" />
            <span>Photographer Directory</span>
          </div>
          
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-tight">
            Hire Professional Photographers<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              In Your Area
            </span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect with verified professional photographers for weddings, events, portraits, and commercial shoots. Book directly through our platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={user ? "/dashboard/photographer" : "/login"}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
            >
              <span>List Your Services</span>
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
                placeholder="Search photographers by name or location..."
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
              {/* Location Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                >
                  {priceRanges.map(range => (
                    <option key={range.id} value={range.id}>{range.label}</option>
                  ))}
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
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
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
            Showing <span className="text-white font-semibold">{filteredPhotographers.length}</span> photographers
          </p>
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <MapPin className="h-4 w-4" />
            <span>Top locations: Colombo, New York, London</span>
          </div>
        </div>
      </section>

      {/* Photographer Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredPhotographers.length === 0 ? (
          <div className="glass-card border border-white/10 rounded-2xl p-12 text-center">
            <Camera className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-white mb-2">No photographers found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotographers.map((photog) => (
              <div
                key={photog.id}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/5"
              >
                {/* Header with Avatar */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={photog.avatar}
                          alt={photog.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        {photog.isSponsored && (
                          <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                            <span className="text-[8px] font-bold text-white uppercase tracking-wider">Sponsored</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-white">{photog.name}</h3>
                        <div className="flex items-center space-x-1 text-slate-400 text-xs mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{photog.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">{photog.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400 text-xs">
                      <Users className="h-3 w-3" />
                      <span>{photog.reviewCount} reviews</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 p-3 bg-white/5 border border-white/5 rounded-xl">
                    <DollarSign className="h-4 w-4 text-indigo-400" />
                    <span className="text-indigo-400 font-bold">{photog.price}</span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {photog.description}
                  </p>

                  {/* Portfolio Preview */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Portfolio</p>
                    <div className="flex space-x-2">
                      {photog.portfolio.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Portfolio ${idx + 1}`}
                          className="w-16 h-16 rounded-lg object-cover border border-white/5"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleBooking(photog)}
                      className="py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center space-x-1"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Book Now</span>
                    </button>
                    <button className="py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center space-x-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {bookingModal.open && bookingModal.photographer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setBookingModal({ open: false, photographer: null })}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronDown className="h-5 w-5 rotate-180" />
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">Book {bookingModal.photographer.name}</h3>
                <p className="text-slate-400 text-sm">Send a booking inquiry directly to the photographer</p>
              </div>

              <div className="glass-panel border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={bookingModal.photographer.avatar}
                    alt={bookingModal.photographer.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="text-white font-semibold">{bookingModal.photographer.name}</div>
                    <div className="text-slate-400 text-xs">{bookingModal.photographer.location}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-indigo-400 text-sm">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">{bookingModal.photographer.price}</span>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <textarea
                  placeholder="Describe your shoot (date, location, type of photography needed...)"
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200">
                Send Booking Inquiry
              </button>

              <p className="text-center text-slate-500 text-xs">
                Your inquiry will be sent directly to the photographer
              </p>
            </div>
          </div>
        </div>
      )}

      {/* List Your Services CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="glass-card border border-white/10 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
                Advertise Your Photography Services
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                List your photography business on our platform and reach thousands of potential clients. Get featured in local searches and receive direct booking inquiries.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="text-2xl font-black text-white font-display">Global</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Reach</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <div className="text-2xl font-black text-white font-display">Direct</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Bookings</div>
                </div>
              </div>

              <Link
                href={user ? "/dashboard/photographer" : "/login"}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
              >
                <span>List Your Services</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="glass-card border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-semibold">Amesh Wijesinghe</div>
                    <div className="text-slate-400 text-xs">Featured Photographer</div>
                  </div>
                  <div className="text-right">
                    <div className="text-indigo-400 font-bold">56</div>
                    <div className="text-slate-500 text-[10px]">Bookings</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Rating</span>
                    <span className="text-white font-semibold flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span>4.9</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Location</span>
                    <span className="text-white font-semibold">Colombo, Sri Lanka</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Rate</span>
                    <span className="text-white font-semibold">$50 - $150 / hr</span>
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
            Find Your Perfect Photographer
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Browse verified professionals in your area or list your own services. Start connecting today.
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
