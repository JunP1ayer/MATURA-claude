import React from 'react';

interface LogoProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => {
  const isCompact = variant === 'compact';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`inline-flex items-center justify-center rounded-xl shadow-lg ${
        isCompact ? 'w-8 h-8 md:w-10 md:h-10' : 'w-10 h-10'
      } bg-gradient-to-br from-blue-500 to-purple-600`}>
        <span className={`text-white font-bold ${
          isCompact ? 'text-sm md:text-base' : 'text-base'
        }`}>
          M
        </span>
      </div>
      <h1 className={`font-semibold text-white ${
        isCompact ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
      }`}>
        MATURA
      </h1>
    </div>
  );
};

export default Logo;