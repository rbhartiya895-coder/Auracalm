import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES, LanguageOption, TranslationKey, getTranslation } from './translations';
import { storageService } from '../services/storageService';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  currentLanguage: LanguageOption;
  supportedLanguages: LanguageOption[];
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  openLanguageSelector: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = storageService.getLanguage();
    const valid = SUPPORTED_LANGUAGES.some((l) => l.code === saved);
    return valid ? (saved as Language) : 'en';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const handleSetLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    storageService.setLanguage(newLang);
    // Update html lang attribute for accessibility & browser rendering
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: TranslationKey, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        openLanguageSelector: () => setIsLanguageModalOpen(true)
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
