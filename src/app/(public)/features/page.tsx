"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { 
  Zap, 
  RefreshCw, 
  Sliders, 
  Image, 
  Brush, 
  ArrowRight, 
  Sparkles, 
  ChevronDown,
  Info,
  Play,
  CheckCircle
} from "lucide-react";

export default function FeaturesPage() {
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState<string>("generator");
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const tools = [
    {
      id: "generator",
      title: "AI Studio Generator",
      description: "Transform selfies into wedding, graduation, or executive portraits instantly.",
      icon: Zap,
      credits: 3,
      color: "from-indigo-500 to-indigo-600",
      bgGlow: "shadow-indigo-500/10",
      borderColor: "border-indigo-500/30",
      features: [
        "Upload any selfie - no professional camera needed",
        "Choose from 50+ premium studio themes",
        "Automatic face extraction and lighting adjustment",
        "8K resolution output with realistic skin details"
      ],
      useCases: [
        "Wedding invitations and save-the-dates",
        "LinkedIn professional headshots",
        "Graduation announcements",
        "Corporate team directories"
      ],
      demoImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "style",
      title: "AI Style Transfer",
      description: "Clone lighting, colors, and camera mood from any reference snapshot.",
      icon: RefreshCw,
      credits: 2,
      color: "from-purple-500 to-purple-600",
      bgGlow: "shadow-purple-500/10",
      borderColor: "border-purple-500/30",
      features: [
        "Upload your photo + a reference style image",
        "AI extracts color grading and lighting patterns",
        "Applies cinematic mood to your portrait",
        "Preserves your facial features perfectly"
      ],
      useCases: [
        "Match your favorite photographer's style",
        "Recreate magazine editorial looks",
        "Apply vintage film aesthetics",
        "Brand-consistent social media content"
      ],
      demoImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "enhancer",
      title: "AI Photo Enhancer",
      description: "Restore blur, reduce image grain, upscale quality, and fix lights.",
      icon: Sliders,
      credits: 1,
      color: "from-teal-500 to-teal-600",
      bgGlow: "shadow-teal-500/10",
      borderColor: "border-teal-500/30",
      features: [
        "One-click blur removal and sharpening",
        "Noise reduction for low-light photos",
        "2x and 4x AI upscaling",
        "Old photo restoration and color correction"
      ],
      useCases: [
        "Fix blurry smartphone photos",
        "Restore old family photographs",
        "Prepare images for print",
        "Enhance social media uploads"
      ],
      demoImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "background",
      title: "Background Swap",
      description: "Drape yourself in luxury hotels, sand beaches, or high-rise offices.",
      icon: Image,
      credits: 2,
      color: "from-pink-500 to-pink-600",
      bgGlow: "shadow-pink-500/10",
      borderColor: "border-pink-500/30",
      features: [
        "Smart subject detection and masking",
        "100+ premium background templates",
        "Custom background upload support",
        "Lighting and shadow matching"
      ],
      useCases: [
        "Professional headshot backgrounds",
        "Travel-themed social posts",
        "Product photography backdrops",
        "Creative profile pictures"
      ],
      demoImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "object",
      title: "Object Replacement",
      description: "Swap outfits, change hairstyles, or add watches and accessories.",
      icon: Brush,
      credits: 5,
      color: "from-blue-500 to-blue-600",
      bgGlow: "shadow-blue-500/10",
      borderColor: "border-blue-500/30",
      features: [
        "AI-powered object detection",
        "Swap outfits, accessories, hairstyles",
        "Add luxury watches and jewelry",
        "Realistic blending and shading"
      ],
      useCases: [
        "Try different outfits before buying",
        "Experiment with hairstyles",
        "Add professional accessories",
        "Create fashion concept previews"
      ],
      demoImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const activeToolData = tools.find(t => t.id === activeTool) || tools[0];

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
            <span>Five Intelligent AI Engines</span>
          </div>
          
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-tight">
            Professional AI Tools<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Zero Learning Curve
            </span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            No prompts, no configurations. Just upload your photo and select from our graphical menus. Our neural networks handle the rest in seconds.
          </p>

          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            <span>Start Creating Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Tool Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTool === tool.id
                    ? `bg-gradient-to-r ${tool.color} text-white shadow-lg ${tool.bgGlow}`
                    : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-semibold">{tool.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Tool Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Tool Details */}
          <div className="space-y-8">
            <div className="glass-card border border-white/10 rounded-2xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`inline-flex p-3 bg-gradient-to-tr ${activeToolData.color} rounded-xl shadow-lg ${activeToolData.bgGlow} text-white`}>
                  <activeToolData.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-white">{activeToolData.title}</h2>
                  <p className="text-slate-400 text-sm">{activeToolData.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Credit Cost:
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold bg-gradient-to-r ${activeToolData.color} text-white`}>
                  {activeToolData.credits} Credits
                </span>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-indigo-400" />
                  <span>Key Features</span>
                </h3>
                <ul className="space-y-3">
                  {activeToolData.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-slate-300 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeToolData.color} mt-2 flex-shrink-0`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Play className="h-4 w-4 text-purple-400" />
                  <span>Perfect For</span>
                </h3>
                <ul className="space-y-3">
                  {activeToolData.useCases.map((useCase, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-slate-300 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeToolData.color} mt-2 flex-shrink-0`} />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href={user ? "/dashboard" : "/login"}
              className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
            >
              <span>Try {activeToolData.title}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Right: Interactive Demo */}
          <div className="space-y-6">
            <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/3]">
                <img 
                  src={activeToolData.demoImage} 
                  alt={`${activeToolData.title} Demo`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Sample Output</p>
                      <p className="text-sm font-bold">{activeToolData.title} Result</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r ${activeToolData.color} text-white`}>
                      {activeToolData.credits} Credits
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="glass-card border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Info className="h-4 w-4 text-teal-400" />
                <span>Pro Tips</span>
              </h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <p>• Upload high-resolution photos for best results</p>
                <p>• Use good lighting when capturing your selfie</p>
                <p>• Experiment with different themes to find your style</p>
                <p>• Save your favorites to quickly regenerate later</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Tools Overview Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
            Complete AI Tool Suite
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            All five engines work together seamlessly. Start with a generator, enhance the result, swap backgrounds, and add accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isExpanded = expandedTool === tool.id;
            return (
              <div 
                key={tool.id}
                className={`glass-card rounded-2xl p-6 border transition-all duration-300 ${
                  isExpanded ? tool.borderColor : "border-white/5"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex p-2.5 bg-gradient-to-tr ${tool.color} rounded-lg shadow-lg ${tool.bgGlow} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-gradient-to-r ${tool.color} text-white`}>
                      {tool.credits} Credits
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">{tool.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{tool.description}</p>
                  </div>

                  <button
                    onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
                    className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>{isExpanded ? "Show Less" : "Learn More"}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {isExpanded && (
                    <div className="pt-4 border-t border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <ul className="space-y-2">
                        {tool.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-slate-300 text-xs">
                            <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${tool.color} mt-1.5 flex-shrink-0`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={user ? "/dashboard" : "/login"}
                        className="block w-full text-center py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 font-semibold rounded-lg text-xs transition-all"
                      >
                        Try Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="glass-card border border-white/10 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 leading-tight">
            Ready to Transform Your Photos?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Create your account now, get 5 free credits instantly, and explore all five AI tools. No credit card required.
          </p>

          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
