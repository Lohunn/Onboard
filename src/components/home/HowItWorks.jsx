import React from 'react';
import { BookOpen, Wrench, Play, Lightbulb, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Learn',
      subtitle: 'The Engineering Principles',
      icon: BookOpen,
      description:
        'Understand how voltage, current, resistance, and digital states behave before connecting a single wire. Clear schematics and zero jargon.',
    },
    {
      step: '02',
      title: 'Build',
      subtitle: 'Virtual Breadboard & Circuit',
      icon: Wrench,
      description:
        'Select microcontrollers, place LEDs, resistors, sensors, and displays. Drag wires between pins with automatic validation.',
    },
    {
      step: '03',
      title: 'Simulate',
      subtitle: 'In-Browser Execution',
      icon: Play,
      description:
        'Write or load C++/Arduino code in the Monaco editor. Compile and run your virtual embedded system in real time with interactive controls.',
    },
    {
      step: '04',
      title: 'Understand',
      subtitle: 'Contextual Explain Mode',
      icon: Lightbulb,
      description:
        'Click any code statement or circuit wire to reveal exactly what physical voltages, currents, and registers are doing under the hood.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#2A56A3] block mb-1">
          METHODOLOGY
        </span>
        <h2 className="font-['Barlow_Semi_Condensed'] text-3xl sm:text-4xl font-bold text-[#18213D]">
          How Onboard Works
        </h2>
        <p className="font-['Barlow'] text-base text-[#4B505C] mt-2">
          Don’t only copy code and hope it works. Follow our four-stage cycle to master both the hardware and firmware layers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((s, index) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="relative rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-[7px] bg-[#18213D] text-[#FAF4E9] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#AAA59D]">
                    {s.step}
                  </span>
                </div>

                <h3 className="font-['Barlow_Semi_Condensed'] text-2xl font-bold text-[#18213D] mb-0.5">
                  {s.title}
                </h3>
                <div className="font-['Barlow_Semi_Condensed'] text-xs font-semibold uppercase tracking-wider text-[#C0652D] mb-3">
                  {s.subtitle}
                </div>

                <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#CEC0AD]/40 flex items-center gap-1.5 text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#2A56A3]">
                <span>Stage {s.step}</span>
                {index < 3 && <ArrowRight className="w-3.5 h-3.5 ml-auto text-[#CEC0AD]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

