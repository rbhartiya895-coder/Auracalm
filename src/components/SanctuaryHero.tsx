import React, { useState } from 'react';
import { MessageSquare, Radio, Wind, RotateCcw, Volume2, Sparkles, Check, Edit3, VolumeX } from 'lucide-react';
import { ToneSetting } from '../types';
import { AmbientSoundType, soundService } from '../services/soundService';

interface SanctuaryHeroProps {
  currentTone: ToneSetting;
  onSelectTone: (tone: ToneSetting) => void;
  breathingGuideActive: boolean;
  onToggleBreathingGuide: () => void;
  onTriggerSighReset: () => void;
  onOpenTextChat: () => void;
  onOpenBreathingModal: () => void;
  onOpenSarvam: () => void;
  onOpenNamingModal?: () => void;
  onOpenTour?: () => void;
  onOpenAmbientPanel?: () => void;
  ambientSound?: string | null;
  onSelectAmbientSound?: (type: AmbientSoundType | null) => void;
  companionName?: string;
  companionVoice?: string;
}

const VOICE_NAMES: Record<string, string> = {
  kavya: 'Kavya (Warm)',
  simran: 'Simran (Soft)',
  pooja: 'Pooja (Centered)',
  ritu: 'Ritu (Steady)',
  priya: 'Priya (Melodious)',
  shreya: 'Shreya (Whisper)'
};

const QUICK_SOUNDSCAPES: { id: AmbientSoundType; label: string; icon: string }[] = [
  { id: 'flute', label: 'Bamboo Flute', icon: '🪈' },
  { id: 'birds', label: 'Dawn Birds', icon: '🐦' },
  { id: 'insects', label: 'Night Crickets', icon: '🦗' },
  { id: 'ocean', label: 'Ocean Waves', icon: '🌊' },
  { id: 'rain', label: 'Gentle Rain', icon: '🌧️' }
];

