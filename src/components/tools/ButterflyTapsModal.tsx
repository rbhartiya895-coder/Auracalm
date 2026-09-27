import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface ButterflyTapsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ButterflyTapsModal: React.FC<ButterflyTapsModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeWing, setActiveWing] = useState<'left' | 'right' | null>(null);
  const [setCount, setSetCount] = useState(0);
  const [speedMs, setSpeedMs] = useState(750); // 750ms between taps
  const [audioEnabled, setAudioEnabled] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setActiveWing(null);
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveWing((prev) => {
        const next = prev === 'left' ? 'right' : 'left';
        if (next === 'right') {
          setSetCount((c) => c + 1);
        }
        if (audioEnabled) {
          soundService.playBilateralTap(next);
        }
        return next;
      });
    }, speedMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, speedMs, audioEnabled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
              <svg className="w-4 h-4 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16" />
                <path d="M12 4c-3-2-7 0-7 4 0 3 4 5 7 5" />
                <path d="M12 4c3-2 7 0 7 4 0 3-4 5-7 5" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Butterfly Taps (EMDR Bilateral)</h2>
              <p className="text-xs text-slate-500">Somatic stimulation to downregulate amygdala distress</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsRunning(false);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
          {/* Posture instructions */}
          <div className="bg-rose-50/70 border border-rose-100/80 rounded-2xl p-3.5 text-xs text-slate-700 leading-relaxed text-left flex items-start gap-3">
            <span className="text-lg">🦋</span>
            <div>
              <strong className="text-rose-900 block font-semibold mb-0.5">The Butterfly Hug Posture:</strong>
              Cross your arms over your chest, resting your hands near your collarbones. Tap your fingers alternately left, then right, mimicking the wings of a butterfly.
            </div>
          </div>

          {/* Interactive visualizer: Animated Butterfly Wings */}
          <div className="py-4 flex flex-col items-center justify-center relative">
            <div className="w-64 h-48 relative flex items-center justify-center">
              {/* Left Wing */}
              <div
                className={`w-28 h-40 rounded-[60px_10px_60px_60px] border-3 transition-all duration-200 transform origin-right flex items-center justify-center ${
                  activeWing === 'left'
                    ? 'bg-rose-500 border-rose-600 text-white scale-105 shadow-xl -rotate-6'
                    : 'bg-rose-100/70 border-rose-200 text-rose-800 rotate-0'
                }`}
              >
                <div className="text-center font-bold text-xs">
                  <span className="block text-xl">👈</span>
                  <span>LEFT</span>
                  {activeWing === 'left' && <span className="block text-[10px] uppercase tracking-wider font-mono">TAP</span>}
                </div>
              </div>

              {/* Center Body */}
              <div className="w-4 h-32 bg-slate-700 rounded-full z-10 mx-1 shadow-inner relative flex flex-col items-center justify-between py-2">
                <div className="w-2 h-2 rounded-full bg-rose-300" />
                <div className="w-2 h-2 rounded-full bg-rose-400" />
                <div className="w-2 h-2 rounded-full bg-rose-300" />
              </div>

              {/* Right Wing */}
              <div
                className={`w-28 h-40 rounded-[10px_60px_60px_60px] border-3 transition-all duration-200 transform origin-left flex items-center justify-center ${
                  activeWing === 'right'
                    ? 'bg-rose-500 border-rose-600 text-white scale-105 shadow-xl rotate-6'
                    : 'bg-rose-100/70 border-rose-200 text-rose-800 rotate-0'
                }`}
              >
                <div className="text-center font-bold text-xs">
                  <span className="block text-xl">👉</span>
                  <span>RIGHT</span>
                  {activeWing === 'right' && <span className="block text-[10px] uppercase tracking-wider font-mono">TAP</span>}
                </div>
              </div>
            </div>

            {/* Set Counter */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Bilateral Sets:</span>
              <span className="text-xl font-bold text-rose-700 font-mono">{setCount}</span>
            </div>
          </div>

          {/* Speed & Audio controls */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Rhythm Cadence:</span>
              <span className="text-slate-500 font-mono">
                {speedMs === 900 ? 'Gentle (Slow)' : speedMs === 750 ? 'Steady (Standard)' : 'Active (Fast)'}
              </span>
            </div>
            <div className="flex gap-2">
              {[
                { label: 'Gentle', ms: 900 },
                { label: 'Standard', ms: 750 },
                { label: 'Active', ms: 600 }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSpeedMs(item.ms)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    speedMs === item.ms
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600">Stereo Bilateral Audio:</span>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="flex items-center gap-1.5 text-xs text-rose-700 font-medium hover:underline"
              >
                {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-rose-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                <span>{audioEnabled ? 'Stereo Audio On' : 'Muted'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={() => {
              setIsRunning(false);
              setSetCount(0);
              setActiveWing(null);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
              isRunning
                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Tapping</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Butterfly Taps</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
