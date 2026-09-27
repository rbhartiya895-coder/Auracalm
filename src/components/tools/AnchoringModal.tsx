import React, { useState } from 'react';
import { X, Eye, Hand, Ear, Sparkles, Check, RotateCcw, Volume2 } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface AnchoringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnchoringModal: React.FC<AnchoringModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean[]>>({
    0: [false, false, false, false, false],
    1: [false, false, false, false],
    2: [false, false, false],
    3: [false, false],
    4: [false]
  });

  if (!isOpen) return null;

  const steps = [
    {
      count: 5,
      sense: 'SEE',
      icon: '👁️',
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      title: '5 Things You Can See',
      description: 'Look around you right now. Spot 5 distinct objects, colors, or patterns in your immediate space.',
      examples: ['A pattern on the wall', 'Light reflection', 'A pen or leaf', 'A shadow edge', 'Color of your shoes']
    },
    {
      count: 4,
      sense: 'TOUCH',
      icon: '✋',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      title: '4 Things You Can Physically Feel',
      description: 'Bring awareness to physical textures and tactile touch points supporting you.',
      examples: ['The fabric of your pants', 'Cool air on your wrists', 'Smooth table surface', 'Feet planted on the ground']
    },
    {
      count: 3,
      sense: 'HEAR',
      icon: '👂',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      title: '3 Things You Can Hear',
      description: 'Close your eyes for a moment and listen to subtle layers of ambient sound.',
      examples: ['Distant traffic or hum', 'Your own gentle breath', 'Clock ticking or birds outside']
    },
    {
      count: 2,
      sense: 'SMELL',
      icon: '👃',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      title: '2 Things You Can Smell',
      description: 'Notice scents in the air, or smell the sleeve of your sweater, hair, or cup of tea.',
      examples: ['Fresh air or rain', 'Coffee, tea, or skin scent']
    },
    {
      count: 1,
      sense: 'TASTE',
      icon: '👅',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      title: '1 Thing You Can Taste',
      description: 'Notice the lingering taste of water, mint, or simply swallow and notice the softness of your mouth.',
      examples: ['Lingering taste of fresh water or mint']
    }
  ];

  const current = steps[currentStep];

  const toggleCheck = (itemIdx: number) => {
    const list = [...checkedItems[currentStep]];
    list[itemIdx] = !list[itemIdx];
    setCheckedItems({
      ...checkedItems,
      [currentStep]: list
    });
    soundService.playChime(640 + itemIdx * 80, 0.4);
  };

  const handleNext = () => {
    soundService.playSingingBowl(240, 2);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all
      setCurrentStep(steps.length);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCheckedItems({
      0: [false, false, false, false, false],
      1: [false, false, false, false],
      2: [false, false, false],
      3: [false, false],
      4: [false]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-cyan-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-800">
              <Eye className="w-4 h-4 text-cyan-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">5-4-3-2-1 Sensory Anchoring</h2>
              <p className="text-xs text-slate-500">Trauma-informed cognitive sensory grounding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress pill indicator */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between gap-1.5">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-cyan-600 scale-y-125'
                  : idx < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {currentStep < steps.length ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{current.icon}</span>
                <div>
                  <div className="text-xs font-bold text-cyan-700 uppercase tracking-widest">
                    Step {currentStep + 1} of 5
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{current.title}</h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {current.description}
              </p>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tap each one as you identify it:
                </p>
                <div className="space-y-2">
                  {current.examples.map((ex, i) => {
                    const isDone = checkedItems[currentStep]?.[i];
                    return (
                      <button
                        key={i}
                        onClick={() => toggleCheck(i)}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isDone
                            ? 'bg-cyan-50/80 border-cyan-300 text-cyan-900 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                            {i + 1}
                          </span>
                          <span>{ex}</span>
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isDone ? 'bg-cyan-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Completed Sanctuary state
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
                🌿
              </div>
              <h3 className="text-xl font-bold text-slate-900">You Are Fully Grounded Here</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                You have brought your cortex and senses back into the present room. Your nervous system is recalibrated to the physical safety around you.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Again</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none"
          >
            ← Back
          </button>
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-800 rounded-xl shadow-xs transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Complete Grounding' : 'Next Sense →'}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
            >
              Finish & Return to Sanctuary
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
