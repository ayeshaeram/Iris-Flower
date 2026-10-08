import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'classic';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'classic',
  showSubtitle = true
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Handcrafted Botanical Iris Crest Emblem */}
      <div
        className={`relative rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 hover:scale-105 ${
          isSm ? 'w-9 h-9' : isLg ? 'w-14 h-14' : 'w-11 h-11'
        } ${
          variant === 'dark'
            ? 'bg-slate-900 border border-slate-700/80 shadow-slate-950/40'
            : variant === 'light'
            ? 'bg-white border border-slate-200 shadow-slate-200/50'
            : 'bg-linear-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-indigo-950/20'
        }`}
      >
        {/* Glowing aura */}
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-xs" />

        {/* Botanical Iris Flower Vector Icon */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${isSm ? 'w-5 h-5' : isLg ? 'w-8 h-8' : 'w-6 h-6'} relative z-10`}
        >
          {/* Outer Laurel / Crest Ring */}
          <circle
            cx="24"
            cy="24"
            r="21"
            stroke="url(#irisGoldGrad)"
            strokeWidth="1.2"
            strokeDasharray="2 3"
            opacity="0.85"
          />

          {/* Central Standard Upright Petals */}
          <path
            d="M24 7C22.5 12 21 16 21 21C21 24.5 22.2 26 24 26C25.8 26 27 24.5 27 21C27 16 25.5 12 24 7Z"
            fill="url(#irisPetalGrad)"
          />

          {/* Left Standard Petal */}
          <path
            d="M20 11C16.5 14 14.5 18 15.5 22C16 24 17.5 25 19.5 24C21 23 22 21 22 18C22 15 21 13 20 11Z"
            fill="url(#irisLilacGrad)"
            opacity="0.9"
          />

          {/* Right Standard Petal */}
          <path
            d="M28 11C31.5 14 33.5 18 32.5 22C32 24 30.5 25 28.5 24C27 23 26 21 26 18C26 15 27 13 28 11Z"
            fill="url(#irisLilacGrad)"
            opacity="0.9"
          />

          {/* Left Fall / Drooping Sepal */}
          <path
            d="M21 24C16 26 10 30 11 36C12 40 16 41 20 37C22 35 23 31 23 27C23 25.5 22 24.5 21 24Z"
            fill="url(#irisFallGrad)"
          />

          {/* Right Fall / Drooping Sepal */}
          <path
            d="M27 24C32 26 38 30 37 36C36 40 32 41 28 37C26 35 25 31 25 27C25 25.5 26 24.5 27 24Z"
            fill="url(#irisFallGrad)"
          />

          {/* Golden Center Signal / Crest Beard */}
          <path
            d="M24 23C23 25 22.5 28 22.5 32C23 33.5 25 33.5 25.5 32C25.5 28 25 25 24 23Z"
            fill="#FBBF24"
          />

          <circle cx="24" cy="27" r="1.5" fill="#F59E0B" />

          {/* Gradients */}
          <defs>
            <linearGradient id="irisGoldGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="0.5" stopColor="#E0E7FF" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="irisPetalGrad" x1="24" y1="7" x2="24" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818CF8" />
              <stop offset="1" stopColor="#4338CA" />
            </linearGradient>
            <linearGradient id="irisLilacGrad" x1="20" y1="11" x2="20" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A5B4FC" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="irisFallGrad" x1="24" y1="24" x2="24" y2="41" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4F46E5" />
              <stop offset="1" stopColor="#312E81" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography Label */}
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight ${
              isSm ? 'text-sm' : isLg ? 'text-xl' : 'text-base'
            } ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}
          >
            IRIS CLASSIFIER
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
            ML
          </span>
        </div>
        {showSubtitle && (
          <div
            className={`font-medium tracking-wide uppercase ${
              isSm ? 'text-[9px]' : 'text-[10px]'
            } ${variant === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Taxonomic Biometric Intelligence
          </div>
        )}
      </div>
    </div>
  );
};
