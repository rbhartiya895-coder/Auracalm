import React, { useState, useEffect } from 'react';
import {
  X,
  PhoneCall,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Globe,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  ArrowRight
} from 'lucide-react';
import { COUNTRIES_CRISIS_DATA, getCountryCrisisData, CountryCrisisData } from '../data/crisisHotlines';
import { storageService } from '../services/storageService';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCountry: string;
  onSelectCountry: (countryCode: string) => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  isOpen,
  onClose,
  userCountry,
  onSelectCountry
}) => {
  // If user has not explicitly confirmed a country yet, show country selection first
  const [isChangingCountry, setIsChangingCountry] = useState<boolean>(() => !storageService.hasSelectedCountry());
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Whenever modal opens, if user hasn't selected country yet, show country step
  useEffect(() => {
    if (isOpen && !storageService.hasSelectedCountry()) {
      setIsChangingCountry(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCountryData: CountryCrisisData = getCountryCrisisData(userCountry);

  const handleCountryPick = (code: string) => {
    onSelectCountry(code);
    storageService.setUserCountry(code);
    setIsChangingCountry(false);
  };

  const countriesList = Object.values(COUNTRIES_CRISIS_DATA).filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-rose-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              {currentCountryData.flag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">Emergency & Crisis Helplines</h2>
                <span className="text-[10px] font-bold bg-white/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  24/7 FREE
                </span>
              </div>
              <p className="text-xs text-rose-100">
                You do not have to carry this alone. Confidential, compassionate help is here.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Country Selector Sub-Bar */}
        <div className="px-5 sm:px-6 py-2.5 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Support Region:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>{currentCountryData.flag}</span>
              <span>{currentCountryData.name}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsChangingCountry(!isChangingCountry)}
            className="px-2.5 py-1 text-xs font-bold text-rose-800 hover:text-rose-950 bg-white hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5 text-rose-700" />
            <span>{isChangingCountry ? 'View Current Details' : 'Change Country'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* STEP 1: Country Selection View (Shown first if not selected or if user clicks Change Country) */}
          {isChangingCountry ? (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded-full">
                    Step 1
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Select Your Country for Local Helplines
                  </h3>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  First enter or select your country below. All crisis phone numbers, emergency dispatch lines, and language support will immediately adjust to your location.
                </p>
              </div>

              {/* Quick Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type country name (e.g. India, United States, UK, Canada...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400 transition-all"
                  autoFocus
                />
              </div>

              {/* Quick Popular Country Buttons */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Frequently Selected:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'in', label: 'India', flag: '🇮🇳', sub: 'Tele-MANAS (14416)' },
                    { id: 'us', label: 'United States', flag: '🇺🇸', sub: '988 Lifeline' },
                    { id: 'uk', label: 'United Kingdom', flag: '🇬🇧', sub: '111 NHS' },
                    { id: 'ca', label: 'Canada', flag: '🇨🇦', sub: '988 Canada' },
                    { id: 'au', label: 'Australia', flag: '🇦🇺', sub: '13 11 14 Lifeline' },
                    { id: 'ae', label: 'UAE', flag: '🇦🇪', sub: '800 HOPE' },
                    { id: 'sg', label: 'Singapore', flag: '🇸🇬', sub: '1767 SOS' }
                  ].map((p) => {
                    const isSelected = userCountry === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleCountryPick(p.id)}
                        className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs scale-102'
                            : 'bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-900 border-slate-200'
                        }`}
                      >
                        <span className="text-lg">{p.flag}</span>
                        <div>
                          <span className="block font-bold text-xs leading-none">{p.label}</span>
                          <span className={`text-[10px] block leading-tight mt-0.5 ${isSelected ? 'text-rose-100' : 'text-slate-500'}`}>
                            {p.sub}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* All Countries Grid */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  All Supported Countries ({countriesList.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-[38vh] overflow-y-auto pr-1">
                  {countriesList.map((country) => {
                    const isSelected = userCountry === country.id;
                    return (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => handleCountryPick(country.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs ring-1 ring-rose-400/40'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl shrink-0">{country.flag}</span>
                          <div className="min-w-0">
                            <span className="block font-bold text-xs truncate">{country.name}</span>
                            <span className="text-[11px] text-slate-500 block truncate">
                              {country.primaryCrisisName} ({country.primaryCrisisNumber})
                            </span>
                          </div>
                        </div>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 2: Helpline Details for Selected Country */}
              {/* Primary Quick Emergency Action Banner */}
              <div className="bg-gradient-to-br from-rose-50 via-red-50/60 to-rose-100/50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-xs">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-rose-950">
                      {currentCountryData.primaryCrisisName}
                    </span>
                    <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      24/7 TOLL-FREE
                    </span>
                  </div>
                  <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                    {currentCountryData.description}
                  </p>
                </div>
                <a
                  href={`tel:${currentCountryData.primaryCrisisNumber.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-98 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md shadow-red-600/30 transition-all shrink-0 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>{currentCountryData.callButtonText} Now</span>
                </a>
              </div>

              {/* Special Verified Indian Government Tele-MANAS Highlight (If country is India) */}
              {userCountry === 'in' && (
                <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl shrink-0">🇮🇳</span>
                    <div>
                      <h4 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                        <span>Govt. of India Tele-MANAS Short Code: 14416</span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-semibold">
                          Official
                        </span>
                      </h4>
                      <p className="text-[11px] text-amber-900/90 leading-snug">
                        Dial <strong>14416</strong> or <strong>1800-891-4416</strong> free of charge from any mobile operator (Jio, Airtel, Vi, BSNL) or landline across India. Supported in 20+ regional Indian languages and overseen by NIMHANS Bengaluru.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Helplines List for Country */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Verified Support Helplines for {currentCountryData.name}:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {currentCountryData.hotlines.length} Verified Services
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentCountryData.hotlines.map((h, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-rose-300 hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{h.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            h.type === 'emergency'
                              ? 'bg-red-100 text-red-800'
                              : h.type === 'ngo'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {h.available}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{h.desc}</p>
                        {h.languages && (
                          <p className="text-[10px] text-slate-500 font-medium">
                            Languages: {h.languages}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                        <a
                          href={h.phone}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{h.numberDisplay}</span>
                        </a>

                        {/* Direct WhatsApp link for Vandrevala Foundation in India */}
                        {h.numberDisplay.includes('9999 666 555') && (
                          <a
                            href="https://wa.me/919999666555?text=Hello%20I%20need%20mental%20health%20support"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 flex items-center gap-1 transition-all cursor-pointer"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acute Somatic Vagal Grounding Protocol */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Right Now: Physical Mammalian Dive Reflex</span>
                </h4>
                <ul className="text-xs text-emerald-950/80 space-y-1.5 list-disc list-inside">
                  <li>Splash cold water on your face or hold an ice cube in your palm to immediately stimulate the vagus nerve.</li>
                  <li>Press both feet firmly against the solid floor. Feel the floor holding you up safely.</li>
                  <li>Take two quick sips of air through your nose, then a long, slow sigh out through your mouth.</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Location: <strong className="text-slate-800">{currentCountryData.name}</strong></span>
            <span>•</span>
            <button
              onClick={() => setIsChangingCountry(true)}
              className="text-rose-700 font-semibold hover:underline cursor-pointer"
            >
              Switch Country
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-xl cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
