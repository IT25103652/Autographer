"use client";

import React, { useState, useRef } from "react";
import { useApp } from "../../../../../context/AppContext";
import { useAuth } from "../../../../../context/AuthContext";
import { storage } from "../../../../../lib/appwrite";
import { ID } from "appwrite";
import { 
  Upload, 
  Sliders, 
  Check, 
  Download, 
  X, 
  Loader2,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { MOCK_SAMPLE_FACES } from "../../../../../lib/mockData";

const ENHANCEMENT_OPTIONS = [
  {
    id: "blurry",
    name: "Fix Blurry Faces",
    description: "Restore sharpness to blurry facial features",
    icon: "🎯"
  },
  {
    id: "upscale",
    name: "Upscale to 4K",
    description: "Increase resolution to ultra-high definition",
    icon: "📐"
  },
  {
    id: "color",
    name: "Color Correction",
    description: "Balance and enhance color tones",
    icon: "🎨"
  },
  {
    id: "noise",
    name: "Remove Digital Noise",
    description: "Clean up grain and artifacts",
    icon: "✨"
  }
];

export default function EnhancerPage() {
  const { credits, spendCredits, saveGeneration } = useApp();
  const { user } = useAuth();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStep, setProcessStep] = useState("");
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [showBefore, setShowBefore] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processSteps = [
    "De-noising Source Image",
    "Super-Resolution Scaling (4K)",
    "Enhancing Facial Details",
    "Balancing Dynamic Contrast"
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

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleEnhance = async () => {
    if (!uploadedImage) {
      alert("Please upload a photo");
      return;
    }

    if (credits < 2) {
      alert("Not enough credits! You need 2 credits to enhance.");
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

      // Call API route for enhancement
      setProcessStep("Processing with AI model...");
      setProcessProgress(50);

      const apiResponse = await fetch("/api/enhancer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
          userId: user?.id || "guest",
          scale: 2,
        }),
      });

      const apiData = await apiResponse.json();

      if (!apiResponse.ok || !apiData.success) {
        throw new Error(apiData.error || "Enhancement failed");
      }

      setProcessStep("Finalizing result...");
      setProcessProgress(90);

      // Deduct credits
      await spendCredits(2, `Photo Enhancement: ${selectedOptions.length} options`);

      // Save generation
      await saveGeneration(
        "enhancer",
        uploadedImageUrl,
        apiData.outputImageUrl,
        `Enhanced (${selectedOptions.length} options)`
      );

      setEnhancedImage(apiData.outputImageUrl);
      setProcessProgress(100);
      setProcessStep("");

    } catch (error) {
      console.error("Enhancement error:", error);
      alert(`Enhancement failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
      setProcessProgress(0);
      setProcessStep("");
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedOptions([]);
    setEnhancedImage(null);
    setShowBefore(true);
  };

  const handleDownload = () => {
    if (enhancedImage) {
      const link = document.createElement("a");
      link.href = enhancedImage!;
      link.download = `autographer-enhanced-${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-white">AI Photo Enhancer</h1>
          <p className="text-slate-400 text-sm mt-1">Restore and enhance your photos with AI-powered quality improvement</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <Sliders className="h-4 w-4 text-indigo-400" />
          <span className="text-indigo-300 font-semibold">{credits} Credits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload & Options */}
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="glass-card border border-white/10 rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
              <Upload className="h-5 w-5 text-indigo-400" />
              <span>Upload Photo</span>
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
                    <span className="text-white text-[10px] font-semibold">Original</span>
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

          {/* Enhancement Options */}
          <div className="glass-card border border-white/10 rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
              <Sliders className="h-5 w-5 text-teal-400" />
              <span>Enhancement Options</span>
            </h2>

            <div className="space-y-3">
              {ENHANCEMENT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                    selectedOptions.includes(option.id)
                      ? "border-teal-500 bg-teal-500/10"
                      : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {selectedOptions.includes(option.id) ? (
                        <div className="w-5 h-5 rounded bg-teal-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded border-2 border-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{option.icon}</span>
                        <h3 className="text-white font-semibold text-sm">{option.name}</h3>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-teal-400 animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-white font-semibold text-sm">{processStep}</p>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 transition-all duration-300"
                        style={{ width: `${processProgress}%` }}
                      />
                    </div>
                    <p className="text-slate-500 text-xs">{Math.round(processProgress)}% complete</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleEnhance}
                  disabled={!uploadedImage}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Enhance Quality</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-semibold">2 Credits</span>
                </button>
              )}
              <p className="text-center text-slate-500 text-xs mt-3">
                {!uploadedImage ? "Upload a photo to get started" : selectedOptions.length === 0 ? "Select enhancement options" : `Ready to enhance with ${selectedOptions.length} option${selectedOptions.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Output Preview */}
        {enhancedImage && (
          <div className="glass-card border border-white/10 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-white flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-teal-400" />
                <span>Enhanced Result</span>
              </h2>
              <button
                onClick={() => setShowBefore(!showBefore)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all"
              >
                {showBefore ? <ToggleLeft className="h-4 w-4 text-slate-400" /> : <ToggleRight className="h-4 w-4 text-teal-400" />}
                <span className="text-xs font-semibold text-white">{showBefore ? "Before" : "After"}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                <img
                  src={showBefore ? uploadedImage! : enhancedImage!}
                  alt={showBefore ? "Before" : "After"}
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
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
                  <span className="text-white text-[10px] font-semibold flex items-center space-x-1">
                    <Check className="h-3 w-3" />
                    <span>{showBefore ? "Original" : "4K Enhanced"}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownload}
                  className="py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleReset}
                  className="py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>New Photo</span>
                </button>
              </div>

              {/* Applied Options Summary */}
              {selectedOptions.length > 0 && (
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Applied Enhancements:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOptions.map(optId => {
                      const opt = ENHANCEMENT_OPTIONS.find(o => o.id === optId);
                      return (
                        <span key={optId} className="px-2 py-1 bg-teal-500/10 border border-teal-500/20 rounded text-xs text-teal-300">
                          {opt?.icon} {opt?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
