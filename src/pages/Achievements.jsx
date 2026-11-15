import React from 'react';
import { useLearnerStore } from '../store/useLearnerStore';
import { ACHIEVEMENTS } from '../services/gamificationService';
import ProgressBar from '../components/ui/ProgressBar';
import { Award, Flame, Zap, CheckCircle2, Lock } from 'lucide-react';

export default function Achievements() {
  const { xp, streakDays, achievements } = useLearnerStore();
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  const unlockedIds = achievements.map((a) => a.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <span className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#C0652D] block mb-1">
          GAMIFICATION & PROGRESS
        </span>
        <h1 className="font-['Barlow_Semi_Condensed'] text-4xl sm:text-5xl font-bold text-[#18213D] tracking-tight">
          Achievements & XP Ledger
        </h1>
        <p className="font-['Barlow'] text-base sm:text-lg text-[#4B505C] mt-2 leading-relaxed">
          Celebrate demonstrated learning. Earn XP by completing server-validated lessons, guided circuit experiments, and debugging challenges.
        </p>
      </div>

      {/* Gamification Summary Card */}
      <div className="rounded-[11px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 sm:p-8 mb-12 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Level Progress */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#2A56A3]">
                  Current Rank
                </span>
                <h2 className="font-['Barlow_Semi_Condensed'] text-2xl sm:text-3xl font-bold text-[#18213D]">
                  Level {currentLevel}: Electronics Explorer
                </h2>
              </div>
              <span className="font-['JetBrains_Mono'] text-sm font-semibold text-[#18213D]">
                {xpInCurrentLevel} / 100 XP to Level {currentLevel + 1}
              </span>
            </div>
            <ProgressBar value={xpInCurrentLevel} max={100} variant="blue" size="md" />
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center justify-around bg-[#F9F2E5] p-4 rounded-[9px] border border-[#CEC0AD]">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-['JetBrains_Mono'] font-bold text-[#C0652D]">
                <Flame className="w-5 h-5 fill-current" />
                {streakDays}
              </div>
              <div className="text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                Day Streak
              </div>
            </div>

            <div className="h-8 w-px bg-[#CEC0AD]" />

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-['JetBrains_Mono'] font-bold text-[#2A56A3]">
                <Zap className="w-5 h-5 fill-current" />
                {xp}
              </div>
              <div className="text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                Total XP
              </div>
            </div>

            <div className="h-8 w-px bg-[#CEC0AD]" />

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-['JetBrains_Mono'] font-bold text-[#057A55]">
                <Award className="w-5 h-5" />
                {unlockedIds.length}
              </div>
              <div className="text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                Badges
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="mb-12">
        <h2 className="font-['Barlow_Semi_Condensed'] text-2xl font-bold text-[#18213D] mb-6">
          Milestone Badges ({unlockedIds.length} of {ACHIEVEMENTS.length} Unlocked)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`rounded-[9px] border p-6 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-[#FAF4E9] border-[#2A56A3] shadow-xs'
                    : 'bg-[#F9F2E5]/70 border-[#CEC0AD] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{ach.icon}</span>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#057A55] bg-[#057A55]/10 px-2 py-0.5 rounded-[4px] uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-['Barlow_Semi_Condensed'] font-semibold text-[#5C6066] bg-[#E3D8CA] px-2 py-0.5 rounded-[4px]">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>

                  <h3 className="font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#18213D] mb-1">
                    {ach.title}
                  </h3>
                  <p className="font-['Barlow'] text-xs text-[#5C6066] mb-2 uppercase font-semibold">
                    {ach.category}
                  </p>
                  <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed mb-4">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#CEC0AD]/40 flex items-center justify-between text-xs font-['JetBrains_Mono']">
                  <span className="text-[#5C6066]">Reward:</span>
                  <span className="font-bold text-[#2A56A3]">+{ach.xpReward} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
