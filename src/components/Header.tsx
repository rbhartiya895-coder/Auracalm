import React from 'react';
import { ShieldCheck, PhoneCall, Globe, Sun, Moon, Settings, Sparkles, Activity, BookOpen, HeartPulse, Volume2, VolumeX, HelpCircle, Palette, Edit3 } from 'lucide-react';
import { TabView, Language, AppTheme } from '../types';
import { BackgroundTheme } from './SanctuaryAtmosphere';
import { getCountryCrisisData } from '../data/crisisHotlines';

interface HeaderProps {
  currentTab: TabView;
  onSelectTab: (tab: TabView) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  bgTheme: BackgroundTheme;
  onBgThemeChange: (theme: BackgroundTheme) => void;
  onOpenSettings: () => void;
  onOpenCrisis: () => void;
  onOpenSarvam: () => void;
  onOpenNamingModal: () => void;
  onOpenTour: () => void;
  onOpenAmbientPanel: () => void;
  ambientSound: string | null;
  onToggleAmbient: () => void;
  streakDays: number;
  companionName?: string;
  companionVoice?: string;
  userCountry?: string;
  onOpenCountrySelect?: () => void;
}

const VOICE_LABELS: Record<string, string> = {
  kavya: 'Kavya',
  simran: 'Simran',
  pooja: 'Pooja',
  ritu: 'Ritu',
  priya: 'Priya',
  shreya: 'Shreya'
};

