import React from 'react';
import { RotateCcw, Eye, Waves, Wind, Heart, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';

interface SomaticToolsViewProps {
  onOpenSigh: () => void;
  onOpenAnchoring: () => void;
  onOpenButterfly: () => void;
  onOpenVagalHum: () => void;
  onOpenBreathingSphere: () => void;
}

export const SomaticToolsView: React.FC<SomaticToolsViewProps> = ({
  onOpenSigh,
  onOpenAnchoring,
  onOpenButterfly,
  onOpenVagalHum,
  onOpenBreathingSphere
}) => {
  const tools = [
    {
      id: 'sigh',
      title: 'Physiological Sigh Reset',
      subtitle: 'Stanford Neurobiology Immediate Reset',
      description: 'Two quick inhales through the nose pop open collapsed alveoli; the prolonged exhale discharges CO2 and triggers the parasympathetic brake within 30 seconds.',
      icon: <RotateCcw className="w-6 h-6 text-teal-700" />,
      badge: 'Acute Panic & Racing Pulse',
      color: 'border-teal-200 bg-teal-50/50 hover:border-teal-400',
      action: onOpenSigh
    },
    {
      id: 'anchoring',
      title: '5-4-3-2-1 Sensory Anchoring',
      subtitle: 'Cortex Re-orientation Protocol',
      description: 'Engages all 5 sensory pathways (Sight, Touch, Sound, Smell, Taste) to ground awareness in present reality and dismantle cognitive rumination spirals.',
      icon: <Eye className="w-6 h-6 text-cyan-700" />,
      badge: 'Dissociation & Overwhelm',
      color: 'border-cyan-200 bg-cyan-50/50 hover:border-cyan-400',
      action: onOpenAnchoring
    },
    {
      id: 'butterfly',
      title: 'Butterfly Taps (EMDR)',
      subtitle: 'Bilateral Somatosensory Stimulation',
      description: 'Rhythmic alternating physical taps across collarbones decrease amygdala hyperactivation and help integrate overwhelming somatic emotion.',
      icon: (
        <svg className="w-6 h-6 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4v16" />
          <path d="M12 4c-3-2-7 0-7 4 0 3 4 5 7 5" />
          <path d="M12 4c3-2 7 0 7 4 0 3-4 5-7 5" />
        </svg>
      ),
      badge: 'Emotional Shock & Grief',
      color: 'border-rose-200 bg-rose-50/50 hover:border-rose-400',
      action: onOpenButterfly
    },
    {
      id: 'vagal',
      title: 'Vagal Hum Resonance (~130Hz)',
      subtitle: 'Cranial Nerve X Vocal Cord Activation',
      description: 'Sustained low baritone vocal humming on the exhalation creates direct physical acoustic vibration along the internal carotid sheath, boosting HRV.',
      icon: <Waves className="w-6 h-6 text-purple-700" />,
      badge: 'Hypervigilance & Muscle Clench',
      color: 'border-purple-200 bg-purple-50/50 hover:border-purple-400',
      action: onOpenVagalHum
    },
    {
      id: 'pacer',
      title: 'HRV Coherence Breathing Sphere',
      subtitle: 'Cardiorespiratory Synchronization',
      description: 'Visual biofeedback expanding orb to harmonize heart rate variability with respiratory sinus arrhythmia at 5.5 to 6 breaths per minute.',
      icon: <Wind className="w-6 h-6 text-emerald-700" />,
      badge: 'Anxiety & High Blood Pressure',
      color: 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-400',
      action: onOpenBreathingSphere
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
            Clinical Somatosensory Toolbox
          </span>
          <span className="text-xs text-slate-500">• Polyvagal & EMDR Protocols</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Somatic Nervous System Calming Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          When talking or reasoning fails, target the autonomic nervous system through body-first physical mechanisms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((t) => (
          <div
            key={t.id}
            onClick={t.action}
            className={`p-6 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${t.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {t.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-white/80 border border-slate-200 px-2.5 py-1 rounded-lg">
                  {t.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {t.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mb-2">
                {t.subtitle}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Launch Tool</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
