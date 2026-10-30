import React from 'react';
import { Link } from 'react-router-dom';
import { boards } from '../../data/boards';
import { Cpu, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function BoardShowcase() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#2A56A3] block mb-1">
            HARDWARE ARCHITECTURES
          </span>
          <h2 className="font-['Barlow_Semi_Condensed'] text-3xl sm:text-4xl font-bold text-[#18213D]">
            Choose your microcontroller
          </h2>
          <p className="font-['Barlow'] text-base text-[#4B505C] mt-2 max-w-xl">
            Explore complete pinout diagrams, electrical specifications, and peripheral configurations for popular maker boards.
          </p>
        </div>
        <Link
          to="/boards"
          className="inline-flex items-center gap-1.5 font-['Barlow_Semi_Condensed'] font-bold text-[#2A56A3] hover:text-[#18213D] transition-colors"
        >
          <span>View all board pinouts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {boards.map((board) => (
          <div
            key={board.id}
            className="flex flex-col justify-between rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] hover:border-[#2A56A3] transition-all p-6 group hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-[5px] bg-[#E3D8CA] text-[#18213D] text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider">
                  {board.badge}
                </span>
                <span className="text-xs font-['JetBrains_Mono'] text-[#5C6066]">
                  {board.specs.operatingVoltage}
                </span>
              </div>

              <div className="w-12 h-12 rounded-[7px] bg-[#18213D] text-[#FAF4E9] flex items-center justify-center mb-4 group-hover:bg-[#2A56A3] transition-colors">
                <Cpu className="w-6 h-6" />
              </div>

              <h3 className="font-['Barlow_Semi_Condensed'] text-2xl font-bold text-[#18213D] mb-1">
                {board.name}
              </h3>
              <p className="font-['Barlow'] text-xs text-[#5C6066] mb-3">
                {board.manufacturer} • {board.architecture}
              </p>

              <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed mb-6">
                {board.description}
              </p>

              <div className="space-y-2 border-t border-[#CEC0AD]/60 pt-4 mb-6">
                <div className="flex justify-between text-xs font-['Barlow']">
                  <span className="text-[#5C6066]">Clock Speed:</span>
                  <span className="font-semibold text-[#18213D] font-['JetBrains_Mono']">{board.specs.clockSpeed}</span>
                </div>
                <div className="flex justify-between text-xs font-['Barlow']">
                  <span className="text-[#5C6066]">Available GPIO:</span>
                  <span className="font-semibold text-[#18213D] font-['JetBrains_Mono']">{board.specs.gpioCount} pins</span>
                </div>
                <div className="flex justify-between text-xs font-['Barlow']">
                  <span className="text-[#5C6066]">Flash Memory:</span>
                  <span className="font-semibold text-[#18213D] font-['JetBrains_Mono']">{board.specs.flash}</span>
                </div>
              </div>
            </div>

            <Link
              to={`/boards/${board.slug}`}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-[7px] bg-[#E3D8CA] hover:bg-[#18213D] hover:text-[#FAF4E9] text-[#18213D] font-['Barlow_Semi_Condensed'] font-bold text-sm transition-all"
            >
              <span>Explore Interactive Pinout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

