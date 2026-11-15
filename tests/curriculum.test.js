/**
 * Automated Verification Tests for Onboard Curriculum and Learning Map
 * Tests prerequisite enforcement, node states, and progression rules.
 */

import {
  ZERO_TO_ESP32_PATH,
  getModuleState,
  calculateUnlockedModules,
  findNextActiveLesson,
} from '../src/services/curriculumService.js';

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

console.log('=== Running Onboard Curriculum & Map Verification Tests ===\n');

// 1. Path Integrity Test
console.log('Test Suite 1: Path & Module Integrity');
assert(ZERO_TO_ESP32_PATH.modules.length === 11, 'Curriculum contains all 11 modules (0 to 10)');
assert(ZERO_TO_ESP32_PATH.boardVariant === 'esp32-devkit-v1', 'Target board is strictly ESP32 DevKit V1');

const allLessonIds = ZERO_TO_ESP32_PATH.modules.flatMap((m) => m.lessons.map((l) => l.id));
const uniqueLessonIds = new Set(allLessonIds);
assert(allLessonIds.length === uniqueLessonIds.size, 'All lesson IDs across all modules are unique');

// 2. Initial State for New Learner
console.log('\nTest Suite 2: New Learner Defaults');
const initialUnlocked = calculateUnlockedModules([]);
assert(initialUnlocked.includes('mod-0-welcome'), 'Module 0 is unlocked by default for new learners');
assert(!initialUnlocked.includes('mod-1-electricity'), 'Module 1 is locked before Module 0 completion');

const mod0 = ZERO_TO_ESP32_PATH.modules[0];
const mod1 = ZERO_TO_ESP32_PATH.modules[1];
assert(getModuleState(mod0, [], initialUnlocked) === 'available', 'Module 0 state is "available" for new learner');
assert(getModuleState(mod1, [], initialUnlocked) === 'locked', 'Module 1 state is "locked" for new learner');

// 3. In-Progress State
console.log('\nTest Suite 3: In-Progress State');
const oneLessonDone = [mod0.lessons[0].id];
assert(getModuleState(mod0, oneLessonDone, initialUnlocked) === 'in_progress', 'Module 0 state transitions to "in_progress" after 1 lesson');

// 4. Module Completion & Unlocking Next Module
console.log('\nTest Suite 4: Sequential Prerequisite Unlocking');
const mod0AllLessons = mod0.lessons.map((l) => l.id);
const mod0CompletedUnlocked = calculateUnlockedModules(mod0AllLessons);

assert(getModuleState(mod0, mod0AllLessons, mod0CompletedUnlocked) === 'completed', 'Module 0 state becomes "completed" when all lessons are done');
assert(mod0CompletedUnlocked.includes('mod-1-electricity'), 'Module 1 becomes unlocked after Module 0 completion');
assert(getModuleState(mod1, mod0AllLessons, mod0CompletedUnlocked) === 'available', 'Module 1 becomes "available"');

// 5. Completed Lessons Remain Reviewable
console.log('\nTest Suite 5: Completed Content Reviewability');
assert(getModuleState(mod0, mod0AllLessons, mod0CompletedUnlocked) !== 'locked', 'Completed modules never revert to locked');

// 6. Resume / Next Active Lesson Finder
console.log('\nTest Suite 6: Active Lesson Resolver');
const activeNew = findNextActiveLesson([]);
assert(activeNew.lesson.id === 'lesson-0-welcome', 'New learner starts at lesson-0-welcome');

const activeAfterOne = findNextActiveLesson(oneLessonDone);
assert(activeAfterOne.lesson.id === mod0.lessons[1].id, 'Next active lesson advances to the second lesson of Module 0');

console.log(`\n========================================`);
console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All curriculum verification tests PASSED!\n');
}
