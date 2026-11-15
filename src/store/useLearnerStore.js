import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  XP_CONFIG,
  REASON_CODES,
  deriveTotalXP,
  processXPTransaction,
  calculateStreak,
  evaluateAchievements,
  getSafeTimezone,
  formatLocalDate,
} from '../services/gamificationService';

const defaultTz = getSafeTimezone();
const initialTimestamp = new Date().toISOString();
const initialDate = formatLocalDate(initialTimestamp, defaultTz);

// Initial verified seed data
const initialTransactions = [
  {
    id: 'tx-seed-1',
    userId: 'learner-1',
    amount: 20,
    reasonCode: REASON_CODES.FIRST_LESSON,
    sourceType: 'lesson',
    sourceId: 'lesson-0-welcome',
    idempotencyKey: 'complete-lesson-lesson-0-welcome',
    metadata: { title: 'Welcome to Onboard' },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tx-seed-2',
    userId: 'learner-1',
    amount: 20,
    reasonCode: REASON_CODES.FIRST_LESSON,
    sourceType: 'lesson',
    sourceId: 'lesson-0-circuit-intro',
    idempotencyKey: 'complete-lesson-lesson-0-circuit-intro',
    metadata: { title: 'What is a Circuit?' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'tx-seed-3',
    userId: 'learner-1',
    amount: 20,
    reasonCode: REASON_CODES.ACHIEVEMENT,
    sourceType: 'achievement',
    sourceId: 'first_spark',
    idempotencyKey: 'achievement-first_spark',
    metadata: { title: 'First Spark Achievement' },
    createdAt: initialTimestamp,
  },
];

const initialActivities = [
  {
    id: 'act-seed-1',
    userId: 'learner-1',
    activityType: 'lesson_completed',
    sourceType: 'lesson',
    sourceId: 'lesson-0-welcome',
    occurredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    localActivityDate: formatLocalDate(new Date(Date.now() - 86400000 * 2), defaultTz),
  },
  {
    id: 'act-seed-2',
    userId: 'learner-1',
    activityType: 'lesson_completed',
    sourceType: 'lesson',
    sourceId: 'lesson-0-circuit-intro',
    occurredAt: new Date(Date.now() - 86400000).toISOString(),
    localActivityDate: formatLocalDate(new Date(Date.now() - 86400000), defaultTz),
  },
  {
    id: 'act-seed-3',
    userId: 'learner-1',
    activityType: 'checkpoint_passed',
    sourceType: 'checkpoint',
    sourceId: 'chk-circuits-closed',
    occurredAt: initialTimestamp,
    localActivityDate: initialDate,
  },
];

export const useLearnerStore = create(
  persist(
    (set, get) => ({
      // Profile
      profile: {
        displayName: 'Learner',
        email: 'learner@onboard.dev',
        dailyGoalMinutes: 10,
        experienceLevel: 'absolute_beginner',
        onboardingCompleted: true,
        timezone: defaultTz,
      },

      // XP Ledger & Activities
      xpTransactions: initialTransactions,
      activities: initialActivities,
      exploredComponentIds: ['esp32-devkit-v1', 'led-5mm-red'],
      passedCheckpointIds: ['chk-circuits-closed'],
      verifiedExperimentIds: [],
      solvedBugIds: [],

      // Derived cached totals (always reconciled with ledger)
      xp: deriveTotalXP(initialTransactions),
      streakDays: 3,
      longestStreak: 3,
      lastActiveDate: initialDate,

      // Achievements
      achievements: [
        {
          id: 'first_spark',
          title: 'First Spark',
          description: 'Complete your very first lesson on Onboard.',
          icon: '⚡',
          category: 'Getting Started',
          xpReward: 20,
          unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ],

      // Progress in "Electronics Zero-to-ESP32"
      activePathId: 'path-zero-to-esp32',
      completedLessonIds: ['lesson-0-welcome', 'lesson-0-circuit-intro'],
      activeLessonId: 'lesson-1-voltage-current',
      unlockedModuleIds: ['mod-0-welcome', 'mod-1-electricity'],

      // Core Action: Record validated learning activity and recompute streak & achievements
      recordActivity: (activityType, sourceType, sourceId, metadata = {}) => {
        const state = get();
        const tz = state.profile.timezone || defaultTz;
        const now = new Date();
        const occurredAt = now.toISOString();
        const localActivityDate = formatLocalDate(now, tz);

        const newActivity = {
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          userId: 'learner-1',
          activityType,
          sourceType,
          sourceId,
          occurredAt,
          localActivityDate,
          metadata,
        };

        const updatedActivities = [...state.activities, newActivity];
        const streakInfo = calculateStreak(updatedActivities, tz, now);

        set({
          activities: updatedActivities,
          streakDays: streakInfo.currentStreak,
          longestStreak: streakInfo.longestStreak,
          lastActiveDate: streakInfo.lastActivityDate,
        });

        // Trigger achievement check
        get().checkAchievements();
      },

      // Core Action: Add XP Transaction through Server-Authoritative Ledger
      awardXP: ({
        amount,
        reasonCode,
        sourceType,
        sourceId,
        idempotencyKey,
        metadata = {},
      }) => {
        const state = get();
        const result = processXPTransaction(state.xpTransactions, {
          userId: 'learner-1',
          amount,
          reasonCode,
          sourceType,
          sourceId,
          idempotencyKey,
          metadata,
        });

        if (result.status === 'awarded') {
          set({
            xpTransactions: result.ledger,
            xp: result.totalXP,
          });
        }

        return result;
      },

      // Action: Complete Lesson (Server-Authoritative, Idempotent, Anti-farming)
      completeLesson: (lessonId, xpReward = XP_CONFIG.FIRST_LESSON_COMPLETION) => {
        const state = get();
        const isFirstTime = !state.completedLessonIds.includes(lessonId);

        // 1. Process XP Transaction with idempotency key
        const idempotencyKey = `complete-lesson-${lessonId}`;
        const xpResult = get().awardXP({
          amount: isFirstTime ? xpReward : XP_CONFIG.REVIEW_SESSION,
          reasonCode: isFirstTime ? REASON_CODES.FIRST_LESSON : REASON_CODES.REVIEW,
          sourceType: 'lesson',
          sourceId: lessonId,
          idempotencyKey: isFirstTime ? idempotencyKey : `${idempotencyKey}-review-${Date.now()}`,
          metadata: { lessonId, isFirstTime },
        });

        // 2. Mark completed in state
        if (isFirstTime) {
          set({ completedLessonIds: [...state.completedLessonIds, lessonId] });
        }

        // 3. Record Meaningful Activity
        get().recordActivity('lesson_completed', 'lesson', lessonId, { xpAwarded: xpResult.transaction?.amount });

        return xpResult;
      },

      // Action: Pass Checkpoint
      passCheckpoint: (checkpointId) => {
        const state = get();
        if (!state.passedCheckpointIds.includes(checkpointId)) {
          set({ passedCheckpointIds: [...state.passedCheckpointIds, checkpointId] });

          get().awardXP({
            amount: XP_CONFIG.LESSON_CHECKPOINT,
            reasonCode: REASON_CODES.CHECKPOINT,
            sourceType: 'checkpoint',
            sourceId: checkpointId,
            idempotencyKey: `chk-${checkpointId}`,
          });

          get().recordActivity('checkpoint_passed', 'checkpoint', checkpointId);
        }
      },

      // Action: Verify Experiment
      verifyExperiment: (experimentId) => {
        const state = get();
        const isFirstTime = !state.verifiedExperimentIds.includes(experimentId);
        if (isFirstTime) {
          set({ verifiedExperimentIds: [...state.verifiedExperimentIds, experimentId] });
        }

        get().awardXP({
          amount: isFirstTime ? XP_CONFIG.GUIDED_EXPERIMENT : XP_CONFIG.REVIEW_SESSION,
          reasonCode: isFirstTime ? REASON_CODES.GUIDED_EXPERIMENT : REASON_CODES.REVIEW,
          sourceType: 'experiment',
          sourceId: experimentId,
          idempotencyKey: `exp-${experimentId}`,
        });

        get().recordActivity('experiment_verified', 'experiment', experimentId);
      },

      // Action: Record Pin/Component Exploration
      recordExploration: (targetId) => {
        const state = get();
        if (!state.exploredComponentIds.includes(targetId)) {
          const updated = [...state.exploredComponentIds, targetId];
          set({ exploredComponentIds: updated });
          get().checkAchievements();
        }
      },

      // Action: Check Achievements and award XP for any newly unlocked
      checkAchievements: () => {
        const state = get();
        const currentUnlockedIds = state.achievements.map((a) => a.id);

        const newlyUnlocked = evaluateAchievements({
          unlockedAchievementIds: currentUnlockedIds,
          completedLessons: state.completedLessonIds,
          exploredCount: state.exploredComponentIds.length,
          passedCheckpoints: state.passedCheckpointIds,
          verifiedExperiments: state.verifiedExperimentIds,
          solvedBugs: state.solvedBugIds,
          completedModules: state.unlockedModuleIds.filter((m) => m === 'mod-10-capstone'),
          currentStreak: state.streakDays,
        });

        if (newlyUnlocked.length > 0) {
          set({ achievements: [...state.achievements, ...newlyUnlocked] });

          // Award XP for each unlocked achievement
          for (const ach of newlyUnlocked) {
            get().awardXP({
              amount: ach.xpReward,
              reasonCode: REASON_CODES.ACHIEVEMENT,
              sourceType: 'achievement',
              sourceId: ach.id,
              idempotencyKey: `achievement-${ach.id}`,
              metadata: { title: ach.title },
            });
          }
        }
      },

      unlockModule: (moduleId) => {
        const state = get();
        if (!state.unlockedModuleIds.includes(moduleId)) {
          set({ unlockedModuleIds: [...state.unlockedModuleIds, moduleId] });
        }
      },

      setActiveLesson: (lessonId) => {
        set({ activeLessonId: lessonId });
      },

      updateDailyGoal: (minutes) => {
        set((state) => ({
          profile: { ...state.profile, dailyGoalMinutes: minutes },
        }));
      },

      updateTimezone: (timezone) => {
        const safeTz = getSafeTimezone(timezone);
        set((state) => ({
          profile: { ...state.profile, timezone: safeTz },
        }));

        // Recalculate streak in the updated timezone
        const state = get();
        const streakInfo = calculateStreak(state.activities, safeTz, new Date());
        set({
          streakDays: streakInfo.currentStreak,
          longestStreak: streakInfo.longestStreak,
          lastActiveDate: streakInfo.lastActivityDate,
        });
      },

      resetProgress: () => {
        const tz = get().profile.timezone || defaultTz;
        const now = new Date();
        const nowIso = now.toISOString();
        const nowDate = formatLocalDate(now, tz);

        const resetTx = [
          {
            id: `tx-reset-${Date.now()}`,
            userId: 'learner-1',
            amount: 20,
            reasonCode: REASON_CODES.ADJUSTMENT,
            sourceType: 'system',
            sourceId: 'reset',
            idempotencyKey: `reset-${Date.now()}`,
            metadata: { note: 'Progress reset to initial' },
            createdAt: nowIso,
          },
        ];

        set({
          xpTransactions: resetTx,
          xp: 20,
          streakDays: 1,
          longestStreak: 1,
          lastActiveDate: nowDate,
          activities: [
            {
              id: `act-reset-${Date.now()}`,
              userId: 'learner-1',
              activityType: 'checkpoint_passed',
              sourceType: 'system',
              sourceId: 'reset',
              occurredAt: nowIso,
              localActivityDate: nowDate,
            },
          ],
          exploredComponentIds: ['esp32-devkit-v1'],
          passedCheckpointIds: [],
          verifiedExperimentIds: [],
          solvedBugIds: [],
          achievements: [],
          completedLessonIds: [],
          activeLessonId: 'lesson-0-welcome',
          unlockedModuleIds: ['mod-0-welcome'],
        });
      },
    }),
    {
      name: 'onboard-learner-storage',
    }
  )
);
