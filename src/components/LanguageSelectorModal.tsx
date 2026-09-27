import React, { useState } from 'react';
import { X, Globe, Check, Search, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../types';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = supportedLanguages.filter((l) => {
    const q = searchTerm.toLowerCase().trim();
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q)
    );
  });

  const handleSelect = (code: Language) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-sans">
                {t('selectLanguageTitle', 'Select Sanctuary Language')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('selectLanguageSubtitle', 'Choose your preferred language for interface and voice')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchLanguage', 'Search language or country...')}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Language List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filteredLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/70 flex items-center justify-center text-xl shrink-0">
                    {lang.flag}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-900 transition-colors">
                        {lang.nativeName}
                      </span>
                      {lang.nativeName !== lang.name && (
                        <span className="text-xs text-slate-500 font-medium">
                          ({lang.name})
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {lang.region}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSelected ? (
                    <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('activeLanguage', 'Active')}</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-emerald-500 transition-colors" />
                  )}
                </div>
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No matching languages found for "{searchTerm}".
            </div>
          )}
        </div>

        {/* Footer info & Done */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t('switchLanguageNotice', 'All clinical tools update instantly.')}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0d6954] hover:bg-[#09473a] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {t('doneBtn', 'Done')}
          </button>
        </div>
      </div>
    </div>
  );
};
