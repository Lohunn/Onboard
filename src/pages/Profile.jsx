import React, { useState } from 'react';
import { useLearnerStore } from '../store/useLearnerStore';
import { ShieldCheck, RotateCcw, Check, Sparkles, Globe, Clock } from 'lucide-react';

const COMMON_TIMEZONES = [
  { label: 'UTC (Coordinated Universal Time)', value: 'UTC' },
  { label: 'America/New_York (Eastern Time)', value: 'America/New_York' },
  { label: 'America/Chicago (Central Time)', value: 'America/Chicago' },
  { label: 'America/Denver (Mountain Time)', value: 'America/Denver' },
  { label: 'America/Los_Angeles (Pacific Time)', value: 'America/Los_Angeles' },
  { label: 'Europe/London (GMT/BST)', value: 'Europe/London' },
  { label: 'Europe/Paris (CET)', value: 'Europe/Paris' },
  { label: 'Asia/Kolkata (IST)', value: 'Asia/Kolkata' },
  { label: 'Asia/Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Australia/Sydney (AEST)', value: 'Australia/Sydney' },
];

export default function Profile() {
  const {
    profile,
    xp,
    streakDays,
    longestStreak,
    completedLessonIds,
    updateDailyGoal,
    updateTimezone,
    resetProgress,
  } = useLearnerStore();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const goalOptions = [5, 10, 15, 20];

  const handleGoalChange = (minutes) => {
    updateDailyGoal(minutes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTzChange = (e) => {
    updateTimezone(e.target.value);
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
          Manage your daily learning target, configure timezone for streak tracking, and customize your beginner journey.
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
                Reconciled Experience
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
                {streakDays} Days <span className="text-xs text-[#5C6066] font-normal">(Best: {longestStreak})</span>
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

        {/* Timezone Preference Card */}
        <div className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#18213D] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#2A56A3]" />
                Learner Timezone (Streak Accounting)
              </h3>
              <p className="font-['Barlow'] text-sm text-[#4B505C]">
                Streaks are strictly evaluated using your local calendar date to ensure midnight boundaries match your real day.
              </p>
            </div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#057A55] bg-[#057A55]/10 px-2 py-1 rounded-[5px]">
                <Check className="w-3.5 h-3.5" />
                Updated
              </span>
            )}
          </div>

          <div className="pt-2 max-w-md">
            <label className="block text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066] mb-1">
              Active Timezone
            </label>
            <select
              value={profile.timezone || 'UTC'}
              onChange={handleTzChange}
              className="w-full bg-[#FAF4E9] border border-[#CEC0AD] rounded-[7px] py-2 px-3 text-sm font-['JetBrains_Mono'] text-[#18213D] focus:outline-hidden focus:border-[#2A56A3]"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Daily Goal Target */}
        <div className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#18213D] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#C0652D]" />
                Daily Learning Target
              </h3>
              <p className="font-['Barlow'] text-sm text-[#4B505C]">
                Set a comfortable daily pace. Goals are motivational and never lock access.
              </p>
            </div>
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
                      ? 'bg-[#18213D] border-[#18213D] text-[#FAF4E9] shadow-xs'
                      : 'bg-[#F9F2E5] border-[#CEC0AD] text-[#18213D] hover:bg-[#E3D8CA]'
                  }`}
                >
                  <div className="font-['JetBrains_Mono'] text-xl font-bold">{mins} min</div>
                  <div
                    className={`text-xs font-['Barlow'] mt-0.5 ${
                      isSelected ? 'text-[#FAF4E9]/80' : 'text-[#5C6066]'
                    }`}
                  >
                    {mins === 5 ? 'Quick Dip' : mins === 10 ? 'Standard' : mins === 15 ? 'Solid Focus' : 'Deep Work'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Progress Section */}
        <div className="rounded-[9px] bg-[#FAF4E9] border border-[#C0652D]/30 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#18213D] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C0652D]" />
              Restart Learning Journey
            </h3>
            <p className="font-['Barlow'] text-sm text-[#4B505C] mt-1">
              Reset completed lessons, streak count, and unlocked modules to review from scratch.
            </p>
          </div>

          <div>
            {resetConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    resetProgress();
                    setResetConfirm(false);
                  }}
                  className="px-3.5 py-2 rounded-[7px] bg-[#C0652D] text-white text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider hover:bg-[#A85422]"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-3 py-2 rounded-[7px] border border-[#CEC0AD] text-xs font-['Barlow_Semi_Condensed'] font-semibold text-[#5C6066]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[7px] border border-[#C0652D]/40 text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#C0652D] uppercase tracking-wider hover:bg-[#C0652D]/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Progress
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
