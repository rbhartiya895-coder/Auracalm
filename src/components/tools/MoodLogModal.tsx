import React, { useState } from 'react';
import { X, Heart, Smile, Meh, Frown, Sparkles, Check } from 'lucide-react';
import { MoodEntry } from '../../types';
import { storageService } from '../../services/storageService';
import confetti from 'canvas-confetti';

interface MoodLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogged: (entry: MoodEntry) => void;
}

export const MoodLogModal: React.FC<MoodLogModalProps> = ({ isOpen, onClose, onLogged }) => {
  const [selectedMood, setSelectedMood] = useState<MoodEntry['primaryFeeling']>('Calm');
  const [intensity, setIntensity] = useState<number>(6);
  const [selectedSensations, setSelectedSensations] = useState<string[]>(['Relaxed jaw']);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const feelings: { label: MoodEntry['primaryFeeling']; emoji: string; color: string }[] = [
    { label: 'Calm', emoji: '🌿', color: 'border-emerald-400 bg-emerald-50 text-emerald-900' },
    { label: 'Grateful', emoji: '✨', color: 'border-teal-400 bg-teal-50 text-teal-900' },
    { label: 'Hopeful', emoji: '🌅', color: 'border-cyan-400 bg-cyan-50 text-cyan-900' },
    { label: 'Anxious', emoji: '⚡', color: 'border-amber-400 bg-amber-50 text-amber-900' },
    { label: 'Overwhelmed', emoji: '🌊', color: 'border-rose-400 bg-rose-50 text-rose-900' },
    { label: 'Restless', emoji: '🌀', color: 'border-orange-400 bg-orange-50 text-orange-900' },
    { label: 'Sad', emoji: '🌧️', color: 'border-blue-400 bg-blue-50 text-blue-900' },
    { label: 'Exhausted', emoji: '🌙', color: 'border-purple-400 bg-purple-50 text-purple-900' }
  ];

  const sensations = [
    'Chest tightness',
    'Shallow breath',
    'Jaw clenching',
    'Relaxed jaw',
    'Warm heart',
    'Shoulder tension',
    'Stomach flutter',
    'Restless legs',
    'Mental fog',
    'Clear mind'
  ];

  const toggleSensation = (item: string) => {
    if (selectedSensations.includes(item)) {
      setSelectedSensations(selectedSensations.filter((s) => s !== item));
    } else {
      setSelectedSensations([...selectedSensations, item]);
    }
  };

  const handleSave = () => {
    const entry = storageService.addMoodEntry({
      moodRating: intensity,
      primaryFeeling: selectedMood,
      physicalSensations: selectedSensations,
      notes: notes.trim()
    });

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    onLogged(entry);
    onClose();
  };

  const getIntensityLabel = (val: number) => {
    if (val <= 2) return 'Very Low / Subdued';
    if (val <= 4) return 'Mild Presence';
    if (val <= 6) return 'Moderate Equilibrium';
    if (val <= 8) return 'Strong & Vibrant';
    return 'Peak Intensity';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Daily Mood & Sensation Log</h2>
              <p className="text-xs text-slate-500">Track emotional trends and somatic bodily awareness</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Primary feeling picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              1. What is your primary feeling right now?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {feelings.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setSelectedMood(f.label)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all ${
                    selectedMood === f.label
                      ? `${f.color} ring-2 ring-emerald-500/50 scale-102 shadow-xs font-bold`
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xl mb-1">{f.emoji}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Sensation / Mood Level: <span className="text-emerald-700">{intensity}/10</span>
              </label>
              <span className="text-xs font-medium text-slate-500">
                {getIntensityLabel(intensity)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0d6954]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>1 (Faint)</span>
              <span>5 (Balanced)</span>
              <span>10 (Overwhelming)</span>
            </div>
          </div>

          {/* Physical Somatic Sensations */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Where do you feel it in your body? (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sensations.map((item) => {
                const active = selectedSensations.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleSensation(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      active
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1" />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              4. Reflection or trigger notes (Private)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Taking a pause before my presentation, feeling grounding in my breath..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-800 placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <p className="text-[11px] text-slate-400">
            🔒 Saved locally on your device only
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0d6954] hover:bg-[#09473a] rounded-xl shadow-xs transition-colors"
            >
              Save Mood Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
