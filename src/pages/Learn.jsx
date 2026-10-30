import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { learningPaths } from '../data/learningPaths';
import { BookOpen, Clock, ChevronDown, ChevronUp, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Learn() {
  const [expandedPath, setExpandedPath] = useState(learningPaths[0].id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="max-w-3xl mb-12">
        <span className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#2A56A3] block mb-1">
          CURRICULUM ROADMAP
        </span>
        <h1 className="font-['Barlow_Semi_Condensed'] text-4xl sm:text-5xl font-bold text-[#18213D] tracking-tight">
          Learning Paths
        </h1>
        <p className="font-['Barlow'] text-base sm:text-lg text-[#4B505C] mt-3 leading-relaxed">
          Step-by-step paths arranged from bare silicon principles to IoT telemetry. Each lesson integrates physical circuit theory with interactive in-browser lab experiments.
        </p>
      </div>

      {/* Learning Paths Accordion / Cards */}
      <div className="space-y-6">
        {learningPaths.map((path) => {
          const isExpanded = expandedPath === path.id;

          return (
            <div
              key={path.id}
              className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] overflow-hidden transition-all shadow-xs"
            >
              {/* Card Header Bar */}
              <div
                onClick={() => setExpandedPath(isExpanded ? null : path.id)}
                className="p-6 cursor-pointer hover:bg-[#F9F2E5] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-[5px] bg-[#E3D8CA] text-[#18213D] text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider">
                      Level {path.level} • {path.difficulty}
                    </span>
                    <span className="text-xs font-['Barlow_Semi_Condensed'] font-semibold text-[#C0652D]">
                      {path.badge}
                    </span>
                  </div>
                  <h2 className="font-['Barlow_Semi_Condensed'] text-2xl sm:text-3xl font-bold text-[#18213D]">
                    {path.title}
                  </h2>
                  <p className="font-['Barlow'] text-sm text-[#4B505C]">
                    {path.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono'] text-[#5C6066]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-[#2A56A3]" />
                    {path.totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-[#2A56A3]" />
                    {path.estimatedHours}
                  </span>
                  <button className="p-1 rounded-[5px] bg-[#E3D8CA] text-[#18213D] ml-2">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Lesson Drawer */}
              {isExpanded && (
                <div className="border-t border-[#CEC0AD] bg-[#F9F2E5] p-6 space-y-4">
                  <p className="font-['Barlow'] text-sm text-[#4B505C] mb-4">
                    {path.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {path.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="rounded-[7px] bg-[#FAF4E9] border border-[#CEC0AD] p-4 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#2A56A3]">
                              {lesson.duration}
                            </span>
                            {lesson.experimentId && (
                              <span className="px-2 py-0.5 rounded-[4px] bg-[#057A55]/15 text-[#057A55] text-[10px] font-['Barlow_Semi_Condensed'] font-bold uppercase">
                                Hands-on Lab
                              </span>
                            )}
                          </div>

                          <h3 className="font-['Barlow_Semi_Condensed'] text-lg font-bold text-[#18213D] mb-1.5">
                            {lesson.title}
                          </h3>

                          <p className="font-['Barlow'] text-xs text-[#4B505C] leading-relaxed mb-3">
                            {lesson.description}
                          </p>

                          <div className="space-y-1 mb-4">
                            <div className="font-['Barlow_Semi_Condensed'] text-[11px] font-bold uppercase tracking-wider text-[#5C6066]">
                              Key Objectives:
                            </div>
                            <ul className="space-y-0.5">
                              {lesson.objectives.map((obj, i) => (
                                <li key={i} className="text-xs text-[#5C6066] flex items-start gap-1.5">
                                  <span className="text-[#2A56A3] font-bold">•</span>
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {lesson.experimentId ? (
                          <Link
                            to={`/lab?experiment=${lesson.experimentId}`}
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-[5px] bg-[#18213D] hover:bg-[#2A56A3] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-xs transition-colors mt-2"
                          >
                            <span>Open Guided Experiment</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <div className="py-2 text-[11px] font-['Barlow'] text-[#5C6066] italic">
                            Theory & Architectural Overview
                          </div>
                        )}
                      </div>
                    ))}
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

