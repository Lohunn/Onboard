import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLearnerStore } from '../store/useLearnerStore';
import { LESSONS_DATA } from '../data/lessonsData';
import { ZERO_TO_ESP32_PATH } from '../services/curriculumService';
import CalloutBlock from '../components/lesson/CalloutBlock';
import HotspotBlock from '../components/lesson/HotspotBlock';
import KnowledgeCheckBlock from '../components/lesson/KnowledgeCheckBlock';
import CodeBlock from '../components/lesson/CodeBlock';
import DiagramBlock from '../components/lesson/DiagramBlock';
import {
  ChevronLeft,
  Zap,
  ArrowRight,
  Award,
} from 'lucide-react';

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { completedLessonIds, completeLesson } = useLearnerStore();

  const [passedChecks, setPassedChecks] = useState(new Set());
  const [justCompleted, setJustCompleted] = useState(false);

  // Look up lesson in full data or metadata fallback
  const lesson = useMemo(() => {
    if (LESSONS_DATA[lessonId]) return LESSONS_DATA[lessonId];

    // Fallback: search in curriculum path
    for (const mod of ZERO_TO_ESP32_PATH.modules) {
      const found = mod.lessons.find((l) => l.id === lessonId);
      if (found) {
        return {
          ...found,
          moduleId: mod.id,
          blocks: [
            { type: 'heading', text: found.title },
            { type: 'paragraph', text: found.summary },
            {
              type: 'callout',
              tone: 'tip',
              title: 'Learning Objective',
              text: found.objectives?.join('. ') || 'Master this foundational electronics concept.',
            },
          ],
        };
      }
    }
    return null;
  }, [lessonId]);

  // Find parent module
  const parentModule = useMemo(() => {
    if (!lesson) return null;
    return ZERO_TO_ESP32_PATH.modules.find((m) => m.id === lesson.moduleId);
  }, [lesson]);

  const isAlreadyDone = completedLessonIds.includes(lessonId);

  // Count total checks
  const totalChecks = useMemo(() => {
    if (!lesson?.blocks) return 0;
    return lesson.blocks.filter((b) => b.type === 'knowledge_check').length;
  }, [lesson]);

  const canComplete = totalChecks === 0 || passedChecks.size >= totalChecks || isAlreadyDone;

  const handleComplete = () => {
    if (lesson) {
      completeLesson(lesson.id, lesson.xpReward || 20);
      setJustCompleted(true);
    }
  };

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-['Barlow_Semi_Condensed'] text-2xl font-bold text-[#18213D] mb-2">
          Lesson Not Found
        </h2>
        <p className="font-['Barlow'] text-sm text-[#5C6066] mb-6">
          The requested lesson ID does not exist in the curriculum roadmap.
        </p>
        <Link
          to="/learn"
          className="px-5 py-2.5 rounded-[7px] bg-[#18213D] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-sm"
        >
          Return to Learning Map
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6EDDD] flex flex-col">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FAF4E9]/95 backdrop-blur-sm border-b border-[#CEC0AD] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/learn"
            className="inline-flex items-center gap-1 text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#5C6066] hover:text-[#18213D] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Map</span>
          </Link>

          <div className="flex-1 max-w-md px-2 text-center">
            <div className="text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066] truncate">
              {parentModule?.title}
            </div>
            <div className="font-['Barlow_Semi_Condensed'] text-sm font-bold text-[#18213D] truncate">
              {lesson.title}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[5px] bg-[#2A56A3]/10 text-[#2A56A3] font-['JetBrains_Mono'] text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              +{lesson.xpReward} XP
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Completion Celebration Overlay */}
        {justCompleted ? (
          <div className="rounded-[11px] bg-[#FAF4E9] border-2 border-[#057A55] p-8 sm:p-12 text-center space-y-6 shadow-md animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#057A55] text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#057A55]">
                Lesson Mastered!
              </span>
              <h2 className="font-['Barlow_Semi_Condensed'] text-3xl sm:text-4xl font-bold text-[#18213D]">
                +{lesson.xpReward} XP Awarded
              </h2>
              <p className="font-['Barlow'] text-sm text-[#4B505C] max-w-md mx-auto">
                Great job! You verified your understanding. The next node on the learning map is now unlocked.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/learn')}
                className="px-6 py-3 rounded-[9px] bg-[#18213D] hover:bg-[#2A56A3] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                Return to Learning Map →
              </button>
            </div>
          </div>
        ) : (
          /* Render Structured Blocks */
          <article className="space-y-6">
            <div className="pb-4 border-b border-[#CEC0AD]/60">
              <div className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#2A56A3] mb-1">
                Module {parentModule?.number || 0} • Lesson
              </div>
              <h1 className="font-['Barlow_Semi_Condensed'] text-3xl sm:text-4xl font-bold text-[#18213D] tracking-tight">
                {lesson.title}
              </h1>
              {lesson.subtitle && (
                <p className="font-['Barlow'] text-base text-[#5C6066] mt-1">
                  {lesson.subtitle}
                </p>
              )}
            </div>

            {lesson.blocks?.map((block, idx) => {
              switch (block.type) {
                case 'heading':
                  return (
                    <h2
                      key={idx}
                      className="font-['Barlow_Semi_Condensed'] text-2xl font-bold text-[#18213D] pt-4"
                    >
                      {block.text}
                    </h2>
                  );
                case 'paragraph':
                  return (
                    <p
                      key={idx}
                      className="font-['Barlow'] text-base text-[#18213D] leading-relaxed"
                    >
                      {block.text}
                    </p>
                  );
                case 'callout':
                  return (
                    <CalloutBlock
                      key={idx}
                      tone={block.tone}
                      title={block.title}
                      text={block.text}
                    />
                  );
                case 'diagram':
                  return (
                    <DiagramBlock
                      key={idx}
                      diagramType={block.diagramType}
                      caption={block.caption}
                    />
                  );
                case 'hotspot':
                  return (
                    <HotspotBlock
                      key={idx}
                      title={block.title}
                      description={block.description}
                      items={block.items}
                    />
                  );
                case 'code_example':
                  return (
                    <CodeBlock
                      key={idx}
                      title={block.title}
                      code={block.code}
                    />
                  );
                case 'knowledge_check':
                  return (
                    <KnowledgeCheckBlock
                      key={idx}
                      id={block.id}
                      prompt={block.prompt}
                      options={block.options}
                      correctOptionId={block.correctOptionId}
                      hint={block.hint}
                      onPass={() => {
                        setPassedChecks((prev) => new Set(prev).add(block.id));
                      }}
                    />
                  );
                default:
                  return null;
              }
            })}

            {/* Bottom Lesson Completion Bar */}
            <div className="pt-8 mt-12 border-t border-[#CEC0AD] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-['Barlow'] text-[#5C6066]">
                {isAlreadyDone
                  ? '✓ You previously completed this lesson. Feel free to review anytime.'
                  : canComplete
                  ? 'Ready to finish and record progress!'
                  : `Complete all checks above to unlock completion (${passedChecks.size}/${totalChecks}).`}
              </div>

              <button
                onClick={handleComplete}
                disabled={!canComplete}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[9px] font-['Barlow_Semi_Condensed'] font-bold text-sm tracking-wider uppercase transition-all shadow-sm ${
                  canComplete
                    ? 'bg-[#18213D] hover:bg-[#2A56A3] text-[#FAF4E9] cursor-pointer'
                    : 'bg-[#E3D8CA] text-[#AAA59D] cursor-not-allowed'
                }`}
              >
                <span>{isAlreadyDone ? 'Finish Review' : 'Complete Lesson'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
