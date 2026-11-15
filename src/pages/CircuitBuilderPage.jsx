/**
 * Circuit Builder Page — Onboard
 * Wraps the CircuitBuilder component with page-level chrome:
 * hero header, breadcrumb, and guided-build notice banner.
 *
 * Route: /circuit
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Info } from 'lucide-react';
import CircuitBuilder from '../components/circuit/CircuitBuilder';

export default function CircuitBuilderPage() {
  return (
    <div className="min-h-screen bg-[#F6EDDD]">
      {/* Page Header */}
      <div className="bg-[#FAF4E9] border-b border-[#CEC0AD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[#5C6066] mb-3 font-['Barlow']">
            <Link to="/" className="hover:text-[#2A56A3] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/lab" className="hover:text-[#2A56A3] transition-colors">Virtual Lab</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#18213D] font-semibold">Circuit Builder</span>
          </nav>

          {/* Title Row */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-['Barlow_Semi_Condensed'] text-3xl font-bold text-[#18213D] flex items-center gap-2">
                <Zap className="w-7 h-7 text-[#C0652D]" />
                Circuit Builder
              </h1>
              <p className="font-['Barlow'] text-sm text-[#5C6066] mt-1">
                Build, validate, and save circuits for ESP32 DevKit V1. Follow a guided build or start from scratch.
              </p>
            </div>

            {/* Simulation Level Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[7px] bg-[#FFF7E8] border border-[#E8D5A3] text-xs font-['Barlow'] text-[#7A5A1E]">
              <Info className="w-3.5 h-3.5" />
              <span>Deterministic Educational Simulation — not SPICE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Circuit Builder Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CircuitBuilder />
      </div>
    </div>
  );
}
