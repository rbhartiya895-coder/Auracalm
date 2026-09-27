import { UserProgress, MoodEntry } from '../types';

const PROGRESS_KEY = 'auracalm_user_progress_v1';
const MOOD_KEY = 'auracalm_mood_history_v1';

const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first-sanctuary',
    title: 'First Sanctuary',
    description: 'Completed your first guided audio meditation session.',
    unlocked: true,
    unlockedAt: 'Yesterday',
    icon: '✨'
  },
  {
    id: 'breath-anchor',
    title: 'Autonomic Balance',
    description: 'Completed at least 10 conscious breathing cycles.',
    unlocked: true,
    unlockedAt: 'Yesterday',
    icon: '🌬️'
  },
  {
    id: 'somatic-explorer',
    title: 'Somatic Grounder',
    description: 'Used a nervous system tool (Sigh Reset, 5-4-3-2-1, or Vagal Hum).',
    unlocked: true,
    unlockedAt: '2 days ago',
    icon: '🌿'
  },
  {
    id: 'mindful-streak-3',
    title: '3-Day Haven',
    description: 'Maintained a daily meditation streak for 3 consecutive days.',
    unlocked: true,
    unlockedAt: 'Today',
    icon: '🔥'
  },
  {
    id: 'deep-restorer',
    title: 'Night Healer',
    description: 'Completed a deep restorative sleep meditation session.',
    unlocked: false,
    icon: '🌙'
  },
  {
    id: 'mastery-7',
    title: '7-Day Sanctuary Master',
    description: 'Consistent daily presence for a full week.',
    unlocked: false,
    icon: '🏆'
  }
];

const INITIAL_MOOD_HISTORY: MoodEntry[] = [
  {
    id: 'mood-seed-1',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    dateStr: '3 days ago',
    moodRating: 4,
    primaryFeeling: 'Overwhelmed',
    physicalSensations: ['Chest tightness', 'Shallow breathing'],
    notes: 'Busy deadline week, feeling tension in shoulders.'
  },
  {
    id: 'mood-seed-2',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    dateStr: '2 days ago',
    moodRating: 6,
    primaryFeeling: 'Restless',
    physicalSensations: ['Jaw tension', 'Fidgeting'],
    notes: 'Tried 5-4-3-2-1 grounding after lunch; felt much clearer.'
  },
  {
    id: 'mood-seed-3',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    dateStr: 'Yesterday',
    moodRating: 8,
    primaryFeeling: 'Calm',
    physicalSensations: ['Warm chest', 'Relaxed jaw'],
    notes: 'Listened to the Anxiety Anchor audio session before sleep.'
  }
];

const INITIAL_PROGRESS: UserProgress = {
  totalMinutes: 42,
  completedSessionsCount: 5,
  currentStreakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  breathworkCycles: 28,
  completedSessionIds: ['anxiety-anchor', 'somatic-vagus-reset', 'morning-clarity'],
  weeklyMinutes: [
    { day: 'Mon', minutes: 8 },
    { day: 'Tue', minutes: 12 },
    { day: 'Wed', minutes: 0 },
    { day: 'Thu', minutes: 10 },
    { day: 'Fri', minutes: 7 },
    { day: 'Sat', minutes: 5 },
    { day: 'Sun', minutes: 12 }
  ],
  moodHistory: INITIAL_MOOD_HISTORY,
  achievements: INITIAL_ACHIEVEMENTS
};

