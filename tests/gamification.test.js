/**
 * Automated Verification Tests for Onboard Gamification Engine & XP Ledger
 * Conforms to Section 5H, Section 10, and Section 16 (Prompt 4) of MVP Specification.
 *
 * Validates:
 * 1. Server-authoritative XP transactions & duplicate-request idempotency.
 * 2. Anti-farming protection for repeat lesson completions.
 * 3. Timezone boundary handling for learning streaks.
 * 4. Streak continuation, break resets, and longest streak retention.
 * 5. Criteria-based achievement unlocking and idempotent reward generation.
 */

import {
  XP_CONFIG,
  REASON_CODES,
  processXPTransaction,
  deriveTotalXP,
  calculateStreak,
  evaluateAchievements,
  formatLocalDate,
} from '../src/services/gamificationService.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('=== Running Onboard Gamification & XP Ledger Verification Tests ===\n');

// ─── Test Suite 1: XP Ledger & Duplicate-Request Idempotency ───
console.log('Test Suite 1: XP Ledger & Idempotency Key Guarantees');

let ledger = [];
const tx1 = processXPTransaction(ledger, {
  userId: 'test-user',
  amount: XP_CONFIG.FIRST_LESSON_COMPLETION,
  reasonCode: REASON_CODES.FIRST_LESSON,
  sourceType: 'lesson',
  sourceId: 'lesson-0-welcome',
  idempotencyKey: 'idemp-lesson-0-welcome-123',
  metadata: { title: 'Welcome' },
});

assert(tx1.status === 'awarded', 'Initial transaction awarded successfully');
assert(tx1.totalXP === 20, 'Derived total XP is 20 after first transaction');
ledger = tx1.ledger;

// Resubmit with the EXACT same idempotency key (network retry / duplicate submission)
const txDuplicate = processXPTransaction(ledger, {
  userId: 'test-user',
  amount: XP_CONFIG.FIRST_LESSON_COMPLETION,
  reasonCode: REASON_CODES.FIRST_LESSON,
  sourceType: 'lesson',
  sourceId: 'lesson-0-welcome',
  idempotencyKey: 'idemp-lesson-0-welcome-123',
});

assert(txDuplicate.status === 'duplicate', 'Duplicate idempotency key detected as duplicate');
assert(txDuplicate.ledger.length === 1, 'Ledger length unchanged by duplicate request');
assert(txDuplicate.totalXP === 20, 'Total XP remains 20 (no double award)');

// ─── Test Suite 2: Anti-Farming Protection for Repeated Lessons ───
console.log('\nTest Suite 2: Anti-Farming Protection for Repeated Content');

// User completes the same lesson again with a new review idempotency key
const txRepeat = processXPTransaction(ledger, {
  userId: 'test-user',
  amount: XP_CONFIG.FIRST_LESSON_COMPLETION, // Attempts to claim full 20 XP again
  reasonCode: REASON_CODES.FIRST_LESSON,
  sourceType: 'lesson',
  sourceId: 'lesson-0-welcome',
  idempotencyKey: 'idemp-lesson-0-welcome-review-456',
});

assert(txRepeat.status === 'awarded', 'Repeat lesson review awarded');
assert(txRepeat.transaction.amount === XP_CONFIG.REVIEW_SESSION, 'Repeat lesson reward downgraded to Review XP (10 XP)');
assert(txRepeat.transaction.reasonCode === REASON_CODES.REVIEW, 'Reason code downgraded to REVIEW');
ledger = txRepeat.ledger;
assert(deriveTotalXP(ledger) === 30, 'Total XP is now 30 (20 + 10 Review)');

// ─── Test Suite 3: Timezone Boundary Handling ───
console.log('\nTest Suite 3: Timezone Boundaries');

// Test activity at 23:55 in New York (EDT: UTC-4)
// In UTC, this is next day 03:55 AM
const utcTimestamp1 = '2026-05-10T03:55:00Z'; // May 9 23:55 in America/New_York
const nyDate1 = formatLocalDate(utcTimestamp1, 'America/New_York');
const utcDate1 = formatLocalDate(utcTimestamp1, 'UTC');

assert(nyDate1 === '2026-05-09', 'Local date correctly formatted as May 9 in America/New_York');
assert(utcDate1 === '2026-05-10', 'Same timestamp is May 10 in UTC (demonstrating timezone boundary)');

