import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';
import { BreathingPreset } from '../../types';
import { BREATHING_PRESETS } from '../../data/sessionsData';
import { soundService } from '../../services/soundService';

interface BreathingSphereModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCyclesAdded: (cycles: number) => void;
}

export const BreathingSphereModal: React.FC<BreathingSphereModalProps> = ({
  isOpen,
  onClose,
  onCyclesAdded
}) => {
  const [selectedPreset, setSelectedPreset] = useState<BreathingPreset>(BREATHING_PRESETS[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'HoldPost'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('Inhale');
      setSecondsLeft(Math.round(selectedPreset.inhale));
      return;
    }

    if (soundEnabled && phase === 'Inhale') {
      soundService.playInhaleChime();
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (phase === 'Inhale') {
            if (selectedPreset.hold1 > 0) {
              setPhase('Hold');
              return Math.round(selectedPreset.hold1);
            } else {
              setPhase('Exhale');
              if (soundEnabled) soundService.playExhaleChime();
              return Math.round(selectedPreset.exhale);
            }
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            if (soundEnabled) soundService.playExhaleChime();
            return Math.round(selectedPreset.exhale);
          } else if (phase === 'Exhale') {
            if (selectedPreset.hold2 > 0) {
              setPhase('HoldPost');
              return Math.round(selectedPreset.hold2);
            } else {
              setPhase('Inhale');
              setCycles((c) => c + 1);
              setTimeout(() => onCyclesAdded(1), 0);
              if (soundEnabled) soundService.playInhaleChime();
              return Math.round(selectedPreset.inhale);
            }
          } else {
            setPhase('Inhale');
            setCycles((c) => c + 1);
            setTimeout(() => onCyclesAdded(1), 0);
            if (soundEnabled) soundService.playInhaleChime();
            return Math.round(selectedPreset.inhale);
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, selectedPreset, soundEnabled, onCyclesAdded]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-900/40 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-emerald-300">Sanctuary Breath Pacer</h2>
            <p className="text-xs text-slate-400">Autonomic regulation & HRV coherence</p>
          </div>
          <button
            onClick={() => {
              setIsActive(false);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="p-4 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/40">
          {BREATHING_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPreset(p);
                setIsActive(false);
                setPhase('Inhale');
                setSecondsLeft(Math.round(p.inhale));
              }}
              className={`p-2 rounded-xl text-left border transition-all ${
                selectedPreset.id === p.id
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                  : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[11px] font-semibold truncate">{p.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                {p.inhale}s - {p.hold1}s - {p.exhale}s
              </div>
            </button>
          ))}
        </div>

        {/* Immersive Central Visualizer */}
        <div className="py-12 flex flex-col items-center justify-center relative min-h-[300px]">
          {/* Subtle concentric rings */}
          <div className="w-72 h-72 rounded-full border border-emerald-500/20 absolute pointer-events-none" />
          <div className="w-96 h-96 rounded-full border border-teal-500/10 absolute pointer-events-none" />

          {/* Central Breathing Orb */}
          <div
            className={`rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl relative ${
              phase === 'Inhale'
                ? 'w-60 h-60 bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 scale-110 shadow-emerald-500/30'
                : phase === 'Hold' || phase === 'HoldPost'
                ? 'w-60 h-60 bg-gradient-to-tr from-cyan-500 to-teal-300 text-slate-950 scale-110 shadow-cyan-500/30'
                : 'w-40 h-40 bg-gradient-to-tr from-emerald-900 to-teal-950 text-white scale-90 shadow-emerald-900/50 border border-emerald-700/50'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">
              {isActive ? phase : 'Ready'}
            </span>
            <span className="text-4xl font-extrabold font-mono my-1">
              {isActive ? `${secondsLeft}s` : `${Math.round(selectedPreset.inhale)}s`}
            </span>
            <span className="text-[11px] font-medium text-center px-4 opacity-75">
              {!isActive
                ? 'Tap Play Below'
                : phase === 'Inhale'
                ? 'Expand lungs gently'
                : phase === 'Hold'
                ? 'Hold air effortlessly'
                : 'Release tension fully'}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
            <span>
              Cycles Completed: <strong className="text-emerald-400">{cycles}</strong>
            </span>
            <span>•</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Chime on' : 'Chime off'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <p className="text-xs text-slate-500 truncate max-w-xs">
            {selectedPreset.benefit}
          </p>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Breath</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Breathing</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
