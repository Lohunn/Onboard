/**
 * Onboard Gamification Service & XP Ledger Engine
 * Conforms to Section 5H, Section 10 (XPTransaction, UserStreak, LearningActivity, UserAchievement),
 * and Section 16 (Prompt 4) of ONBOARD Product Architecture & MVP Specification.
 *
 * Core Guarantees:
 * 1. Server-authoritative / ledger-derived XP (never trust naked frontend numbers).
 * 2. Strict unique idempotency keys preventing duplicate XP awards.
 * 3. Anti-farming rules: repeat completions transition to capped review XP.
 * 4. Timezone-aware streak calculation based on validated meaningful learning activities.
 * 5. Criteria-based achievement unlocking with XP rewards.
 * 6. Positive reinforcement only: zero shame-based copy or hearts locks.
 */

// ─── Initial Configurable Rewards (per Spec Section 16, Prompt 4) ───
export const XP_CONFIG = {
  FIRST_LESSON_COMPLETION: 20,
  LESSON_CHECKPOINT: 10,
  GUIDED_EXPERIMENT: 30,
  INDEPENDENT_CHALLENGE: 50,
  MODULE_COMPLETION: 75,
  REVIEW_SESSION: 10,
  EXPLORATION: 15,
};

// ─── Reason Codes ───
export const REASON_CODES = {
  FIRST_LESSON: 'FIRST_LESSON',
  CHECKPOINT: 'CHECKPOINT',
  GUIDED_EXPERIMENT: 'GUIDED_EXPERIMENT',
  INDEPENDENT_CHALLENGE: 'INDEPENDENT_CHALLENGE',
  MODULE_COMPLETION: 'MODULE_COMPLETION',
  REVIEW: 'REVIEW',
  ACHIEVEMENT: 'ACHIEVEMENT',
  ADJUSTMENT: 'ADJUSTMENT',
};

// ─── Validated Meaningful Activity Types ───
export const MEANINGFUL_ACTIVITY_TYPES = new Set([
  'lesson_completed',
  'checkpoint_passed',
  'experiment_verified',
  'challenge_passed',
  'module_completed',
]);

// ─── Achievement Catalog ───
export const ACHIEVEMENTS = [
  {
    id: 'first_spark',
    title: 'First Spark',
    description: 'Complete your very first lesson on Onboard.',
    icon: '⚡',
    category: 'Getting Started',
    xpReward: 20,
    check: ({ completedLessons }) => (completedLessons?.length || 0) >= 1,
  },
  {
    id: 'circuit_curious',
    title: 'Circuit Curious',
    description: 'Inspect 5 board pins or virtual electronic components.',
    icon: '🔍',
    category: 'Exploration',
    xpReward: 15,
    check: ({ exploredCount }) => (exploredCount || 0) >= 5,
  },
  {
    id: 'pin_detective',
    title: 'Pin Detective',
    description: 'Pass the ESP32 board explorer pinout checkpoint.',
    icon: '📌',
    category: 'Hardware',
    xpReward: 25,
    check: ({ passedCheckpoints }) => passedCheckpoints?.includes('chk-pinout-esp32'),
  },
  {
    id: 'light_it_up',
    title: 'Light It Up',
    description: 'Successfully wire and run the virtual LED blink experiment.',
    icon: '💡',
    category: 'Virtual Lab',
    xpReward: 30,
    check: ({ verifiedExperiments }) => verifiedExperiments?.includes('exp-01-blink'),
  },
  {
    id: 'button_boss',
    title: 'Button Boss',
    description: 'Master digital inputs by building the button-controlled circuit.',
    icon: '🔘',
    category: 'Virtual Lab',
    xpReward: 30,
    check: ({ verifiedExperiments }) => verifiedExperiments?.includes('exp-02-button'),
  },
  {
    id: 'bug_hunter',
    title: 'Bug Hunter',
    description: 'Diagnose and fix a seeded circuit error using Explain Mode.',
    icon: '🐞',
    category: 'Troubleshooting',
    xpReward: 35,
    check: ({ solvedBugs }) => (solvedBugs?.length || 0) >= 1,
  },
  {
    id: 'analog_explorer',
    title: 'Analog Explorer',
    description: 'Read and map changing voltages from a potentiometer ADC.',
    icon: '🌊',
    category: 'Sensors',
    xpReward: 40,
    check: ({ verifiedExperiments }) => verifiedExperiments?.includes('exp-03-potentiometer'),
  },
  {
    id: 'first_mission',
    title: 'First Mission',
    description: 'Complete the Smart Indicator beginner capstone project.',
    icon: '🏆',
    category: 'Milestones',
    xpReward: 75,
    check: ({ completedModules, completedLessons }) =>
      completedModules?.includes('mod-9-smart-indicator') ||
      completedModules?.includes('mod-10-capstone') ||
      completedLessons?.includes('lesson-9-final-mission'),
  },
  {
    id: 'smart_indicator_master',
    title: 'Smart Indicator Master',
    description: 'Master physical computing by designing and verifying the Smart Indicator capstone project.',
    icon: '🎖️',
    category: 'Milestones',
    xpReward: 100,
    check: ({ verifiedExperiments, completedLessons }) =>
      verifiedExperiments?.includes('exp-smart-indicator') ||
      completedLessons?.includes('lesson-9-final-mission'),
  },
  {
    id: 'consistent_builder',
    title: 'Consistent Builder',
    description: 'Maintain a 7-day learning streak.',
    icon: '🔥',
    category: 'Consistency',
    xpReward: 50,
    check: ({ currentStreak }) => (currentStreak || 0) >= 7,
  },
];

