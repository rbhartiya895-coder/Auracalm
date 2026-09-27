import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Check, Clock, ShieldCheck, Heart, User, ChevronRight, Sliders, X } from 'lucide-react';
import { GuidedSession } from '../types';
import { GUIDED_SESSIONS } from '../data/sessionsData';
import { soundService } from '../services/soundService';
import confetti from 'canvas-confetti';

interface GuidedSessionsViewProps {
  onSessionCompleted: (sessionId: string, durationMinutes: number) => void;
  completedSessionIds: string[];
}

export const GuidedSessionsView: React.FC<GuidedSessionsViewProps> = ({
  onSessionCompleted,
  completedSessionIds
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSession, setActiveSession] = useState<GuidedSession | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [ambientSound, setAmbientSound] = useState<string>('ocean');
  const [voiceNarratorOn, setVoiceNarratorOn] = useState<boolean>(true);
  const [showCompletionCelebration, setShowCompletionCelebration] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    { id: 'all', label: 'All Sessions' },
    { id: 'anxiety', label: 'Anxiety & Panic Relief' },
    { id: 'somatic', label: 'Vagus & Somatic Reset' },
    { id: 'sleep', label: 'Deep Sleep & Night' },
    { id: 'morning', label: 'Morning Grounding' }
  ];

  const filteredSessions = activeCategory === 'all'
    ? GUIDED_SESSIONS
    : GUIDED_SESSIONS.filter((s) => s.category === activeCategory);

  const startSession = (session: GuidedSession) => {
    setActiveSession(session);
    setCurrentTime(0);
    setIsPlaying(true);
    setShowCompletionCelebration(false);

    // Start default ambient sound
    const soundType = (session.ambientSoundDefault || 'ocean') as 'ocean' | 'rain' | 'theta' | 'bowl_drone' | 'forest';
    setAmbientSound(soundType);
    soundService.startAmbient(soundType);

    // Initial voice instruction
    if (session.steps.length > 0 && voiceNarratorOn) {
      soundService.speakGuidance(session.steps[0].text);
      soundService.playSingingBowl(216, 3);
    }
  };

  const closePlayer = () => {
    setIsPlaying(false);
    soundService.stopAmbient();
    soundService.stopSpeaking();
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveSession(null);
  };

  // Timer loop for playback
  useEffect(() => {
    if (!isPlaying || !activeSession) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const nextTime = prev + 1;

        if (nextTime >= activeSession.durationSeconds) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeout(() => handleFinish(), 0);
          return activeSession.durationSeconds;
        }

        // Check if we reached a new step
        const matchedStep = activeSession.steps.find((st) => st.timeSeconds === nextTime);
        if (matchedStep) {
          soundService.playSingingBowl(240, 2);
          if (voiceNarratorOn) {
            soundService.speakGuidance(matchedStep.text);
          }
        }

        return nextTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeSession, voiceNarratorOn]);

  const handleFinish = () => {
    setIsPlaying(false);
    setShowCompletionCelebration(true);
    soundService.playSingingBowl(216, 4.5);

    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    if (activeSession) {
      onSessionCompleted(activeSession.id, activeSession.durationMinutes);
    }
  };

  // Find active step
  const currentStep = activeSession
    ? [...activeSession.steps].reverse().find((st) => currentTime >= st.timeSeconds) || activeSession.steps[0]
    : null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              Clinical Audio Sanctuary
            </span>
            <span className="text-xs text-slate-500">• Evidence-Based Grounding</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Guided Audio Meditations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Clinical somatic protocols with binaural acoustic soundscapes and paced voice guidance.
          </p>
        </div>

        {/* Categories Tab pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Session Banner */}
      {activeCategory === 'all' && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c5946] via-[#0e745b] to-[#128b6d] text-white p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Recommended Daily Sanctuary</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Anxiety De-escalation & Safe Anchor
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-light">
              A rapid 3-minute, trauma-informed grounding protocol to soften acute overwhelm, slow the racing pulse, and return your body to physical safety.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> 3 Minutes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> Dr. Elena Vance
              </span>
              <span>•</span>
              <span className="bg-emerald-900/60 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Ocean Waves + Voice
              </span>
            </div>
            <div className="pt-3">
              <button
                onClick={() => startSession(GUIDED_SESSIONS[0])}
                className="inline-flex items-center gap-2 bg-white text-[#0c5946] hover:bg-emerald-50 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin 3-Minute Session</span>
              </button>
            </div>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-96 h-96 rounded-full border-8 border-white/10 pointer-events-none" />
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/15 pointer-events-none" />
        </div>
      )}

      {/* Grid of Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSessions.map((session) => {
          const isCompleted = completedSessionIds.includes(session.id);
          return (
            <div
              key={session.id}
              className="bg-white/95 rounded-3xl border border-slate-200/80 hover:border-emerald-300 transition-all p-5 shadow-xs hover:shadow-lg flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                    {session.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{session.durationMinutes}m</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors leading-snug mb-2">
                  {session.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                  {session.description}
                </p>

                {/* Key Benefits */}
                <div className="space-y-1 mb-4">
                  {session.benefits.slice(0, 2).map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[130px]">{session.instructor.split(',')[0]}</span>
                </div>

                <button
                  onClick={() => startSession(session)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-[#0d6954] hover:bg-[#0a5242] text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCompleted ? 'Replay' : 'Start'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Meditation Player Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-900/40 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-white max-h-[92vh]">
            {/* Player Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold truncate max-w-xs sm:max-w-md">{activeSession.title}</h2>
                  <p className="text-xs text-slate-400">{activeSession.instructor}</p>
                </div>
              </div>
              <button
                onClick={closePlayer}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visualizer & Spoken Step Section */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col items-center justify-center text-center">
              {!showCompletionCelebration ? (
                <>
                  {/* Concentric Breathing Aura */}
                  <div className="relative flex items-center justify-center py-4">
                    <div className="w-48 h-48 rounded-full border border-emerald-500/20 absolute animate-pulse-slow" />
                    <div className="w-64 h-64 rounded-full border border-teal-500/10 absolute" />

                    <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 flex flex-col items-center justify-center text-white shadow-2xl border-2 border-emerald-400/40 scale-105 transition-all">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                        {isPlaying ? 'Sanctuary Playing' : 'Paused'}
                      </span>
                      <span className="text-3xl font-extrabold font-mono my-0.5">
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
                      </span>
                      <span className="text-[10px] text-emerald-200/80 font-mono">
                        / {activeSession.durationMinutes}:00
                      </span>
                    </div>
                  </div>

                  {/* Synchronized Step Transcript */}
                  {currentStep && (
                    <div className="w-full bg-slate-950/80 border border-emerald-900/40 rounded-2xl p-5 text-left space-y-2">
                      <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
                        <span>Current Guidance</span>
                        <span className="text-[10px] text-slate-500">Live Voice Cue</span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                        “{currentStep.text}”
                      </p>
                      {currentStep.action && (
                        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-300">
                          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                          <span>Somatic posture: {currentStep.action}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Scrubber Progress Bar */}
                  <div className="w-full space-y-1">
                    <input
                      type="range"
                      min="0"
                      max={activeSession.durationSeconds}
                      value={currentTime}
                      onChange={(e) => setCurrentTime(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                      <span>{activeSession.durationMinutes}:00</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Completion Celebration Screen */
                <div className="py-6 space-y-4 max-w-md">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                    🌿
                  </div>
                  <h3 className="text-2xl font-bold text-white">Session Completed</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    You have nurtured your autonomic nervous system. Your progress tracking has been updated with +{activeSession.durationMinutes} mindful minutes!
                  </p>
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center justify-center gap-3">
                    <span>🏆 Session checkmark earned</span>
                    <span>•</span>
                    <span>🔥 Streak Active</span>
                  </div>
                  <button
                    onClick={closePlayer}
                    className="w-full py-3 bg-[#0d6954] hover:bg-[#0a5343] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    Finish & View Progress Tracking
                  </button>
                </div>
              )}
            </div>

            {/* Player Controls & Ambient Mixer Bar */}
            {!showCompletionCelebration && (
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Ambient Soundscape selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Ambient:</span>
                  {(['ocean', 'rain', 'theta', 'bowl_drone'] as const).map((sound) => (
                    <button
                      key={sound}
                      onClick={() => {
                        setAmbientSound(sound);
                        soundService.startAmbient(sound);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        ambientSound === sound
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sound === 'ocean' ? '🌊 Ocean' : sound === 'rain' ? '🌧️ Rain' : sound === 'theta' ? '🧘 Theta' : '📿 Bowls'}
                    </button>
                  ))}
                </div>

                {/* Main Playback Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentTime((t) => Math.max(0, t - 15))}
                    className="p-2 text-slate-400 hover:text-white"
                    title="Rewind 15 seconds"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={handleFinish}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    End Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
