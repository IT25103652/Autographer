"use client";

import React, { useState, useRef } from "react";
import { useApp } from "../../../../../context/AppContext";
import { useAuth } from "../../../../../context/AuthContext";
import { storage } from "../../../../../lib/appwrite";
import { ID } from "appwrite";
import { 
  Upload, 
  Sparkles, 
  Zap, 
  Check, 
  Download, 
  Heart, 
  X, 
  Loader2,
  Image as ImageIcon,
  Search,
  ChevronDown
} from "lucide-react";
import { CATEGORIES, DEFAULT_THEMES, MOCK_SAMPLE_FACES } from "../../../../../lib/mockData";

export default function GeneratorPage() {
  const { credits, spendCredits, saveGeneration } = useApp();
  const { user } = useAuth();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generationSteps = [
    "Uploading Selfie",
    "Extracting Facial Features",
    "Injecting AI Theme Prompt",
    "Polishing Studio Lighting",
    "Final Studio Render"
  ];

  const filteredThemes = DEFAULT_THEMES.filter(theme => {
    const matchesCategory = selectedCategory === "All" || theme.category === selectedCategory;
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const selectSampleFace = (face: typeof MOCK_SAMPLE_FACES[0]) => {
    setUploadedImage(face.url);
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedTheme) {
      alert("Please upload a photo and select a theme");
      return;
    }

    if (credits < 3) {
      alert("Not enough credits! You need 3 credits to generate.");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStep("Uploading image to storage...");

    try {
      // Convert base64 to blob for upload
      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      const file = new File([blob], "source-image.jpg", { type: "image/jpeg" });

      // Upload to Appwrite Storage
      const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "ai-images";
      let uploadedImageUrl = uploadedImage;

      if (storage) {
        try {
          setGenerationStep("Uploading to secure storage...");
          setGenerationProgress(25);

          const uploadResult = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            file
          );

          uploadedImageUrl = storage.getFilePreview(
            STORAGE_BUCKET_ID,
            uploadResult.$id
          ).toString();
        } catch (storageError) {
          console.error("Storage upload failed, using base64:", storageError);
        }
      }

      // Call API route for generation
      setGenerationStep("Processing with AI model...");
      setGenerationProgress(50);

      const theme = DEFAULT_THEMES.find(t => t.id === selectedTheme);
      const apiResponse = await fetch("/api/generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceImageUrl: uploadedImageUrl,
          prompt: theme?.prompt || "professional studio portrait",
          userId: user?.id || "guest",
          themeName: theme?.name,
        }),
      });

      const apiData = await apiResponse.json();

      if (!apiResponse.ok || !apiData.success) {
        throw new Error(apiData.error || "Generation failed");
      }

      setGenerationStep("Finalizing result...");
      setGenerationProgress(90);

      // Deduct credits
      await spendCredits(3, `Generated photo using theme '${theme?.name}'`);

      // Save generation
      await saveGeneration(
        "generator",
        uploadedImageUrl,
        apiData.outputImageUrl,
        theme?.name
      );

      setGeneratedImage(apiData.outputImageUrl);
      setGenerationProgress(100);
      setGenerationStep("");

    } catch (error) {
      console.error("Generation error:", error);
      alert(`Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStep("");
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedTheme(null);
    setGeneratedImage(null);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `autographer-generated-${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-white">AI Photo Generator</h1>
          <p className="text-slate-400 text-sm mt-1">Transform your selfies into professional studio portraits</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <Zap className="h-4 w-4 text-indigo-400" />
          <span className="text-indigo-300 font-semibold">{credits} Credits</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload Section */}
        <div className="space-y-6">
          <div className="glass-card border border-white/10 rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
              <Upload className="h-5 w-5 text-indigo-400" />
              <span>Upload Your Photo</span>
            </h2>

            {/* Upload Area */}
            {!uploadedImage ? (
              <div className="space-y-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-xl p-8 text-center cursor-pointer transition-all duration-200 bg-white/5 hover:bg-white/[0.07]"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-indigo-500/10 rounded-xl">
                      <Upload className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Drop your image here</p>
                      <p className="text-slate-500 text-xs mt-1">or click to browse</p>
                    </div>
                    <p className="text-slate-600 text-[10px]">Supports: JPG, PNG, WebP</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Sample Faces */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Or try with sample faces:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {MOCK_SAMPLE_FACES.map((face) => (
                      <button
                        key={face.name}
                        onClick={() => selectSampleFace(face)}
                        className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-all duration-200"
                      >
                        <img
                          src={face.url}
                          alt={face.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-all"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg">
                    <span className="text-white text-[10px] font-semibold">Uploaded</span>
                  </div>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  Choose Different Photo
                </button>
              </div>
            )}
          </div>

          {/* Generated Output */}
          {generatedImage && (
            <div className="glass-card border border-white/10 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span>Generated Result</span>
              </h2>

              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={handleDownload}
                      className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-all"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                    <span className="text-white text-[10px] font-semibold flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Studio Quality</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    className="py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Generate New</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Theme Selector */}
        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-purple-400" />
            <span>Select Theme</span>
          </h2>

          {/* Search and Filter */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === "All"
                    ? "bg-indigo-500 text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-indigo-500 text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Grid */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredThemes.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No themes found</p>
              </div>
            ) : (
              filteredThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`w-full p-3 rounded-xl border transition-all duration-200 text-left ${
                    selectedTheme === theme.id
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={theme.image}
                        alt={theme.name}
                        className="w-full h-full object-cover"
                      />
                      {theme.isPopular && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-indigo-500 rounded">
                          <span className="text-[8px] font-bold text-white">POP</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="text-white font-semibold text-sm truncate">{theme.name}</h3>
                          <p className="text-slate-400 text-xs truncate">{theme.category}</p>
                        </div>
                        {selectedTheme === theme.id && (
                          <Check className="h-4 w-4 text-indigo-400 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-slate-500 text-[10px]">by {theme.authorName}</span>
                        <span className="text-indigo-400 text-xs font-bold">3 credits</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Generate Button */}
          <div className="mt-6 pt-6 border-t border-white/5">
            {isGenerating ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white font-semibold text-sm">{generationStep}</p>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="text-slate-500 text-xs">{Math.round(generationProgress)}% complete</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!uploadedImage || !selectedTheme}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>Generate Portrait</span>
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-semibold">3 Credits</span>
              </button>
            )}
            <p className="text-center text-slate-500 text-xs mt-3">
              {!uploadedImage ? "Upload a photo to get started" : !selectedTheme ? "Select a theme to continue" : "Ready to generate!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
