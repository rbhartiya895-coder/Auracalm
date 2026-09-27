import React, { useState } from 'react';
import { X, Globe, Check, Search, ShieldCheck, PhoneCall, Sparkles, ArrowRight } from 'lucide-react';
import { COUNTRIES_CRISIS_DATA, CountryCrisisData, getCountryCrisisData } from '../data/crisisHotlines';
import { storageService } from '../services/storageService';

interface CountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: string;
  onSelectCountry: (countryCode: string) => void;
  // Optional flag: if true, user must pick a country before closing (e.g. first-time crisis access)
  requiredFirstSelection?: boolean;
}

export const CountrySelectorModal: React.FC<CountrySelectorModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  onSelectCountry,
  requiredFirstSelection = false
}) => {
  const [selectedCode, setSelectedCode] = useState<string>(currentCountry || storageService.getUserCountry() || 'in');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = (codeToSave?: string) => {
    const finalCode = codeToSave || selectedCode;
    storageService.setUserCountry(finalCode);
    onSelectCountry(finalCode);
    onClose();
  };

  const allCountries = Object.values(COUNTRIES_CRISIS_DATA);
  const filteredCountries = allCountries.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.shortLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCountryData: CountryCrisisData = getCountryCrisisData(selectedCode);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-rose-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">Select Your Country</h2>
                <span className="text-[10px] font-bold bg-white/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Local Support
                </span>
              </div>
              <p className="text-xs text-rose-100">
                All crisis numbers & emergency services will adapt to your country.
              </p>
            </div>
          </div>
          {!requiredFirstSelection && (
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Informative Sub-banner */}
        <div className="px-5 sm:px-6 py-3 bg-rose-50/80 border-b border-rose-100 flex items-center gap-2.5 text-xs text-rose-950">
          <ShieldCheck className="w-4 h-4 text-rose-700 shrink-0" />
          <span>
            Please select your location so we can provide real, verified 24/7 toll-free crisis lines and local emergency dispatch.
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by country name (e.g. India, United States, UK...)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400 transition-all"
              autoFocus
            />
          </div>

          {/* Quick Popular Country Pills */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Popular Regions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'in', label: 'India', flag: '🇮🇳' },
                { id: 'us', label: 'United States', flag: '🇺🇸' },
                { id: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
                { id: 'ca', label: 'Canada', flag: '🇨🇦' },
                { id: 'au', label: 'Australia', flag: '🇦🇺' },
                { id: 'ae', label: 'UAE', flag: '🇦🇪' },
                { id: 'sg', label: 'Singapore', flag: '🇸🇬' },
                { id: 'de', label: 'Germany', flag: '🇩🇪' }
              ].map((p) => {
                const isCurrent = selectedCode === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedCode(p.id);
                      handleConfirm(p.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs scale-102'
                        : 'bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-900 border-slate-200'
                    }`}
                  >
                    <span>{p.flag}</span>
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country Selection List */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              All Available Countries ({filteredCountries.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredCountries.map((c) => {
                const isSelected = selectedCode === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCode(c.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-rose-50/90 border-rose-400 text-rose-950 font-bold shadow-xs ring-1 ring-rose-400/40'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl shrink-0">{c.flag}</span>
                      <div className="min-w-0">
                        <span className="block font-bold text-xs truncate">{c.name}</span>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {c.primaryCrisisName} ({c.primaryCrisisNumber})
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Selection Preview Card */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50/40 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeCountryData.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{activeCountryData.name}</span>
                  <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                    Selected
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Helpline: <strong className="text-rose-900">{activeCountryData.primaryCrisisName}</strong> (Toll-Free: {activeCountryData.primaryCrisisNumber})
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <a
                href={`tel:${activeCountryData.primaryCrisisNumber.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-2xs transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Test Call</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-[11px] text-slate-500">
            Selected: <strong className="text-slate-800">{activeCountryData.name}</strong> ({activeCountryData.primaryCrisisNumber})
          </span>
          <button
            type="button"
            onClick={() => handleConfirm()}
            className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Confirm & View Helplines</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
