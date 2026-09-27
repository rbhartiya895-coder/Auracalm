import React, { useState } from 'react';
import { X, Sparkles, Wind, Volume2, ShieldCheck, Heart, ArrowRight, ArrowLeft, Check, Music } from 'lucide-react';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';
import { getCountryCrisisData } from '../data/crisisHotlines';

interface IntroGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  companionName: string;
  onOpenNamingModal: () => void;
  onOpenSarvam: () => void;
  userCountry?: string;
}

export const IntroGuideModal: React.FC<IntroGuideModalProps> = ({
  isOpen,
  onClose,
  companionName,
  onOpenNamingModal,
  onOpenSarvam,
  userCountry = 'in'
}) => {
  const [step, setStep] = useState<number>(0);
  const countryData = getCountryCrisisData(userCountry);

  if (!isOpen) return null;

  const handleFinish = () => {
    storageService.setSeenIntroGuide(true);
    soundService.playSingingBowl(216, 2.0);
    onClose();
  };

  const handlePersonalizeNow = () => {
    storageService.setSeenIntroGuide(true);
    onClose();
    onOpenNamingModal();
  };

  const steps = [
    {
      badge: 'Step 1 of 4 • Companion',
      title: `Meet Your Personal Guide, ${companionName}`,
      tagline: 'Powered by Sarvam AI Neural Speech Models',
      icon: '🌸',
      description:
        `AuraCalm provides a deeply compassionate, human-sounding voice companion named ${companionName}. She speaks gently to ground your nervous system during panic, stress, insomnia, or emotional overload.`,
      features: [
        'Pure neural speech synthesis with warm natural cadence',
        'Customizable: Choose from 6 neural voices (Kavya, Simran, Pooja, etc.)',
        'Name your guide whatever brings you the greatest peace and comfort'
      ],
      tip: 'You can tap "Name Model" anytime in the header to change her name or voice.'
    },
    {
      badge: 'Step 2 of 4 • Somatic Science',
      title: 'Evidence-Based Nervous System Relief',
      tagline: 'Rapid autonomic down-regulation in under 60 seconds',
      icon: '🫁',
      description:
        'When anxiety spikes, logic shuts down. AuraCalm gives you immediate physical grounding tools recommended by somatic therapists and neurobiologists:',
      features: [
        'Physiological Sigh Reset: Two quick inhales + long exhale to pop open alveoli',
        '4-7-8 Breathing Sphere: Deep vagus nerve stimulation for sleep and rest',
        'EMDR Butterfly Taps: Bilateral alternating audio stimulation',
        '5-4-3-2-1 Anchoring: Re-engages your sensory prefrontal cortex'
      ],
      tip: 'The center circular button on the home screen starts instant guided breathing.'
    },
    {
      badge: 'Step 3 of 4 • Soundscapes',
      title: 'Soothing Procedural Audio & Instruments',
      tagline: 'Client-side synthesized relaxation with custom volume',
      icon: '🪈',
      description:
        'Immerse yourself in gentle soundscapes designed to quiet intrusive thoughts without overwhelming your senses:',
      features: [
        'Indian Bansuri Bamboo Flute: Meditative melodic raga notes with warm drone',
        'Dawn Songbirds: Sweet randomized forest whistles and natural warbles',
        'Night Insects & Crickets: Calming rhythmic twilight ambiance',
        'Gentle Rain, Ocean Waves, 432Hz Theta waves & Tibetan Singing Bowls'
      ],
      tip: 'Tap the "Soundscape" button in the top bar to adjust volume or switch sounds.'
    },
    {
      badge: 'Step 4 of 4 • Privacy & Safety',
      title: '100% Private, On-Device & Safe',
      tagline: `Zero tracking • No account required • Direct ${countryData.primaryCrisisNumber} Helpline (${countryData.name})`,
      icon: '🛡️',
      description:
        'Your mental wellness is deeply personal. AuraCalm is built with absolute respect for your dignity and privacy:',
      features: [
        'Zero tracking: All audio synthesis and journal notes stay on your browser',
        'Anonymous: No login, no password, no email required',
        `Country-Adapted Crisis Support: 1-tap direct access to ${countryData.primaryCrisisName} (${countryData.primaryCrisisNumber}) and 24/7 verified lifelines for ${countryData.name}`,
        'Change Country Anytime: Freely switch between India (Tele-MANAS 14416), US (988), UK (111), and global lifelines',
        'Offline capability: Works smoothly without interruption'
      ],
      tip: `Your sanctuary is always here whenever you need a peaceful breath. In emergencies, tap "${countryData.callButtonText}" at any time.`
    }
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-[#0e1715]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#1b2b25] to-[#121c18] border border-[#3b554b] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-[#e4eae6]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#2d4239] bg-[#16241f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{current.icon}</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#86cca8] block">
                {current.badge}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-[#f0f4f1] tracking-tight">
                Sanctuary Introductory Guide
              </h2>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="p-1.5 text-[#889d93] hover:text-white hover:bg-[#263a31] rounded-full transition-colors cursor-pointer"
            title="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Main Step Headline & Tagline */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#f3f7f4] tracking-tight leading-snug">
              {current.title}
            </h3>
            <p className="text-xs text-[#86cca8] font-medium mt-0.5">
              {current.tagline}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#b8cbbf] leading-relaxed">
            {current.description}
          </p>

          {/* Bullet points */}
          <div className="space-y-2 bg-[#16231e] border border-[#283d33] rounded-2xl p-3.5">
            {current.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#d2ded7]">
                <div className="w-4 h-4 rounded-full bg-[#234235] border border-[#386150] flex items-center justify-center shrink-0 mt-0.5 text-[#86cca8]">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Helpful Tip Box */}
          <div className="p-3 bg-[#1e332a]/60 border border-[#375a4b] rounded-xl flex items-center gap-2.5 text-xs text-[#a9c9b8]">
            <Sparkles className="w-4 h-4 text-[#d9c79f] shrink-0" />
            <span><strong>Quick tip:</strong> {current.tip}</span>
          </div>

          {/* If step 0: Provide instant companion naming trigger */}
          {step === 0 && (
            <div className="pt-1 flex items-center justify-between bg-[#192b23] border border-[#314e40] rounded-xl p-3">
              <div className="text-xs">
                <span className="font-semibold text-white block">Want to customize {companionName}?</span>
                <span className="text-[11px] text-[#8ea499]">Change her name or pick a different voice model</span>
              </div>
              <button
                type="button"
                onClick={handlePersonalizeNow}
                className="px-3 py-1.5 bg-[#295444] hover:bg-[#346b57] text-[#e8f5ee] rounded-lg text-xs font-semibold cursor-pointer border border-[#447862] transition-colors"
              >
                Customize Now ✏️
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation */}
        <div className="px-6 py-4 bg-[#14201b] border-t border-[#2d4239] flex items-center justify-between gap-3">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  step === i ? 'w-6 bg-[#86cca8]' : 'w-2 bg-[#2a4036] hover:bg-[#3d5c4e]'
                }`}
                title={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-3 py-2 text-xs font-semibold text-[#a5bbb0] hover:text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-[#264e3f] hover:bg-[#31624f] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-[#3d705c] shadow-xs"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2.5 bg-[#2d624f] hover:bg-[#397a63] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#163327]/50 flex items-center gap-2 cursor-pointer transition-all border border-[#488d74]"
              >
                <Sparkles className="w-4 h-4 text-[#ded29b]" />
                <span>Begin Sanctuary</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
