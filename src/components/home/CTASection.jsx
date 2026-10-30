import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-[11px] bg-gradient-to-r from-[#18213D] via-[#283656] to-[#18213D] text-[#FAF4E9] p-8 sm:p-12 border border-[#34436A] shadow-md relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#2A56A3]/20 blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A56A3]/30 border border-[#2A56A3]/50 text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#FAF4E9]">
            <Sparkles className="w-3.5 h-3.5 text-[#C0652D]" />
            Free & In-Browser
          </div>

          <h2 className="font-['Barlow_Semi_Condensed'] text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Ready to wire your first virtual circuit?
          </h2>

          <p className="font-['Barlow'] text-base sm:text-lg text-[#AAA59D] leading-relaxed max-w-2xl">
            Choose between the ESP32, Arduino Uno, or Raspberry Pi Pico. Load starter firmware, inspect live signals, and understand how embedded computing works from the ground up.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/lab"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[9px] bg-[#FAF4E9] text-[#18213D] font-['Barlow_Semi_Condensed'] font-bold text-base hover:bg-[#E3D8CA] transition-all shadow-sm group"
            >
              <span>Launch Virtual Lab Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/boards"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[9px] bg-transparent border border-[#FAF4E9]/30 text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-semibold text-base hover:bg-[#FAF4E9]/10 transition-all"
            >
              <span>Inspect Pinouts</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

