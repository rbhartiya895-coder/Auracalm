import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Waves, Volume2, Sparkles, Activity } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface VagalHumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VagalHumModal: React.FC<VagalHumModalProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hum'>('Inhale');
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [completedHums, setCompletedHums] = useState(0);

  const stopHumRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stopHumRef.current) {
        stopHumRef.current();
        stopHumRef.current = null;
      }
      setPhase('Inhale');
      setPhaseSeconds(4);
      return;
    }

    timerRef.current = setInterval(() => {
      setPhaseSeconds((prev) => {
        if (prev <= 1) {
          if (phase === 'Inhale') {
            setPhase('Hum');
            // Start audio hum tone
            stopHumRef.current = soundService.startVagalHum(130);
            return 8; // 8 seconds of deep humming exhale
          } else {
            // End hum phase
            if (stopHumRef.current) {
              stopHumRef.current();
              stopHumRef.current = null;
            }
            setCompletedHums((c) => c + 1);
            setPhase('Inhale');
            return 4; // 4 seconds inhale
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stopHumRef.current) {
        stopHumRef.current();
        stopHumRef.current = null;
      }
    };
  }, [isActive, phase]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
              <Waves className="w-4 h-4 text-purple-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Vagal Hum Resonance</h2>
              <p className="text-xs text-slate-500">Cranial Nerve X activation via vocal cord vibration</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsActive(false);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
          {/* Neurobiology Card */}
          <div className="bg-purple-50/70 border border-purple-100/80 rounded-2xl p-3.5 text-xs text-slate-700 text-left flex items-start gap-3">
            <span className="text-xl">🧬</span>
            <div>
              <strong className="text-purple-900 block font-semibold mb-0.5">The Clinical Science:</strong>
              The vagus nerve passes right through your vocal cords and larynx. Humming a low continuous "Mmmmm" on your exhale creates direct acoustic vibration against the vagal sheath, increasing parasympathetic brake and heart-rate variability (HRV).
            </div>
          </div>

          {/* Interactive Humming Resonator Visualizer */}
          <div className="py-6 flex flex-col items-center justify-center relative">
            <div className="relative flex items-center justify-center w-56 h-56">
              {/* Outer vibrational rings */}
              {isActive && phase === 'Hum' && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-ping opacity-30" />
                  <div className="absolute -inset-4 rounded-full border border-purple-300/30 animate-pulse" />
                </>
              )}

              {/* Central Pulsating Orb */}
              <div
                className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-xl ${
                  !isActive
                    ? 'bg-purple-50 border-2 border-purple-200 text-purple-800'
                    : phase === 'Inhale'
                    ? 'bg-purple-100 border-4 border-purple-300 scale-110 text-purple-900'
                    : 'bg-gradient-to-tr from-purple-700 to-indigo-600 text-white scale-95 shadow-purple-500/30'
                }`}
              >
                <Waves className={`w-8 h-8 mb-1 ${isActive && phase === 'Hum' ? 'animate-bounce' : ''}`} />
                <span className="text-base font-bold tracking-tight">
                  {!isActive ? 'Ready' : phase === 'Inhale' ? 'Inhale Gently' : 'HUM: Mmmmm...'}
                </span>
                <span className="text-2xl font-black font-mono mt-1">
                  {!isActive ? '130 Hz' : `${phaseSeconds}s`}
                </span>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-purple-900">
                {!isActive
                  ? 'Tap Start to begin guided vocal toning'
                  : phase === 'Inhale'
                  ? 'Breathe in softly through your nose (4 seconds)...'
                  : 'Exhale with lips closed, creating a low steady vibration in your throat'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Completed cycles: <strong className="text-purple-700">{completedHums}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-xs text-slate-500">
            Target tone: ~130 Hz low baritone
          </span>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                : 'bg-purple-700 hover:bg-purple-800 text-white'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Vagal Hum</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
