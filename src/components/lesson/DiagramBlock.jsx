import React from 'react';
import { ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function DiagramBlock({ diagramType, caption }) {
  return (
    <div className="my-6 rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 text-center">
      {diagramType === 'loop_analogy' && (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#18213D]">
            <div className="p-3 rounded-[7px] bg-[#E3D8CA] border border-[#CEC0AD] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C0652D]" />
              <span>1. Power Source (3.3V)</span>
            </div>

            <ArrowRight className="w-4 h-4 text-[#2A56A3] shrink-0" />

            <div className="p-3 rounded-[7px] bg-[#2A56A3]/10 border border-[#2A56A3] text-[#2A56A3] flex items-center gap-2">
              <span>2. Resistor & LED</span>
            </div>

            <ArrowRight className="w-4 h-4 text-[#2A56A3] shrink-0" />

            <div className="p-3 rounded-[7px] bg-[#18213D] text-[#FAF4E9] flex items-center gap-2">
              <span>3. Ground (0V Return)</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-['Barlow'] text-[#057A55] font-semibold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Continuous unbroken loop = Current flows safely</span>
          </div>
        </div>
      )}

      {caption && (
        <p className="mt-2 text-xs font-['Barlow'] text-[#5C6066] italic border-t border-[#CEC0AD]/40 pt-2">
          {caption}
        </p>
      )}
    </div>
  );
}
