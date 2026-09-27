import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Play, Pause, ChevronRight, Sparkles, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { BreathingPreset } from '../types';
import { BREATHING_PRESETS } from '../data/sessionsData';
import { soundService } from '../services/soundService';
import { useLanguage } from '../i18n/LanguageContext';

interface BreathingExerciseBarProps {
  onOpenBreathingModal: () => void;
  onCycleComplete?: () => void;
}

export const BreathingExerciseBar: React.FC<BreathingExerciseBarProps> = ({
  onOpenBreathingModal,
  onCycleComplete
}) => {
  const { t } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState<BreathingPreset>(BREATHING_PRESETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'HoldPost'>('Inhale');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedCycles, setCompletedCycles] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('Inhale');
      setPhaseTimeLeft(selectedPreset.inhale);
      return;
    }

    if (soundEnabled && phase === 'Inhale') {
      soundService.playInhaleChime();
    }

    timerRef.current = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        if (prev <= 1) {
          // Switch phase
          if (phase === 'Inhale') {
            if (selectedPreset.hold1 > 0) {
              setPhase('Hold');
              return selectedPreset.hold1;
            } else {
              setPhase('Exhale');
              if (soundEnabled) soundService.playExhaleChime();
              return selectedPreset.exhale;
            }
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            if (soundEnabled) soundService.playExhaleChime();
            return selectedPreset.exhale;
          } else if (phase === 'Exhale') {
            if (selectedPreset.hold2 > 0) {
              setPhase('HoldPost');
              return selectedPreset.hold2;
            } else {
              setPhase('Inhale');
              setCompletedCycles((c) => c + 1);
              if (onCycleComplete) {
                setTimeout(() => onCycleComplete(), 0);
              }
              if (soundEnabled) soundService.playInhaleChime();
              return selectedPreset.inhale;
            }
          } else {
            // After HoldPost
            setPhase('Inhale');
            setCompletedCycles((c) => c + 1);
            if (onCycleComplete) {
              setTimeout(() => onCycleComplete(), 0);
            }
            if (soundEnabled) soundService.playInhaleChime();
            return selectedPreset.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, phase, selectedPreset, soundEnabled, onCycleComplete]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-6">
      <div className="bg-[#ffffff]/90 backdrop-blur-md border border-[#d8e2dc] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#b8cec3] transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left section matching screenshot */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#eef5f1] border border-[#d2e2d8] flex items-center justify-center text-[#2b5646] shrink-0">
              <Leaf className="w-6 h-6 text-[#2b5646]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1a2d25] font-sans">
                  {t('pacerTitle', 'Breathing Exercise')}
                </h3>
                {isRunning && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2b5646] bg-[#eef5f1] px-2 py-0.5 rounded-full border border-[#cadcd1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3d7a64] animate-ping"></span>
                    {phase === 'Inhale' ? t('breatheIn', 'Inhale') : phase === 'Exhale' ? t('breatheOut', 'Exhale') : t('holdBreath', 'Hold')} {phaseTimeLeft}s
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#546e62]">
                {t('pacerActive', 'Follow the pace to feel calmer.')}
              </p>
            </div>
          </div>

          {/* Right section: Exact Steps with Calm Muted Multi-colors */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {/* Step 1: Inhale - Muted Eucalyptus */}
              <div
                className={`flex flex-col items-center px-3.5 py-1.5 rounded-xl border transition-all ${
                  isRunning && phase === 'Inhale'
                    ? 'bg-[#e2ede7] border-[#8cb8a3] text-[#163a2d] scale-105 shadow-xs font-bold'
                    : 'bg-[#ecf3ef] border-[#c8ded2] text-[#21493b]'
                }`}
              >
                <span className="text-sm font-bold font-mono">
                  {selectedPreset.inhale}s
                </span>
                <span className="text-[11px] text-[#4d7062] font-medium">{t('breatheIn', 'Inhale')}</span>
              </div>

              {/* Arrow */}
              <span className="text-[#a1b5ac] font-bold">→</span>

              {/* Step 2: Hold - Muted Sandstone Gold */}
              <div
                className={`flex flex-col items-center px-3.5 py-1.5 rounded-xl border transition-all ${
                  isRunning && phase === 'Hold'
                    ? 'bg-[#ebe4d5] border-[#baa98c] text-[#4d3d22] scale-105 shadow-xs font-bold'
                    : 'bg-[#f5efe5] border-[#ded4bf] text-[#69532e]'
                }`}
              >
                <span className="text-sm font-bold font-mono">
                  {selectedPreset.hold1}s
                </span>
                <span className="text-[11px] text-[#786646] font-medium">{t('holdBreath', 'Hold')}</span>
              </div>

              {/* Arrow */}
              <span className="text-[#a1b5ac] font-bold">→</span>

              {/* Step 3: Exhale - Muted Twilight Lavender */}
              <div
                className={`flex flex-col items-center px-3.5 py-1.5 rounded-xl border transition-all ${
                  isRunning && phase === 'Exhale'
                    ? 'bg-[#e4e1ee] border-[#a59ebc] text-[#342f4c] scale-105 shadow-xs font-bold'
                    : 'bg-[#f0eef5] border-[#d4cfdf] text-[#4f4868]'
                }`}
              >
                <span className="text-sm font-bold font-mono">
                  {selectedPreset.exhale}s
                </span>
                <span className="text-[11px] text-[#625b80] font-medium">{t('breatheOut', 'Exhale')}</span>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  isRunning
                    ? 'bg-[#f4efe4] hover:bg-[#ede5d6] text-[#665028] border border-[#d6c7b0]'
                    : 'bg-[#224b3e] hover:bg-[#193a2f] text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>{t('pauseSession', 'Pause')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t('startSession', 'Start Pacer')}</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenBreathingModal}
                className="p-2 text-[#567266] hover:text-[#183127] hover:bg-[#eef5f1] rounded-xl transition-colors cursor-pointer"
                title="Open Fullscreen Breathing Sphere"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Small live visualizer bar if running */}
        {isRunning && (
          <div className="mt-3 pt-3 border-t border-[#edf2ee] flex items-center justify-between text-xs text-[#526d60]">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#1e4537]">
                Phase: <strong className="text-[#153429]">{phase}</strong> ({phaseTimeLeft}s remaining)
              </span>
              <span>• Cycles completed: <strong className="text-[#2b5a49]">{completedCycles}</strong></span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1 text-[11px] text-[#526d60] hover:text-[#1a382c] cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#3b7560]" /> : <VolumeX className="w-3.5 h-3.5 text-[#8fa79c]" />}
              <span>{soundEnabled ? 'Bell chime on' : 'Chime muted'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