export const SanctuaryHero: React.FC<SanctuaryHeroProps> = ({
  currentTone,
  onSelectTone,
  breathingGuideActive,
  onToggleBreathingGuide,
  onTriggerSighReset,
  onOpenTextChat,
  onOpenSarvam,
  onOpenNamingModal,
  onOpenTour,
  onOpenAmbientPanel,
  ambientSound,
  onSelectAmbientSound,
  companionName = 'Meera',
  companionVoice = 'kavya'
}) => {
  const [activeMode, setActiveMode] = useState<'sarvam' | 'chat'>('sarvam');
  const [showToneDropdown, setShowToneDropdown] = useState(false);

  const tones: { name: ToneSetting; desc: string }[] = [
    { name: 'Calm', desc: 'Quiet sanctuary baseline' },
    { name: 'Compassionate', desc: 'Gentle warmth & soothing reassurance' },
    { name: 'Grounded', desc: 'Firm, steady anchor for panic & spin' },
    { name: 'Whisper', desc: 'Ultra-soft pacing for sleep & night' }
  ];

  const handlePillClick = (mode: 'sarvam' | 'chat') => {
    setActiveMode(mode);
    if (mode === 'sarvam') {
      onOpenSarvam();
    } else if (mode === 'chat') {
      onOpenTextChat();
    }
  };

  const handleQuickSoundClick = (type: AmbientSoundType) => {
    if (ambientSound === type) {
      soundService.stopAmbient();
      if (onSelectAmbientSound) onSelectAmbientSound(null);
    } else {
      soundService.startAmbient(type);
      if (onSelectAmbientSound) onSelectAmbientSound(type);
    }
  };

  const currentVoiceDesc = VOICE_NAMES[companionVoice] || 'Kavya (Warm)';

  return (
    <section className="relative w-full max-w-5xl mx-auto pt-6 sm:pt-8 pb-10 px-4 sm:px-6">
      {/* Background Soft Organic Foliage Accents with Enhanced Motion */}
      <div className="absolute top-12 left-0 -translate-x-12 w-80 h-80 bg-[#d8e5df]/50 rounded-full blur-3xl pointer-events-none -z-10 animate-aurora-1" />
      <div className="absolute top-20 right-0 translate-x-12 w-96 h-96 bg-[#e3eae6]/50 rounded-full blur-3xl pointer-events-none -z-10 animate-aurora-2" />

      {/* Decorative foliage SVGs floating in background with gentle sway */}
      <div className="absolute top-20 left-2 lg:left-6 opacity-35 pointer-events-none select-none hidden md:block animate-sway">
        <svg width="180" height="220" viewBox="0 0 180 220" fill="none" className="text-[#3a6555]/25">
          <path d="M20 200 C40 120, 100 60, 160 20 C140 100, 80 160, 20 200 Z" fill="currentColor" />
          <path d="M20 200 C70 140, 110 90, 160 20" stroke="rgba(58, 101, 85, 0.4)" strokeWidth="1.5" />
          <path d="M60 160 C90 145, 120 120, 135 95" stroke="rgba(58, 101, 85, 0.3)" strokeWidth="1" />
          <path d="M40 180 C70 170, 95 150, 110 130" stroke="rgba(58, 101, 85, 0.3)" strokeWidth="1" />
        </svg>
      </div>

      <div className="absolute top-16 right-2 lg:right-6 opacity-35 pointer-events-none select-none hidden md:block animate-sway" style={{ animationDelay: '4s' }}>
        <svg width="180" height="220" viewBox="0 0 180 220" fill="none" className="text-[#3c6b65]/25 scale-x-[-1]">
          <path d="M20 200 C40 120, 100 60, 160 20 C140 100, 80 160, 20 200 Z" fill="currentColor" />
          <path d="M20 200 C70 140, 110 90, 160 20" stroke="rgba(60, 107, 101, 0.4)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Heading & Subtitle */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        {onOpenTour && (
          <button
            onClick={onOpenTour}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ebf4ef] hover:bg-[#deede6] text-[#21493d] rounded-full text-xs font-semibold border border-[#cde2d6] transition-all hover:scale-102 cursor-pointer shadow-2xs mb-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2f6352]" />
            <span>First time? Take a 1-minute sanctuary tour</span>
            <span className="text-[#4b7a66]">→</span>
          </button>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a2c25] font-sans">
          How are you feeling today?
        </h1>
        <p className="text-sm sm:text-base text-[#4a6358] font-normal leading-relaxed">
          Speak with your personal guide <strong>{companionName}</strong>. Take your time. This is a safe and private space.
        </p>
      </div>

      {/* Status Bar / Settings Row */}
      <div className="mt-7 max-w-3xl mx-auto bg-white/95 backdrop-blur-md border border-[#dce5df] rounded-2xl p-2 shadow-xs grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#edf2ee] gap-1 sm:gap-0">
        {/* Tone Selector */}
        <div className="relative">
          <button
            onClick={() => setShowToneDropdown(!showToneDropdown)}
            className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[#f5f8f6] rounded-xl transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#ecf4f1] border border-[#cfdfd7] flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-[#2f5e4e]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#1e342b] flex items-center justify-between">
                <span>Tone: {currentTone}</span>
                <span className="text-[10px] text-[#738b80]">▾</span>
              </div>
              <p className="text-[11px] text-[#557165] truncate">
                {tones.find((t) => t.name === currentTone)?.desc}
              </p>
            </div>
          </button>

          {showToneDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-white border border-[#d6e2db] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
              <div className="text-[11px] font-semibold text-[#668275] px-3 py-1 uppercase tracking-wider">
                Sanctuary Audio Tone
              </div>
              {tones.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    onSelectTone(t.name);
                    setShowToneDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    currentTone === t.name ? 'bg-[#ebf4ef] text-[#18392d] font-semibold' : 'hover:bg-[#f6f9f7] text-[#334c41]'
                  }`}
                >
                  <div>
                    <span className="block font-medium">{t.name}</span>
                    <span className="text-[11px] text-[#5c776b]">{t.desc}</span>
                  </div>
                  {currentTone === t.name && <Check className="w-3.5 h-3.5 text-[#2f5e4e] shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Breathing Guide Active */}
        <button
          onClick={onToggleBreathingGuide}
          className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[#f5f8f6] rounded-xl transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#ecf4f1] border border-[#cfdfd7] flex items-center justify-center shrink-0">
            <Wind className={`w-4 h-4 ${breathingGuideActive ? 'text-[#2f5e4e]' : 'text-[#879d92]'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-[#1e342b] flex items-center gap-1.5">
              <span>Breathing Guide</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${breathingGuideActive ? 'bg-[#dbeef4] text-[#1c4c59]' : 'bg-[#eef2f0] text-[#698276]'}`}>
                {breathingGuideActive ? 'Active' : 'Muted'}
              </span>
            </div>
            <p className="text-[11px] text-[#557165] truncate">
              {breathingGuideActive ? 'Paced visual cues on' : 'Click to activate cues'}
            </p>
          </div>
        </button>

        {/* Sigh Reset */}
        <button
          onClick={onTriggerSighReset}
          className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[#f5f8f6] rounded-xl transition-colors group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#f4eee6] border border-[#ded2c3] flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform">
            <RotateCcw className="w-4 h-4 text-[#755938]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-[#1e342b]">Sigh Reset</div>
            <p className="text-[11px] text-[#755938] font-medium">Tap when needed</p>
          </div>
        </button>
      </div>

      {/* Main Interactive Circle & Quotes with Enhanced Motion */}
      <div className="mt-10 sm:mt-14 flex items-center justify-center relative">
        {/* Left Serene Quote */}
        <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 max-w-[200px] text-left">
          <p className="font-serif-quote italic text-lg text-[#3d5a4d] leading-snug">
            “A calmer mind,<br />brighter tomorrows.”
          </p>
        </div>

        {/* Center Glowing Ripple Rings & Talk with Sarvam AI Guide Button */}
        <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80">
          {/* Animated concentric soft wave rings with organic breath motion */}
          <div className="absolute inset-0 rounded-full border border-[#3b6756]/25 bg-[#3b6756]/5 animate-ripple-1 scale-110 pointer-events-none" />
          <div className="absolute inset-4 rounded-full border border-[#406e6a]/25 bg-[#406e6a]/5 animate-ripple-2 scale-105 pointer-events-none" />
          <div className="absolute inset-8 rounded-full border border-[#4d6a5e]/30 bg-[#4d6a5e]/5 animate-ripple-3 pointer-events-none" />

          {/* Soft central green aura glow */}
          <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-[#30594a]/25 via-[#38655e]/20 to-[#3d5d54]/25 blur-md pointer-events-none animate-pulse-slow" />

          {/* Central Circular Interactive Button */}
          <button
            onClick={activeMode === 'sarvam' ? onOpenSarvam : onOpenTextChat}
            className="relative z-10 w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-[#21493d] to-[#15342a] text-white shadow-xl shadow-[#15342a]/35 hover:shadow-2xl hover:shadow-[#15342a]/50 hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center cursor-pointer group border-4 border-white/70 animate-float-gentle"
          >
            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              {activeMode === 'sarvam' ? (
                <span className="text-2xl">🌸</span>
              ) : (
                <MessageSquare className="w-6 h-6 text-white" />
              )}
            </div>
            <span className="font-bold text-sm sm:text-base tracking-wide leading-tight">
              {activeMode === 'sarvam' ? `Talk with ${companionName}` : 'Text Sanctuary'}
            </span>
            <span className="text-[11px] text-[#c0dad0] font-light mt-1">
              Sarvam AI Guide • Tap to start
            </span>
          </button>
        </div>

        {/* Right Serene Quote */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 max-w-[200px] text-right">
          <p className="font-serif-quote italic text-lg text-[#3d5a4d] leading-snug">
            You are safe.<br />You are not alone.
          </p>
        </div>
      </div>

      {/* Mode Switcher & Personalization Card */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="inline-flex items-center p-1 bg-white/95 border border-[#d6e0db] rounded-full shadow-xs">
          <button
            onClick={() => handlePillClick('sarvam')}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeMode === 'sarvam'
                ? 'bg-[#21493d] text-white shadow-xs'
                : 'text-[#21493d] bg-[#ebf4ef] hover:bg-[#deede6]'
            }`}
          >
            <span>🌸</span>
            <span>Talk with {companionName}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
              activeMode === 'sarvam' ? 'bg-[#3b6656] text-white' : 'bg-[#d2e7dd] text-[#1c4538]'
            }`}>
              Sarvam AI
            </span>
          </button>

          <button
            onClick={() => handlePillClick('chat')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeMode === 'chat'
                ? 'bg-[#21493d] text-white shadow-xs'
                : 'text-[#476156] hover:text-[#1c2e27]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Text Chat</span>
          </button>
        </div>

        {/* Companion Profile Strip with 1-click rename and voice model choice */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={onOpenSarvam}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#edf5f1] hover:bg-[#e2ede7] border border-[#c8ddd1] text-xs text-[#20473a] font-medium transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            <span className="text-base">🌸</span>
            <span>
              Your Sanctuary Guide: <strong>{companionName}</strong> ({currentVoiceDesc})
            </span>
            <span className="text-[#2b5848] font-bold group-hover:translate-x-0.5 transition-transform">
              Begin →
            </span>
          </button>

          {onOpenNamingModal && (
            <button
              onClick={onOpenNamingModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#f2f7f4] border border-[#d3ded7] text-xs text-[#294c3d] font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              title="Change companion name or choose another Sarvam voice model"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#3b6e5b]" />
              <span>Change Voice / Name</span>
            </button>
          )}
        </div>

        {/* Quick Ambient Soundscape Selector Strip */}
        <div className="mt-3 w-full max-w-xl bg-white/80 backdrop-blur-xs border border-[#dbe6df] rounded-2xl p-2.5 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5 px-1.5">
            <span className="text-[11px] font-bold text-[#446658] uppercase tracking-wider flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-[#3b6e5b]" />
              <span>Quick Soundscape</span>
            </span>
            {onOpenAmbientPanel && (
              <button
                onClick={onOpenAmbientPanel}
                className="text-[11px] text-[#2d5c4b] font-semibold hover:underline cursor-pointer"
              >
                Volume & All Sounds →
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_SOUNDSCAPES.map((qs) => {
              const isPlaying = ambientSound === qs.id;
              return (
                <button
                  key={qs.id}
                  onClick={() => handleQuickSoundClick(qs.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isPlaying
                      ? 'bg-[#21493d] text-white shadow-xs font-semibold'
                      : 'bg-[#f3f7f5] hover:bg-[#e7f0eb] text-[#334f43] border border-[#d6e2db]'
                  }`}
                >
                  <span>{qs.icon}</span>
                  <span>{qs.label}</span>
                  {isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-[#86cca8] animate-ping ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

