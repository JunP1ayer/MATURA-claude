import React from 'react';

interface MATURALogoProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function MATURALogo({ variant = 'default', className = '' }: MATURALogoProps) {
  const isCompact = variant === 'compact';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Geometric M with Structure & AI theme */}
      <div className={`relative ${isCompact ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center`}>
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          
          {/* Background Circle with Subtle Gradient */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="url(#logoGradient)"
            className="drop-shadow-lg"
          />
          
          {/* Geometric M - Clear M Shape */}
          <g fill="white" fillOpacity="0.95">
            {/* Left Vertical Bar */}
            <rect x="8" y="12" width="4" height="16" />
            {/* Center V Shape */}
            <polygon points="12,12 16,12 20,20 24,12 28,12 22,24 20,24 18,24" />
            {/* Right Vertical Bar */}
            <rect x="28" y="12" width="4" height="16" />
          </g>
          
          {/* AI Neural Dots - Subtle accent */}
          <circle cx="32" cy="8" r="1.5" fill="url(#accentGradient)" opacity="0.8" />
          <circle cx="8" cy="32" r="1" fill="url(#accentGradient)" opacity="0.6" />
          <circle cx="35" cy="15" r="0.8" fill="url(#accentGradient)" opacity="0.5" />
        </svg>
      </div>
      
      {/* MATURA Text */}
      <div className="flex flex-col">
        <h1 className={`matura-brand-text font-bold tracking-wide text-white leading-none ${
          isCompact ? 'text-lg' : 'text-xl md:text-2xl'
        }`}>
          MATURA
        </h1>
        {!isCompact && (
          <span className="text-xs text-white/60 font-medium tracking-widest mt-0.5 uppercase">
            AI Builder
          </span>
        )}
      </div>
    </div>
  );
}

// Alternative Minimalist Version
export function MATURALogoMinimal({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Minimal Geometric Icon */}
      <div className="w-9 h-9 relative">
        <svg viewBox="0 0 36 36" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          
          {/* Rounded Square Background */}
          <rect
            x="2" y="2" width="32" height="32"
            rx="8" ry="8"
            fill="url(#minimalGradient)"
            className="drop-shadow-md"
          />
          
          {/* Clear M Shape */}
          <path
            d="M8 26 L8 10 L12 10 L18 18 L24 10 L28 10 L28 26 L24 26 L24 16 L20 22 L16 22 L12 16 L12 26 Z"
            fill="white"
            fillOpacity="0.95"
          />
        </svg>
      </div>
      
      <h1 className="matura-brand-text font-bold tracking-wide text-white text-xl leading-none">
        MATURA
      </h1>
    </div>
  );
}

// Speech Bubble Version (Option B)
export function MATURALogoSpeech({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 relative">
        <svg viewBox="0 0 40 40" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="speechGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          
          {/* Speech Bubble */}
          <path
            d="M8 8 Q8 4 12 4 L32 4 Q36 4 36 8 L36 20 Q36 24 32 24 L16 24 L8 30 L8 24 Q8 24 8 20 Z"
            fill="url(#speechGradient)"
            className="drop-shadow-lg"
          />
          
          {/* M inside bubble - Clear M */}
          <path
            d="M13 19 L13 9 L16 9 L20 15 L24 9 L27 9 L27 19 L24 19 L24 13 L21 17 L19 17 L16 13 L16 19 Z"
            fill="white"
            fillOpacity="0.95"
          />
        </svg>
      </div>
      
      <h1 className="matura-brand-text font-bold tracking-wide text-white text-xl leading-none">
        MATURA
      </h1>
    </div>
  );
}