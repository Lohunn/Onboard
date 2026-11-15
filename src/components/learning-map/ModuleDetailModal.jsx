import React from 'react';
import {
  X,
  Lock,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function ModuleDetailModal({
  module,
  state = 'locked',
  completedLessonIds = [],
  prerequisiteModule = null,
  onClose,
  onStartLesson,
}) {
  if (!module) return null;

  const isLocked = state === 'locked';
  const isCompleted = state === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18213D]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#FAF4E9] rounded-[11px] border-2 border-[#CEC0AD] shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 bg-[#F9F2E5] border-b border-[#CEC0AD] flex items-start justify-between">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-[5px] bg-[#E3D8CA] text-[#18213D] text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider">
                Module {module.number}
              </span>
              <span
                className={`text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] ${
                  isLocked
                    ? 'bg-[#E3D8CA] text-[#5C6066]'
                    : isCompleted
                    ? 'bg-[#057A55]/15 text-[#057A55]'
                    : 'bg-[#2A56A3]/15 text-[#2A56A3]'
                }`}
              >
                {state.replace('_', ' ')}
              </span>
            </div>
            <h2 className="font-['Barlow_Semi_Condensed'] text-2xl sm:text-3xl font-bold text-[#18213D]">
              {module.title}
            </h2>
            <p className="font-['Barlow'] text-sm text-[#4B505C]">
              {module.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-[7px] text-[#5C6066] hover:bg-[#E3D8CA] hover:text-[#18213D] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Prerequisite Alert if Locked */}
          {isLocked && (
            <div className="p-4 rounded-[7px] bg-[#E02424]/10 border border-[#E02424]/30 flex items-start gap-3 text-xs text-[#18213D]">
              <Lock className="w-4 h-4 text-[#E02424] shrink-0 mt-0.5" />
              <div>
                <div className="font-['Barlow_Semi_Condensed'] font-bold text-[#E02424] uppercase mb-0.5">
                  Prerequisite Required
                </div>
                <p className="font-['Barlow']">
                  Complete <strong>{prerequisiteModule?.title || 'the previous module'}</strong> to unlock this module. Backend rules enforce sequential understanding.
                </p>
              </div>
            </div>
          )}

          {/* Module Completed Banner */}
          {isCompleted && (
            <div className="p-4 rounded-[7px] bg-[#057A55]/10 border border-[#057A55]/30 flex items-start gap-3 text-xs text-[#18213D]">
              <CheckCircle2 className="w-4 h-4 text-[#057A55] shrink-0 mt-0.5" />
              <div>
                <div className="font-['Barlow_Semi_Condensed'] font-bold text-[#057A55] uppercase mb-0.5">
                  Module Completed
                </div>
                <p className="font-['Barlow']">
                  You have mastered this module! Completed lessons remain reviewable anytime without locking or penalty.
                </p>
              </div>
            </div>
          )}

          {/* Learning Outcomes */}
          {module.learningOutcomes && (
            <div>
              <h3 className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#5C6066] mb-2">
                What You Will Understand:
              </h3>
              <ul className="space-y-1.5">
                {module.learningOutcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-['Barlow'] text-[#18213D]">
                    <span className="text-[#2A56A3] font-bold">•</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lessons List */}
          <div>
            <h3 className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#5C6066] mb-3">
              Module Lessons ({module.lessons.length}):
            </h3>

            <div className="space-y-2.5">
              {module.lessons.map((lesson, idx) => {
                const isLessonDone = completedLessonIds.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    className="p-3.5 rounded-[7px] bg-[#F9F2E5] border border-[#CEC0AD] flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-['JetBrains_Mono'] font-bold ${
                          isLessonDone
                            ? 'bg-[#057A55] text-white'
                            : 'bg-[#E3D8CA] text-[#18213D]'
                        }`}
                      >
                        {isLessonDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div>
                        <div className="font-['Barlow_Semi_Condensed'] text-sm font-bold text-[#18213D]">
                          {lesson.title}
                        </div>
                        <div className="text-[11px] font-['Barlow'] text-[#5C6066] flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.durationMinutes} min
                          </span>
                          <span>•</span>
                          <span className="capitalize">{lesson.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-['JetBrains_Mono'] font-bold text-[#2A56A3]">
                        +{lesson.xpReward} XP
                      </span>

                      {!isLocked ? (
                        <button
                          onClick={() => onStartLesson(lesson, module)}
                          className="px-3 py-1.5 rounded-[5px] bg-[#18213D] hover:bg-[#2A56A3] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-xs transition-colors cursor-pointer"
                        >
                          {isLessonDone ? 'Review' : 'Start'}
                        </button>
                      ) : (
                        <span className="p-1.5 text-[#AAA59D]">
                          <Lock className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F9F2E5] border-t border-[#CEC0AD] flex items-center justify-between">
          <div className="text-xs font-['Barlow_Semi_Condensed'] font-semibold text-[#5C6066]">
            {module.checkpointTitle}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-[7px] bg-[#E3D8CA] hover:bg-[#D6C7B3] text-[#18213D] font-['Barlow_Semi_Condensed'] font-bold text-xs"
            >
              Close
            </button>
            {!isLocked && (
              <button
                onClick={() => {
                  const firstIncomplete =
                    module.lessons.find((l) => !completedLessonIds.includes(l.id)) ||
                    module.lessons[0];
                  onStartLesson(firstIncomplete, module);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[7px] bg-[#18213D] hover:bg-[#2A56A3] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-xs shadow-xs"
              >
                <span>{isCompleted ? 'Review Module' : 'Continue Module'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
