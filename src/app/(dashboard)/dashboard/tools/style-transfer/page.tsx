"use client";

import React, { useState, useRef } from "react";
import { useApp } from "../../../../../context/AppContext";
import { 
  Upload, 
  RefreshCw, 
  Check, 
  Download, 
  X, 
  Loader2,
  Image as ImageIcon,
  Palette,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { MOCK_SAMPLE_FACES } from "../../../../../lib/mockData";

const STYLE_PRESETS = [
  {
    id: "anime",
    name: "Anime Style",
    description: "Japanese animation aesthetic",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=300&auto=format&fit=crop",
    color: "from-pink-500 to-purple-600"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon-lit futuristic city",
    image: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=300&auto=format&fit=crop",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    description: "Classic fine art texture",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=300&auto=format&fit=crop",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "pop-art",
    name: "Pop Art",
    description: "Bold colors and patterns",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=300&auto=format&fit=crop",
    color: "from-yellow-500 to-red-600"
  },
  {
    id: "vangogh",
    name: "Van Gogh",
    description: "Impressionist brush strokes",
    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=300&auto=format&fit=crop",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "sketch",
    name: "Pencil Sketch",
    description: "Hand-drawn pencil effect",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=300&auto=format&fit=crop",
    color: "from-slate-500 to-slate-600"
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft painted wash effect",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=300&auto=format&fit=crop",
    color: "from-teal-500 to-cyan-600"
  },
  {
    id: "noir",
    name: "Film Noir",
    description: "Classic black & white cinema",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    color: "from-gray-500 to-gray-700"
  }
];

export default function StyleTransferPage() {
  const { credits, spendCredits, saveGeneration } = useApp();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStep, setProcessStep] = useState("");
  const [styledImage, setStyledImage] = useState<string | null>(null);
  const [showBefore, setShowBefore] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processSteps = [
    "Analyzing Image Structure",
    "Mapping Color Gradients",
    `Applying ${STYLE_PRESETS.find(s => s.id === selectedStyle)?.name || "Neural"} Style`,
    "Refining Edge Contrast"
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

  const handleApplyStyle = async () => {
    if (!uploadedImage || !selectedStyle) {
      alert("Please upload a photo and select a style");
      return;
    }

    if (credits < 2) {
      alert("Not enough credits! You need 2 credits to apply style.");
      return;
    }

    setIsProcessing(true);
    setProcessProgress(0);

    for (let i = 0; i < processSteps.length; i++) {
      setProcessStep(processSteps[i]);
      setProcessProgress(((i + 1) / processSteps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await spendCredits(2, `Style Transfer: ${STYLE_PRESETS.find(s => s.id === selectedStyle)?.name}`);

    const styleOutput = STYLE_PRESETS.find(s => s.id === selectedStyle)?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";
    setStyledImage(styleOutput);

    await saveGeneration(
      "style-transfer",
      uploadedImage,
      styleOutput,
      `${STYLE_PRESETS.find(s => s.id === selectedStyle)?.name} Style`
    );

    setIsProcessing(false);
    setProcessProgress(0);
    setProcessStep("");
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedStyle(null);
    setStyledImage(null);
    setShowBefore(true);
  };

  const handleDownload = () => {
    if (styledImage) {
      const link = document.createElement("a");
      link.href = styledImage!;
      link.download = `autographer-style-${Date.now()}.jpg`;
      link.click();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-white">AI Style Transfer</h1>
          <p className="text-slate-400 text-sm mt-1">Apply artistic styles to your photos with neural networks</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <RefreshCw className="h-4 w-4 text-indigo-400" />
          <span className="text-indigo-300 font-semibold">{credits} Credits</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Source Image Upload */}
        <div className="space-y-6">
          <div className="glass-card border border-white/10 rounded-2xl p-6">
            <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
              <Upload className="h-5 w-5 text-indigo-400" />
              <span>Source Image</span>
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
                    alt="Source"
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

          {/* Output Preview */}
          {styledImage && (
            <div className="glass-card border border-white/10 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-white flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-purple-400" />
                  <span>Styled Result</span>
                </h2>
                <button
                  onClick={() => setShowBefore(!showBefore)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all"
                >
                  {showBefore ? <ToggleLeft className="h-4 w-4 text-slate-400" /> : <ToggleRight className="h-4 w-4 text-indigo-400" />}
                  <span className="text-xs font-semibold text-white">{showBefore ? "Before" : "After"}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={(showBefore ? uploadedImage : styledImage) || ""}
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
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <span className="text-white text-[10px] font-semibold flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>{showBefore ? "Original" : "Style Applied"}</span>
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
                    <RefreshCw className="h-4 w-4" />
                    <span>New Style</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Style Palette */}
        <div className="glass-card border border-white/10 rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center space-x-2">
            <Palette className="h-5 w-5 text-purple-400" />
            <span>Style Palette</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                  selectedStyle === style.id
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                }`}
              >
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedStyle === style.id && (
                      <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                        <Check className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{style.name}</h3>
                    <p className="text-slate-400 text-xs">{style.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Apply Style Button */}
          <div className="mt-6 pt-6 border-t border-white/5">
            {isProcessing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white font-semibold text-sm">{processStep}</p>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300"
                      style={{ width: `${processProgress}%` }}
                    />
                  </div>
                  <p className="text-slate-500 text-xs">{Math.round(processProgress)}% complete</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleApplyStyle}
                disabled={!uploadedImage || !selectedStyle}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2"
              >
                <Palette className="h-5 w-5" />
                <span>Apply Style</span>
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-semibold">2 Credits</span>
              </button>
            )}
            <p className="text-center text-slate-500 text-xs mt-3">
              {!uploadedImage ? "Upload a photo to get started" : !selectedStyle ? "Select a style to continue" : "Ready to transform!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
