import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Sparkles, Check, Wind } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface SighResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCycleCompleted?: () => void;
}

export const SighResetModal: React.FC<SighResetModalProps> = ({
  isOpen,
  onClose,
  onCycleCompleted
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState<'Ready' | 'Inhale1' | 'Inhale2' | 'Exhale' | 'Rest'>('Ready');
  const [timerCount, setTimerCount] = useState(3);
  const [completedCount, setCompletedCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      setStep('Ready');
      return;
    }

    const runSequence = async () => {
      // Step 1: Inhale 1 (Deep through nose) - 3s
      setStep('Inhale1');
      soundService.playChime(350, 1.5);
      setTimerCount(3);
      await delay(3000);

      // Step 2: Inhale 2 (Quick sharp top-off through nose) - 1.5s
      setStep('Inhale2');
      soundService.playChime(520, 1.0);
      setTimerCount(1);
      await delay(1500);

      // Step 3: Extended long sigh out through mouth - 6s
      setStep('Exhale');
      soundService.playExhaleChime();
      setTimerCount(6);
      await delay(6000);

      // Rest / Settle
      setStep('Rest');
      soundService.playSingingBowl(216, 3);
      setCompletedCount((c) => c + 1);
      if (onCycleCompleted) onCycleCompleted();
      await delay(2500);

      setIsRunning(false);
      setStep('Ready');
    };

    runSequence();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onCycleCompleted]);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-800">
              <RotateCcw className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Physiological Sigh Reset</h2>
              <p className="text-xs text-slate-500">Stanford Neurobiology immediate nervous system reset</p>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
          <div className="bg-teal-50/70 border border-teal-100/80 rounded-2xl p-3.5 text-xs text-slate-700 text-left flex items-start gap-3">
            <span className="text-xl">🫁</span>
            <div>
              <strong className="text-teal-900 block font-semibold mb-0.5">The 2-Breath Mechanism:</strong>
              Two quick inhales through the nose pop open the millions of tiny collapsed air sacs (alveoli) in your lungs. The prolonged slow exhale dumps excess carbon dioxide, immediately slowing the heart rate within 20 to 30 seconds.
            </div>
          </div>

          {/* Interactive visual circle */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div
              className={`w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-xl ${
                step === 'Ready'
                  ? 'bg-emerald-50 border-2 border-emerald-200 text-emerald-900'
                  : step === 'Inhale1'
                  ? 'bg-teal-100 border-4 border-teal-400 scale-110 text-teal-950'
                  : step === 'Inhale2'
                  ? 'bg-teal-200 border-4 border-teal-500 scale-125 text-teal-950 ring-4 ring-teal-300'
                  : step === 'Exhale'
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-800 text-white scale-90 shadow-emerald-500/20'
                  : 'bg-emerald-500 text-white scale-100'
              }`}
            >
              <Wind className="w-8 h-8 mb-1" />
              <span className="text-sm font-bold tracking-tight">
                {step === 'Ready' && 'Ready for Sigh'}
                {step === 'Inhale1' && '1st Deep Inhale'}
                {step === 'Inhale2' && '+ Extra Top-Off!'}
                {step === 'Exhale' && 'Long Soft Sigh...'}
                {step === 'Rest' && 'Settle & Release'}
              </span>
              <span className="text-xs font-medium opacity-80 mt-1">
                {step === 'Ready' && 'Tap below'}
                {step === 'Inhale1' && 'Through nose (deep)'}
                {step === 'Inhale2' && 'Through nose (sharp)'}
                {step === 'Exhale' && 'Slow out mouth'}
                {step === 'Rest' && 'Nervous system reset'}
              </span>
            </div>

            <div className="mt-4 text-xs font-semibold text-slate-600">
              Completed Resets: <strong className="text-teal-700">{completedCount}</strong>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-xs text-slate-500">
            Recommended: 2 to 3 sighs whenever stress surges
          </span>
          <button
            onClick={() => setIsRunning(true)}
            disabled={isRunning}
            className="px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 text-white bg-[#0d6954] hover:bg-[#09473a] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'Sigh in progress...' : 'Execute Sigh Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
