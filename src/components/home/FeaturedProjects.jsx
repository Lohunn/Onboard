import React from 'react';
import { Link } from 'react-router-dom';
import { experiments } from '../../data/experiments';
import { ArrowRight, Clock, Layers, Sparkles } from 'lucide-react';

export default function FeaturedProjects() {
  const featured = experiments.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#C0652D] block mb-1">
            HANDS-ON STARTERS
          </span>
          <h2 className="font-['Barlow_Semi_Condensed'] text-3xl sm:text-4xl font-bold text-[#18213D]">
            Start with a project
          </h2>
          <p className="font-['Barlow'] text-base text-[#4B505C] mt-2 max-w-xl">
            Five verified beginner experiments designed to take you from a single blinking LED to multi-sensor telemetry dashboards.
          </p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 font-['Barlow_Semi_Condensed'] font-bold text-[#2A56A3] hover:text-[#18213D] transition-colors"
        >
          <span>View all 5 experiments</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-col justify-between rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] hover:border-[#18213D] transition-all p-6 group hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-[5px] bg-[#E3D8CA] text-[#18213D] text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider">
                  {exp.difficulty}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#5C6066]">
                  <Clock className="w-3.5 h-3.5" />
                  {exp.estimatedMinutes} min
                </span>
              </div>

              <h3 className="font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#18213D] mb-2 group-hover:text-[#2A56A3] transition-colors">
                {exp.title}
              </h3>

              <p className="font-['Barlow'] text-xs font-medium text-[#C0652D] mb-3">
                {exp.tagline}
              </p>

              <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed mb-6 line-clamp-3">
                {exp.description}
              </p>

              <div className="mb-6 space-y-1.5 bg-[#F9F2E5] p-3 rounded-[7px] border border-[#CEC0AD]/40">
                <div className="text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                  Required Components
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exp.componentsNeeded.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-[4px] bg-[#FAF4E9] border border-[#CEC0AD] text-[11px] font-['Barlow'] text-[#18213D]"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#CEC0AD]/60">
              <Link
                to={`/lab?experiment=${exp.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[7px] bg-[#18213D] hover:bg-[#2A56A3] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-xs transition-colors"
              >
                <span>Launch in Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/projects"
                className="py-2.5 px-3 rounded-[7px] bg-[#E3D8CA] hover:bg-[#D6C7B3] text-[#18213D] font-['Barlow_Semi_Condensed'] font-semibold text-xs"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

