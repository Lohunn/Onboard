import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { experiments } from '../data/experiments';
import { Clock, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Terminal, Layers } from 'lucide-react';

export default function Projects() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedExpId, setExpandedExpId] = useState(null);

  const filtered = experiments.filter((exp) => {
    if (selectedDifficulty === 'all') return true;
    return exp.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <span className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#C0652D] block mb-1">
          LAB EXPERIMENT REPOSITORY
        </span>
        <h1 className="font-['Barlow_Semi_Condensed'] text-4xl sm:text-5xl font-bold text-[#18213D] tracking-tight">
          Project Library
        </h1>
        <p className="font-['Barlow'] text-base sm:text-lg text-[#4B505C] mt-3 leading-relaxed">
          Five guided embedded projects covering digital outputs, switch debouncing, analog ADC sampling, ultrasonic flight timing, and graphical I2C OLED screens.
        </p>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-6">
          <span className="text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#5C6066] uppercase tracking-wider mr-2">
            Filter:
          </span>
          {['all', 'beginner', 'intermediate'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-[5px] text-xs font-['Barlow_Semi_Condensed'] font-semibold capitalize transition-all ${
                selectedDifficulty === diff
                  ? 'bg-[#18213D] text-[#FAF4E9]'
                  : 'bg-[#E3D8CA] text-[#18213D] hover:bg-[#D6C7B3]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Experiment Cards */}
      <div className="space-y-6">
        {filtered.map((exp) => {
          const isExpanded = expandedExpId === exp.id;

          return (
            <div
              key={exp.id}
              className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] overflow-hidden transition-all shadow-xs"
            >
              <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-[5px] bg-[#E3D8CA] text-[#18213D] text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider">
                      {exp.difficulty}
                    </span>
                    <span className="text-xs font-['JetBrains_Mono'] text-[#2A56A3] font-semibold">
                      {exp.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#5C6066]">
                      <Clock className="w-3.5 h-3.5" />
                      {exp.estimatedMinutes} min
                    </span>
                  </div>

                  <h2 className="font-['Barlow_Semi_Condensed'] text-2xl sm:text-3xl font-bold text-[#18213D]">
                    {exp.title}
                  </h2>
                  <p className="font-['Barlow'] text-sm font-medium text-[#C0652D]">
                    {exp.tagline}
                  </p>
                  <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed max-w-3xl">
                    {exp.description}
                  </p>
                </div>

                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0">
                  <Link
                    to={`/lab?experiment=${exp.id}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[7px] bg-[#18213D] hover:bg-[#2A56A3] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-sm transition-colors shadow-xs"
                  >
                    <span>Launch in Lab</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setExpandedExpId(isExpanded ? null : exp.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[7px] bg-[#E3D8CA] hover:bg-[#D6C7B3] text-[#18213D] text-xs font-['Barlow_Semi_Condensed'] font-bold transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Specs & Code' : 'View Specs & Code'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-[#CEC0AD] bg-[#F9F2E5] p-6 space-y-6">
                  {/* Objectives & Common Mistakes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#FAF4E9] p-4 rounded-[7px] border border-[#CEC0AD]">
                      <h4 className="font-['Barlow_Semi_Condensed'] text-sm font-bold uppercase tracking-wider text-[#18213D] mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#057A55]" />
                        Learning Objectives
                      </h4>
                      <ul className="space-y-1.5 text-xs text-[#4B505C]">
                        {exp.learningObjectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#2A56A3] font-bold">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#FAF4E9] p-4 rounded-[7px] border border-[#CEC0AD]">
                      <h4 className="font-['Barlow_Semi_Condensed'] text-sm font-bold uppercase tracking-wider text-[#C0652D] mb-2">
                        Common Beginner Mistakes
                      </h4>
                      <ul className="space-y-1.5 text-xs text-[#4B505C]">
                        {exp.commonMistakes.map((mis, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#C0652D] font-bold">✕</span>
                            <span>{mis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Wiring Diagram Map */}
                  <div className="bg-[#FAF4E9] p-4 rounded-[7px] border border-[#CEC0AD]">
                    <h4 className="font-['Barlow_Semi_Condensed'] text-sm font-bold uppercase tracking-wider text-[#18213D] mb-3">
                      Connection Pin Map
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {exp.wiring.map((w, i) => (
                        <div key={i} className="p-2.5 rounded-[5px] bg-[#F9F2E5] border border-[#CEC0AD]/70 text-xs">
                          <div className="font-semibold text-[#18213D] font-['JetBrains_Mono']">{w.from}</div>
                          <div className="text-[#5C6066] text-[11px] my-0.5">connects to</div>
                          <div className="font-semibold text-[#2A56A3] font-['JetBrains_Mono']">{w.to}</div>
                          <div className="text-[10px] text-[#C0652D] font-medium mt-1">({w.label})</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Starter Firmware Code */}
                  <div className="bg-[#18213D] rounded-[7px] p-4 border border-[#34436A] text-[#FAF4E9]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#34436A]">
                      <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#AAA59D]">
                        firmware.ino (C++ / Arduino)
                      </span>
                      <Link
                        to={`/lab?experiment=${exp.id}`}
                        className="text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#F6EDDD] hover:underline"
                      >
                        Edit in Monaco Lab →
                      </Link>
                    </div>
                    <pre className="font-['JetBrains_Mono'] text-xs text-[#FAF4E9] overflow-x-auto p-2 bg-[#283656] rounded-[5px]">
                      <code>{exp.starterCode}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

