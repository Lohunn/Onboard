import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      },

      // Gamification
      xp: 60,
      streakDays: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      achievements: [
        { id: 'first_spark', title: 'First Spark', unlockedAt: new Date().toISOString() },
        { id: 'circuit_curious', title: 'Circuit Curious', unlockedAt: new Date().toISOString() },
      ],

      // Progress in "Electronics Zero-to-ESP32"
      activePathId: 'path-zero-to-esp32',
      completedLessonIds: ['lesson-0-welcome', 'lesson-0-circuit-intro'],
      activeLessonId: 'lesson-1-voltage-current',
      unlockedModuleIds: ['mod-0-welcome', 'mod-1-electricity'],

      // Actions
      addXP: (amount, _reason = 'Lesson Completion') => {
        set((state) => ({ xp: state.xp + amount }));
      },

      completeLesson: (lessonId, xpReward = 20) => {
        const state = get();
        if (!state.completedLessonIds.includes(lessonId)) {
          set({
            completedLessonIds: [...state.completedLessonIds, lessonId],
            xp: state.xp + xpReward,
          });
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

      resetProgress: () => {
        set({
          xp: 0,
          streakDays: 1,
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
