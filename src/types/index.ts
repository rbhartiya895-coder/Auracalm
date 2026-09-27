export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja' | 'mr' | 'bn' | 'ta' | 'te';

export type AppTheme = 'light' | 'dark' | 'sanctuary';

export type ToneSetting = 'Calm' | 'Compassionate' | 'Grounded' | 'Whisper';

export type TabView = 'sanctuary' | 'sessions' | 'progress' | 'tools';

export interface GuidedSession {
  id: string;
  title: string;
  category: 'anxiety' | 'sleep' | 'somatic' | 'morning' | 'emergency' | 'focus';
  categoryLabel: string;
  durationMinutes: number;
  durationSeconds: number;
  description: string;
  benefits: string[];
  steps: {
    timeSeconds: number;
    text: string;
    action?: string;
  }[];
  instructor: string;
  ambientSoundDefault?: string;
  colorScheme: string;
  tag: string;
}

export interface MoodEntry {
  id: string;
  timestamp: string;
  dateStr: string;
  moodRating: number; // 1 to 10
  primaryFeeling: 'Calm' | 'Anxious' | 'Overwhelmed' | 'Sad' | 'Exhausted' | 'Hopeful' | 'Grateful' | 'Restless';
  physicalSensations: string[];
  notes?: string;
}

export interface UserProgress {
  totalMinutes: number;
  completedSessionsCount: number;
  currentStreakDays: number;
  lastActiveDate: string;
  breathworkCycles: number;
  completedSessionIds: string[];
  weeklyMinutes: { day: string; minutes: number }[];
  moodHistory: MoodEntry[];
  achievements: {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    unlockedAt?: string;
    icon: string;
  }[];
}

export interface BreathingPreset {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  benefit: string;
}