// ─── Timezone Helpers ───

/**
 * Returns a valid IANA timezone string, falling back to UTC if invalid.
 */
export function getSafeTimezone(tz) {
  if (!tz || typeof tz !== 'string') {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  }
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return tz;
  } catch {
    return 'UTC';
  }
}

/**
 * Formats a Date or ISO timestamp into YYYY-MM-DD in the learner's specified timezone.
 */
export function formatLocalDate(dateInput, timezone = 'UTC') {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const safeTz = getSafeTimezone(timezone);

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: safeTz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(date); // en-CA produces YYYY-MM-DD
}

/**
 * Calculates day difference between two YYYY-MM-DD strings.
 */
export function dateDiffInDays(dateStrA, dateStrB) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const dateA = new Date(dateStrA + 'T00:00:00Z');
  const dateB = new Date(dateStrB + 'T00:00:00Z');
  return Math.round((dateB.getTime() - dateA.getTime()) / msPerDay);
}

// ─── XP Ledger & Idempotency Engine ───

/**
 * Derives total XP by summing all valid transactions in the ledger.
 */
export function deriveTotalXP(transactions = []) {
  return transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);
}

/**
 * Attempts to award XP by creating an immutable XPTransaction.
 * Enforces unique idempotency keys: duplicate keys return the existing transaction without adding XP.
 * Enforces anti-farming rules for repeated actions.
 */
export function processXPTransaction(ledger = [], request = {}) {
  const {
    userId = 'learner-1',
    amount,
    reasonCode = REASON_CODES.ADJUSTMENT,
    sourceType = 'system',
    sourceId = 'system-action',
    idempotencyKey,
    metadata = {},
    createdAt = new Date().toISOString(),
  } = request;

  if (!idempotencyKey) {
    throw new Error('XPTransaction requires a unique idempotencyKey');
  }

  // 1. Idempotency Check
  const existing = ledger.find((tx) => tx.idempotencyKey === idempotencyKey);
  if (existing) {
    return {
      status: 'duplicate',
      transaction: existing,
      ledger,
      totalXP: deriveTotalXP(ledger),
      isNew: false,
    };
  }

  // 2. Anti-farming validation: if completing a lesson already awarded in history
  let finalAmount = amount;
  let finalReason = reasonCode;

  if (sourceType === 'lesson') {
    const previousLessonAwards = ledger.filter(
      (tx) => tx.sourceType === 'lesson' && tx.sourceId === sourceId && tx.amount > 0
    );

    if (previousLessonAwards.length > 0) {
      // Already awarded first-time completion: downgrade to Review XP (10 XP)
      finalAmount = XP_CONFIG.REVIEW_SESSION;
      finalReason = REASON_CODES.REVIEW;
    }
  }

  // 3. Create immutable transaction
  const newTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    amount: finalAmount,
    reasonCode: finalReason,
    sourceType,
    sourceId,
    idempotencyKey,
    metadata,
    createdAt,
  };

  const updatedLedger = [...ledger, newTransaction];

  return {
    status: 'awarded',
    transaction: newTransaction,
    ledger: updatedLedger,
    totalXP: deriveTotalXP(updatedLedger),
    isNew: true,
  };
}

