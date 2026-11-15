import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnerStore } from '../store/useLearnerStore';
import {
  ZERO_TO_ESP32_PATH,
  getModuleState,
  calculateUnlockedModules,
  findNextActiveLesson,
} from '../services/curriculumService';
import LearningMapNode from '../components/learning-map/LearningMapNode';
import ContinueLearningBanner from '../components/learning-map/ContinueLearningBanner';
import ModuleDetailModal from '../components/learning-map/ModuleDetailModal';
import { Cpu } from 'lucide-react';

export default function Learn() {
  const navigate = useNavigate();
  const { completedLessonIds, setActiveLesson } = useLearnerStore();

  const [selectedModule, setSelectedModule] = useState(null);

  // Recalculate unlocked modules based on completed lessons
  const dynamicUnlockedModules = useMemo(() => {
    return calculateUnlockedModules(completedLessonIds);
  }, [completedLessonIds]);

  // Total lessons in the path
  const allLessons = useMemo(() => {
    return ZERO_TO_ESP32_PATH.modules.flatMap((m) => m.lessons);
  }, []);

  // Find next active lesson
  const { lesson: nextLesson, module: nextModule } = useMemo(() => {
    return findNextActiveLesson(completedLessonIds);
  }, [completedLessonIds]);

  // Handle lesson start
  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson.id);
    setSelectedModule(null);

    if (lesson.experimentId) {
      navigate(`/lab?experiment=${lesson.experimentId}`);
    } else {
      navigate(`/lessons/${lesson.id}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[5px] bg-[#2A56A3]/10 text-[#2A56A3] text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider mb-2">
          <Cpu className="w-3.5 h-3.5" />
          Verified Hardware Path: ESP32 DevKit V1
        </div>
        <h1 className="font-['Barlow_Semi_Condensed'] text-4xl sm:text-5xl font-bold text-[#18213D] tracking-tight">
          {ZERO_TO_ESP32_PATH.title}
        </h1>
        <p className="font-['Barlow'] text-base sm:text-lg text-[#4B505C] mt-2 leading-relaxed">
          {ZERO_TO_ESP32_PATH.tagline}. Step through 11 bite-sized modules with guaranteed understanding at every node.
        </p>
      </div>

      {/* Continue Learning Resume Banner */}
      <ContinueLearningBanner
        activeModule={nextModule}
        activeLesson={nextLesson}
        totalLessons={allLessons.length}
        completedCount={completedLessonIds.length}
        onContinue={handleStartLesson}
      />

      {/* Duolingo-style Winding Learning Map */}
      <div className="relative py-8 flex flex-col items-center">
        {/* Central visual vertical guideline */}
        <div className="absolute top-12 bottom-12 w-1.5 bg-[#CEC0AD] rounded-full -z-0" />

        <div className="w-full space-y-10 relative z-10">
          {ZERO_TO_ESP32_PATH.modules.map((module, index) => {
            const state = getModuleState(module, completedLessonIds, dynamicUnlockedModules);
            const isCurrent = module.id === nextModule?.id;
            const completedCount = module.lessons.filter((l) => completedLessonIds.includes(l.id)).length;

            // Offset alternating horizontal positions: left, center, right, center
            const alignments = ['items-center', 'items-start sm:pl-28', 'items-center', 'items-end sm:pr-28'];
            const alignment = alignments[index % alignments.length];

            return (
              <div key={module.id} className={`flex flex-col ${alignment} w-full`}>
                <LearningMapNode
                  module={module}
                  state={state}
                  isCurrent={isCurrent}
                  totalLessons={module.lessons.length}
                  completedCount={completedCount}
                  onSelect={(mod) => setSelectedModule(mod)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Inspector Drawer Modal */}
      {selectedModule && (
        <ModuleDetailModal
          module={selectedModule}
          state={getModuleState(selectedModule, completedLessonIds, dynamicUnlockedModules)}
          completedLessonIds={completedLessonIds}
          prerequisiteModule={
            selectedModule.prerequisiteModuleId
              ? ZERO_TO_ESP32_PATH.modules.find((m) => m.id === selectedModule.prerequisiteModuleId)
              : null
          }
          onClose={() => setSelectedModule(null)}
          onStartLesson={handleStartLesson}
        />
      )}
    </div>
  );
}
