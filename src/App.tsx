/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { Header } from './components/Header';
import { SanctuaryHero } from './components/SanctuaryHero';
import { BreathingExerciseBar } from './components/BreathingExerciseBar';
import { CalmingToolsGrid } from './components/CalmingToolsGrid';
import { EmergencyHelpBanner } from './components/EmergencyHelpBanner';
import { GuidedSessionsView } from './components/GuidedSessionsView';
import { ProgressView } from './components/ProgressView';
import { SomaticToolsView } from './components/SomaticToolsView';
import { SanctuaryAtmosphere, BackgroundTheme } from './components/SanctuaryAtmosphere';

// Modals
import { MoodLogModal } from './components/tools/MoodLogModal';
import { AnchoringModal } from './components/tools/AnchoringModal';
import { ButterflyTapsModal } from './components/tools/ButterflyTapsModal';
import { VagalHumModal } from './components/tools/VagalHumModal';
import { SighResetModal } from './components/tools/SighResetModal';
import { BreathingSphereModal } from './components/tools/BreathingSphereModal';
import { CrisisModal } from './components/CrisisModal';
import { TextChatModal } from './components/TextChatModal';
import { SettingsModal } from './components/SettingsModal';
import { SarvamSpeakingModal } from './components/SarvamSpeakingModal';
import { NamingCompanionModal } from './components/NamingCompanionModal';
import { IntroGuideModal } from './components/IntroGuideModal';
import { AmbientSoundPanel } from './components/AmbientSoundPanel';
import { CountrySelectorModal } from './components/CountrySelectorModal';
import { InstallAppModal } from './components/InstallAppModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';

import { TabView, Language, AppTheme, ToneSetting, UserProgress } from './types';
import { storageService } from './services/storageService';
import { soundService, AmbientSoundType } from './services/soundService';
import { getCountryCrisisData } from './data/crisisHotlines';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

