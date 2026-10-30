import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play, Sparkles, Cpu, Zap, Activity } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#F9F2E5] via-[#F6EDDD] to-[#FAF4E9] pt-12 pb-20 border-b border-[#CEC0AD]">
      {/* Decorative background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#18213D 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3D8CA] border border-[#CEC0AD] text-[#18213D] text-xs font-['Barlow_Semi_Condensed'] font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#C0652D] animate-pulse" />
              Interactive Electronics Lab & Simulator
            </div>

            <h1 className="font-['Barlow_Semi_Condensed'] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#18213D] tracking-tight leading-[1.08]">
              BUILD YOUR FIRST CIRCUIT.{' '}
              <span className="text-[#2A56A3]">UNDERSTAND EVERY CONNECTION.</span>
            </h1>

            <p className="font-['Barlow'] text-lg sm:text-xl text-[#4B505C] leading-relaxed max-w-2xl">
              Explore microcontrollers, connect virtual components, write firmware, and see your projects come to life—all in your browser with real-time Explain Mode.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[9px] bg-[#18213D] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-base hover:bg-[#2A56A3] transition-all shadow-sm group"
              >
                <span>Enter Virtual Lab</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] text-[#18213D] font-['Barlow_Semi_Condensed'] font-semibold text-base hover:bg-[#E3D8CA] transition-all shadow-xs"
              >
                <span>Explore beginner lessons</span>
              </Link>
            </div>

            {/* Feature Highlights Pills */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#CEC0AD]/70">
              <div className="space-y-0.5">
                <span className="block font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#18213D]">ESP32 & Uno</span>
                <span className="block font-['Barlow'] text-xs text-[#5C6066]">Full Pinout Mapping</span>
              </div>
              <div className="space-y-0.5">
                <span className="block font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#2A56A3]">Explain Mode</span>
                <span className="block font-['Barlow'] text-xs text-[#5C6066]">Why circuits work</span>
              </div>
              <div className="space-y-0.5">
                <span className="block font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#C0652D]">In-Browser</span>
                <span className="block font-['Barlow'] text-xs text-[#5C6066]">Zero hardware required</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Illustration */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[11px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 shadow-sm">
              {/* Header mockup bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#CEC0AD]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#E02424]/80" />
                  <span className="w-3 h-3 rounded-full bg-[#D97706]/80" />
                  <span className="w-3 h-3 rounded-full bg-[#057A55]/80" />
                  <span className="ml-2 font-['JetBrains_Mono'] text-xs text-[#5C6066]">lab_preview.circuit</span>
                </div>
                <span className="px-2 py-0.5 rounded-[5px] bg-[#2A56A3]/10 text-[#2A56A3] font-['JetBrains_Mono'] text-[11px] font-semibold">
                  ESP32 DevKit V1
                </span>
              </div>

              {/* Circuit SVG Graphic */}
              <div className="bg-[#18213D] rounded-[9px] p-5 relative overflow-hidden text-[#FAF4E9]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#C0652D]" />
                    <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#F6EDDD]">ACTIVE SIMULATION</span>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#057A55] bg-[#057A55]/20 px-2 py-0.5 rounded-[4px]">
                    ● RUNNING (3.3V)
                  </span>
                </div>

                {/* Circuit Traces Diagram */}
                <div className="space-y-3 font-['JetBrains_Mono'] text-xs">
                  <div className="p-3 rounded-[7px] bg-[#283656] border border-[#34436A] flex items-center justify-between">
                    <span className="text-[#AAA59D]">GPIO 2 (Digital Out)</span>
                    <span className="text-[#FAF4E9] font-bold">HIGH (3.3V)</span>
                  </div>
                  <div className="flex justify-center text-[#C0652D]">
                    ↓ 15mA current through 220Ω resistor
                  </div>
                  <div className="p-3 rounded-[7px] bg-[#283656] border border-[#34436A] flex items-center justify-between">
                    <span className="text-[#AAA59D]">Red LED State</span>
                    <span className="text-[#E02424] font-bold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E02424] shadow-[0_0_8px_#E02424]" />
                      ILLUMINATED
                    </span>
                  </div>
                </div>

                {/* Explain Callout */}
                <div className="mt-4 p-3 rounded-[7px] bg-[#FAF4E9] text-[#18213D] border-l-4 border-[#2A56A3] text-xs">
                  <div className="font-['Barlow_Semi_Condensed'] font-bold text-[#2A56A3] uppercase tracking-wide text-[11px] mb-0.5">
                    Explain Mode
                  </div>
                  <p className="font-['Barlow'] text-xs text-[#4B505C] leading-snug">
                    GPIO 2 configured as OUTPUT drives pin to 3.3V rail. Resistor limits current to prevent diode destruction.
                  </p>
                </div>
              </div>

              {/* Action bar below */}
              <div className="mt-4 flex items-center justify-between text-xs text-[#5C6066]">
                <span className="flex items-center gap-1.5 font-['JetBrains_Mono']">
                  <Activity className="w-3.5 h-3.5 text-[#057A55]" />
                  Clock: 240 MHz
                </span>
                <Link to="/lab" className="text-[#2A56A3] font-semibold hover:underline flex items-center gap-1">
                  Launch Lab Editor →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

