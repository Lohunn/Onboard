import React, { useState } from 'react';
import { useLearnerStore } from '../store/useLearnerStore';
import { ACHIEVEMENTS, getLearnerRank } from '../services/gamificationService';
import ProgressBar from '../components/ui/ProgressBar';
import {
  Award,
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  History,
  ShieldCheck,
  Calendar,
  Filter,
} from 'lucide-react';

export default function Achievements() {
  const {
    xp,
    streakDays,
    longestStreak,
    lastActiveDate,
    achievements,
    xpTransactions = [],
    profile,
  } = useLearnerStore();

  const [activeTab, setActiveTab] = useState('badges'); // 'badges' | 'ledger'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const rank = getLearnerRank(xp);
  const unlockedIds = achievements.map((a) => a.id);

  const categories = ['all', 'Getting Started', 'Hardware', 'Virtual Lab', 'Sensors', 'Consistency'];

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    if (selectedCategory === 'all') return true;
    return ach.category.toLowerCase() === selectedCategory.toLowerCase();
  });

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
          Celebrate demonstrated learning. Earn XP by completing verified lessons, guided circuit experiments, and debugging challenges.
        </p>
      </div>

      {/* Gamification Summary Card */}
      <div className="rounded-[11px] bg-[#FAF4E9] border border-[#CEC0AD] p-6 sm:p-8 mb-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Level Progress */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#2A56A3]">
                  Current Rank
                </span>
                <h2 className="font-['Barlow_Semi_Condensed'] text-2xl sm:text-3xl font-bold text-[#18213D]">
                  Level {rank.level}: {rank.title}
                </h2>
              </div>
              <span className="font-['JetBrains_Mono'] text-sm font-semibold text-[#18213D]">
                {rank.xpInCurrentLevel} / 100 XP ({rank.xpNeeded} XP to Level {rank.level + 1})
              </span>
            </div>
            <ProgressBar value={rank.xpInCurrentLevel} max={100} variant="blue" size="md" />
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
                Reconciled XP
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

      {/* Positive Streak Momentum Banner (No shame-based copy, no hearts lock) */}
      <div className="rounded-[9px] bg-[#2A56A3]/5 border border-[#2A56A3]/20 p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-[7px] bg-[#2A56A3]/10 text-[#2A56A3]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="font-['Barlow_Semi_Condensed'] font-bold text-base text-[#18213D]">
              Learning Habit: {streakDays} Day Streak (Record: {longestStreak} days)
            </div>
            <p className="font-['Barlow'] text-xs text-[#5C6066]">
              Every validated lesson, circuit build, or checkpoint maintains your streak. Calculated in your local timezone ({profile.timezone || 'UTC'}).
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] bg-[#FAF4E9] border border-[#CEC0AD] text-xs font-['JetBrains_Mono'] text-[#5C6066]">
          <Calendar className="w-3.5 h-3.5" />
          Last active: {lastActiveDate || 'Today'}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#CEC0AD] mb-8">
        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-3 px-4 font-['Barlow_Semi_Condensed'] text-base font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'badges'
              ? 'border-[#2A56A3] text-[#2A56A3]'
              : 'border-transparent text-[#5C6066] hover:text-[#18213D]'
          }`}
        >
          <Award className="w-4 h-4" />
          Milestone Badges ({unlockedIds.length} / {ACHIEVEMENTS.length})
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 px-4 font-['Barlow_Semi_Condensed'] text-base font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'ledger'
              ? 'border-[#2A56A3] text-[#2A56A3]'
              : 'border-transparent text-[#5C6066] hover:text-[#18213D]'
          }`}
        >
          <History className="w-4 h-4" />
          Server XP Ledger ({xpTransactions.length} entries)
        </button>
      </div>

      {/* Tab 1: Badges */}
      {activeTab === 'badges' && (
        <div>
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <span className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase text-[#5C6066] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-[5px] text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#18213D] text-[#FAF4E9]'
                    : 'bg-[#FAF4E9] text-[#5C6066] border border-[#CEC0AD] hover:bg-[#E3D8CA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((ach) => {
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
      )}

      {/* Tab 2: Server XP Ledger */}
      {activeTab === 'ledger' && (
        <div className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] overflow-hidden shadow-xs">
          <div className="p-4 sm:p-6 bg-[#F9F2E5] border-b border-[#CEC0AD] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-['Barlow_Semi_Condensed'] text-lg font-bold text-[#18213D] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#057A55]" />
                Immutable XP Audit Ledger
              </h3>
              <p className="font-['Barlow'] text-xs text-[#5C6066]">
                Every XP award is cryptographically indexed by unique idempotency keys to prevent double-claiming.
              </p>
            </div>
            <div className="font-['JetBrains_Mono'] text-xs font-bold text-[#2A56A3] bg-[#2A56A3]/10 px-3 py-1.5 rounded-[5px]">
              Ledger Sum: {xp} XP
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#CEC0AD] bg-[#FAF4E9] text-[11px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Reason Code</th>
                  <th className="py-3 px-4">Source ID</th>
                  <th className="py-3 px-4">Idempotency Key</th>
                  <th className="py-3 px-4 text-right">XP Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CEC0AD]/40 text-xs font-['JetBrains_Mono']">
                {[...xpTransactions].reverse().map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F9F2E5]/50 transition-colors">
                    <td className="py-3 px-4 text-[#5C6066]">
                      {new Date(tx.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#18213D]/10 text-[#18213D] font-bold text-[10px]">
                        {tx.reasonCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#18213D] font-medium">{tx.sourceId}</td>
                    <td className="py-3 px-4 text-[#5C6066] text-[11px] truncate max-w-xs" title={tx.idempotencyKey}>
                      {tx.idempotencyKey}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#2A56A3]">
                      +{tx.amount} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
