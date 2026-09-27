import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, X, Sliders, Sparkles } from 'lucide-react';
import { soundService, AmbientSoundType } from '../services/soundService';
import { storageService } from '../services/storageService';

interface AmbientSoundPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSound: AmbientSoundType | null;
  onSelectSound: (type: AmbientSoundType | null) => void;
}

interface SoundscapeItem {
  id: AmbientSoundType;
  title: string;
  icon: string;
  tag: string;
  desc: string;
}

const SOUNDSCAPES: SoundscapeItem[] = [
  {
    id: 'flute',
    title: 'Bamboo Flute',
    icon: '🪈',
    tag: 'Indian Bansuri',
    desc: 'Deep meditative raga tones with breathy resonance and tanpura drone'
  },
  {
    id: 'birds',
    title: 'Dawn Birds',
    icon: '🐦',
    tag: 'Morning Chorus',
    desc: 'Sweet randomized songbird whistles, chirps, and light meadow breeze'
  },
  {
    id: 'insects',
    title: 'Night Crickets',
    icon: '🦗',
    tag: 'Twilight Forest',
    desc: 'Gentle nocturnal cricket trills and soft soothing evening air'
  },
  {
    id: 'ocean',
    title: 'Ocean Waves',
    icon: '🌊',
    tag: 'Coastal Tide',
    desc: 'Rhythmic, deep ocean wave swells easing autonomic tension'
  },
  {
    id: 'rain',
    title: 'Gentle Rain',
    icon: '🌧️',
    tag: 'Warm Downpour',
    desc: 'Continuous soft rain shower for blocking out distractions'
  },
  {
    id: 'bowl_drone',
    title: 'Singing Bowl',
    icon: '🧘',
    tag: 'Tibetan Resonator',
    desc: 'Harmonic 288Hz & 576Hz continuous bowl overtone drone'
  },
  {
    id: 'theta',
    title: '432Hz Theta',
    icon: '🌀',
    tag: '4Hz Binaural Beat',
    desc: 'Deep brainwave entrainment for sleep induction and letting go'
  },
  {
    id: 'forest',
    title: 'Pine Forest',
    icon: '🌲',
    tag: 'Mountain Wind',
    desc: 'Subtle pine needle rustling and gentle mountain breeze'
  }
];

export const AmbientSoundPanel: React.FC<AmbientSoundPanelProps> = ({
  isOpen,
  onClose,
  currentSound,
  onSelectSound
}) => {
  const [volume, setVolume] = useState<number>(() => storageService.getAmbientVolume());

  useEffect(() => {
    soundService.setAmbientVolume(volume);
  }, [volume]);

  if (!isOpen) return null;

  const handleSoundClick = (type: AmbientSoundType) => {
    if (currentSound === type) {
      // Toggle off
      soundService.stopAmbient();
      onSelectSound(null);
    } else {
      // Switch sound
      soundService.startAmbient(type);
      onSelectSound(type);
    }
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    soundService.setAmbientVolume(newVal);
    storageService.setAmbientVolume(newVal);
  };

  const handleStopAll = () => {
    soundService.stopAmbient();
    onSelectSound(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0e1715]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#1b2b25] to-[#121c18] border border-[#3b554b] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-[#e4eae6]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2d4239] bg-[#16241f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#263e34] border border-[#3c594c] flex items-center justify-center text-[#86cca8] shadow-xs">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f0f4f1] tracking-tight">Ambient Soundscapes</h2>
              <p className="text-[11px] text-[#9eb2a8]">Synthesized peaceful background ambiance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#889d93] hover:text-white hover:bg-[#263a31] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Volume Control Card */}
          <div className="p-4 bg-[#16241e] border border-[#2c4035] rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#f0f4f1] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#86cca8]" />
                <span>Background Soundscape Volume</span>
              </span>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-[#21372c] text-[#86cca8]">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#22362c] rounded-lg appearance-none cursor-pointer accent-[#58a883]"
            />

            {/* Volume Quick Presets */}
            <div className="flex items-center justify-between text-[11px] text-[#8aa396] pt-1">
              <button
                type="button"
                onClick={() => handleVolumeChange(0.0)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Mute
              </button>
              <button
                type="button"
                onClick={() => handleVolumeChange(0.20)}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  volume >= 0.18 && volume <= 0.22 ? 'bg-[#294c3c] text-white font-bold' : 'hover:text-white'
                }`}
              >
                Whisper (20%)
              </button>
              <button
                type="button"
                onClick={() => handleVolumeChange(0.35)}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  volume >= 0.33 && volume <= 0.37 ? 'bg-[#294c3c] text-white font-bold' : 'hover:text-white'
                }`}
              >
                Gentle (35%)
              </button>
              <button
                type="button"
                onClick={() => handleVolumeChange(0.60)}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  volume >= 0.58 && volume <= 0.62 ? 'bg-[#294c3c] text-white font-bold' : 'hover:text-white'
                }`}
              >
                Deep (60%)
              </button>
            </div>
          </div>

          {/* Soundscapes Grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9db2a7]">
                Choose Soundscape
              </label>
              {currentSound && (
                <button
                  type="button"
                  onClick={handleStopAll}
                  className="text-[11px] text-[#e09898] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <VolumeX className="w-3 h-3" />
                  <span>Turn Off</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SOUNDSCAPES.map((item) => {
                const isActive = currentSound === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSoundClick(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isActive
                        ? 'bg-[#27483a] border-[#4f856d] text-white shadow-md shadow-[#193226]/50 scale-[1.01]'
                        : 'bg-[#182620] border-[#293d33] text-[#b8c9c1] hover:bg-[#1f312a] hover:border-[#385446]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#21382e] border border-[#345244] flex items-center justify-center text-lg shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{item.title}</span>
                        {isActive ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#1b3b2d] text-[#86cca8] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#86cca8] animate-ping" />
                            Playing
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#1f362c] text-[#7d998d]">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#8aa396] leading-snug mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#14201b] border-t border-[#2d4239] flex items-center justify-between">
          <span className="text-xs text-[#82998d]">
            {currentSound ? `Now playing: ${currentSound}` : 'Soundscapes are currently off'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#254d3e] hover:bg-[#2e5e4c] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border border-[#3d6e59]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
