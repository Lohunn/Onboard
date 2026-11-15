import React from 'react';
import { Lightbulb, AlertTriangle, Info, BookOpen } from 'lucide-react';

export default function CalloutBlock({ tone = 'tip', title, text }) {
  const tones = {
    tip: {
      bg: 'bg-[#2A56A3]/10',
      border: 'border-[#2A56A3]',
      icon: <Lightbulb className="w-5 h-5 text-[#2A56A3]" />,
      titleColor: 'text-[#2A56A3]',
    },
    warning: {
      bg: 'bg-[#C0652D]/10',
      border: 'border-[#C0652D]',
      icon: <AlertTriangle className="w-5 h-5 text-[#C0652D]" />,
      titleColor: 'text-[#C0652D]',
    },
    concept: {
      bg: 'bg-[#057A55]/10',
      border: 'border-[#057A55]',
      icon: <BookOpen className="w-5 h-5 text-[#057A55]" />,
      titleColor: 'text-[#057A55]',
    },
    note: {
      bg: 'bg-[#E3D8CA]',
      border: 'border-[#18213D]',
      icon: <Info className="w-5 h-5 text-[#18213D]" />,
      titleColor: 'text-[#18213D]',
    },
  };

  const style = tones[tone] || tones.tip;

  return (
    <div
      role="region"
      aria-label={title || 'Note'}
      className={`p-4 rounded-[7px] border-l-4 ${style.bg} ${style.border} my-4 flex items-start gap-3`}
    >
      <div className="shrink-0 mt-0.5">{style.icon}</div>
      <div className="space-y-1">
        {title && (
          <div className={`font-['Barlow_Semi_Condensed'] text-sm font-bold uppercase tracking-wider ${style.titleColor}`}>
            {title}
          </div>
        )}
        <p className="font-['Barlow'] text-sm text-[#18213D] leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
