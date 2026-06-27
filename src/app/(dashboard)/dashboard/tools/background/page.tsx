"use client";

import React, { useState, useRef } from "react";
import { useApp } from "../../../../../context/AppContext";
import { useAuth } from "../../../../../context/AuthContext";
import { storage } from "../../../../../lib/appwrite";
import { ID } from "appwrite";
import { 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Download, 
  X, 
  Loader2,
  Sparkles,
  Search
} from "lucide-react";
import { MOCK_SAMPLE_FACES, MOCK_BACKGROUNDS } from "../../../../../lib/mockData";

const BACKGROUND_CATEGORIES = [
  { id: "all", name: "All Backgrounds" },
  { id: "nature", name: "Nature" },
  { id: "urban", name: "Urban" },
  { id: "studio", name: "Studio" },
  { id: "fantasy", name: "Fantasy" },
  { id: "luxury", name: "Luxury" }
];

export default function BackgroundPage() {
  const { credits, spendCredits, saveGeneration } = useApp();
  const { user } = useAuth();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStep, setProcessStep] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processSteps = [
    "Isolating Foreground Subject",
    "Creating High-Precision Alpha Matte",
    "Synthesizing Background Prompt",
    "Blending Environmental Lighting & Shadows"
  ];

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
    if (!uploadedImage) {
      alert("Please upload a photo");
      return;
    }

    if (!selectedBackground && !customPrompt.trim()) {
      alert("Please select a background or enter a custom prompt");
      return;
    }

    if (credits < 3) {
      alert("Not enough credits! You need 3 credits to swap background.");
      return;
    }

    setIsProcessing(true);
    setProcessProgress(0);
    setProcessStep("Uploading image to storage...");

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
          setProcessStep("Uploading to secure storage...");
          setProcessProgress(25);

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

      // Call API route for background swap
      setProcessStep("Processing with AI model...");
      setProcessProgress(50);

      const backgroundImageUrl = selectedBackground 
        ? MOCK_BACKGROUNDS.find(b => b.id === selectedBackground)?.url 
        : customPrompt;

      const apiResponse = await fetch("/api/background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
          backgroundImageUrl: backgroundImageUrl,
          userId: user?.id || "guest",
          operation: selectedBackground ? "replace" : "remove",
        }),
      });

      const apiData = await apiResponse.json();

      if (!apiResponse.ok || !apiData.success) {
        throw new Error(apiData.error || "Background swap failed");
      }

      setProcessStep("Finalizing result...");
      setProcessProgress(90);

      // Deduct credits
      await spendCredits(3, `Background Swap: ${customPrompt || MOCK_BACKGROUNDS.find(b => b.id === selectedBackground)?.name}`);

      // Save generation
      await saveGeneration(
        "background",
        uploadedImageUrl,
        apiData.outputImageUrl,
        customPrompt || MOCK_BACKGROUNDS.find(b => b.id === selectedBackground)?.name
      );

      setResultImage(apiData.outputImageUrl);
      setProcessProgress(100);
      setProcessStep("");

    } catch (error) {
      console.error("Background swap error:", error);
      alert(`Background swap failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
      setProcessProgress(0);
      setProcessStep("");
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedBackground(null);
    setCustomPrompt("");
    setResultImage(null);
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage!;
      link.download = `autographer-bg-swap-${Date.now()}.jpg`;
      link.click();
    }
  };

  const filteredBackgrounds = selectedCategory === "all" 
    ? MOCK_BACKGROUNDS 
    : MOCK_BACKGROUNDS.filter(bg => bg.name.toLowerCase().includes(selectedCategory));

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-white">Background Swap</h1>
          <p className="text-slate-400 text-sm mt-1">Replace your photo background with stunning environments</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <ImageIcon className="h-4 w-4 text-indigo-400" />
          <span className="text-indigo-300 font-semibold">{credits} Credits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Subject Upload */}
        <div className="space-y-6">
          <div className="glass-card border border-white/10 rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
              <Upload className="h-5 w-5 text-indigo-400" />
              <span>Subject Photo</span>
            </h2>

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
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

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
                    alt="Subject"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-all"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg">
                    <span className="text-white text-[10px] font-semibold">Subject</span>
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

          {/* Output Preview */}
          {resultImage && (
            <div className="glass-card border border-white/10 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-pink-400" />
                <span>Background Swapped Result</span>
              </h2>

              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={resultImage}
                    alt="Result"
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
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                    <span className="text-white text-[10px] font-semibold flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Background Applied</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    className="py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>New Background</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Background Selector */}
        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-pink-400" />
            <span>Background Environment</span>
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {BACKGROUND_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-pink-500 text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Background Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-4">
            {filteredBackgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => {
                  setSelectedBackground(bg.id);
                  setCustomPrompt("");
                }}
                className={`relative aspect-video rounded-lg overflow-hidden border transition-all duration-200 ${
                  selectedBackground === bg.id
                    ? "border-pink-500 ring-2 ring-pink-500/50"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <img
                  src={bg.url}
                  alt={bg.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-[10px] font-semibold truncate">{bg.name}</p>
                </div>
                {selectedBackground === bg.id && (
                  <div className="absolute top-2 right-2 p-1 bg-pink-500 rounded-full">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Prompt Input */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Or describe a custom background..."
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  setSelectedBackground(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-all text-sm"
              />
            </div>

            {/* Generate Button */}
            {isProcessing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-pink-400 animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white font-semibold text-sm">{processStep}</p>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${processProgress}%` }}
                    />
                  </div>
                  <p className="text-slate-500 text-xs">{Math.round(processProgress)}% complete</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!uploadedImage || (!selectedBackground && !customPrompt.trim())}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-pink-500/25 flex items-center justify-center space-x-2"
              >
                <ImageIcon className="h-5 w-5" />
                <span>Generate Background</span>
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-semibold">3 Credits</span>
              </button>
            )}
            <p className="text-center text-slate-500 text-xs">
              {!uploadedImage ? "Upload a photo to get started" : (!selectedBackground && !customPrompt.trim()) ? "Select a background or enter a prompt" : "Ready to transform!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
