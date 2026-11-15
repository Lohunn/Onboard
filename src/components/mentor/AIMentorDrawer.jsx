/**
 * AI Mentor Drawer Component — Onboard
 * Conforms to Section 5, Section 10 (Mentor), and Section 16 (Prompt 9) of MVP Specification.
 *
 * Provides contextual AI guidance:
 * - Progressive hints (Level 1 conceptual → Level 2 wiring → Level 3 solution)
 * - Grounded diagnostic explanations for simulator errors
 * - Hardware pin explanations (ESP32 DevKit V1)
 * - Understanding checks (quick multiple-choice comprehension questions)
 * - Thumbs up / down helpfulness feedback
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
} from 'lucide-react';
import {
  MENTOR_INTENTS,
  queryMentor,
  recordMentorFeedback,
} from '../../services/mentorService';

export default function AIMentorDrawer({
  isOpen,
  onClose,
  experimentId = 'exp-01-blink',
  diagnostics = [],
  circuit = null,
  code = '',
}) {
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      sender: 'mentor',
      title: '👋 Hi, I’m your Embedded Mentor!',
      text: 'I’m here to guide you through this project step-by-step. I prefer giving small clues before revealing the solution so you can discover the "aha!" moment yourself.',
      suggestedActions: ['hint', 'concept', 'quiz'],
    },
  ]);
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState(1);
  const [ratedMessages, setRatedMessages] = useState({});
  const messagesEndRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleActionClick = async (action) => {
    setIsLoading(true);

    try {
      if (action === 'hint') {
        const res = await queryMentor({
          intent: MENTOR_INTENTS.PROGRESSIVE_HINT,
          experimentId,
          hintLevel: currentHintLevel,
          diagnostics,
          circuit,
          code,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: `hint-${Date.now()}`,
            sender: 'mentor',
            title: res.title,
            text: res.message,
            level: res.level,
            hasMoreHints: res.hasMoreHints,
            actionableHint: res.actionableHint,
          },
        ]);

        if (res.hasMoreHints) {
          setCurrentHintLevel((lvl) => lvl + 1);
        }
      } else if (action === 'diagnose') {
        const res = await queryMentor({
          intent: MENTOR_INTENTS.DIAGNOSE_CIRCUIT_ERROR,
          diagnostics,
          circuit,
          code,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: `diag-${Date.now()}`,
            sender: 'mentor',
            title: res.title,
            text: res.message,
            actionableHint: res.actionableHint,
            severity: res.severity,
          },
        ]);
      } else if (action === 'quiz') {
        const res = await queryMentor({
          intent: MENTOR_INTENTS.UNDERSTANDING_CHECK,
          experimentId,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: `quiz-${Date.now()}`,
            sender: 'mentor',
            title: res.title,
            quiz: res.quiz,
            answered: false,
          },
        ]);
      } else if (action === 'concept') {
        const res = await queryMentor({
          intent: MENTOR_INTENTS.EXPLAIN_CONCEPT,
          query: 'voltage and resistance',
        });

        setMessages((prev) => [
          ...prev,
          {
            id: `concept-${Date.now()}`,
            sender: 'mentor',
            title: res.title,
            text: `${res.message} ${res.detail || ''}`,
            actionableHint: res.actionableHint,
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const clean = queryInput.trim();
    if (!clean || isLoading) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: clean,
      },
    ]);
    setQueryInput('');
    setIsLoading(true);

    try {
      const res = await queryMentor({
        intent: clean.toLowerCase().includes('pin')
          ? MENTOR_INTENTS.EXPLAIN_PIN_OR_COMPONENT
          : clean.toLowerCase().includes('error') || clean.toLowerCase().includes('wrong')
          ? MENTOR_INTENTS.DIAGNOSE_CIRCUIT_ERROR
          : MENTOR_INTENTS.EXPLAIN_CONCEPT,
        query: clean,
        experimentId,
        diagnostics,
        circuit,
        code,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `mentor-${Date.now()}`,
          sender: 'mentor',
          title: res.title,
          text: res.message,
          detail: res.detail,
          actionableHint: res.actionableHint,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (msgId, isHelpful) => {
    setRatedMessages((prev) => ({ ...prev, [msgId]: isHelpful }));
    recordMentorFeedback({
      query: `Message ${msgId}`,
      intent: 'chat_response',
      isHelpful,
    });
  };

  const handleQuizAnswer = (msgIndex, selectedOptionIndex) => {
    setMessages((prev) =>
      prev.map((msg, idx) => {
        if (idx === msgIndex && msg.quiz) {
          const isCorrect = selectedOptionIndex === msg.quiz.correctIndex;
          return {
            ...msg,
            answered: true,
            selectedIndex: selectedOptionIndex,
            isCorrect,
          };
        }
        return msg;
      })
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#FAF4E9] border-l border-[#CEC0AD] shadow-2xl flex flex-col font-['Barlow']">
      {/* Drawer Header */}
      <div className="p-4 bg-[#18213D] text-[#FAF4E9] flex items-center justify-between border-b border-[#34436A]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[7px] bg-[#2A56A3] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#FAF4E9]" />
          </div>
          <div>
            <h3 className="font-['Barlow_Semi_Condensed'] text-base font-bold leading-tight">
              AI Embedded Mentor
            </h3>
            <span className="text-[10px] text-[#FAF4E9]/70 font-['JetBrains_Mono']">
              Context-Aware & Hardware-Grounded
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-[6px] hover:bg-[#283656] text-[#FAF4E9] transition-colors"
          aria-label="Close Mentor"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action Bar */}
      <div className="p-2.5 bg-[#FAF4E9] border-b border-[#CEC0AD] flex items-center gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => handleActionClick('hint')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] bg-[#E3D8CA] hover:bg-[#D6C7B3] text-[#18213D] font-medium whitespace-nowrap transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5 text-[#C0652D]" />
          <span>Hint ({currentHintLevel}/3)</span>
        </button>

        {diagnostics.length > 0 && (
          <button
            onClick={() => handleActionClick('diagnose')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] bg-[#E02424]/15 hover:bg-[#E02424]/25 text-[#E02424] font-semibold whitespace-nowrap transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Diagnose Error</span>
          </button>
        )}

        <button
          onClick={() => handleActionClick('quiz')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] bg-[#E3D8CA] hover:bg-[#D6C7B3] text-[#18213D] font-medium whitespace-nowrap transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#2A56A3]" />
          <span>Quiz Me</span>
        </button>

        <button
          onClick={() => handleActionClick('concept')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] bg-[#E3D8CA] hover:bg-[#D6C7B3] text-[#18213D] font-medium whitespace-nowrap transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#057A55]" />
          <span>Key Concepts</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[92%] rounded-[9px] p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#2A56A3] text-white shadow-xs'
                  : 'bg-white border border-[#CEC0AD] text-[#18213D] shadow-xs'
              }`}
            >
              {msg.title && (
                <div className="font-['Barlow_Semi_Condensed'] font-bold text-sm text-[#18213D] mb-1 flex items-center justify-between">
                  <span>{msg.title}</span>
                  {msg.level && (
                    <span className="text-[10px] font-['JetBrains_Mono'] px-1.5 py-0.2 rounded bg-[#E3D8CA]">
                      Level {msg.level}
                    </span>
                  )}
                </div>
              )}

              {msg.text && (
                <div className="whitespace-pre-line text-[#333742]">
                  {msg.text}
                </div>
              )}

              {msg.actionableHint && (
                <div className="mt-2 pt-2 border-t border-[#CEC0AD]/50 text-[11px] font-semibold text-[#057A55]">
                  💡 Action: {msg.actionableHint}
                </div>
              )}

              {/* Quiz Mode Card */}
              {msg.quiz && (
                <div className="mt-2 space-y-2">
                  <div className="font-semibold text-xs text-[#18213D]">
                    {msg.quiz.question}
                  </div>
                  <div className="space-y-1">
                    {msg.quiz.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        disabled={msg.answered}
                        onClick={() => handleQuizAnswer(idx, optIdx)}
                        className={`w-full text-left p-2 rounded-[5px] text-[11px] border transition-colors ${
                          msg.answered
                            ? optIdx === msg.quiz.correctIndex
                              ? 'bg-[#057A55]/15 border-[#057A55] text-[#057A55] font-bold'
                              : optIdx === msg.selectedIndex
                              ? 'bg-[#E02424]/15 border-[#E02424] text-[#E02424]'
                              : 'bg-white border-[#CEC0AD] opacity-60'
                            : 'bg-white border-[#CEC0AD] hover:bg-[#FAF4E9] text-[#18213D]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {msg.answered && (
                    <div
                      className={`p-2 rounded-[5px] text-[11px] ${
                        msg.isCorrect
                          ? 'bg-[#057A55]/10 text-[#057A55]'
                          : 'bg-[#C0652D]/10 text-[#C0652D]'
                      }`}
                    >
                      <div className="font-bold">
                        {msg.isCorrect ? '✓ Correct!' : '✗ Not quite.'}
                      </div>
                      <div className="mt-0.5">{msg.quiz.explanation}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Next Hint Button */}
              {msg.hasMoreHints && (
                <div className="mt-2.5 pt-2 border-t border-[#CEC0AD]/40">
                  <button
                    onClick={() => handleActionClick('hint')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2A56A3] hover:underline"
                  >
                    <span>Need more help? Get Hint Level {msg.level + 1} →</span>
                  </button>
                </div>
              )}

              {/* Feedback buttons for mentor answers */}
              {msg.sender === 'mentor' && (
                <div className="mt-2 pt-1 flex items-center justify-end gap-2 text-[10px] text-[#5C6066]">
                  <span>Helpful?</span>
                  <button
                    onClick={() => handleFeedback(msg.id, true)}
                    className={`p-1 rounded hover:bg-[#FAF4E9] ${
                      ratedMessages[msg.id] === true ? 'text-[#057A55]' : ''
                    }`}
                    title="Helpful"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback(msg.id, false)}
                    className={`p-1 rounded hover:bg-[#FAF4E9] ${
                      ratedMessages[msg.id] === false ? 'text-[#E02424]' : ''
                    }`}
                    title="Not helpful"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white border border-[#CEC0AD] rounded-[9px] text-xs text-[#5C6066]">
            <Sparkles className="w-3.5 h-3.5 text-[#2A56A3] animate-spin" />
            <span>Consulting ESP32 DevKit V1 knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-[#CEC0AD] flex items-center gap-2"
      >
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Ask a question about your wiring or code..."
          className="flex-1 text-xs px-3 py-2 rounded-[6px] border border-[#CEC0AD] bg-[#FAF4E9] focus:outline-none focus:border-[#2A56A3]"
        />
        <button
          type="submit"
          disabled={!queryInput.trim() || isLoading}
          className="p-2 rounded-[6px] bg-[#18213D] text-[#FAF4E9] disabled:opacity-40 hover:bg-[#2A56A3] transition-colors"
          title="Send Question"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
