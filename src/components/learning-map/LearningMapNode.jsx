import React from 'react';
import {
  Lock,
  Check,
  Clock,
  Sparkles,
  Zap,
  Layers,
  Cpu,
  Lightbulb,
  Square,
  Sliders,
  Activity,
  AlertCircle,
  Award,
  ShieldCheck,
} from 'lucide-react';

const ICON_MAP = {
  Sparkles,
  Zap,
  Layers,
  Cpu,
  Lightbulb,
  Square,
  Sliders,
  Activity,
  AlertCircle,
  Award,
  ShieldCheck,
};

/**
 * Duolingo-style Learning Map Node.
 * States: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered'
 */
export default function LearningMapNode({
  module,
  state = 'locked',
  onSelect,
  isCurrent = false,
  totalLessons = 2,
  completedCount = 0,
}) {
  const IconComponent = ICON_MAP[module.icon] || Sparkles;

  const stateStyles = {
    locked: {
      bg: 'bg-[#E3D8CA]',
      border: 'border-[#CEC0AD]',
      text: 'text-[#AAA59D]',
      badge: 'bg-[#D6C7B3] text-[#5C6066]',
      badgeText: 'Locked',
      icon: <Lock className="w-5 h-5 text-[#AAA59D]" />,
    },
    available: {
      bg: 'bg-[#FAF4E9]',
      border: 'border-[#2A56A3]',
      text: 'text-[#18213D]',
      badge: 'bg-[#2A56A3] text-white animate-pulse',
      badgeText: 'Start Next',
      icon: <IconComponent className="w-6 h-6 text-[#2A56A3]" />,
    },
    in_progress: {
      bg: 'bg-[#FAF4E9]',
      border: 'border-[#C0652D]',
      text: 'text-[#18213D]',
      badge: 'bg-[#C0652D] text-white',
      badgeText: `${completedCount}/${totalLessons} Done`,
      icon: <IconComponent className="w-6 h-6 text-[#C0652D]" />,
    },
    completed: {
      bg: 'bg-[#FAF4E9]',
      border: 'border-[#057A55]',
      text: 'text-[#18213D]',
      badge: 'bg-[#057A55] text-white',
      badgeText: 'Completed',
      icon: <Check className="w-6 h-6 text-[#057A55] stroke-[3]" />,
    },
    mastered: {
      bg: 'bg-[#FAF4E9]',
      border: 'border-[#D97706]',
      text: 'text-[#18213D]',
      badge: 'bg-[#D97706] text-white',
      badgeText: 'Mastered',
      icon: <Award className="w-6 h-6 text-[#D97706]" />,
    },
  };

  const style = stateStyles[state] || stateStyles.locked;

  return (
    <div className="flex flex-col items-center my-4 group relative">
      {/* Node Button */}
      <button
        onClick={() => onSelect(module)}
        aria-label={`${module.title} (${state})`}
        className={`relative w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-200 shadow-md ${
          style.bg
        } ${style.border} ${
          isCurrent ? 'ring-4 ring-[#2A56A3]/30 scale-105' : ''
        } hover:scale-105 active:scale-95 cursor-pointer`}
      >
        {style.icon}

        {/* Status Mini Pill Badge */}
        <span
          className={`absolute -bottom-2.5 px-2 py-0.5 rounded-full text-[10px] font-['Barlow_Semi_Condensed'] font-bold tracking-wider uppercase shadow-xs whitespace-nowrap ${style.badge}`}
        >
          {style.badgeText}
        </span>
      </button>

      {/* Module Title Label */}
      <div className="mt-4 text-center max-w-[180px]">
        <div className="font-['Barlow_Semi_Condensed'] text-sm font-bold text-[#18213D] leading-tight group-hover:text-[#2A56A3] transition-colors">
          {module.title}
        </div>
        <div className="text-[11px] font-['Barlow'] text-[#5C6066] mt-0.5 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{module.lessons.reduce((acc, l) => acc + l.durationMinutes, 0)} min</span>
        </div>
      </div>
    </div>
  );
}
