"use client";

import React from "react";
import { 
  Sparkles, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  Heart,
  Target,
  Award
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Sparkles,
      title: "Innovation First",
      description: "Pushing the boundaries of AI-powered photography with cutting-edge technology"
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Building tools that empower creators and photographers to achieve their vision"
    },
    {
      icon: Shield,
      title: "Privacy Focused",
      description: "Your photos and data are secure with enterprise-grade encryption and protection"
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making professional photography accessible to everyone, everywhere"
    }
  ];

  const milestones = [
    { year: "2024", title: "Project Inception", description: "Started with a vision to democratize professional photography" },
    { year: "2025", title: "Beta Launch", description: "Released beta version with 3 AI tools to 500 early users" },
    { year: "2026", title: "Full Release", description: "Launched with 5 AI tools, marketplace, and photographer directory" }
  ];

  const team = [
    { name: "Alex Chen", role: "Founder & CEO", bio: "Former AI researcher at Google with 10+ years in computer vision" },
    { name: "Sarah Williams", role: "CTO", bio: "Full-stack architect with expertise in scalable AI systems" },
    { name: "Mike Johnson", role: "Head of Product", bio: "Product designer focused on user experience and accessibility" }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-semibold">About Us</span>
          </div>
          <h1 className="font-display font-black text-5xl md:text-6xl text-white mb-6">
            Transforming Photography with AI
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            We're on a mission to make professional photography accessible to everyone through the power of artificial intelligence.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="glass-card border border-white/10 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-3xl text-white mb-6">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                At Autographer, we believe everyone deserves access to professional-quality photography. Whether you're a content creator, small business owner, or just want to look your best online, our AI-powered tools make it possible.
              </p>
              <p className="text-slate-400 leading-relaxed">
                We combine cutting-edge AI technology with intuitive design to deliver studio-quality results without the studio price tag.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                <Target className="h-24 w-24 text-indigo-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white mb-4">Our Values</h2>
          <p className="text-slate-400">The principles that guide everything we do</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="glass-card border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
              <div className="p-3 bg-indigo-500/10 rounded-xl w-fit mb-4">
                <value.icon className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">{value.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white mb-4">Our Journey</h2>
          <p className="text-slate-400">Key milestones in our growth</p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent" />
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <div className="flex-1">
                  <div className={`glass-card border border-white/10 rounded-2xl p-6 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 font-semibold text-sm mb-3">
                      {milestone.year}
                    </div>
                    <h3 className="font-display font-bold text-xl text-white mb-2">{milestone.title}</h3>
                    <p className="text-slate-400 text-sm">{milestone.description}</p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-indigo-500 rounded-full border-4 border-slate-900 z-10 mx-4" />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white mb-4">Meet the Team</h2>
          <p className="text-slate-400">The people behind Autographer</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="glass-card border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{member.name.charAt(0)}</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-1">{member.name}</h3>
              <p className="text-indigo-400 text-sm font-semibold mb-3">{member.role}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="glass-card border border-white/10 rounded-3xl p-8 md:p-12 text-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
          <Heart className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
          <h2 className="font-display font-bold text-3xl text-white mb-4">Join Our Journey</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            We're always looking for passionate people to join our team. If you're excited about AI and photography, we'd love to hear from you.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25">
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  );
}
