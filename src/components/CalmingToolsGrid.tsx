import React from 'react';
import { FileText, Eye, ChevronRight, Activity, Waves } from 'lucide-react';

interface CalmingToolsGridProps {
  onOpenMoodLog: () => void;
  onOpenAnchoring: () => void;
  onOpenButterfly: () => void;
  onOpenVagalHum: () => void;
}

export const CalmingToolsGrid: React.FC<CalmingToolsGridProps> = ({
  onOpenMoodLog,
  onOpenAnchoring,
  onOpenButterfly,
  onOpenVagalHum
}) => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-6">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a2d25] font-sans tracking-tight">
          Calming Tools
        </h2>
        <p className="text-xs sm:text-sm text-[#556f62] font-normal">
          Try these anytime to feel more grounded.
        </p>
      </div>

      {/* 4 Cards Grid with Calm Muted Distinct Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tool 1: Daily Mood Log - Muted Sage */}
        <button
          onClick={onOpenMoodLog}
          className="group text-left bg-[#fbfdfc] hover:bg-[#f5f9f6] border border-[#d2e2d8] hover:border-[#a8cab5] rounded-2xl p-4 transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#eaf3ed] border border-[#d0e4d7] flex items-center justify-center text-[#255242] shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-[#2b5949]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-[#1b2f27] group-hover:text-[#11241d] transition-colors truncate">
                Daily Mood Log
              </h3>
              <p className="text-[11px] sm:text-xs text-[#597568] truncate">
                Track your feelings
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8ca398] group-hover:text-[#2b5949] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
        </button>

        {/* Tool 2: 5-4-3-2-1 Anchoring - Muted Ocean Slate */}
        <button
          onClick={onOpenAnchoring}
          className="group text-left bg-[#fcfdfe] hover:bg-[#f4f8fa] border border-[#cedfe4] hover:border-[#9ec1cc] rounded-2xl p-4 transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#e6f0f3] border border-[#cbdee3] flex items-center justify-center text-[#285763] shrink-0 group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5 text-[#285763]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-[#1a2f36] group-hover:text-[#0e1f24] transition-colors truncate">
                5-4-3-2-1 Anchoring
              </h3>
              <p className="text-[11px] sm:text-xs text-[#52737c] truncate">
                Ground yourself now
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#89a6af] group-hover:text-[#285763] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
        </button>

        {/* Tool 3: Butterfly Taps - Muted Dusty Rose */}
        <button
          onClick={onOpenButterfly}
          className="group text-left bg-[#fdfcfc] hover:bg-[#fbf5f4] border border-[#e8d5d2] hover:border-[#cfa7a2] rounded-2xl p-4 transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#f5e7e5] border border-[#ebd2ce] flex items-center justify-center text-[#7e4742] shrink-0 group-hover:scale-105 transition-transform">
              {/* Butterfly SVG */}
              <svg className="w-5 h-5 text-[#7e4742]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v16" />
                <path d="M12 4c-3-2-7 0-7 4 0 3 4 5 7 5" />
                <path d="M12 4c3-2 7 0 7 4 0 3-4 5-7 5" />
                <path d="M12 13c-3 0-6 2-6 5 0 2 3 3 6 1" />
                <path d="M12 13c3 0 6 2 6 5 0 2-3 3-6 1" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-[#351e1c] group-hover:text-[#200f0e] transition-colors truncate">
                Butterfly Taps
              </h3>
              <p className="text-[11px] sm:text-xs text-[#7c5b57] truncate">
                Reduce stress
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#af8e8a] group-hover:text-[#7e4742] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
        </button>

        {/* Tool 4: Vagal Hum - Muted Twilight Lavender */}
        <button
          onClick={onOpenVagalHum}
          className="group text-left bg-[#fdfcfd] hover:bg-[#f6f4fa] border border-[#ded7e8] hover:border-[#b7aaca] rounded-2xl p-4 transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#ece7f5] border border-[#dbd3e7] flex items-center justify-center text-[#554770] shrink-0 group-hover:scale-105 transition-transform">
              <Waves className="w-5 h-5 text-[#554770]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-[#282036] group-hover:text-[#181122] transition-colors truncate">
                Vagal Hum
              </h3>
              <p className="text-[11px] sm:text-xs text-[#6a5e80] truncate">
                Activate calm
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9c90b0] group-hover:text-[#554770] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
        </button>
      </div>
    </section>
  );
};