function SanctuaryApp() {
  const { language, setLanguage, t, currentLanguage, isLanguageModalOpen, setIsLanguageModalOpen, openLanguageSelector } = useLanguage();
  const [currentTab, setCurrentTab] = useState<TabView>('sanctuary');
  const [theme, setTheme] = useState<AppTheme>('light');
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>(() => storageService.getBackgroundTheme() as BackgroundTheme);
  const [currentTone, setCurrentTone] = useState<ToneSetting>('Calm');
  const [breathingGuideActive, setBreathingGuideActive] = useState<boolean>(true);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType | null>(() => soundService.getCurrentAmbient());

  // User Country for Crisis & Emergency Support (Defaults to India 'in')
  const [userCountry, setUserCountry] = useState<string>(() => storageService.getUserCountry());
  const countryCrisis = getCountryCrisisData(userCountry);

  // Country selector modal
  const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);

  // Companion personalization (Naming & voice model features)
  const [companionName, setCompanionName] = useState<string>(() => storageService.getCompanionName());
  const [companionVoice, setCompanionVoice] = useState<string>(() => storageService.getCompanionVoice());
  const [isNamingModalOpen, setIsNamingModalOpen] = useState<boolean>(false);

  // Introductory tour guide (shown on first visit or on demand)
  const [isIntroGuideOpen, setIsIntroGuideOpen] = useState<boolean>(() => !storageService.hasSeenIntroGuide());

  // Ambient sound selector panel
  const [isAmbientPanelOpen, setIsAmbientPanelOpen] = useState<boolean>(false);

  // Install app modal state
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // User progress data
  const [userProgress, setUserProgress] = useState<UserProgress>(() => storageService.getProgress());

  // Modal visibility states
  const [isMoodLogOpen, setIsMoodLogOpen] = useState(false);
  const [isAnchoringOpen, setIsAnchoringOpen] = useState(false);
  const [isButterflyOpen, setIsButterflyOpen] = useState(false);
  const [isVagalHumOpen, setIsVagalHumOpen] = useState(false);
  const [isSighResetOpen, setIsSighResetOpen] = useState(false);
  const [isBreathingSphereOpen, setIsBreathingSphereOpen] = useState(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isTextChatOpen, setIsTextChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSarvamModalOpen, setIsSarvamModalOpen] = useState(false);

  // Handle country selection & persistence
  const handleSelectCountry = (countryCode: string) => {
    setUserCountry(countryCode);
    storageService.setUserCountry(countryCode);
  };

  // Immediate emergency trigger - if country hasn't been chosen yet, ask for country first
  const handleOpenEmergency = () => {
    if (!storageService.hasSelectedCountry()) {
      setIsCountryModalOpen(true);
    } else {
      setIsCrisisOpen(true);
    }
  };

  // Toggle ambient background sound
  const handleToggleAmbient = () => {
    if (ambientSound) {
      soundService.stopAmbient();
      setAmbientSound(null);
    } else {
      soundService.startAmbient('flute');
      setAmbientSound('flute');
    }
  };

  const handleSelectAmbientSound = (type: AmbientSoundType | null) => {
    setAmbientSound(type);
    if (!type) {
      soundService.stopAmbient();
    }
  };

  const handleBgThemeChange = (newBg: BackgroundTheme) => {
    setBgTheme(newBg);
    storageService.setBackgroundTheme(newBg);
  };

  const handleSessionCompleted = (sessionId: string, durationMinutes: number) => {
    const updated = storageService.addCompletedSession(sessionId, durationMinutes);
    setUserProgress({ ...updated });
  };

  const handleCyclesCompleted = (count: number) => {
    const updated = storageService.addBreathCycles(count);
    setUserProgress({ ...updated });
  };

  const handleResetData = () => {
    storageService.resetAll();
    setCompanionName(storageService.getCompanionName());
    setCompanionVoice(storageService.getCompanionVoice());
    setBgTheme('lotus-dawn');
    setUserCountry(storageService.getUserCountry());
    setUserProgress(storageService.getProgress());
  };

  const handleTriggerChatTool = (tool: 'sigh' | 'breathing' | 'anchoring') => {
    if (tool === 'sigh') setIsSighResetOpen(true);
    else if (tool === 'breathing') setIsBreathingSphereOpen(true);
    else if (tool === 'anchoring') setIsAnchoringOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-500 ${
      theme === 'dark'
        ? 'text-[#e2e8e5]'
        : 'text-[#1c2e26]'
    }`}>
      {/* Rich Atmospheric Motion & Calming Background Layer */}
      <SanctuaryAtmosphere theme={bgTheme} isDark={theme === 'dark'} />

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
        bgTheme={bgTheme}
        onBgThemeChange={handleBgThemeChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCrisis={handleOpenEmergency}
        onOpenCountrySelect={() => setIsCountryModalOpen(true)}
        userCountry={userCountry}
        onOpenSarvam={() => setIsSarvamModalOpen(true)}
        onOpenNamingModal={() => setIsNamingModalOpen(true)}
        onOpenTour={() => setIsIntroGuideOpen(true)}
        onOpenAmbientPanel={() => setIsAmbientPanelOpen(true)}
        ambientSound={ambientSound}
        onToggleAmbient={handleToggleAmbient}
        streakDays={userProgress.currentStreakDays}
        companionName={companionName}
        companionVoice={companionVoice}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 relative z-10">
        {currentTab === 'sanctuary' && (
          <div className="animate-in fade-in duration-300">
            {/* Sanctuary Hero - Centered on Personalized Sarvam Guide */}
            <SanctuaryHero
              currentTone={currentTone}
              onSelectTone={setCurrentTone}
              breathingGuideActive={breathingGuideActive}
              onToggleBreathingGuide={() => setBreathingGuideActive(!breathingGuideActive)}
              onTriggerSighReset={() => setIsSighResetOpen(true)}
              onOpenTextChat={() => setIsTextChatOpen(true)}
              onOpenBreathingModal={() => setIsBreathingSphereOpen(true)}
              onOpenSarvam={() => setIsSarvamModalOpen(true)}
              onOpenNamingModal={() => setIsNamingModalOpen(true)}
              onOpenTour={() => setIsIntroGuideOpen(true)}
              onOpenAmbientPanel={() => setIsAmbientPanelOpen(true)}
              ambientSound={ambientSound}
              onSelectAmbientSound={handleSelectAmbientSound}
              companionName={companionName}
              companionVoice={companionVoice}
            />

            {/* Breathing Exercise Bar */}
            <BreathingExerciseBar
              onOpenBreathingModal={() => setIsBreathingSphereOpen(true)}
              onCycleComplete={() => handleCyclesCompleted(1)}
            />

            {/* Calming Tools Grid */}
            <CalmingToolsGrid
              onOpenMoodLog={() => setIsMoodLogOpen(true)}
              onOpenAnchoring={() => setIsAnchoringOpen(true)}
              onOpenButterfly={() => setIsButterflyOpen(true)}
              onOpenVagalHum={() => setIsVagalHumOpen(true)}
            />

            {/* Need Immediate Help Banner with Country Context */}
            <EmergencyHelpBanner
              userCountry={userCountry}
              onTriggerEmergency={handleOpenEmergency}
              onOpenCountrySelect={() => setIsCountryModalOpen(true)}
            />
          </div>
        )}

        {currentTab === 'sessions' && (
          <div className="animate-in fade-in duration-300">
            <GuidedSessionsView
              onSessionCompleted={handleSessionCompleted}
              completedSessionIds={userProgress.completedSessionIds}
            />
          </div>
        )}

        {currentTab === 'progress' && (
          <div className="animate-in fade-in duration-300">
            <ProgressView
              progress={userProgress}
              onOpenMoodLog={() => setIsMoodLogOpen(true)}
              onOpenGuidedSessions={() => setCurrentTab('sessions')}
            />
          </div>
        )}

        {currentTab === 'tools' && (
          <div className="animate-in fade-in duration-300">
            <SomaticToolsView
              onOpenSigh={() => setIsSighResetOpen(true)}
              onOpenAnchoring={() => setIsAnchoringOpen(true)}
              onOpenButterfly={() => setIsButterflyOpen(true)}
              onOpenVagalHum={() => setIsVagalHumOpen(true)}
              onOpenBreathingSphere={() => setIsBreathingSphereOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-900/10 bg-white/70 backdrop-blur-md py-6 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AuraCalm</span>
            <span>• Evidence-Based Somatic & Audio Grounding</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Guide: {companionName}</span>
            <span>•</span>
            <button
              onClick={() => setIsIntroGuideOpen(true)}
              className="text-[#285746] font-semibold hover:underline cursor-pointer"
            >
              Feature Tour ✨
            </button>
            <span>•</span>
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              title="Download or install AuraCalm on your device"
            >
              <span>Install / Download App 📲</span>
            </button>
            <span>•</span>
            <button
              onClick={openLanguageSelector}
              className="text-[#1f4739] hover:text-[#0c261d] font-semibold hover:underline flex items-center gap-1.5 cursor-pointer bg-[#eef5f1] px-2.5 py-0.5 rounded-full border border-[#cadcd1] transition-all hover:scale-102"
              title={`Language: ${currentLanguage.name}. Click to change.`}
            >
              <Globe className="w-3.5 h-3.5 text-[#2c5b4b]" />
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.nativeName}</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsCountryModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              title="Change your country"
            >
              <span>{countryCrisis.flag}</span>
              <span>{countryCrisis.name}</span>
            </button>
            <span>•</span>
            <button
              onClick={handleOpenEmergency}
              className="text-rose-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              title={`Emergency Helpline for ${countryCrisis.name}: ${countryCrisis.primaryCrisisName} (${countryCrisis.primaryCrisisNumber})`}
            >
              <span>{t('emergencyNumber', 'Emergency Helpline')} ({countryCrisis.primaryCrisisNumber})</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MoodLogModal
        isOpen={isMoodLogOpen}
        onClose={() => setIsMoodLogOpen(false)}
        onLogged={() => setUserProgress(storageService.getProgress())}
      />

      <AnchoringModal
        isOpen={isAnchoringOpen}
        onClose={() => setIsAnchoringOpen(false)}
      />

      <ButterflyTapsModal
        isOpen={isButterflyOpen}
        onClose={() => setIsButterflyOpen(false)}
      />

      <VagalHumModal
        isOpen={isVagalHumOpen}
        onClose={() => setIsVagalHumOpen(false)}
      />

      <SighResetModal
        isOpen={isSighResetOpen}
        onClose={() => setIsSighResetOpen(false)}
        onCycleCompleted={() => handleCyclesCompleted(1)}
      />

      <BreathingSphereModal
        isOpen={isBreathingSphereOpen}
        onClose={() => setIsBreathingSphereOpen(false)}
        onCyclesAdded={handleCyclesCompleted}
      />

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Country Selector Modal (Enter/Select Country First) */}
      <CountrySelectorModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        currentCountry={userCountry}
        onSelectCountry={(code) => {
          handleSelectCountry(code);
          setIsCrisisOpen(true);
        }}
      />

      {/* Emergency Crisis Helplines Modal tailored to Selected Country */}
      <CrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
        userCountry={userCountry}
        onSelectCountry={handleSelectCountry}
      />

      <TextChatModal
        isOpen={isTextChatOpen}
        onClose={() => setIsTextChatOpen(false)}
        onTriggerTool={handleTriggerChatTool}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tone={currentTone}
        onToneChange={setCurrentTone}
        onResetData={handleResetData}
        companionName={companionName}
        onOpenNamingModal={() => setIsNamingModalOpen(true)}
        userCountry={userCountry}
        onOpenCrisis={() => setIsCountryModalOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

      <SarvamSpeakingModal
        isOpen={isSarvamModalOpen}
        onClose={() => setIsSarvamModalOpen(false)}
        onAddMindfulMinutes={(mins) => handleSessionCompleted('sarvam-dialogue', mins)}
        companionName={companionName}
        onCompanionNameChange={setCompanionName}
      />

      <NamingCompanionModal
        isOpen={isNamingModalOpen}
        onClose={() => setIsNamingModalOpen(false)}
        initialName={companionName}
        initialVoice={companionVoice}
        onNameSaved={(name, voice) => {
          setCompanionName(name);
          setCompanionVoice(voice);
        }}
      />

      <IntroGuideModal
        isOpen={isIntroGuideOpen}
        onClose={() => setIsIntroGuideOpen(false)}
        companionName={companionName}
        onOpenNamingModal={() => setIsNamingModalOpen(true)}
        onOpenSarvam={() => setIsSarvamModalOpen(true)}
        userCountry={userCountry}
      />

      <AmbientSoundPanel
        isOpen={isAmbientPanelOpen}
        onClose={() => setIsAmbientPanelOpen(false)}
        currentSound={ambientSound}
        onSelectSound={handleSelectAmbientSound}
      />

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        companionName={companionName}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <SanctuaryApp />
    </LanguageProvider>
  );
}