// ─── Streak Calculator (Timezone-Aware) ───

/**
 * Calculates current and longest streak from validated meaningful learning activities.
 * Only validated meaningful actions count toward streaks.
 */
export function calculateStreak(activities = [], timezone = 'UTC', referenceDate = new Date()) {
  const safeTz = getSafeTimezone(timezone);
  const todayStr = formatLocalDate(referenceDate, safeTz);

  // Filter to validated meaningful activities only
  const validActivities = activities.filter(
    (act) => act && MEANINGFUL_ACTIVITY_TYPES.has(act.activityType)
  );

  if (validActivities.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      isActiveToday: false,
    };
  }

  // Extract distinct active calendar dates sorted ascending
  const uniqueDates = Array.from(
    new Set(
      validActivities.map((act) =>
        act.localActivityDate || formatLocalDate(act.occurredAt, safeTz)
      )
    )
  ).sort();

  const lastActivityDate = uniqueDates[uniqueDates.length - 1];
  const diffFromToday = dateDiffInDays(lastActivityDate, todayStr);

  // Determine current streak
  let currentStreak = 0;
  const isActiveToday = diffFromToday === 0;

  if (diffFromToday === 0 || diffFromToday === 1) {
    // Active today or active yesterday: walk backward through consecutive dates
    currentStreak = 1;
    let expectedPrevDate = lastActivityDate;

    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const prevDate = uniqueDates[i];
      const diff = dateDiffInDays(prevDate, expectedPrevDate);
      if (diff === 1) {
        currentStreak++;
        expectedPrevDate = prevDate;
      } else if (diff > 1) {
        break; // Streak broke prior to this point
      }
    }
  } else {
    // Gap >= 2 days: current streak has lapsed to 0
    currentStreak = 0;
  }

  // Compute longest streak across all history
  let longestStreak = 0;
  let running = 0;
  let prev = null;

  for (const d of uniqueDates) {
    if (!prev) {
      running = 1;
    } else {
      const diff = dateDiffInDays(prev, d);
      if (diff === 1) {
        running++;
      } else if (diff > 1) {
        running = 1;
      }
    }
    if (running > longestStreak) {
      longestStreak = running;
    }
    prev = d;
  }

  return {
    currentStreak,
    longestStreak,
    lastActivityDate,
    isActiveToday,
  };
}

// ─── Achievement Evaluator ───

/**
 * Checks all achievement conditions against learner state and returns newly unlocked achievements.
 */
export function evaluateAchievements(state = {}) {
  const {
    unlockedAchievementIds = [],
    completedLessons = [],
    exploredCount = 0,
    passedCheckpoints = [],
    verifiedExperiments = [],
    solvedBugs = [],
    completedModules = [],
    currentStreak = 0,
  } = state;

  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS) {
    if (unlockedAchievementIds.includes(ach.id)) {
      continue; // Already unlocked
    }

    const context = {
      completedLessons,
      exploredCount,
      passedCheckpoints,
      verifiedExperiments,
      solvedBugs,
      completedModules,
      currentStreak,
    };

    if (ach.check(context)) {
      newlyUnlocked.push({
        id: ach.id,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        category: ach.category,
        xpReward: ach.xpReward,
        unlockedAt: new Date().toISOString(),
      });
    }
  }

  return newlyUnlocked;
}

// ─── Rank / Level Progression ───

export function getLearnerRank(xp) {
  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;
  const xpNeeded = 100 - xpInCurrentLevel;

  let title = 'Electronics Novice';
  if (level >= 2 && level < 4) title = 'Breadboard Apprentice';
  else if (level >= 4 && level < 7) title = 'Circuit Crafter';
  else if (level >= 7 && level < 10) title = 'ESP32 Builder';
  else if (level >= 10) title = 'Master Embedded Engineer';

  return {
    level,
    title,
    xpInCurrentLevel,
    xpNeeded,
  };
}
