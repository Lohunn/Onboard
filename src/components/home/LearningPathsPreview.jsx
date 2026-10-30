import React from 'react';
import { Link } from 'react-router-dom';
import { learningPaths } from '../../data/learningPaths';
import { ArrowRight, BookOpen, Clock, ChevronRight } from 'lucide-react';

export default function LearningPathsPreview() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#2A56A3] block mb-1">
            CURATED CURRICULUM
          </span>
          <h2 className="font-['Barlow_Semi_Condensed'] text-3xl sm:text-4xl font-bold text-[#18213D]">
            Structured learning paths
          </h2>
          <p className="font-['Barlow'] text-base text-[#4B505C] mt-2 max-w-xl">
            Progress systematically from binary gates and GPIO registers to Wi-Fi connectivity and cloud telemetry.
          </p>
        </div>
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 font-['Barlow_Semi_Condensed'] font-bold text-[#2A56A3] hover:text-[#18213D] transition-colors"
        >
          <span>Explore all 19 lessons</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPaths.map((path) => (
          <div
            key={path.id}
            className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 hover:border-[#2A56A3] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-[5px] bg-[#E3D8CA] text-[#18213D] text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider">
                  Level {path.level} • {path.difficulty}
                </span>
                <div className="flex items-center gap-3 text-xs text-[#5C6066]">
                  <span className="flex items-center gap-1 font-['JetBrains_Mono']">
                    <BookOpen className="w-3.5 h-3.5" />
                    {path.totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1 font-['JetBrains_Mono']">
                    <Clock className="w-3.5 h-3.5" />
                    {path.estimatedHours}
                  </span>
                </div>
              </div>

              <h3 className="font-['Barlow_Semi_Condensed'] text-2xl font-bold text-[#18213D] mb-1">
                {path.title}
              </h3>
              <p className="font-['Barlow'] text-xs font-medium text-[#C0652D] mb-3">
                {path.subtitle}
              </p>

              <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed mb-6">
                {path.description}
              </p>

              <div className="space-y-1.5 border-t border-[#CEC0AD]/40 pt-4 mb-4">
                {path.lessons.slice(0, 3).map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-[#4B505C] py-1 border-b border-[#CEC0AD]/20 last:border-0">
                    <span className="font-['Barlow'] font-medium truncate max-w-[280px]">
                      {l.title}
                    </span>
                    <span className="text-[#5C6066] font-['JetBrains_Mono'] text-[11px] shrink-0 ml-2">
                      {l.duration}
                    </span>
                  </div>
                ))}
                {path.lessons.length > 3 && (
                  <div className="text-[11px] font-['Barlow'] font-semibold text-[#2A56A3] pt-1">
                    + {path.lessons.length - 3} more lessons
                  </div>
                )}
              </div>
            </div>

            <Link
              to="/learn"
              className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-[7px] bg-[#E3D8CA] hover:bg-[#18213D] hover:text-[#FAF4E9] text-[#18213D] font-['Barlow_Semi_Condensed'] font-bold text-xs transition-colors"
            >
              <span>View Curriculum</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

