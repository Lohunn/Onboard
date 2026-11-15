import React, { useState } from 'react';
import { Eye, ChevronRight } from 'lucide-react';

export default function HotspotBlock({ title, description, items = [] }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="my-6 p-5 rounded-[9px] bg-[#F9F2E5] border border-[#CEC0AD]">
      {title && (
        <div className="font-['Barlow_Semi_Condensed'] text-base font-bold text-[#18213D] mb-1 flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#2A56A3]" />
          {title}
        </div>
      )}
      {description && (
        <p className="font-['Barlow'] text-xs text-[#5C6066] mb-4">{description}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Item Pills List */}
        <div className="sm:col-span-5 space-y-1.5">
          {items.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full text-left p-2.5 rounded-[6px] border text-xs font-['Barlow_Semi_Condensed'] font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#18213D] text-[#FAF4E9] border-[#18213D] shadow-xs'
                    : 'bg-[#FAF4E9] text-[#18213D] border-[#CEC0AD] hover:border-[#2A56A3]'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              </button>
            );
          })}
        </div>

        {/* Selected Item Detail Panel */}
        <div className="sm:col-span-7 bg-[#FAF4E9] p-4 rounded-[7px] border border-[#CEC0AD] flex flex-col justify-center">
          <div className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#2A56A3] mb-1">
            {items[selectedIdx]?.label}
          </div>
          <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed">
            {items[selectedIdx]?.role}
          </p>
        </div>
      </div>
    </div>
  );
}
