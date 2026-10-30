import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Heart, Code2, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mb-12">
        <span className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#2A56A3] block mb-1">
          THE VISION
        </span>
        <h1 className="font-['Barlow_Semi_Condensed'] text-4xl sm:text-5xl font-bold text-[#18213D] tracking-tight">
          About Onboard
        </h1>
        <p className="font-['Barlow'] text-base sm:text-lg text-[#4B505C] mt-3 leading-relaxed">
          Onboard is an interactive electronics learning platform and virtual microcontroller laboratory built for college students, university freshers, and electronics beginners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-8 space-y-6">
          <div className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-8 space-y-4">
            <h2 className="font-['Barlow_Semi_Condensed'] text-2xl font-bold text-[#18213D]">
              Our Product Principle
            </h2>
            <blockquote className="border-l-4 border-[#2A56A3] pl-4 italic font-['Barlow'] text-base sm:text-lg text-[#18213D]">
              "Don’t only show learners how to make a circuit work. Explain why it works."
            </blockquote>
            <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed">
              Most online tutorials give students code to copy and paste. When an LED illuminates, the student still doesn’t know what a GPIO driver does, why the resistor was necessary, or why floating pins pick up noise. Onboard bridges the gap between software code and physical electron flow.
            </p>
          </div>

          <div className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-8 space-y-4">
            <h2 className="font-['Barlow_Semi_Condensed'] text-2xl font-bold text-[#18213D]">
              Simulation Architecture & Honesty
            </h2>
            <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed">
              We maintain a strict boundary: decorative animations are never falsely passed off as true firmware execution. Our Virtual Lab includes a simulator adapter architecture designed to interface with open-source instruction-set engines (like AVR8js and RP2040js) alongside guided visual circuit validation.
            </p>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="rounded-[9px] bg-[#18213D] text-[#FAF4E9] p-6 border border-[#34436A] space-y-4">
            <h3 className="font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#FAF4E9]">
              Design System Tokens
            </h3>
            <div className="space-y-2 text-xs font-['JetBrains_Mono']">
              <div className="flex items-center justify-between">
                <span>Background</span>
                <span className="font-bold">#F6EDDD</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Surface</span>
                <span className="font-bold">#FAF4E9</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Primary Navy</span>
                <span className="font-bold">#18213D</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Accent Blue</span>
                <span className="font-bold">#2A56A3</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Accent Orange</span>
                <span className="font-bold">#C0652D</span>
              </div>
            </div>
            <p className="font-['Barlow'] text-xs text-[#AAA59D] pt-2 border-t border-[#34436A]">
              Inspired by editorial engineering workbooks with warm pale-orange paper tones.
            </p>
          </div>

          <div className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 space-y-3">
            <h3 className="font-['Barlow_Semi_Condensed'] text-lg font-bold text-[#18213D]">
              Ready to explore?
            </h3>
            <p className="font-['Barlow'] text-xs text-[#4B505C]">
              Launch the virtual lab or examine board pinout diagrams right away.
            </p>
            <Link
              to="/lab"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-[7px] bg-[#18213D] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-xs hover:bg-[#2A56A3] transition-colors"
            >
              Enter Virtual Lab
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

