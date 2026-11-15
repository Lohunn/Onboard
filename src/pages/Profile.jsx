import React, { useState } from 'react';
import { useLearnerStore } from '../store/useLearnerStore';
import { ShieldCheck, RotateCcw, Check, Sparkles } from 'lucide-react';

export default function Profile() {
  const { profile, xp, streakDays, completedLessonIds, updateDailyGoal, resetProgress } =
    useLearnerStore();

  const [savedSuccess, setSavedSuccess] = useState(false);

  const goalOptions = [5, 10, 15, 20];

  const handleGoalChange = (minutes) => {
    updateDailyGoal(minutes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mb-10">
        <span className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#2A56A3] block mb-1">
          LEARNER SETTINGS
        </span>
        <h1 className="font-['Barlow_Semi_Condensed'] text-4xl sm:text-5xl font-bold text-[#18213D] tracking-tight">
          Profile & Preferences
        </h1>
        <p className="font-['Barlow'] text-base sm:text-lg text-[#4B505C] mt-2 leading-relaxed">
          Manage your daily learning target, view completed milestones, and customize your beginner journey.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Details Card */}
        <div className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 sm:p-8">
          <div className="flex items-center gap-4 pb-6 border-b border-[#CEC0AD]/60">
            <div className="w-16 h-16 rounded-[9px] bg-[#18213D] text-[#FAF4E9] flex items-center justify-center text-2xl font-['Barlow_Semi_Condensed'] font-bold">
              {profile.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-['Barlow_Semi_Condensed'] text-2xl font-bold text-[#18213D]">
                {profile.displayName}
              </h2>
              <p className="font-['Barlow'] text-sm text-[#5C6066]">
                {profile.email} • Level {Math.floor(xp / 100) + 1} Learner
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-[5px] bg-[#057A55]/10 text-[#057A55] text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Beginner-First Path Active
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="bg-[#F9F2E5] p-4 rounded-[7px] border border-[#CEC0AD]">
              <div className="text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                Total Experience
              </div>
              <div className="text-2xl font-['JetBrains_Mono'] font-bold text-[#2A56A3]">
                {xp} XP
              </div>
            </div>

            <div className="bg-[#F9F2E5] p-4 rounded-[7px] border border-[#CEC0AD]">
              <div className="text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                Current Streak
              </div>
              <div className="text-2xl font-['JetBrains_Mono'] font-bold text-[#C0652D]">
                {streakDays} Days
              </div>
            </div>

            <div className="bg-[#F9F2E5] p-4 rounded-[7px] border border-[#CEC0AD]">
              <div className="text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                Lessons Completed
              </div>
              <div className="text-2xl font-['JetBrains_Mono'] font-bold text-[#057A55]">
                {completedLessonIds.length}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goal Target */}
        <div className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#18213D]">
                Daily Learning Target
              </h3>
              <p className="font-['Barlow'] text-sm text-[#4B505C]">
                Set a comfortable daily pace. Goals are motivational and never lock access.
              </p>
            </div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#057A55] bg-[#057A55]/10 px-2 py-1 rounded-[5px]">
                <Check className="w-3.5 h-3.5" />
                Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {goalOptions.map((mins) => {
              const isSelected = profile.dailyGoalMinutes === mins;
              return (
                <button
                  key={mins}
                  onClick={() => handleGoalChange(mins)}
                  className={`p-3.5 rounded-[7px] border text-center transition-all ${
                    isSelected
                      ? 'bg-[#18213D] text-[#FAF4E9] border-[#18213D] shadow-xs'
                      : 'bg-[#F9F2E5] text-[#18213D] border-[#CEC0AD] hover:border-[#2A56A3]'
                  }`}
                >
                  <div className="font-['JetBrains_Mono'] text-lg font-bold">
                    {mins} min
                  </div>
                  <div className="text-[10px] font-['Barlow_Semi_Condensed'] font-semibold uppercase tracking-wider opacity-80">
                    {mins === 5 ? 'Casual' : mins === 10 ? 'Standard' : mins === 15 ? 'Serious' : 'Intense'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Zero Hardware Guarantee Card */}
        <div className="rounded-[9px] bg-[#E3D8CA] border border-[#CEC0AD] p-6 space-y-2">
          <h3 className="font-['Barlow_Semi_Condensed'] text-lg font-bold text-[#18213D] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C0652D]" />
            Physical Hardware is 100% Optional
          </h3>
          <p className="font-['Barlow'] text-xs text-[#4B505C] leading-relaxed">
            The entire core curriculum, circuit construction, firmware execution, and quizzes are fully supported inside the in-browser Virtual Lab. You do not need to purchase an ESP32 or breadboard to complete the program.
          </p>
        </div>

        {/* Reset Progress Action */}
        <div className="pt-4 flex justify-between items-center text-xs text-[#5C6066]">
          <span>Reset your progress back to Module 0 for testing</span>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all lesson progress and XP?')) {
                resetProgress();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-[#FAF4E9] border border-[#CEC0AD] hover:bg-[#E02424]/10 hover:text-[#E02424] text-[#5C6066] font-['Barlow_Semi_Condensed'] font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
}