// Second activity at 00:15 May 10 in America/New_York (UTC 04:15)
const utcTimestamp2 = '2026-05-10T04:15:00Z';
const nyDate2 = formatLocalDate(utcTimestamp2, 'America/New_York');
assert(nyDate2 === '2026-05-10', 'Second activity falls on May 10 in America/New_York');

const activitiesTzTest = [
  {
    activityType: 'lesson_completed',
    occurredAt: utcTimestamp1,
    localActivityDate: nyDate1,
  },
  {
    activityType: 'checkpoint_passed',
    occurredAt: utcTimestamp2,
    localActivityDate: nyDate2,
  },
];

const refDateMay10 = new Date('2026-05-10T12:00:00-04:00');
const streakTz = calculateStreak(activitiesTzTest, 'America/New_York', refDateMay10);
assert(streakTz.currentStreak === 2, 'Consecutive activities across midnight in learner timezone yield 2-day streak');

// ─── Test Suite 4: Streak Continuation, Rest Days, & Longest Retention ───
console.log('\nTest Suite 4: Streak Continuation & Gaps');

const streakHistory = [
  { activityType: 'lesson_completed', localActivityDate: '2026-05-01' },
  { activityType: 'lesson_completed', localActivityDate: '2026-05-02' },
  { activityType: 'lesson_completed', localActivityDate: '2026-05-03' },
  { activityType: 'lesson_completed', localActivityDate: '2026-05-04' }, // 4 days streak
  // Gap on May 5, 6
  { activityType: 'lesson_completed', localActivityDate: '2026-05-07' },
  { activityType: 'lesson_completed', localActivityDate: '2026-05-08' }, // 2 days
];

// Evaluate on May 8
const streakEval1 = calculateStreak(streakHistory, 'UTC', new Date('2026-05-08T10:00:00Z'));
assert(streakEval1.currentStreak === 2, 'Current streak is 2 after gap');
assert(streakEval1.longestStreak === 4, 'Longest streak retains historical peak of 4 days');

// Rest day on May 9 (learner has not logged in yet today)
const streakEval2 = calculateStreak(streakHistory, 'UTC', new Date('2026-05-09T10:00:00Z'));
assert(streakEval2.currentStreak === 2, 'Streak is preserved on rest day before lapse');

// Gap > 1 day: learner missed May 9 and May 10, now it is May 11
const streakEval3 = calculateStreak(streakHistory, 'UTC', new Date('2026-05-11T10:00:00Z'));
assert(streakEval3.currentStreak === 0, 'Current streak lapses to 0 after >1 day absence without shame-based penalty');
assert(streakEval3.longestStreak === 4, 'Longest streak still safely preserved at 4');

// Non-meaningful activity check (page views do NOT count towards streaks)
const nonMeaningful = [
  { activityType: 'page_view', localActivityDate: '2026-05-12' },
];
const streakInvalid = calculateStreak(nonMeaningful, 'UTC', new Date('2026-05-12T10:00:00Z'));
assert(streakInvalid.currentStreak === 0, 'Non-meaningful activity (page_view) does not advance streak');

// ─── Test Suite 5: Criteria-Based Achievement Unlocking ───
console.log('\nTest Suite 5: Achievement Unlocking');

// State with 1 completed lesson
const ach1 = evaluateAchievements({
  unlockedAchievementIds: [],
  completedLessons: ['lesson-0-welcome'],
  exploredCount: 1,
});

assert(ach1.some((a) => a.id === 'first_spark'), 'first_spark achievement unlocks on first lesson completion');

// State with 5 explored components
const ach2 = evaluateAchievements({
  unlockedAchievementIds: ['first_spark'],
  completedLessons: ['lesson-0-welcome'],
  exploredCount: 5,
});

assert(ach2.some((a) => a.id === 'circuit_curious'), 'circuit_curious unlocks upon inspecting 5 components');

// Verify that already unlocked achievement is never returned twice
const ach3 = evaluateAchievements({
  unlockedAchievementIds: ['first_spark', 'circuit_curious'],
  completedLessons: ['lesson-0-welcome'],
  exploredCount: 6,
});

assert(ach3.length === 0, 'Already unlocked achievements are not duplicate-awarded');

// State with 7-day streak
const achStreak = evaluateAchievements({
  unlockedAchievementIds: [],
  currentStreak: 7,
});

assert(achStreak.some((a) => a.id === 'consistent_builder'), 'consistent_builder unlocks upon reaching 7-day streak');

// ─── Summary ───
console.log('\n=============================================');
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log('=============================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
