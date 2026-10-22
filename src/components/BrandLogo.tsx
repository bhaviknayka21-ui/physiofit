import React from 'react';
import { ASSETS } from '../data/seedData';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'hero';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'compact',
  className = '',
  onClick,
}) => {
  if (variant === 'icon') {
    return (
      <div
        onClick={onClick}
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 ${
          onClick ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-transform' : ''
        } ${className || 'h-9 w-9'}`}
      >
        <img
          src={ASSETS.brandLogo}
          alt="PhysioFit App Icon"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl ${className}`}
      >
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-500/30 mb-4 bg-white">
          <img
            src={ASSETS.brandLogo}
            alt="PhysioFit Brand Logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-black tracking-tight text-white">
          <span>Physio</span>
          <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
            Fit
          </span>
        </div>
        <div className="text-xs sm:text-sm font-semibold tracking-widest text-slate-300 uppercase mt-1">
          Train Smart. Move Better.
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-3 ${
          onClick ? 'cursor-pointer group' : ''
        } ${className}`}
      >
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-white p-0.5 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/20 group-hover:ring-emerald-400 transition-all">
          <img
            src={ASSETS.brandLogo}
            alt="PhysioFit Logo"
            className="h-full w-full object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-lg font-black tracking-tight text-white">
            <span>Physio</span>
            <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
              Fit
            </span>
          </div>
          <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase -mt-0.5">
            Train Smart. Move Better.
          </span>
        </div>
      </div>
    );
  }

  // Compact variant (default for Navbar)
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white p-0.5 shadow-sm ring-1 ring-emerald-500/20 group-hover:ring-emerald-400 transition-all">
        <img
          src={ASSETS.brandLogo}
          alt="PhysioFit Logo"
          className="h-full w-full object-cover rounded-[10px]"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center text-base sm:text-lg font-extrabold tracking-tight text-white leading-none">
          <span>Physio</span>
          <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
            Fit
          </span>
        </div>
        <span className="text-[9px] font-medium tracking-wider text-slate-400 uppercase leading-tight mt-0.5">
          Train Smart. Move Better.
        </span>
      </div>
    </div>
  );
};
