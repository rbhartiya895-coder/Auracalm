import React, { useState } from 'react';
import { X, Volume2, Settings, ShieldCheck, Trash2, Check, UserCheck, Edit3 } from 'lucide-react';
import { ToneSetting } from '../types';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';
import { getCountryCrisisData } from '../data/crisisHotlines';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tone: ToneSetting;
  onToneChange: (t: ToneSetting) => void;
  onResetData: () => void;
  companionName?: string;
  onOpenNamingModal?: () => void;
  userCountry?: string;
  onOpenCrisis?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  tone,
  onToneChange,
  onResetData,
  companionName = 'Meera',
  onOpenNamingModal,
  userCountry = 'in',
  onOpenCrisis
}) => {
  const [volume, setVolume] = useState(() => storageService.getAmbientVolume());
  const companionVoice = storageService.getCompanionVoice() || 'kavya';
  const countryCrisis = getCountryCrisisData(userCountry);

  if (!isOpen) return null;

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundService.setAmbientVolume(newVol);
    storageService.setAmbientVolume(newVol);
  };

  const handleTestChime = () => {
    soundService.playSingingBowl(216, 2.5);
  };

  const handleTestCompanionVoice = () => {
    soundService.previewSarvamVoice(companionVoice, companionName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Sanctuary Settings</h2>
              <p className="text-xs text-slate-500">Audio synthesis & companion preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700 overflow-y-auto max-h-[75vh]">
          {/* Companion & Voice Model Customization */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-base">
                🌸
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">
                  Companion: {companionName}
                </span>
                <span className="text-[11px] text-emerald-700">
                  Voice Model: <strong className="capitalize">{companionVoice}</strong> (Sarvam AI)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleTestCompanionVoice}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                title="Hear sample speech"
              >
                Test Voice
              </button>
              {onOpenNamingModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenNamingModal();
                  }}
                  className="px-2.5 py-1.5 bg-[#0d6954] hover:bg-[#09473a] text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Change</span>
                </button>
              )}
            </div>
          </div>

          {/* Audio Master Volume */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-900">Background Soundscape Volume</span>
              <span className="font-mono text-slate-500">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0d6954]"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Controls the volume of ocean, rain, bansuri flute, birds, and night insects.
            </p>
          </div>

          {/* Test Chime */}
          <div className="flex items-center justify-between pt-1">
            <span>Tibetan Singing Bowl Bell Test</span>
            <button
              onClick={handleTestChime}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              Ring Chime 🔔
            </button>
          </div>

          {/* Tone Baseline */}
          <div>
            <span className="font-bold text-slate-900 block mb-2">Sanctuary Tone Baseline</span>
            <div className="grid grid-cols-2 gap-2">
              {(['Calm', 'Compassionate', 'Grounded', 'Whisper'] as ToneSetting[]).map((t) => (
                <button
                  key={t}
                  onClick={() => onToneChange(t)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    tone === t
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Helpline Region / Country */}
          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-base shrink-0">
                {countryCrisis.flag}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-rose-950 block truncate">
                  Helpline Country: {countryCrisis.name}
                </span>
                <span className="text-[11px] text-rose-800 truncate block">
                  {countryCrisis.primaryCrisisName} ({countryCrisis.primaryCrisisNumber})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenCrisis) onOpenCrisis();
              }}
              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
            >
              Change
            </button>
          </div>

          {/* Privacy Disclaimer */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-emerald-950 leading-relaxed">
              <strong className="block font-semibold">100% Client-Side Privacy:</strong>
              All audio waveforms, breathing timers, voice synthesis, and mood entries are generated and stored exclusively in your browser. No personal data is sent to external tracking servers.
            </div>
          </div>

          {/* Reset progress */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                if (window.confirm('Reset local progress and restore default sample data?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium text-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Local Sanctuary Data</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0d6954] hover:bg-[#09473a] rounded-xl shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
