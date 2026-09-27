import React, { useState } from 'react';
import { X, Sparkles, Heart, Check, Volume2, UserCheck, ShieldCheck } from 'lucide-react';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface NamingCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNameSaved: (name: string, voice: string) => void;
  initialName?: string;
  initialVoice?: string;
}

const PRESET_NAMES = [
  { name: 'Meera', tag: 'Serene & Warm', desc: 'Compassionate presence, grounding and mindful' },
  { name: 'Aura', tag: 'Radiant Sanctuary', desc: 'Gentle warmth and protective tranquil light' },
  { name: 'Tara', tag: 'Guiding Star', desc: 'Steady anchor to find your breath in anxious moments' },
  { name: 'Ananya', tag: 'Peaceful Harmony', desc: 'Soft and patient companion for emotional balance' },
  { name: 'Shanti', tag: 'Inner Stillness', desc: 'Deep calm, soothing away worries and physical tension' },
  { name: 'Priya', tag: 'Beloved Friend', desc: 'Caring, empathetic listener who never judges' }
];

const SARVAM_VOICES = [
  { id: 'kavya', label: 'Kavya', desc: 'Warm & Grounded (Recommended for anxiety)', tone: 'Grounding' },
  { id: 'simran', label: 'Simran', desc: 'Soft & Meditative (Great for sleep & unwinding)', tone: 'Gentle' },
  { id: 'pooja', label: 'Pooja', desc: 'Clear & Centered (Deep somatic breathing)', tone: 'Centered' },
  { id: 'ritu', label: 'Ritu', desc: 'Reassuring & Steady (Crisis stabilization)', tone: 'Steady' },
  { id: 'priya', label: 'Priya', desc: 'Melodious & Comforting (Daily check-ins)', tone: 'Warm' },
  { id: 'shreya', label: 'Shreya', desc: 'Delicate & Serene (Whisper bedtime solace)', tone: 'Whisper' }
];

