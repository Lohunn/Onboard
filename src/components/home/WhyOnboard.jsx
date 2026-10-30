import React from 'react';
import { ShieldCheck, Eye, Terminal, Zap } from 'lucide-react';

export default function WhyOnboard() {
  const reasons = [
    {
      title: 'Experiment Safely',
      icon: ShieldCheck,
      color: '#057A55',
      description:
        'Short-circuits, inverted diodes, and floating pins teach lessons without frying physical $20 microcontrollers or smoking breadboards.',
    },
    {
      title: 'Learn Visually',
      icon: Eye,
      color: '#2A56A3',
      description:
        'Watch currents travel through schematics and see dynamic pinout labels highlight in real time as logic levels switch.',
    },
    {
      title: 'Understand Deeply',
      icon: Terminal,
      color: '#C0652D',
      description:
        'Explain Mode unmasks magic library calls. Click any line of code to see what internal hardware registers and MOSFETs are configured.',
    },
    {
      title: 'Practice Freely',
      icon: Zap,
      color: '#18213D',
      description:
        'Zero driver installation, no driver conflicts, and no port mismatches. Everything runs instantly in modern browsers.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#C0652D] block mb-1">
          THE ONBOARD ADVANTAGE
        </span>
        <h2 className="font-['Barlow_Semi_Condensed'] text-3xl sm:text-4xl font-bold text-[#18213D]">
          Built for true comprehension
        </h2>
        <p className="font-['Barlow'] text-base text-[#4B505C] mt-2">
          Designed specifically for university students, educators, and makers starting out in physical computing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={i}
              className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 flex flex-col justify-start"
            >
              <div
                className="w-10 h-10 rounded-[7px] flex items-center justify-center mb-4 text-[#FAF4E9]"
                style={{ backgroundColor: r.color }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#18213D] mb-2">
                {r.title}
              </h3>

              <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed">
                {r.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

