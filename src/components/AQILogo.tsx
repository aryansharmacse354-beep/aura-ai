import React from 'react';

interface AQILogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  showBadge?: boolean;
  variant?: 'full' | 'icon-only' | 'watermark';
  iconClassName?: string;
}

export const AQILogo: React.FC<AQILogoProps> = ({
  className = '',
  size = 'md',
  showBadge = false,
  variant = 'full',
  iconClassName = ''
}) => {
  const sizeClasses = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
    '2xl': 'h-28',
    custom: ''
  };

  const svgClass = size === 'custom' ? className : `${sizeClasses[size]} ${className}`;

  if (variant === 'icon-only') {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-2xl bg-white p-2 shadow-md border border-slate-200/50 dark:border-slate-700/50 ${iconClassName}`}>
        <svg viewBox="0 0 100 100" className={svgClass || 'w-8 h-8'} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* A */}
          <path
            d="M 12 75 L 26 22 L 34 22 L 48 75 L 39 75 L 35.5 60 L 24.5 60 L 21 75 Z M 26.5 52 L 33.5 52 L 30 36 Z"
            fill="#0097D8"
          />
          {/* Spectrum Arc Q Ring */}
          <defs>
            <linearGradient id="spectrumGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D90429" />
              <stop offset="18%" stopColor="#F72585" />
              <stop offset="36%" stopColor="#FB8500" />
              <stop offset="54%" stopColor="#FFB703" />
              <stop offset="72%" stopColor="#80B918" />
              <stop offset="90%" stopColor="#0097D8" />
            </linearGradient>
          </defs>
          <circle
            cx="64"
            cy="46"
            r="20"
            stroke="url(#spectrumGradientIcon)"
            strokeWidth="7"
            fill="none"
          />
          {/* Q Tail */}
          <path
            d="M 68 52 L 78 72 L 70 75 L 61 58 Z"
            fill="#0097D8"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'watermark') {
    return (
      <div className={`pointer-events-none select-none flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 400 180" className="w-full h-full opacity-100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="watermarkSpectrum" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E63946" />
              <stop offset="20%" stopColor="#D90429" />
              <stop offset="40%" stopColor="#FB8500" />
              <stop offset="60%" stopColor="#FFB703" />
              <stop offset="80%" stopColor="#52B788" />
              <stop offset="100%" stopColor="#0097D8" />
            </linearGradient>
          </defs>

          {/* Letter A */}
          <path
            d="M 30 145 L 82 28 L 105 28 L 157 145 L 132 145 L 120 115 L 67 115 L 55 145 Z M 75 95 L 112 95 L 93.5 48 Z"
            fill="#0097D8"
          />

          {/* Letter Q with spectrum ring */}
          {/* Spectrum Ring Segments */}
          <circle
            cx="245"
            cy="86"
            r="54"
            stroke="url(#watermarkSpectrum)"
            strokeWidth="16"
            fill="none"
          />
          {/* Q Tail */}
          <path
            d="M 252 105 L 285 148 L 262 153 L 235 118 Z"
            fill="#0097D8"
          />

          {/* Letter I */}
          <rect
            x="320"
            y="28"
            width="20"
            height="117"
            fill="#0097D8"
          />

          {/* ® Registered Trademark Symbol */}
          <circle cx="355" cy="38" r="8" stroke="#0097D8" strokeWidth="1.8" fill="none" />
          <text x="355" y="41.5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0097D8" fontFamily="system-ui, sans-serif">R</text>
        </svg>
      </div>
    );
  }

  // Full default view
  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* App Icon Card */}
      <div className={`relative flex items-center justify-center rounded-2xl bg-white p-2 shadow-md border border-slate-200/60 dark:border-slate-700/60 transition-transform duration-300 hover:scale-105 ${iconClassName}`}>
        <svg viewBox="0 0 380 180" className={svgClass || 'h-10 w-auto'} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D90429" />
              <stop offset="16%" stopColor="#E63946" />
              <stop offset="33%" stopColor="#FB8500" />
              <stop offset="50%" stopColor="#FFB703" />
              <stop offset="68%" stopColor="#70C1B3" />
              <stop offset="85%" stopColor="#0097D8" />
              <stop offset="100%" stopColor="#0077B6" />
            </linearGradient>
            <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0097D8" floodOpacity="0.2"/>
            </filter>
          </defs>

          {/* Letter A */}
          <path
            d="M 30 145 L 82 28 L 105 28 L 157 145 L 132 145 L 120 115 L 67 115 L 55 145 Z M 75 95 L 112 95 L 93.5 48 Z"
            fill="#0097D8"
          />

          {/* Letter Q */}
          <circle
            cx="245"
            cy="86"
            r="54"
            stroke="url(#spectrumGradient)"
            strokeWidth="16"
            fill="none"
          />
          {/* Q Tail */}
          <path
            d="M 252 105 L 285 148 L 262 153 L 235 118 Z"
            fill="#0097D8"
          />

          {/* Letter I */}
          <rect
            x="320"
            y="28"
            width="20"
            height="117"
            fill="#0097D8"
          />

          {/* ® Registered Trademark */}
          <circle cx="355" cy="38" r="8" stroke="#0097D8" strokeWidth="1.8" fill="none" />
          <text x="355" y="41.5" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0097D8" fontFamily="system-ui, sans-serif">R</text>
        </svg>
      </div>

      {showBadge && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold tracking-tight text-slate-900 dark:text-slate-100 text-sm">
              AuraPredict AI
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              v3.7 Enterprise
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Atmospheric Intelligence Platform
          </span>
        </div>
      )}
    </div>
  );
};