export const NamingCompanionModal: React.FC<NamingCompanionModalProps> = ({
  isOpen,
  onClose,
  onNameSaved,
  initialName,
  initialVoice
}) => {
  const [selectedName, setSelectedName] = useState<string>(initialName || storageService.getCompanionName() || 'Meera');
  const [customInput, setCustomInput] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>(initialVoice || storageService.getCompanionVoice() || 'kavya');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [auditioningVoice, setAuditioningVoice] = useState<string | null>(null);
  const [auditionError, setAuditionError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDisplayName = isCustomMode && customInput.trim() ? customInput.trim() : selectedName;

  const handleSelectPreset = (name: string) => {
    setSelectedName(name);
    setIsCustomMode(false);
    setCustomInput('');
  };

  const handleAuditionVoice = async (voiceId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (auditioningVoice === voiceId) {
      soundService.stopSpeaking();
      setAuditioningVoice(null);
      return;
    }

    setAuditioningVoice(voiceId);
    setAuditionError(null);

    const res = await soundService.previewSarvamVoice(voiceId, currentDisplayName);
    if (!res.success && res.error) {
      setAuditionError(res.error);
    }
    setAuditioningVoice(null);
  };

  const handleSave = () => {
    soundService.stopSpeaking();
    const finalName = currentDisplayName.trim() || 'Meera';
    storageService.setCompanionName(finalName);
    storageService.setCompanionVoice(selectedVoice);
    soundService.playSingingBowl(216, 2.5);
    onNameSaved(finalName, selectedVoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-[#0e1715]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#1b2b25] to-[#121c18] border border-[#3b554b] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-[#e4eae6]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2d4239] bg-[#16241f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#263e34] border border-[#3c594c] flex items-center justify-center text-base shadow-xs">
              🌸
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f0f4f1] tracking-tight">Name Your Sanctuary Guide</h2>
              <p className="text-[11px] text-[#9eb2a8]">Personalize your Sarvam AI voice companion</p>
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
          {/* Why Name Guide Card */}
          <div className="p-3.5 bg-[#172520] border border-[#2b3e34] rounded-2xl flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-[#21382e] border border-[#345244] flex items-center justify-center shrink-0 mt-0.5">
              <Heart className="w-3.5 h-3.5 text-[#e09898]" />
            </div>
            <p className="text-xs text-[#a9bdaf] leading-relaxed">
              Naming your guide creates an emotional anchor. When you open your sanctuary in anxious or lonely moments, having a recognized, trusted companion helps your nervous system feel safe right away.
            </p>
          </div>

          {/* Preset Name Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9db2a7] mb-2.5">
              Choose a Serene Name
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_NAMES.map((item) => {
                const isSelected = !isCustomMode && selectedName.toLowerCase() === item.name.toLowerCase();
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSelectPreset(item.name)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#294a3d] border-[#4b7a65] text-[#f2f7f4] shadow-md shadow-[#1b3429]/40 scale-[1.02]'
                        : 'bg-[#182620] border-[#293d33] text-[#b8c9c1] hover:bg-[#1f312a] hover:border-[#385446]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{item.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#86cca8]" />}
                    </div>
                    <span className="text-[10px] text-[#869b91] block mt-0.5">{item.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Name Option */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9db2a7]">
                Or Type a Custom Name
              </label>
              {isCustomMode && (
                <span className="text-[10px] text-[#86cca8] font-medium">Using custom name</span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                maxLength={20}
                placeholder="e.g. Maya, Sara, Noor, Aria..."
                value={customInput}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  setIsCustomMode(true);
                }}
                onFocus={() => setIsCustomMode(true)}
                className={`w-full bg-[#16231e] border rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#e4eae6] placeholder:text-[#677b72] focus:outline-none transition-all ${
                  isCustomMode && customInput.trim()
                    ? 'border-[#4b7a65] ring-2 ring-[#4b7a65]/40'
                    : 'border-[#2d4237]'
                }`}
              />
            </div>
          </div>

          {/* Voice Model Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9db2a7]">
                Sarvam Neural Voice Model
              </label>
              <span className="text-[10px] text-[#86cca8]">
                Tap ▶ to preview each voice
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SARVAM_VOICES.map((v) => {
                const isSelected = selectedVoice === v.id;
                const isAuditioning = auditioningVoice === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#294a3d] border-[#4b7a65] text-[#f2f7f4] shadow-xs'
                        : 'bg-[#182620] border-[#293d33] text-[#b8c9c1] hover:bg-[#1f312a]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                          <span>{v.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#86cca8]" />}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#1f362c] text-[#86cca8] font-normal">
                          {v.tone}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#83978d] block mt-1 leading-snug">
                        {v.desc}
                      </span>
                    </div>

                    {/* Audition Voice Button */}
                    <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => handleAuditionVoice(v.id, e)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          isAuditioning
                            ? 'bg-[#86cca8] text-[#12281e] animate-pulse font-bold'
                            : 'bg-[#233b30] hover:bg-[#2c4b3d] text-[#c1ddd0]'
                        }`}
                        title={`Listen to sample in ${v.label}'s voice`}
                      >
                        {isAuditioning ? (
                          <>
                            <span className="inline-block w-2 h-2 rounded-full bg-[#12281e] animate-ping" />
                            <span>Speaking...</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen Preview</span>
                          </>
                        )}
                      </button>
                      {isSelected && (
                        <span className="text-[9px] text-[#86cca8] font-medium">Selected</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {auditionError && (
              <p className="text-[11px] text-[#e09898] mt-1.5">
                Note: {auditionError}
              </p>
            )}
          </div>

          {/* Live Preview Box */}
          <div className="p-3.5 bg-[#15221c] border border-[#2a3c33] rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-[#20362c] border border-[#385848] flex items-center justify-center shrink-0 text-lg">
                🌸
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-[#86cca8] block">
                  {currentDisplayName} • Voice: {SARVAM_VOICES.find(v => v.id === selectedVoice)?.label || 'Kavya'}
                </span>
                <p className="text-xs text-[#cad5cf] italic truncate">
                  “Namaste! I am {currentDisplayName}. Breathe with me, you are safe here.”
                </p>
              </div>
            </div>

            {/* Test Selected Voice Button */}
            <button
              type="button"
              onClick={() => handleAuditionVoice(selectedVoice)}
              className="px-3 py-1.5 bg-[#254537] hover:bg-[#315746] text-[#e5f4ec] rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 cursor-pointer border border-[#3b6b55] transition-colors"
            >
              {auditioningVoice === selectedVoice ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#86cca8] animate-ping" />
                  <span>Speaking</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#86cca8]" />
                  <span>Test Voice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-[#14201b] border-t border-[#2d4239] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#9ab0a5] hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#254d3e] hover:bg-[#2d5c4b] active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#163327]/50 flex items-center gap-2 cursor-pointer transition-all border border-[#3d6e59]"
          >
            <Sparkles className="w-4 h-4 text-[#d9c79f]" />
            <span>Save & Begin with {currentDisplayName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
