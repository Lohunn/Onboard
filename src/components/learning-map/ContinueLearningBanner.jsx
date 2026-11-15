import React from 'react';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

export default function ContinueLearningBanner({
  activeModule,
  activeLesson,
  totalLessons = 21,
  completedCount = 2,
  onContinue,
}) {
  const percentage = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="rounded-[11px] bg-[#FAF4E9] border-2 border-[#2A56A3] p-6 sm:p-8 mb-12 shadow-sm relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#2A56A3]/5 pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-[5px] bg-[#2A56A3] text-white text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider">
              Continue Learning
            </span>
            <span className="text-xs font-['Barlow_Semi_Condensed'] font-semibold text-[#C0652D]">
              {activeModule?.title || 'Module in Progress'}
            </span>
          </div>

          <h2 className="font-['Barlow_Semi_Condensed'] text-2xl sm:text-3xl font-bold text-[#18213D] tracking-tight">
            Next: {activeLesson?.title || 'Getting Started'}
          </h2>

          <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed">
            {activeLesson?.summary || 'Pick up right where you left off. Every concept builds toward your first physical microcontroller project.'}
          </p>

          <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono'] text-[#5C6066]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2A56A3]" />
              {activeLesson?.durationMinutes || 5} min read & build
            </span>
            <span className="flex items-center gap-1.5 font-bold text-[#2A56A3]">
              <Zap className="w-3.5 h-3.5 fill-current" />
              +{activeLesson?.xpReward || 20} XP
            </span>
          </div>
        </div>

        {/* Action Button & Overall Progress */}
        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
          <button
            onClick={() => onContinue(activeLesson, activeModule)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[9px] bg-[#18213D] hover:bg-[#2A56A3] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-base shadow-sm transition-all group cursor-pointer"
          >
            <span>Resume Lesson</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="w-full sm:w-56 space-y-1">
            <div className="flex justify-between text-xs font-['Barlow_Semi_Condensed'] font-semibold text-[#5C6066]">
              <span>Zero-to-ESP32 Progress</span>
              <span className="font-['JetBrains_Mono']">{percentage}%</span>
            </div>
            <ProgressBar value={completedCount} max={totalLessons} variant="blue" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
