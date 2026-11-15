import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, RotateCcw } from 'lucide-react';

export default function KnowledgeCheckBlock({
  id,
  prompt,
  options = [],
  correctOptionId,
  hint,
  onPass,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const selectedOption = options.find((o) => o.id === selectedId);
  const isCorrect = submitted && selectedId === correctOptionId;

  const handleSubmit = () => {
    if (!selectedId) return;
    setSubmitted(true);
    if (selectedId === correctOptionId && onPass) {
      onPass();
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setSelectedId(null);
  };

  return (
    <div
      role="region"
      aria-label="Knowledge Check"
      className="my-6 p-6 rounded-[9px] bg-[#FAF4E9] border-2 border-[#CEC0AD] shadow-xs"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="px-2.5 py-0.5 rounded-[5px] bg-[#2A56A3] text-white text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider">
          Knowledge Check
        </span>
        {hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-1 text-xs font-['Barlow_Semi_Condensed'] font-semibold text-[#5C6066] hover:text-[#18213D] cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
          </button>
        )}
      </div>

      {/* Question Prompt */}
      <h3 className="font-['Barlow_Semi_Condensed'] text-lg sm:text-xl font-bold text-[#18213D] mb-4">
        {prompt}
      </h3>

      {/* Hint Drawer */}
      {showHint && hint && (
        <div className="mb-4 p-3 rounded-[6px] bg-[#F9F2E5] border border-[#CEC0AD] text-xs font-['Barlow'] text-[#4B505C] italic">
          💡 <strong>Hint:</strong> {hint}
        </div>
      )}

      {/* Options List */}
      <div className="space-y-2.5 mb-6">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          let optionBorder = 'border-[#CEC0AD]';
          let optionBg = 'bg-[#F9F2E5]';

          if (isSelected) {
            optionBorder = 'border-[#2A56A3]';
            optionBg = 'bg-[#2A56A3]/5';
          }

          if (submitted) {
            if (opt.id === correctOptionId) {
              optionBorder = 'border-[#057A55]';
              optionBg = 'bg-[#057A55]/10';
            } else if (isSelected) {
              optionBorder = 'border-[#E02424]';
              optionBg = 'bg-[#E02424]/10';
            }
          }

          return (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-3.5 rounded-[7px] border transition-all cursor-pointer ${optionBorder} ${optionBg}`}
            >
              <input
                type="radio"
                name={`kc-${id}`}
                value={opt.id}
                disabled={submitted && isCorrect}
                checked={isSelected}
                onChange={() => {
                  if (!submitted || !isCorrect) {
                    setSelectedId(opt.id);
                    setSubmitted(false);
                  }
                }}
                className="mt-1 text-[#2A56A3] focus:ring-[#2A56A3]"
              />
              <span className="font-['Barlow'] text-sm text-[#18213D] leading-snug">
                {opt.text}
              </span>
            </label>
          );
        })}
      </div>

      {/* Explanatory Feedback Banner */}
      {submitted && selectedOption && (
        <div
          className={`p-4 rounded-[7px] border my-4 text-xs font-['Barlow'] leading-relaxed flex items-start gap-3 ${
            isCorrect
              ? 'bg-[#057A55]/10 border-[#057A55] text-[#18213D]'
              : 'bg-[#C0652D]/10 border-[#C0652D] text-[#18213D]'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-[#057A55] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#C0652D] shrink-0 mt-0.5" />
          )}
          <div>
            <div
              className={`font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-xs mb-1 ${
                isCorrect ? 'text-[#057A55]' : 'text-[#C0652D]'
              }`}
            >
              {isCorrect ? 'Correct! Here is why:' : 'Not quite. Here is why:'}
            </div>
            <p>{selectedOption.explanation}</p>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] font-['Barlow'] text-[#5C6066]">
          {isCorrect ? '✓ Verified understanding' : 'Select an answer to verify'}
        </span>

        {!submitted || !isCorrect ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedId}
            className={`px-5 py-2.5 rounded-[7px] font-['Barlow_Semi_Condensed'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedId
                ? 'bg-[#18213D] hover:bg-[#2A56A3] text-[#FAF4E9] shadow-xs'
                : 'bg-[#E3D8CA] text-[#AAA59D] cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#5C6066] hover:bg-[#E3D8CA] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
