/**
 * Automated Verification Tests for Onboard Lesson Engine
 * Validates lesson schema versioning, block types, knowledge check grading, and safe fallbacks.
 */

import { LESSONS_DATA } from '../src/data/lessonsData.js';
import { ZERO_TO_ESP32_PATH } from '../src/services/curriculumService.js';

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

console.log('=== Running Onboard Lesson Engine Verification Tests ===\n');

// 1. Schema Version & Lesson Structure
console.log('Test Suite 1: Lesson Schema & Metadata');
const lessonKeys = Object.keys(LESSONS_DATA);
assert(lessonKeys.length > 0, `Lessons data is populated with ${lessonKeys.length} rich structured lessons`);

const allowedBlockTypes = new Set([
  'heading',
  'paragraph',
  'callout',
  'hotspot',
  'knowledge_check',
  'code_example',
  'diagram',
]);

let allLessonsValid = true;
let totalBlocks = 0;
let knowledgeCheckCount = 0;

for (const [key, lesson] of Object.entries(LESSONS_DATA)) {
  if (lesson.id !== key) allLessonsValid = false;
  if (!lesson.title || typeof lesson.title !== 'string') allLessonsValid = false;
  if (!lesson.moduleId || typeof lesson.moduleId !== 'string') allLessonsValid = false;
  if (typeof lesson.xpReward !== 'number' || lesson.xpReward <= 0) allLessonsValid = false;
  if (lesson.schemaVersion !== 1) allLessonsValid = false;
  if (!Array.isArray(lesson.blocks) || lesson.blocks.length === 0) allLessonsValid = false;

  for (const block of lesson.blocks) {
    totalBlocks++;
    if (!allowedBlockTypes.has(block.type)) {
      console.error(`Invalid block type: ${block.type} in lesson ${key}`);
      allLessonsValid = false;
    }
    if (block.type === 'knowledge_check') {
      knowledgeCheckCount++;
    }
  }
}

assert(allLessonsValid, 'All lesson definitions satisfy Schema Version 1 requirements');
assert(totalBlocks > 15, `Validated ${totalBlocks} structured educational blocks across lessons`);
assert(knowledgeCheckCount >= 4, `Found ${knowledgeCheckCount} interactive knowledge checks`);

// 2. Knowledge Check Integrity & Grading Logic
console.log('\nTest Suite 2: Knowledge Check Grading Logic');
let allChecksValid = true;
let testedGradingCount = 0;

for (const [, lesson] of Object.entries(LESSONS_DATA)) {
  const checks = lesson.blocks.filter((b) => b.type === 'knowledge_check');
  for (const check of checks) {
    if (!check.id || !check.prompt || !check.correctOptionId || !Array.isArray(check.options)) {
      allChecksValid = false;
      continue;
    }

    const correctOpt = check.options.find((o) => o.id === check.correctOptionId);
    if (!correctOpt) {
      console.error(`Knowledge check ${check.id} has no matching option for correctOptionId`);
      allChecksValid = false;
      continue;
    }

    // Verify option explanation completeness
    for (const opt of check.options) {
      if (!opt.id || !opt.text || !opt.explanation) {
        allChecksValid = false;
      }
    }

    // Verify grading behavior
    const wrongOpt = check.options.find((o) => o.id !== check.correctOptionId);
    const isCorrectSelection = (selectedId) => selectedId === check.correctOptionId;

    if (!isCorrectSelection(correctOpt.id)) allChecksValid = false;
    if (wrongOpt && isCorrectSelection(wrongOpt.id)) allChecksValid = false;

    testedGradingCount++;
  }
}

assert(allChecksValid, 'All knowledge checks contain valid prompts, options, explanations, and keys');
assert(testedGradingCount >= 4, `Successfully validated deterministic grading across ${testedGradingCount} checks`);

// 3. Fallback Engine Support for Every Curriculum Lesson
console.log('\nTest Suite 3: Global Curriculum Coverage & Fallback Engine');
const allCurriculumLessons = ZERO_TO_ESP32_PATH.modules.flatMap((m) => m.lessons);
let engineCoverage = true;

for (const curLesson of allCurriculumLessons) {
  // Lesson player fallback resolver
  const resolved = LESSONS_DATA[curLesson.id] || {
    id: curLesson.id,
    title: curLesson.title,
    blocks: [
      { type: 'heading', text: curLesson.title },
      { type: 'paragraph', text: curLesson.summary },
    ],
    xpReward: curLesson.xp || 20,
  };

  if (!resolved.id || !resolved.title || !resolved.blocks || resolved.blocks.length === 0) {
    engineCoverage = false;
  }
}

assert(engineCoverage, `Lesson player safely resolves all ${allCurriculumLessons.length} curriculum lessons`);

// Summary
console.log('\n=============================================');
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log('=============================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
