import React, { useState, useEffect } from 'react';

interface SarvamAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  mood?: 'calm' | 'compassionate' | 'breathing' | 'listening';
  size?: 'sm' | 'md' | 'lg';
}

export const SarvamAvatar: React.FC<SarvamAvatarProps> = ({
  isSpeaking,
  isListening,
  mood = 'calm',
  size = 'lg'
}) => {
  const [mouthState, setMouthState] = useState<number>(0);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  // Sync mouth animation when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthState(0);
      return;
    }

    const interval = setInterval(() => {
      // oscillate between 0, 1, 2, 3 (closed, slightly open, open, wide)
      setMouthState((prev) => (prev + 1) % 4);
    }, 140);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Natural blink loop every 3.5 - 5 seconds
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 180);
    };

    const interval = setInterval(triggerBlink, 4200);
    return () => clearInterval(interval);
  }, []);

  const dimensions =
    size === 'sm' ? 'w-24 h-24' : size === 'md' ? 'w-36 h-36' : 'w-48 h-48 sm:w-56 sm:h-56';

  return (
    <div className={`relative flex items-center justify-center ${dimensions} select-none`}>
      {/* Outer audio reactive aura rings */}
      <div
        className={`absolute -inset-4 sm:-inset-6 rounded-full border border-emerald-400/30 transition-all duration-700 pointer-events-none ${
          isSpeaking
            ? 'scale-115 opacity-70 animate-ping'
            : isListening
            ? 'scale-105 opacity-60 border-teal-400 animate-pulse'
            : 'scale-95 opacity-25'
        }`}
      />
      <div
        className={`absolute -inset-2 sm:-inset-3 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-400/20 to-emerald-300/10 blur-xl pointer-events-none transition-all duration-500 ${
          isSpeaking ? 'opacity-80 scale-110' : 'opacity-40 scale-100'
        }`}
      />

      {/* Main Avatar Circular Frame */}
      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-emerald-300/60 shadow-2xl bg-gradient-to-b from-[#e8f5f0] via-[#d1ebe1] to-[#b3ded0] flex items-center justify-center">
        {/* Soft meditative background lighting rays */}
        <div className="absolute inset-0 bg-radial from-white/60 via-transparent to-emerald-900/10 pointer-events-none" />

        {/* Handcrafted Serene Girl Illustration (Sarvam) */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full object-cover transform translate-y-2 scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin gradient */}
            <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f7d0b5" />
              <stop offset="100%" stopColor="#eec0a2" />
            </linearGradient>
            {/* Hair gradient: Dark warm brown with soft highlights */}
            <linearGradient id="hair" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c1a16" />
              <stop offset="50%" stopColor="#22120e" />
              <stop offset="100%" stopColor="#150a08" />
            </linearGradient>
            {/* Clothing gradient: Sage green meditation linen */}
            <linearGradient id="robe" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2f6d58" />
              <stop offset="100%" stopColor="#1c483a" />
            </linearGradient>
            {/* Cheek blush */}
            <radialGradient id="blush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f48b8b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f48b8b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Shoulders & Linen Robe */}
          <path
            d="M30 190 C35 155, 60 145, 100 145 C140 145, 165 155, 170 190 Z"
            fill="url(#robe)"
          />
          {/* Robe Collar V-neck */}
          <path
            d="M85 145 L100 168 L115 145 Z"
            fill="#e2efe9"
            stroke="#215242"
            strokeWidth="1.5"
          />

          {/* Neck */}
          <rect x="88" y="118" width="24" height="32" rx="8" fill="url(#skin)" />
          {/* Subtle throat shadow */}
          <ellipse cx="100" cy="128" rx="8" ry="3" fill="#dfad8f" opacity="0.5" />

          {/* Hair back layer */}
          <path
            d="M52 85 C45 125, 48 160, 60 180 C68 180, 72 150, 72 120 L128 120 C128 150, 132 180, 140 180 C152 160, 155 125, 148 85 Z"
            fill="url(#hair)"
          />

          {/* Head & Face Oval */}
          <path
            d="M66 82 C66 48, 134 48, 134 82 C134 116, 118 135, 100 135 C82 135, 66 116, 66 82 Z"
            fill="url(#skin)"
          />

          {/* Ears */}
          <ellipse cx="65" cy="88" rx="6" ry="11" fill="url(#skin)" />
          <ellipse cx="135" cy="88" rx="6" ry="11" fill="url(#skin)" />
          {/* Tiny delicate emerald earring */}
          <circle cx="65" cy="95" r="2.2" fill="#10b981" />
          <circle cx="135" cy="95" r="2.2" fill="#10b981" />

          {/* Cheeks Blush */}
          <circle cx="78" cy="98" r="9" fill="url(#blush)" />
          <circle cx="122" cy="98" r="9" fill="url(#blush)" />

          {/* Eyebrows (Gentle soft arch) */}
          <path
            d="M74 72 Q85 68 94 73"
            stroke="#3a221b"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M106 73 Q115 68 126 72"
            stroke="#3a221b"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Eyes (Serene, soft meditative gaze or blinking) */}
          {isBlinking ? (
            // Closed eyes blink
            <>
              <path
                d="M75 84 Q84 89 93 84"
                stroke="#321c17"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M107 84 Q116 89 125 84"
                stroke="#321c17"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          ) : (
            // Gentle open, soft smiling eyes
            <>
              {/* Left Eye */}
              <ellipse cx="84" cy="83" rx="7.5" ry="5.5" fill="#ffffff" />
              <ellipse cx="84" cy="83" rx="4.5" ry="4.5" fill="#42251d" />
              <ellipse cx="85" cy="82.5" rx="2.5" ry="2.5" fill="#1a0e0a" />
              <circle cx="86" cy="81.5" r="1.5" fill="#ffffff" />
              {/* Upper Eyelash curve */}
              <path
                d="M75 83 Q84 78 93 83"
                stroke="#2a1410"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Right Eye */}
              <ellipse cx="116" cy="83" rx="7.5" ry="5.5" fill="#ffffff" />
              <ellipse cx="116" cy="83" rx="4.5" ry="4.5" fill="#42251d" />
              <ellipse cx="115" cy="82.5" rx="2.5" ry="2.5" fill="#1a0e0a" />
              <circle cx="117" cy="81.5" r="1.5" fill="#ffffff" />
              {/* Upper Eyelash curve */}
              <path
                d="M107 83 Q116 78 125 83"
                stroke="#2a1410"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Subtle Bindi (Traditional sanctuary touch) */}
          <circle cx="100" cy="73" r="1.8" fill="#a83232" opacity="0.85" />

          {/* Delicate Nose */}
          <path
            d="M99 82 L98 94 Q98 97 101 97"
            stroke="#cf9373"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Dynamic Animated Mouth */}
          {!isSpeaking ? (
            // Soft peaceful closed smile
            <path
              d="M91 110 Q100 115 109 110"
              stroke="#b55858"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          ) : mouthState === 1 ? (
            // Slightly open mouth (articulating soft vowel)
            <ellipse cx="100" cy="111" rx="6" ry="3.5" fill="#7d3434" stroke="#b55858" strokeWidth="1.5" />
          ) : mouthState === 2 ? (
            // Open mouth speaking
            <path
              d="M92 109 Q100 118 108 109 Z"
              fill="#6b2525"
              stroke="#b55858"
              strokeWidth="1.5"
            />
          ) : (
            // Smiling vowel
            <path
              d="M93 110 Q100 114 107 110"
              stroke="#b55858"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          )}

          {/* Beautiful Hair bangs and strands */}
          <path
            d="M66 75 C70 42, 95 38, 100 48 C105 38, 130 42, 134 75 C124 55, 108 52, 100 62 C92 52, 76 55, 66 75 Z"
            fill="url(#hair)"
          />
          {/* Side swept wisps */}
          <path
            d="M65 78 C62 95, 66 115, 71 125 C68 110, 67 92, 70 78 Z"
            fill="url(#hair)"
          />
          <path
            d="M135 78 C138 95, 134 115, 129 125 C132 110, 133 92, 130 78 Z"
            fill="url(#hair)"
          />

          {/* Lotus flower ornament tucked in hair */}
          <g transform="translate(126, 52) scale(0.65)">
            <path d="M12 2 Q16 8 12 14 Q8 8 12 2 Z" fill="#fbcfe8" />
            <path d="M6 7 Q12 10 9 16 Q3 12 6 7 Z" fill="#f472b6" />
            <path d="M18 7 Q15 12 21 16 Q12 10 18 7 Z" fill="#f472b6" />
            <circle cx="12" cy="12" r="2.5" fill="#fef08a" />
          </g>
        </svg>

        {/* Live Speaking Indicator Badge */}
        {isSpeaking && (
          <div className="absolute bottom-2 bg-emerald-950/80 backdrop-blur-xs border border-emerald-400/40 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Speaking</span>
          </div>
        )}
        {isListening && (
          <div className="absolute bottom-2 bg-teal-950/80 backdrop-blur-xs border border-teal-400/40 text-teal-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>Listening to you...</span>
          </div>
        )}
      </div>
    </div>
  );
};
