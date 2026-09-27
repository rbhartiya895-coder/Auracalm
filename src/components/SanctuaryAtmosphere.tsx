import React from 'react';

export type BackgroundTheme = 'lotus-dawn' | 'himalayan-mist' | 'twilight-starlight' | 'zen-garden';

interface SanctuaryAtmosphereProps {
  theme: BackgroundTheme;
  isDark?: boolean;
}

export const SanctuaryAtmosphere: React.FC<SanctuaryAtmosphereProps> = ({ theme, isDark = false }) => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden transition-all duration-700 select-none">
      {/* Dynamic Theme Gradients */}
      {theme === 'lotus-dawn' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbf8f5] via-[#f3f7f4] to-[#edf4f0] transition-colors duration-700">
          {/* Soft Aurora Glow 1 - Lotus Pink Glow */}
          <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#f9d5d3]/40 via-[#f0e3db]/30 to-transparent blur-3xl animate-aurora-1" />
          {/* Soft Aurora Glow 2 - Morning Sage Mist */}
          <div className="absolute top-1/3 -right-24 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-[#d5e7dd]/50 via-[#e0ece5]/30 to-transparent blur-3xl animate-aurora-2" />
          {/* Soft Aurora Glow 3 - Golden Sunlight */}
          <div className="absolute -bottom-24 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#f6eedb]/45 via-[#e8f1eb]/35 to-transparent blur-3xl animate-aurora-3" />
        </div>
      )}

      {theme === 'himalayan-mist' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#f2f7f4] via-[#e8f1ed] to-[#dfebe4] transition-colors duration-700">
          {/* Emerald & Pine Green Aura */}
          <div className="absolute -top-20 left-10 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#c4e0d2]/50 via-[#d3ebd9]/40 to-transparent blur-3xl animate-aurora-1" />
          <div className="absolute top-1/2 -right-20 w-[580px] h-[580px] rounded-full bg-gradient-to-bl from-[#b2d9c6]/40 via-[#d4ebe1]/30 to-transparent blur-3xl animate-aurora-2" />
          <div className="absolute -bottom-20 left-1/4 w-[540px] h-[540px] rounded-full bg-gradient-to-tr from-[#cde3d8]/40 to-transparent blur-3xl animate-aurora-3" />
        </div>
      )}

      {theme === 'twilight-starlight' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1619] via-[#112124] to-[#0a1417] transition-colors duration-700">
          {/* Deep Indigo & Midnight Teal Aura */}
          <div className="absolute top-0 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#1b3d45]/40 via-[#173038]/30 to-transparent blur-3xl animate-aurora-1" />
          <div className="absolute top-1/2 right-10 w-[480px] h-[480px] rounded-full bg-gradient-to-bl from-[#2a3b5c]/35 via-[#1a2a3e]/20 to-transparent blur-3xl animate-aurora-2" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#16433a]/30 to-transparent blur-3xl animate-aurora-3" />
          {/* Subtle Celestial Stars */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-[12%] left-[18%] w-1 h-1 bg-white/70 rounded-full animate-pulse" />
            <div className="absolute top-[22%] left-[78%] w-1 h-1 bg-cyan-200/80 rounded-full animate-pulse-slow" />
            <div className="absolute top-[35%] left-[45%] w-1.5 h-1.5 bg-emerald-100/70 rounded-full animate-pulse" />
            <div className="absolute top-[68%] left-[25%] w-1 h-1 bg-amber-100/60 rounded-full animate-pulse-slow" />
            <div className="absolute top-[82%] left-[82%] w-1.5 h-1.5 bg-teal-100/70 rounded-full animate-pulse" />
            <div className="absolute top-[50%] left-[88%] w-1 h-1 bg-white/60 rounded-full animate-pulse" />
            <div className="absolute top-[75%] left-[62%] w-1 h-1 bg-white/70 rounded-full animate-pulse-slow" />
          </div>
        </div>
      )}

      {theme === 'zen-garden' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f6f0] via-[#f1eee4] to-[#e8e4d8] transition-colors duration-700">
          {/* Warm Sand & Bamboo Aura */}
          <div className="absolute -top-20 left-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#eeddc5]/45 via-[#e2d5c2]/35 to-transparent blur-3xl animate-aurora-1" />
          <div className="absolute top-1/2 -right-20 w-[560px] h-[560px] rounded-full bg-gradient-to-bl from-[#d8e2d0]/50 via-[#cfded0]/30 to-transparent blur-3xl animate-aurora-2" />
          <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#ded9cb]/40 to-transparent blur-3xl animate-aurora-3" />
        </div>
      )}

      {/* Floating Meditative Botanical Petals / Leaves (Enhanced Motion) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Petal 1 */}
        <div className="absolute top-[70%] left-[8%] animate-petal-1">
          <svg className="w-5 h-7 text-[#5a8775]/25" viewBox="0 0 24 32" fill="currentColor">
            <path d="M12 0 C18 8, 24 16, 20 28 C16 32, 8 32, 4 28 C0 16, 6 8, 12 0 Z" />
          </svg>
        </div>

        {/* Floating Petal 2 */}
        <div className="absolute top-[60%] right-[12%] animate-petal-2">
          <svg className="w-6 h-8 text-[#d89797]/30" viewBox="0 0 24 32" fill="currentColor">
            <path d="M12 0 C18 8, 24 16, 20 28 C16 32, 8 32, 4 28 C0 16, 6 8, 12 0 Z" />
          </svg>
        </div>

        {/* Floating Petal 3 */}
        <div className="absolute top-[80%] left-[55%] animate-petal-3">
          <svg className="w-4 h-6 text-[#5a8775]/20" viewBox="0 0 24 32" fill="currentColor">
            <path d="M12 0 C18 8, 24 16, 20 28 C16 32, 8 32, 4 28 C0 16, 6 8, 12 0 Z" />
          </svg>
        </div>

        {/* Floating Petal 4 */}
        <div className="absolute top-[85%] right-[35%] animate-petal-4">
          <svg className="w-5 h-7 text-[#d4af37]/20" viewBox="0 0 24 32" fill="currentColor">
            <path d="M12 0 C18 8, 24 16, 20 28 C16 32, 8 32, 4 28 C0 16, 6 8, 12 0 Z" />
          </svg>
        </div>
      </div>

      {/* Subtle organic Zen wave texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1c3a2f_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
};