export const storageService = {
  getProgress(): UserProgress {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    this.saveProgress(INITIAL_PROGRESS);
    return INITIAL_PROGRESS;
  },

  saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  },

  addCompletedSession(sessionId: string, durationMinutes: number): UserProgress {
    const progress = this.getProgress();
    const today = new Date().toISOString().split('T')[0];

    const isNewDay = progress.lastActiveDate !== today;
    const newStreak = isNewDay ? progress.currentStreakDays + 1 : progress.currentStreakDays;

    const updatedSessionIds = progress.completedSessionIds.includes(sessionId)
      ? progress.completedSessionIds
      : [...progress.completedSessionIds, sessionId];

    // Update today in weeklyMinutes
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayName = dayNames[new Date().getDay()];
    const updatedWeekly = progress.weeklyMinutes.map((w) =>
      w.day === currentDayName ? { ...w, minutes: w.minutes + durationMinutes } : w
    );

    // Check achievement unlock
    const updatedAchievements = progress.achievements.map((a) => {
      if (a.id === 'first-sanctuary') return { ...a, unlocked: true };
      if (a.id === 'deep-restorer' && sessionId === 'deep-rest-sleep') {
        return { ...a, unlocked: true, unlockedAt: 'Today' };
      }
      if (a.id === 'mastery-7' && newStreak >= 7) {
        return { ...a, unlocked: true, unlockedAt: 'Today' };
      }
      return a;
    });

    const updated: UserProgress = {
      ...progress,
      totalMinutes: progress.totalMinutes + durationMinutes,
      completedSessionsCount: progress.completedSessionsCount + 1,
      currentStreakDays: newStreak,
      lastActiveDate: today,
      completedSessionIds: updatedSessionIds,
      weeklyMinutes: updatedWeekly,
      achievements: updatedAchievements
    };

    this.saveProgress(updated);
    return updated;
  },

  addBreathCycles(cycles: number): UserProgress {
    const progress = this.getProgress();
    const updated: UserProgress = {
      ...progress,
      breathworkCycles: progress.breathworkCycles + cycles
    };
    this.saveProgress(updated);
    return updated;
  },

  addMoodEntry(entry: Omit<MoodEntry, 'id' | 'timestamp' | 'dateStr'>): MoodEntry {
    const progress = this.getProgress();
    const newEntry: MoodEntry = {
      id: 'mood-' + Date.now(),
      timestamp: new Date().toISOString(),
      dateStr: 'Just now',
      ...entry
    };

    const updatedHistory = [newEntry, ...progress.moodHistory];
    const updatedProgress = {
      ...progress,
      moodHistory: updatedHistory
    };

    this.saveProgress(updatedProgress);
    return newEntry;
  },

  resetAll(): void {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(MOOD_KEY);
    localStorage.removeItem('auracalm_companion_name_v1');
    localStorage.removeItem('auracalm_companion_voice_v1');
    localStorage.removeItem('auracalm_has_named_v1');
    localStorage.removeItem('auracalm_has_seen_guide_v1');
    localStorage.removeItem('auracalm_ambient_sound_v1');
    localStorage.removeItem('auracalm_ambient_volume_v1');
    localStorage.removeItem('auracalm_bg_theme_v1');
    localStorage.removeItem('auracalm_user_country_v1');
    localStorage.removeItem('auracalm_has_selected_country_v1');
    localStorage.removeItem('auracalm_app_language_v1');
  },

  getLanguage(): string {
    try {
      const lang = localStorage.getItem('auracalm_app_language_v1');
      if (lang && lang.trim()) return lang.trim();

      // Auto-detect browser preferred language
      if (typeof navigator !== 'undefined' && navigator.language) {
        const browser = navigator.language.toLowerCase();
        if (browser.startsWith('hi')) return 'hi';
        if (browser.startsWith('mr')) return 'mr';
        if (browser.startsWith('bn')) return 'bn';
        if (browser.startsWith('ta')) return 'ta';
        if (browser.startsWith('te')) return 'te';
        if (browser.startsWith('es')) return 'es';
        if (browser.startsWith('fr')) return 'fr';
        if (browser.startsWith('de')) return 'de';
        if (browser.startsWith('ja')) return 'ja';
      }
    } catch {
      // fallback
    }
    return 'en';
  },

  setLanguage(lang: string): void {
    try {
      localStorage.setItem('auracalm_app_language_v1', lang.trim().toLowerCase());
    } catch {
      // ignore
    }
  },

  getUserCountry(): string {
    try {
      const c = localStorage.getItem('auracalm_user_country_v1');
      if (c && c.trim()) return c.trim().toLowerCase();
    } catch {
      // fallback
    }
    return 'in'; // Default to India
  },

  setUserCountry(countryCode: string): void {
    try {
      const code = countryCode.trim().toLowerCase() || 'in';
      localStorage.setItem('auracalm_user_country_v1', code);
      localStorage.setItem('auracalm_has_selected_country_v1', 'true');
    } catch {
      // ignore
    }
  },

  hasSelectedCountry(): boolean {
    try {
      return localStorage.getItem('auracalm_has_selected_country_v1') === 'true';
    } catch {
      return false;
    }
  },

  hasSeenIntroGuide(): boolean {
    try {
      return localStorage.getItem('auracalm_has_seen_guide_v1') === 'true';
    } catch {
      return false;
    }
  },

  setSeenIntroGuide(val = true): void {
    try {
      localStorage.setItem('auracalm_has_seen_guide_v1', val ? 'true' : 'false');
    } catch {
      // ignore
    }
  },

  getAmbientVolume(): number {
    try {
      const v = localStorage.getItem('auracalm_ambient_volume_v1');
      if (v) return Math.max(0, Math.min(1, parseFloat(v)));
    } catch {
      // fallback
    }
    return 0.35; // Default soft soothing ambient volume (reduced)
  },

  setAmbientVolume(vol: number): void {
    try {
      localStorage.setItem('auracalm_ambient_volume_v1', vol.toString());
    } catch {
      // ignore
    }
  },

  getBackgroundTheme(): string {
    try {
      const t = localStorage.getItem('auracalm_bg_theme_v1');
      if (t) return t;
    } catch {
      // fallback
    }
    return 'lotus-dawn'; // default atmospheric background
  },

  setBackgroundTheme(theme: string): void {
    try {
      localStorage.setItem('auracalm_bg_theme_v1', theme);
    } catch {
      // ignore
    }
  },

  getCompanionName(): string {
    try {
      const name = localStorage.getItem('auracalm_companion_name_v1');
      if (name && name.trim()) return name.trim();
    } catch {
      // fallback
    }
    return 'Meera';
  },

  setCompanionName(name: string): void {
    try {
      const clean = name.trim() || 'Meera';
      localStorage.setItem('auracalm_companion_name_v1', clean);
      localStorage.setItem('auracalm_has_named_v1', 'true');
    } catch {
      // ignore
    }
  },

  hasNamedCompanion(): boolean {
    try {
      return localStorage.getItem('auracalm_has_named_v1') === 'true';
    } catch {
      return false;
    }
  },

  getCompanionVoice(): string {
    try {
      const voice = localStorage.getItem('auracalm_companion_voice_v1');
      if (voice && voice.trim()) return voice.trim();
    } catch {
      // fallback
    }
    return 'kavya';
  },

  setCompanionVoice(voice: string): void {
    try {
      localStorage.setItem('auracalm_companion_voice_v1', voice);
    } catch {
      // ignore
    }
  }
};
