/**
 * Automated Verification Tests for Smart Indicator Capstone Mission & Beta Polish
 * Conforms to Section 6, Section 10, and Section 16 (Prompt 10) of MVP Specification.
 *
 * Verifies:
 * 1. Capstone mission curriculum mapping (Module 9, lesson-9-final-mission).
 * 2. Capstone lesson structure, rich educational blocks, and knowledge check.
 * 3. Smart Indicator experiment definition and wiring in experiments catalog.
 * 4. Deterministic simulation of Smart Indicator state transitions and evidence generation.
 * 5. smart_indicator_master achievement unlocking logic.
 * 6. End-to-end beta user journey integrity (Onboarding → Curriculum → Lab → Mentor → Capstone → Rank).
 */

import { ZERO_TO_ESP32_PATH } from '../src/services/curriculumService.js';
import { LESSONS_DATA } from '../src/data/lessonsData.js';
import { experiments } from '../src/data/experiments.js';
import { runSimulation, verifyChallengeEvidence } from '../src/services/simulatorAdapter.js';
import {
  evaluateAchievements,
  processXPTransaction,
  getLearnerRank,
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

console.log('=== Running Onboard Capstone Mission & Beta Polish Tests ===\n');

// ─── Test Suite 1: Capstone Curriculum & Lesson Integrity ───
console.log('Test Suite 1: Capstone Curriculum & Lesson Integrity');

const mod9 = ZERO_TO_ESP32_PATH.modules.find((m) => m.id === 'mod-9-smart-indicator');
assert(mod9 !== undefined, 'Module 9 exists in curriculum');
assert(mod9.title.includes('Smart Indicator'), 'Module 9 title is Smart Indicator mission');
assert(mod9.prerequisiteModuleId === 'mod-8-debugging', 'Module 9 requires Module 8 as prerequisite');

const capstoneLesson = LESSONS_DATA['lesson-9-final-mission'];
assert(capstoneLesson !== undefined, 'lesson-9-final-mission exists in LESSONS_DATA');
assert(capstoneLesson.moduleId === 'mod-9-smart-indicator', 'Lesson belongs to Module 9');
assert(capstoneLesson.xpReward === 100, 'Capstone mission grants 100 XP');
assert(capstoneLesson.blocks.length === 6, 'Capstone lesson contains 6 rich blocks');

const quizBlock = capstoneLesson.blocks.find((b) => b.type === 'knowledge_check');
assert(quizBlock !== undefined, 'Contains knowledge check block');
assert(quizBlock.correctOptionId === 'kc-opt-1', 'Knowledge check has verified answer');

// ─── Test Suite 2: Capstone Experiment Catalog ───
console.log('\nTest Suite 2: Capstone Experiment Catalog');

const capstoneExp = experiments.find((e) => e.id === 'exp-smart-indicator');
assert(capstoneExp !== undefined, 'exp-smart-indicator exists in experiments catalog');
assert(capstoneExp.category === 'Capstone Mission', 'Category is Capstone Mission');
assert(capstoneExp.boardId === 'esp32-devkit-v1', 'Board is strictly ESP32 DevKit V1');
assert(capstoneExp.componentsNeeded.length >= 4, 'Requires ESP32, button, resistor, and LED');
assert(typeof capstoneExp.starterCode === 'string', 'Starter code provided');
assert(capstoneExp.starterCode.includes('INPUT_PULLUP'), 'Starter code uses INPUT_PULLUP');
assert(capstoneExp.starterCode.includes('systemMode'), 'Starter code implements systemMode state machine');

// ─── Test Suite 3: Deterministic Capstone Simulation & Evidence ───
console.log('\nTest Suite 3: Deterministic Capstone Simulation & Evidence');

const capstoneCircuit = {
  schemaVersion: 1,
  boardId: 'esp32-devkit-v1',
  instances: [
    { id: 'esp32-1', componentTypeId: 'esp32-devkit-v1' },
    { id: 'btn-1', componentTypeId: 'push-button' },
    { id: 'res-1', componentTypeId: 'resistor-220' },
    { id: 'led-1', componentTypeId: 'led-5mm-red' },
  ],
  connections: [
    // Button: D4 -> pin1a, pin2a -> GND
    {
      id: 'c1',
      from: { componentInstanceId: 'esp32-1', terminalId: 'd4' },
      to: { componentInstanceId: 'btn-1', terminalId: 'pin1a' },
    },
    {
      id: 'c2',
      from: { componentInstanceId: 'btn-1', terminalId: 'pin2a' },
      to: { componentInstanceId: 'esp32-1', terminalId: 'gnd-14' },
    },
    // LED: D2 -> res:pin1, res:pin2 -> led:anode, led:cathode -> GND
    {
      id: 'c3',
      from: { componentInstanceId: 'esp32-1', terminalId: 'd2' },
      to: { componentInstanceId: 'res-1', terminalId: 'pin1' },
    },
    {
      id: 'c4',
      from: { componentInstanceId: 'res-1', terminalId: 'pin2' },
      to: { componentInstanceId: 'led-1', terminalId: 'anode' },
    },
    {
      id: 'c5',
      from: { componentInstanceId: 'led-1', terminalId: 'cathode' },
      to: { componentInstanceId: 'esp32-1', terminalId: 'gnd-29' },
    },
  ],
};

const simResult = runSimulation({
  experimentId: 'exp-smart-indicator',
  circuit: capstoneCircuit,
  code: capstoneExp.starterCode,
  buttonEvents: [false, true, true, false, true, false],
});

assert(simResult.success === true, 'Capstone mission simulation succeeds');
assert(simResult.summary.buttonPressesSimulated === 3, 'Simulated 3 mode change button clicks');
assert(simResult.summary.ledActivationsObserved === 3, 'Observed 3 LED activations corresponding to modes');

const tokenVerified = verifyChallengeEvidence(simResult.evidenceToken);
assert(tokenVerified.valid === true, 'Generated cryptographically signed evidence token');
assert(tokenVerified.isPassingEvidence === true, 'Token confirms passing capstone evidence');
assert(tokenVerified.payload.expId === 'exp-smart-indicator', 'Token carries exp-smart-indicator ID');

// ─── Test Suite 4: Capstone Achievement Unlocking ───
console.log('\nTest Suite 4: Capstone Achievement Unlocking');

const unlockedFromLesson = evaluateAchievements({
  completedLessons: ['lesson-9-final-mission'],
});

const masterBadgeFromLesson = unlockedFromLesson.find(
  (a) => a.id === 'smart_indicator_master'
);
assert(masterBadgeFromLesson !== undefined, 'Unlocks smart_indicator_master upon completing capstone lesson');
assert(masterBadgeFromLesson.xpReward === 100, 'Grants 100 XP achievement reward');

const unlockedFromExp = evaluateAchievements({
  verifiedExperiments: ['exp-smart-indicator'],
});

const masterBadgeFromExp = unlockedFromExp.find(
  (a) => a.id === 'smart_indicator_master'
);
assert(masterBadgeFromExp !== undefined, 'Unlocks smart_indicator_master upon verifying capstone experiment');

// ─── Test Suite 5: Full End-to-End Beta Learner Journey ───
console.log('\nTest Suite 5: Full End-to-End Beta Learner Journey');

// Journey: Learner completes Module 0 lessons, Module 1 lessons, verifies experiments, and completes capstone
let ledger = [];

// Step 1: Lesson 0-welcome completion
const t1 = processXPTransaction(ledger, {
  amount: 20,
  reasonCode: 'LESSON_COMPLETE',
  sourceType: 'lesson',
  sourceId: 'lesson-0-welcome',
  idempotencyKey: 't1-lesson-0-welcome',
});
ledger = t1.ledger;

// Step 2: Virtual Lab LED blink experiment verified
const t2 = processXPTransaction(ledger, {
  amount: 30,
  reasonCode: 'EXPERIMENT_VERIFIED',
  sourceType: 'experiment',
  sourceId: 'exp-01-blink',
  idempotencyKey: 't2-exp-01-blink',
});
ledger = t2.ledger;

// Step 3: Button experiment verified
const t3 = processXPTransaction(ledger, {
  amount: 30,
  reasonCode: 'EXPERIMENT_VERIFIED',
  sourceType: 'experiment',
  sourceId: 'exp-02-button',
  idempotencyKey: 't3-exp-02-button',
});
ledger = t3.ledger;

// Step 4: Capstone Smart Indicator mission completed
const t4 = processXPTransaction(ledger, {
  amount: 100,
  reasonCode: 'CAPSTONE_COMPLETE',
  sourceType: 'mission',
  sourceId: 'lesson-9-final-mission',
  idempotencyKey: 't4-lesson-9-final-mission',
});
ledger = t4.ledger;

// Step 5: Capstone achievement awarded
const t5 = processXPTransaction(ledger, {
  amount: 100,
  reasonCode: 'ACHIEVEMENT_UNLOCKED',
  sourceType: 'achievement',
  sourceId: 'smart_indicator_master',
  idempotencyKey: 't5-ach-smart-indicator-master',
});
ledger = t5.ledger;

assert(ledger.length === 5, 'Ledger accurately records 5 audited transactions');
assert(t5.totalXP === 280, 'Total derived XP is 280 XP');

const learnerRank = getLearnerRank(t5.totalXP);
assert(typeof learnerRank.title === 'string', 'Learner rank title resolved');
assert(learnerRank.level >= 3, `Learner reached Level ${learnerRank.level}`);

console.log('\n=============================================');
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log('=============================================');

if (failed > 0) {
  process.exit(1);
}
