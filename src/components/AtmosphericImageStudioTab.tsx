import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Maximize2, 
  RefreshCw, 
  Ratio, 
  Sliders, 
  Layers, 
  Satellite, 
  Flame, 
  Trees, 
  Eye, 
  Copy, 
  Check,
  Zap,
  Info,
  Maximize
} from 'lucide-react';
import { AQIMeasurement } from '../types';
import { AQILogo } from './AQILogo';

interface AtmosphericImageStudioTabProps {
  currentCityData: AQIMeasurement;
}

type AspectRatioOption = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

interface GeneratedAtmosphericImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: AspectRatioOption;
  timestamp: string;
  modelUsed: string;
  category: string;
}

export const AtmosphericImageStudioTab: React.FC<AtmosphericImageStudioTabProps> = ({
  currentCityData
}) => {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>('16:9');
  const [imageSize, setImageSize] = useState<'1K' | '2K'>('1K');
  const [customPrompt, setCustomPrompt] = useState(
    `Sentinel-5P satellite false-color tropospheric NO2 and PM2.5 atmospheric concentration map over ${currentCityData.cityName}, high altitude Earth observation render with topological terrain contours and emission plume gradients`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GeneratedAtmosphericImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [gallery, setGallery] = useState<GeneratedAtmosphericImage[]>([
    {
      id: 'img_default_1',
      url: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0b132b"/><stop offset="100%" stop-color="#1c2541"/></linearGradient>
            <radialGradient id="smog" cx="40%" cy="60%" r="50%"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.8"/><stop offset="30%" stop-color="#f97316" stop-opacity="0.6"/><stop offset="70%" stop-color="#38bdf8" stop-opacity="0.2"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g1)"/>
          <circle cx="500" cy="420" r="320" fill="url(#smog)"/>
          <text x="50" y="80" fill="#38bdf8" font-family="system-ui" font-size="28" font-weight="bold">Sentinel-5P Tropospheric NO2 Column</text>
          <text x="50" y="115" fill="#94a3b8" font-family="monospace" font-size="16">Target Basin: ${currentCityData.cityName} | Aspect: 16:9 | High Density Spatial Field</text>
        </svg>
      `)}`,
      prompt: `Sentinel-5P satellite false-color tropospheric NO2 and PM2.5 atmospheric concentration map over ${currentCityData.cityName}`,
      aspectRatio: '16:9',
      timestamp: 'Today at 03:30 AM',
      modelUsed: 'gemini-3.1-flash-image',
      category: 'Satellite Remote Sensing'
    }
  ]);

  const aspectRatios: { id: AspectRatioOption; label: string; desc: string; previewClass: string }[] = [
    { id: '1:1', label: '1:1 Square', desc: 'Social & Icon Feed', previewClass: 'w-6 h-6' },
    { id: '2:3', label: '2:3 Portrait', desc: 'Standard Poster', previewClass: 'w-4 h-6' },
    { id: '3:2', label: '3:2 Landscape', desc: 'Classic 35mm Frame', previewClass: 'w-6 h-4' },
    { id: '3:4', label: '3:4 Vertical', desc: 'Tablet & Report', previewClass: 'w-4.5 h-6' },
    { id: '4:3', label: '4:3 Standard', desc: 'GIS Deck Display', previewClass: 'w-6 h-4.5' },
    { id: '9:16', label: '9:16 Vertical', desc: 'Mobile Story / Feed', previewClass: 'w-3.5 h-6' },
    { id: '16:9', label: '16:9 Cinematic', desc: 'HD Widescreen Display', previewClass: 'w-7 h-4' },
    { id: '21:9', label: '21:9 Ultra-Wide', desc: 'Panoramic GIS Wall', previewClass: 'w-8 h-3.5' }
  ];

  const presetThemes = [
    {
      title: 'Satellite Tropospheric Column',
      icon: Satellite,
      prompt: `Sentinel-5P satellite false-color tropospheric NO2 and PM2.5 atmospheric concentration map over ${currentCityData.cityName}, high altitude Earth observation render with topological terrain contours and emission plume gradients`
    },
    {
      title: 'Gaussian Industrial Plume',
      icon: Flame,
      prompt: `3D thermal Gaussian industrial plume dispersion simulation flowing over an urban metropolis, advection-diffusion atmospheric particles glowing in red, orange, and amber heat levels`
    },
    {
      title: 'Clean-Air Green Canopy Corridor',
      icon: Trees,
      prompt: `Architectural aerial render of an urban green-canopy clean-air corridor with lush tree filtration barriers separating highway traffic particulate emissions from pedestrian paths`
    },
    {
      title: 'Thermal Inversion Smog Cap',
      icon: Layers,
      prompt: `Atmospheric nocturnal temperature inversion layer trapping dense aerosol haze over valley topography at twilight, realistic meteorological cross-section diagram`
    }
  ];

  const handleGenerateImage = async () => {
    if (!customPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          aspectRatio: selectedRatio,
          imageSize
        })
      });

      const data = await response.json();
      if (data.imageUrl) {
        const newImg: GeneratedAtmosphericImage = {
          id: `gen_${Date.now()}`,
          url: data.imageUrl,
          prompt: customPrompt,
          aspectRatio: selectedRatio,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed || 'gemini-3.1-flash-image',
          category: 'Synthetic Atmospheric Field'
        };

        setGallery(prev => [newImg, ...prev]);
      }
    } catch (err: any) {
      console.error('Image generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-5 pointer-events-none">
          <AQILogo variant="watermark" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <AQILogo variant="icon-only" iconClassName="w-11 h-11" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <span>Satellite & Atmospheric Image Generation Studio</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Aspect Ratio Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate high-resolution synthetic Earth observation fields, smog diffusion plumes, and green canopy maps with precise aspect ratio control
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Aspect Ratio & Prompt Configuration */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Ratio className="w-4 h-4 text-cyan-400" />
              <span>Aspect Ratio Selection</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">{selectedRatio}</span>
          </div>

          {/* Aspect Ratio Selector (8 Formats) */}
          <div className="grid grid-cols-2 gap-2.5">
            {aspectRatios.map(r => {
              const isSelected = selectedRatio === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRatio(r.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/60 shadow-md shadow-cyan-500/10 text-cyan-200'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{r.label}</span>
                    <div className={`border border-current rounded-sm ${r.previewClass} opacity-80`} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{r.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Resolution selector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Resolution Level:</span>
              <span className="font-mono text-cyan-400">{imageSize}</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['1K', '2K'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setImageSize(size)}
                  className={`py-1.5 px-3 rounded-lg border font-semibold text-center transition-all ${
                    imageSize === size
                      ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {size} Resolution
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Presets */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Prompt Engineering Presets:</span>
            </label>
            <div className="space-y-1.5">
              {presetThemes.map((theme, idx) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setCustomPrompt(theme.prompt)}
                    className="w-full p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 hover:bg-slate-800 hover:border-cyan-500/40 text-left text-xs text-slate-300 hover:text-cyan-300 flex items-center space-x-2 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{theme.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Prompt Editor & Generation Canvas */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span>Atmospheric Prompt Formulation</span>
              </h3>
              <span className="text-xs text-slate-400">Powered by Gemini 3.1 Flash Image</span>
            </div>

            <textarea
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe the atmospheric satellite map, plume dispersion field, or clean-air canopy you wish to synthesize..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Selected Aspect: <strong className="text-cyan-300">{selectedRatio}</strong> ({imageSize})</span>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGenerating || !customPrompt.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/10"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Atmospheric Image...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Image ({selectedRatio})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Gallery Display */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="font-bold text-xs text-slate-300 flex items-center justify-between">
              <span>Synthesized Image Gallery ({gallery.length})</span>
              <span className="text-[11px] font-mono text-slate-500">Auto-saved to session</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto p-1">
              {gallery.map(img => (
                <div
                  key={img.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-md flex flex-col group transition-all hover:border-slate-700"
                >
                  {/* Image Frame */}
                  <div className="relative bg-slate-900 flex items-center justify-center overflow-hidden min-h-[160px]">
                    <img
                      src={img.url}
                      alt={img.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover max-h-[220px] transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Aspect Ratio Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur border border-slate-700 text-[10px] font-mono font-bold text-cyan-300">
                      {img.aspectRatio}
                    </div>

                    {/* Lightbox button overlay */}
                    <button
                      onClick={() => setLightboxImage(img)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Inspect Fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed" title={img.prompt}>
                      {img.prompt}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                      <span className="font-mono">{img.timestamp}</span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyPrompt(img.prompt, img.id)}
                          className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Copy prompt"
                        >
                          {copiedId === img.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <a
                          href={img.url}
                          download={`aurapredict_${img.aspectRatio.replace(':', 'x')}_${img.id}.png`}
                          className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                          title="Download Image"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-4 space-y-3 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
                  {lightboxImage.aspectRatio}
                </span>
                <span className="text-xs font-bold text-slate-200 truncate max-w-md">
                  {lightboxImage.prompt}
                </span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden max-h-[70vh]">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.prompt}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Model: {lightboxImage.modelUsed} | Time: {lightboxImage.timestamp}</span>
              <a
                href={lightboxImage.url}
                download={`aurapredict_highres_${lightboxImage.id}.png`}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save High-Res Image</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
