"use client";

import React, { useState, useRef } from "react";
import { useApp } from "../../../../../context/AppContext";
import { 
  Upload, 
  Brush, 
  Check, 
  Download, 
  X, 
  Loader2,
  Sparkles,
  Target
} from "lucide-react";
import { MOCK_SAMPLE_FACES, MOCK_OBJECTS } from "../../../../../lib/mockData";

export default function ObjectReplacementPage() {
  const { credits, spendCredits, saveGeneration } = useApp();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [replacementPrompt, setReplacementPrompt] = useState("");
  const [selectedMaskArea, setSelectedMaskArea] = useState<{x: number, y: number} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStep, setProcessStep] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [maskMode, setMaskMode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processSteps = [
    "Parsing Masked Coordinates",
    "Removing Target Object (Inpainting)",
    "Generating Prompted Object",
    "Matching Light Directions & Reflections"
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!maskMode || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSelectedMaskArea({ x, y });
  };

  const handleTransform = async () => {
    if (!uploadedImage) {
      alert("Please upload a photo");
      return;
    }

    if (!replacementPrompt.trim()) {
      alert("Please describe what you want to replace the object with");
      return;
    }

    if (credits < 3) {
      alert("Not enough credits! You need 3 credits to transform object.");
      return;
    }

    setIsProcessing(true);
    setProcessProgress(0);

    for (let i = 0; i < processSteps.length; i++) {
      setProcessStep(processSteps[i]);
      setProcessProgress(((i + 1) / processSteps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await spendCredits(3, `Object Replacement: ${replacementPrompt}`);

    const objectOutput = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop";
    setResultImage(objectOutput);

    await saveGeneration(
      "object-replacement",
      uploadedImage,
      objectOutput,
      replacementPrompt
    );

    setIsProcessing(false);
    setProcessProgress(0);
    setProcessStep("");
  };

  const handleReset = () => {
    setUploadedImage(null);
    setReplacementPrompt("");
    setSelectedMaskArea(null);
    setResultImage(null);
    setMaskMode(false);
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage!;
      link.download = `autographer-object-${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-white">Object Replacement</h1>
          <p className="text-slate-400 text-sm mt-1">Transform objects in your photos with AI-powered replacement</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <Brush className="h-4 w-4 text-indigo-400" />
          <span className="text-indigo-300 font-semibold">{credits} Credits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Image Upload & Masking */}
        <div className="space-y-6">
          <div className="glass-card border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-white flex items-center space-x-2">
                <Upload className="h-5 w-5 text-indigo-400" />
                <span>Source Image</span>
              </h2>
              {uploadedImage && (
                <button
                  onClick={() => setMaskMode(!maskMode)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    maskMode 
                      ? "bg-blue-500 text-white" 
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <Target className="h-3.5 w-3.5" />
                  <span>{maskMode ? "Masking Active" : "Select Object"}</span>
                </button>
              )}
            </div>

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
                <div 
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-200 ${
                    maskMode ? "border-blue-500 cursor-crosshair" : "border-white/10"
                  }`}
                >
                  <img
                    src={uploadedImage}
                    alt="Source"
                    className="w-full h-full object-cover"
                  />
                  
                  {maskMode && (
                    <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
                  )}
                  
                  {selectedMaskArea && (
                    <div
                      className="absolute w-16 h-16 border-2 border-blue-500 rounded-lg pointer-events-none animate-pulse"
                      style={{
                        left: selectedMaskArea.x - 32,
                        top: selectedMaskArea.y - 32
                      }}
                    >
                      <div className="absolute inset-0 bg-blue-500/20 rounded-lg" />
                      <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-400" />
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-all"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  
                  {maskMode && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-blue-500/80 backdrop-blur-sm rounded-lg">
                      <span className="text-white text-[10px] font-semibold">Click to select object</span>
                    </div>
                  )}
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
                <Sparkles className="h-5 w-5 text-blue-400" />
                <span>Transformed Result</span>
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
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                    <span className="text-white text-[10px] font-semibold flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Object Transformed</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    className="py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
                  >
                    <Brush className="h-4 w-4" />
                    <span>New Object</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Replacement Controls */}
        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
            <Brush className="h-5 w-5 text-blue-400" />
            <span>Replacement Options</span>
          </h2>

          {/* Quick Object Presets */}
          <div className="space-y-4 mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Presets:</p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_OBJECTS.outfits.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setReplacementPrompt(`Change the outfit to ${item.name}`)}
                  className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-xl text-left transition-all"
                >
                  <p className="text-white text-sm font-semibold">{item.name}</p>
                  <p className="text-slate-500 text-xs">Outfit</p>
                </button>
              ))}
              {MOCK_OBJECTS.accessories.slice(0, 2).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setReplacementPrompt(`Add a ${item.name}`)}
                  className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-xl text-left transition-all"
                >
                  <p className="text-white text-sm font-semibold">{item.name}</p>
                  <p className="text-slate-500 text-xs">Accessory</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Custom Replacement:</p>
            <textarea
              placeholder="What do you want to replace it with?&#10;Example: Change the coffee cup into a glowing potion bottle"
              value={replacementPrompt}
              onChange={(e) => setReplacementPrompt(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm resize-none"
            />
          </div>

          {/* Transform Button */}
          <div className="mt-6 pt-6 border-t border-white/5">
            {isProcessing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white font-semibold text-sm">{processStep}</p>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-300"
                      style={{ width: `${processProgress}%` }}
                    />
                  </div>
                  <p className="text-slate-500 text-xs">{Math.round(processProgress)}% complete</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleTransform}
                disabled={!uploadedImage || !replacementPrompt.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
              >
                <Brush className="h-5 w-5" />
                <span>Transform Object</span>
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-semibold">3 Credits</span>
              </button>
            )}
            <p className="text-center text-slate-500 text-xs mt-3">
              {!uploadedImage ? "Upload a photo to get started" : !replacementPrompt.trim() ? "Describe what to replace it with" : "Ready to transform!"}
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">How to use:</p>
            <ol className="text-slate-400 text-xs space-y-1 list-decimal list-inside">
              <li>Upload your photo</li>
              <li>Click "Select Object" and click on the object to replace</li>
              <li>Choose a preset or describe your custom replacement</li>
              <li>Click "Transform Object" to generate</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
