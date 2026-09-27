import React, { useState, useRef } from 'react';
import { AlertTriangle, PhoneCall, Globe, ShieldCheck } from 'lucide-react';
import { getCountryCrisisData } from '../data/crisisHotlines';
import { storageService } from '../services/storageService';
import { useLanguage } from '../i18n/LanguageContext';

interface EmergencyHelpBannerProps {
  onTriggerEmergency: () => void;
  onOpenCountrySelect?: () => void;
  userCountry?: string;
}

export const EmergencyHelpBanner: React.FC<EmergencyHelpBannerProps> = ({
  onTriggerEmergency,
  onOpenCountrySelect,
  userCountry = 'in'
}) => {
  const { t } = useLanguage();
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const countryData = getCountryCrisisData(userCountry);
  const hasChosenCountry = storageService.hasSelectedCountry();

  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);

    const stepMs = 30; // update every 30ms
    const totalMs = 3000;
    const increment = (stepMs / totalMs) * 100;

    intervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev + increment >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsHolding(false);
          setHoldProgress(0);
          onTriggerEmergency();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);
  };

  const endHold = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-[#faf4f2] border border-[#edd5d1] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        {/* Left Section */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#f4e3e0] border border-[#e8cecb] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-[#8b433e]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-[#632925] font-sans">
                {t('immediateHelpQuestion', 'Need immediate crisis help?')}
              </h3>
              {/* Country Badge with Change Action */}
              <button
                type="button"
                onClick={onOpenCountrySelect || onTriggerEmergency}
                className="text-xs bg-[#f2e1de] hover:bg-[#ebd3cf] text-[#7a322e] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#e5c9c5]"
                title="Click to change your country"
              >
                <span>{countryData.flag}</span>
                <span>{countryData.name}</span>
                <span className="text-[10px] text-[#9c524c] font-normal underline">
                  {hasChosenCountry ? t('changeCountry', 'Change') : t('setCountry', 'Set Country')}
                </span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#8a524e] font-normal mt-0.5">
              {t('immediateHelpDesc', 'Hold the button for 3 seconds to access 24/7 verified emergency lifelines.')} (<strong className="font-semibold text-[#662824]">{countryData.primaryCrisisName} - {countryData.primaryCrisisNumber}</strong>)
            </p>
          </div>
        </div>

        {/* Right Section: Country Switcher & Hold Button */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {onOpenCountrySelect && (
            <button
              onClick={onOpenCountrySelect}
              className="px-3 py-3 text-xs font-semibold text-[#7c3732] hover:text-[#521e1a] bg-white hover:bg-[#faeeec] border border-[#ebd0cc] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Change your country for emergency services"
            >
              <Globe className="w-3.5 h-3.5 text-[#914641]" />
              <span className="hidden sm:inline">{t('changeCountry', 'Country')}:</span>
              <span>{countryData.flag}</span>
            </button>
          )}

          <div className="relative overflow-hidden rounded-xl shrink-0 flex-1 sm:flex-initial">
            <button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              className="relative overflow-hidden flex items-center gap-2.5 bg-[#8b433e] hover:bg-[#783733] active:bg-[#632925] text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all select-none cursor-pointer w-full justify-center"
            >
              {/* Progress Fill bar */}
              {isHolding && (
                <div
                  className="absolute inset-0 bg-[#531f1c]/40 transition-all pointer-events-none"
                  style={{ width: `${holdProgress}%` }}
                />
              )}
              <PhoneCall className="w-4 h-4 text-white relative z-10 shrink-0" />
              <span className="relative z-10">
                {isHolding
                  ? `Holding... ${Math.round((holdProgress / 100) * 3)}s / 3s`
                  : `${t('holdToCall', 'Hold 3s to Call')} (${countryData.primaryCrisisNumber})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
