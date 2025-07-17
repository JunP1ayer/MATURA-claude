'use client';

import React from 'react';

interface MATURALogoModernProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function MATURALogoModern({ variant = 'default', className = '' }: MATURALogoModernProps) {
  const isCompact = variant === 'compact';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Modern M Logo - Clean and Clear */}
      <div className={`relative ${isCompact ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center`}>
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="modernGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          
          {/* Clean M Icon - No confusion with W */}
          <g fill="url(#modernGradient)" className="drop-shadow-lg">
            {/* Left stroke of M */}
            <rect x="6" y="10" width="5" height="20" rx="1" />
            {/* Center V of M - pointing down */}
            <path d="M11 10 L11 14 L20 26 L29 14 L29 10 L25 10 L20 18 L15 10 Z" />
            {/* Right stroke of M */}
            <rect x="29" y="10" width="5" height="20" rx="1" />
          </g>
          
          {/* Subtle tech accent dots */}
          <circle cx="20" cy="32" r="1" fill="#F59E0B" opacity="0.8" />
          <circle cx="20" cy="36" r="0.8" fill="#F59E0B" opacity="0.5" />
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

// Alternative: Strong M Design
export function MATURALogoStrong({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 relative">
        <svg viewBox="0 0 40 40" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="strongGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          
          {/* Background Circle */}
          <circle cx="20" cy="20" r="18" fill="url(#strongGradient)" opacity="0.1" />
          
          {/* Strong M Design */}
          <path
            d="M 8,28 L 8,12 L 13,12 L 20,22 L 27,12 L 32,12 L 32,28 L 27,28 L 27,20 L 22,26 L 18,26 L 13,20 L 13,28 Z"
            fill="url(#strongGradient)"
            className="drop-shadow-md"
          />
        </svg>
      </div>
      
      <h1 className="matura-brand-text font-bold tracking-wide text-white text-xl leading-none">
        MATURA
      </h1>
    </div>
  );
}

// Clean Square Version
export function MATURALogoSquare({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 relative">
        <svg viewBox="0 0 40 40" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="squareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          
          {/* Rounded Square Background */}
          <rect
            x="2" y="2" width="36" height="36"
            rx="8" ry="8"
            fill="url(#squareGradient)"
            className="drop-shadow-lg"
          />
          
          {/* Clear M inside */}
          <g fill="white">
            {/* Left vertical */}
            <rect x="8" y="12" width="4" height="16" />
            {/* Center peak pointing up (correct M orientation) */}
            <polygon points="12,12 16,12 20,20 24,12 28,12 24,20 20,28 16,20" />
            {/* Right vertical */}
            <rect x="28" y="12" width="4" height="16" />
          </g>
        </svg>
      </div>
      
      <h1 className="matura-brand-text font-bold tracking-wide text-white text-xl leading-none">
        MATURA
      </h1>
    </div>
  );
}