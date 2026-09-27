import React from 'react';
import { Activity, Flame, Clock, CheckCircle2, Wind, Heart, Award, Calendar, Sparkles, TrendingUp, Plus } from 'lucide-react';
import { UserProgress } from '../types';

interface ProgressViewProps {
  progress: UserProgress;
  onOpenMoodLog: () => void;
  onOpenGuidedSessions: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onOpenMoodLog,
  onOpenGuidedSessions
}) => {
  // Calculate average mood
  const avgMood = progress.moodHistory.length > 0
    ? (
        progress.moodHistory.reduce((acc, m) => acc + m.moodRating, 0) /
        progress.moodHistory.length
      ).toFixed(1)
    : '7.0';

  // Max minutes in week for chart scaling
  const maxMins = Math.max(15, ...progress.weeklyMinutes.map((w) => w.minutes));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              Evidence & Continuity
            </span>
            <span className="text-xs text-slate-500">• Private On-Device Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Progress & Nervous System Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your mindful streaks, total audio immersion time, breathwork cycles, and emotional equilibrium.
          </p>
        </div>

        <button
          onClick={onOpenMoodLog}
          className="inline-flex items-center gap-2 bg-[#0d6954] hover:bg-[#0a5242] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Mood & Sensations</span>
        </button>
      </div>

      {/* Hero Streak Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-200/80 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-3xl shadow-xs">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {progress.currentStreakDays} Day Streak!
              </h2>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-300">
                Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your autonomic nervous system builds neural resilience with daily repeated micro-anchors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
            const isCompleted = idx < progress.currentStreakDays;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-all ${
                    isCompleted
                      ? 'bg-[#0d6954] text-white shadow-xs scale-105'
                      : 'bg-white border border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : day}
                </div>
                <span className="text-[10px] text-slate-400">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Minutes */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mindful Time</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {progress.totalMinutes} <span className="text-sm font-semibold text-slate-500">mins</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 inline" /> +15m this week
          </p>
        </div>

        {/* Card 2: Completed Sessions */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {progress.completedSessionsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across anxiety & somatic
          </p>
        </div>

        {/* Card 3: Breathwork Cycles */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Breath Cycles</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {progress.breathworkCycles}
          </div>
          <p className="text-[11px] text-cyan-700 font-medium mt-1">
            Vagal tone stimulation
          </p>
        </div>

        {/* Card 4: Average Mood / Equilibrium */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Calm Score</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {avgMood} <span className="text-sm font-semibold text-slate-500">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Based on {progress.moodHistory.length} check-ins
          </p>
        </div>
      </div>

      {/* Weekly Activity Bar Chart & Milestones in 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Mindful Minutes</h3>
              <p className="text-xs text-slate-500">Daily audio sanctuary time (Goal: 10 mins/day)</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              This Week
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {progress.weeklyMinutes.map((w, idx) => {
              const heightPct = Math.max(10, (w.minutes / maxMins) * 100);
              const isGoalMet = w.minutes >= 10;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-700 transition-colors">
                    {w.minutes > 0 ? `${w.minutes}m` : '-'}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl h-32 flex items-end overflow-hidden p-0.5">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isGoalMet
                          ? 'bg-gradient-to-t from-[#0c5946] to-[#10b981]'
                          : w.minutes > 0
                          ? 'bg-gradient-to-t from-teal-600 to-teal-400'
                          : 'bg-transparent'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 font-mono">
                    {w.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#0c5946]"></span>
              <span>Target met (≥10 min)</span>
            </span>
            <button
              onClick={onOpenGuidedSessions}
              className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
            >
              Start Session Now →
            </button>
          </div>
        </div>

        {/* Milestones & Badges (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Milestones</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {progress.achievements.filter((a) => a.unlocked).length} / {progress.achievements.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
            {progress.achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                  ach.unlocked
                    ? 'bg-amber-50/50 border-amber-200/80 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-2xl shrink-0">{ach.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{ach.title}</h4>
                    {ach.unlocked ? (
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.2 rounded">
                        {ach.unlockedAt || 'Unlocked'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Locked</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mood History Log & Recent Entries */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Emotional & Somatic Check-Ins</h3>
            <p className="text-xs text-slate-500">Track how your bodily sensations evolve before and after practice</p>
          </div>
          <button
            onClick={onOpenMoodLog}
            className="text-xs font-bold text-[#0d6954] hover:underline"
          >
            + New Check-In
          </button>
        </div>

        <div className="space-y-3">
          {progress.moodHistory.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 bg-slate-50/60 hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                  {m.primaryFeeling === 'Calm'
                    ? '🌿'
                    : m.primaryFeeling === 'Anxious'
                    ? '⚡'
                    : m.primaryFeeling === 'Overwhelmed'
                    ? '🌊'
                    : m.primaryFeeling === 'Restless'
                    ? '🌀'
                    : m.primaryFeeling === 'Grateful'
                    ? '✨'
                    : '🌙'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{m.primaryFeeling}</span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-md">
                      Level {m.moodRating}/10
                    </span>
                    <span className="text-xs text-slate-400">• {m.dateStr}</span>
                  </div>
                  {m.notes && (
                    <p className="text-xs text-slate-600 mt-1 italic">
                      “{m.notes}”
                    </p>
                  )}
                </div>
              </div>

              {/* Physical Sensations pills */}
              <div className="flex flex-wrap gap-1.5 self-start sm:self-center">
                {m.physicalSensations.map((sens, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full"
                  >
                    {sens}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
