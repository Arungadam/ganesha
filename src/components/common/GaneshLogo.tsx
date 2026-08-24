import React from 'react';

interface GaneshLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function GaneshLogo({ className = '', size = 38, showText = true }: GaneshLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-2xl shadow-sm text-white font-bold transition-transform hover:scale-105"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #EA580C 0%, #B91C1C 100%)',
          boxShadow: '0 4px 14px 0 rgba(234, 88, 12, 0.35)',
        }}
      >
        {/* Lord Ganesha Stylized Sacred Emblem */}
        <svg
          viewBox="0 0 100 100"
          className="w-4/5 h-4/5 text-amber-300 fill-current drop-shadow-sm"
        >
          {/* Sacred Tilak / Trishul Crown */}
          <path
            d="M50 12 C48 20 44 26 40 28 C46 30 49 33 50 40 C51 33 54 30 60 28 C56 26 52 20 50 12 Z"
            fill="#FDE047"
          />
          {/* Center Red Vermillion Bindi */}
          <circle cx="50" cy="30" r="3.5" fill="#DC2626" />
          {/* Elephant Ears */}
          <path
            d="M32 38 C20 38 12 46 16 62 C19 72 28 72 35 68 C33 60 32 50 32 38 Z"
            fill="#FEF08A"
            opacity="0.9"
          />
          <path
            d="M68 38 C80 38 88 46 84 62 C81 72 72 72 65 68 C67 60 68 50 68 38 Z"
            fill="#FEF08A"
            opacity="0.9"
          />
          {/* Elephant Trunk curve */}
          <path
            d="M44 42 C44 42 42 62 46 74 C48 82 56 86 62 82 C66 78 64 72 58 72 C52 72 50 64 50 56 C50 48 56 42 56 42 Z"
            fill="#FACC15"
          />
          {/* Tusk */}
          <path d="M41 58 L33 60 L38 55 Z" fill="#FFFFFF" />
          {/* Modak in trunk */}
          <circle cx="60" cy="74" r="3" fill="#F59E0B" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-extrabold tracking-tight text-lg text-amber-950 flex items-center gap-1.5">
            GANESH SEVA
            <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60">
              Smart
            </span>
          </span>
          <span className="text-[10.5px] font-medium text-amber-800/80 tracking-wide -mt-0.5">
            Ganesh Festival Management
          </span>
        </div>
      )}
    </div>
  );
}