const BG_THEME_OPTIONS: { id: BackgroundTheme; label: string; icon: string }[] = [
  { id: 'lotus-dawn', label: 'Lotus Dawn', icon: '🌸' },
  { id: 'himalayan-mist', label: 'Himalayan Mist', icon: '🌲' },
  { id: 'twilight-starlight', label: 'Twilight Sky', icon: '✨' },
  { id: 'zen-garden', label: 'Zen Garden', icon: '🎋' }
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  bgTheme,
  onBgThemeChange,
  onOpenSettings,
  onOpenCrisis,
  onOpenSarvam,
  onOpenNamingModal,
  onOpenTour,
  onOpenAmbientPanel,
  ambientSound,
  onToggleAmbient,
  streakDays,
  companionName = 'Meera',
  companionVoice = 'kavya',
  userCountry = 'in',
  onOpenCountrySelect
}) => {
  const voiceLabel = VOICE_LABELS[companionVoice] || 'Kavya';
  const countryCrisis = getCountryCrisisData(userCountry);

  return (
    <header className="w-full bg-[#fbfcfb]/90 backdrop-blur-md border-b border-[#e2e8e4]/80 sticky top-0 z-40 transition-colors shadow-2xs">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2.5">
        {/* Brand Logo & Clinical badge */}
        <div 
          onClick={() => onSelectTab('sanctuary')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#214c3e] to-[#3a6b5c] flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
            {/* Serene Lotus SVG with gentle floating */}
            <svg className="w-6 h-6 text-white group-hover:rotate-6 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c-1.5 3-4.5 6-4.5 9a4.5 4.5 0 0 0 9 0c0-3-3-6-4.5-9z" />
              <path d="M4.5 13.5c1.5-1 3.5-1.5 5.5-1.5 0 3-1.5 5.5-4 6.5-1-1.5-1.8-3.3-1.5-5z" />
              <path d="M19.5 13.5c-1.5-1-3.5-1.5-5.5-1.5 0 3 1.5 5.5 4 6.5 1-1.5 1.8-3.3 1.5-5z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#1c2e27] font-sans">AuraCalm</span>
              <span className="text-[10px] font-bold tracking-widest text-[#2d5648] bg-[#ebf4ef] border border-[#cde0d5] px-2 py-0.5 rounded-md uppercase">
                CLINICAL
              </span>
            </div>
            <p className="text-xs text-[#5f746b] font-medium">Crisis Audio Sanctuary</p>
          </div>
        </div>

        {/* Center Pill: Private & Anonymous */}
        <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 bg-[#f0f6f2]/80 border border-[#d2e2d8] rounded-full text-xs text-[#22483b] font-medium shadow-xs">
          <div className="w-5 h-5 rounded-full bg-[#dcece2] flex items-center justify-center text-[#275344]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#275344]" />
          </div>
          <div>
            <span className="font-semibold text-[#1e4235] block leading-tight">Private & Anonymous</span>
            <span className="text-[11px] text-[#4d7062] leading-tight">100% on-device • Zero tracking</span>
          </div>
        </div>

        {/* Right utility items */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Companion Profile & Voice Model Customizer Pill */}
          <button
            onClick={onOpenNamingModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#edf5f1] hover:bg-[#e1ede7] text-[#224b3e] border border-[#cadcd1] shadow-xs transition-all hover:scale-102 cursor-pointer group"
            title="Click to change companion name or neural voice model"
          >
            <span className="text-sm">🌸</span>
            <span>{companionName}</span>
            <span className="text-[10px] text-[#4d7667] bg-[#dbeae1] px-1.5 py-0.2 rounded-md font-medium">
              {voiceLabel}
            </span>
            <Edit3 className="w-3 h-3 text-[#4f7868] opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Intro Tour Guide Button */}
          <button
            onClick={onOpenTour}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#2d5747] hover:text-[#18392d] bg-[#f2f7f4] hover:bg-[#e6f0ea] border border-[#d3e2d8] rounded-lg transition-all cursor-pointer shadow-2xs"
            title="Open Interactive Sanctuary Guide"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3e725f]" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Ambient Soundscapes Selector Pill */}
          <button
            onClick={onOpenAmbientPanel}
            title={ambientSound ? `Ambient audio: ${ambientSound} (Click to change sound or adjust volume)` : 'Choose calming background soundscapes'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer ${
              ambientSound
                ? 'bg-[#ebf4f5] border-[#bedbdc] text-[#28555e] shadow-xs'
                : 'bg-white border-[#d8e0db] text-[#556b62] hover:bg-[#f3f7f5]'
            }`}
          >
            {ambientSound ? (
              <Volume2 className="w-3.5 h-3.5 text-[#2d636e] animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="capitalize">{ambientSound ? ambientSound.replace('_', ' ') : 'Soundscapes'}</span>
            <span className="text-[10px] text-[#789689]">▾</span>
          </button>

          {/* Background Theme Selector Dropdown */}
          <div className="relative group hidden sm:block">
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#3b5248] hover:text-[#1c2e27] bg-[#f4f7f5] hover:bg-[#eaf1ed] border border-[#d6e0da] rounded-lg transition-colors cursor-pointer"
              title="Change Sanctuary Background Atmosphere"
            >
              <Palette className="w-3.5 h-3.5 text-[#5e7c6e]" />
              <span className="text-[11px] hidden md:inline">Atmosphere</span>
              <span className="text-[10px] text-[#7d978c]">▾</span>
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#d6e0da] rounded-xl shadow-xl py-1 hidden group-hover:block z-50 animate-in fade-in duration-150">
              <div className="text-[10px] font-bold text-[#6f8a7e] px-3 py-1 uppercase tracking-wider">
                Sanctuary Background
              </div>
              {BG_THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onBgThemeChange(opt.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    bgTheme === opt.id ? 'bg-[#ebf4ef] text-[#1c4538] font-bold' : 'hover:bg-[#f3f7f5] text-[#334b40]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </span>
                  {bgTheme === opt.id && <span className="text-[10px] text-[#2c5b4b]">Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Settings icon */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-[#4e6b5e] hover:text-[#1c2e27] bg-[#f4f7f5] hover:bg-[#eaf1ed] border border-[#d6e0da] rounded-lg transition-colors cursor-pointer"
            title="Sanctuary & Voice Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Country Selector Pill */}
          <button
            onClick={onOpenCountrySelect || onOpenCrisis}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-full bg-[#f2f7f4] hover:bg-[#e4ede7] text-[#20493b] border border-[#d2e2d8] shadow-2xs transition-all cursor-pointer"
            title={`Region: ${countryCrisis.name}. Click to change country.`}
          >
            <span className="text-sm">{countryCrisis.flag}</span>
            <span className="hidden sm:inline font-bold">{countryCrisis.name}</span>
            <span className="text-[10px] text-[#527768]">▾</span>
          </button>

          {/* Call Crisis Helpline Button with Country Details */}
          <button
            onClick={onOpenCrisis}
            className="flex items-center gap-2 bg-[#1f4236] hover:bg-[#163329] text-white px-3.5 py-1.5 rounded-full font-medium shadow-xs transition-all hover:shadow-md cursor-pointer text-xs"
            title={`Emergency helpline for ${countryCrisis.name}: ${countryCrisis.primaryCrisisName} (${countryCrisis.primaryCrisisNumber})`}
          >
            <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-xs">
              <span>{countryCrisis.flag}</span>
            </div>
            <div className="text-left">
              <span className="block font-bold text-xs leading-none">{countryCrisis.callButtonText}</span>
              <span className="text-[10px] text-[#b8dacf] leading-none">{countryCrisis.shortLabel}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#e8eee9] flex items-center justify-between overflow-x-auto py-1 scrollbar-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onSelectTab('sanctuary')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentTab === 'sanctuary'
                ? 'bg-[#ebf4ef] text-[#1c4538] shadow-xs'
                : 'text-[#4c6359] hover:text-[#1a2f27] hover:bg-[#f1f6f3]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#376b5a]" />
            <span>Sanctuary</span>
          </button>

          <button
            onClick={() => onSelectTab('sessions')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentTab === 'sessions'
                ? 'bg-[#ebf4ef] text-[#1c4538] shadow-xs'
                : 'text-[#4c6359] hover:text-[#1a2f27] hover:bg-[#f1f6f3]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#3d6e67]" />
            <span>Guided Sessions</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#d7ece5] text-[#225044] rounded-full font-bold">6</span>
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentTab === 'progress'
                ? 'bg-[#ebf4ef] text-[#1c4538] shadow-xs'
                : 'text-[#4c6359] hover:text-[#1a2f27] hover:bg-[#f1f6f3]'
            }`}
          >
            <Activity className="w-4 h-4 text-[#3f6575]" />
            <span>Progress & Tracking</span>
            {streakDays > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-[#f4ebdc] text-[#73572d] rounded-full font-bold flex items-center gap-0.5">
                🔥 {streakDays}d
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('tools')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentTab === 'tools'
                ? 'bg-[#ebf4ef] text-[#1c4538] shadow-xs'
                : 'text-[#4c6359] hover:text-[#1a2f27] hover:bg-[#f1f6f3]'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-[#8a5554]" />
            <span>Somatic Calming Tools</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center text-xs text-[#577064] gap-2">
          <button
            onClick={onOpenTour}
            className="flex items-center gap-1 text-[11px] text-[#3e6a59] hover:underline cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Feature Guide</span>
          </button>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#3d7a64] animate-ping" />
            <span>Sanctuary Live</span>
          </div>
        </div>
      </div>
    </header>
  );
};

