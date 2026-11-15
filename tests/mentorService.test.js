/**
 * Automated Verification Tests for Onboard Context-Aware AI Mentor Service
 * Conforms to Section 5, Section 10, and Section 16 (Prompt 9) of MVP Specification.
 *
 * Verifies:
 * 1. MENTOR_INTENTS registry and default limits.
 * 2. Progressive hint levels (Level 1 conceptual -> Level 2 wiring -> Level 3 solution).
 * 3. Grounded diagnosis of structured circuit errors.
 * 4. Grounded hardware pin capability and strapping warnings (D34 input-only, D12 strapping).
 * 5. Concept knowledge base definitions for beginner electronics terms.
 * 6. Rate limiter enforcement: blocks after 15 requests in sliding window.
 * 7. Untrusted input sanitization and character length clamping.
 * 8. Understanding check quiz generation with correct answers and explanations.
 * 9. Learner feedback tracking and recording.
 */

import {
  MENTOR_INTENTS,
  MENTOR_LIMITS,
  checkRateLimit,
  _resetRateLimit,
  sanitizeInput,
  queryMentor,
  recordMentorFeedback,
  _getFeedbackCount,
} from '../src/services/mentorService.js';

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

console.log('=== Running Onboard AI Mentor Service Tests ===\n');

// ─── Test Suite 1: Intent Registry & Boundaries ───
console.log('Test Suite 1: Intent Registry & Boundaries');
assert(MENTOR_INTENTS.EXPLAIN_CONCEPT === 'explain_concept', 'Contains EXPLAIN_CONCEPT intent');
assert(MENTOR_INTENTS.PROGRESSIVE_HINT === 'progressive_hint', 'Contains PROGRESSIVE_HINT intent');
assert(MENTOR_INTENTS.DIAGNOSE_CIRCUIT_ERROR === 'diagnose_circuit_error', 'Contains DIAGNOSE_CIRCUIT_ERROR intent');
assert(MENTOR_INTENTS.UNDERSTANDING_CHECK === 'understanding_check', 'Contains UNDERSTANDING_CHECK intent');
assert(MENTOR_LIMITS.maxRequestsPerMinute === 15, 'Rate limit set to 15 req/min');
assert(MENTOR_LIMITS.maxHintLevel === 3, 'Max hint level is 3');

// ─── Test Suite 2: Progressive Hints ───
console.log('\nTest Suite 2: Progressive Hints Engine');

async function testProgressiveHints() {
  _resetRateLimit();

  const hint1 = await queryMentor({
    intent: MENTOR_INTENTS.PROGRESSIVE_HINT,
    experimentId: 'exp-01-blink',
    hintLevel: 1,
  });
  assert(hint1.success === true, 'Level 1 hint query succeeds');
  assert(hint1.level === 1, 'Hint reports level 1');
  assert(hint1.hasMoreHints === true, 'Level 1 has more hints available');
  assert(hint1.nextHintLevel === 2, 'Next hint is level 2');

  const hint2 = await queryMentor({
    intent: MENTOR_INTENTS.PROGRESSIVE_HINT,
    experimentId: 'exp-01-blink',
    hintLevel: 2,
  });
  assert(hint2.level === 2, 'Level 2 hint query succeeds');
  assert(hint2.hasMoreHints === true, 'Level 2 still has level 3 remaining');

  const hint3 = await queryMentor({
    intent: MENTOR_INTENTS.PROGRESSIVE_HINT,
    experimentId: 'exp-01-blink',
    hintLevel: 3,
  });
  assert(hint3.level === 3, 'Level 3 direct solution hint succeeds');
  assert(hint3.hasMoreHints === false, 'Level 3 is terminal hint level');
  assert(hint3.nextHintLevel === null, 'No next level after level 3');
}

// ─── Test Suite 3: Grounded Diagnosis of Circuit Errors ───
console.log('\nTest Suite 3: Grounded Diagnosis of Circuit Errors');

async function testCircuitDiagnosis() {
  _resetRateLimit();

  // Test Missing Resistor error grounding
  const missingResistorDiag = [
    {
      code: 'MISSING_CURRENT_LIMITING_RESISTOR',
      severity: 'warning',
      message: 'LED connected directly without resistor',
      suggestion: 'Add a 220Ω resistor',
    },
  ];

  const diagResponse = await queryMentor({
    intent: MENTOR_INTENTS.DIAGNOSE_CIRCUIT_ERROR,
    diagnostics: missingResistorDiag,
  });

  assert(diagResponse.success === true, 'Error diagnosis query succeeds');
  assert(diagResponse.source === 'diagnostic_grounding', 'Source is diagnostic_grounding');
  assert(
    diagResponse.title.includes('Missing Current-Limiting Resistor'),
    'Grounded explanation identified resistor title'
  );
  assert(
    diagResponse.actionableHint.includes('220Ω'),
    'Actionable hint gives direct instruction with 220Ω'
  );

  // Test Reversed Polarity error grounding
  const reversedDiag = [
    {
      code: 'LED_REVERSED_POLARITY',
      severity: 'error',
      message: 'LED reversed',
      suggestion: 'Flip LED',
    },
  ];

  const reversedResponse = await queryMentor({
    intent: MENTOR_INTENTS.DIAGNOSE_CIRCUIT_ERROR,
    diagnostics: reversedDiag,
  });

  assert(
    reversedResponse.message.includes('Anode (+) to Cathode (-)'),
    'Explains diode polarity principles clearly'
  );

  // Test Button Short Circuit
  const shortDiag = [
    {
      code: 'BUTTON_POWER_SHORT',
      severity: 'error',
      message: 'Short circuit',
      suggestion: 'Rewire button',
    },
  ];

  const shortResponse = await queryMentor({
    intent: MENTOR_INTENTS.DIAGNOSE_CIRCUIT_ERROR,
    diagnostics: shortDiag,
  });

  assert(
    shortResponse.title.includes('Short Circuit'),
    'Correctly identifies power-to-ground short circuit'
  );
}

// ─── Test Suite 4: Hardware Pin Grounding & Strapping Warnings ───
console.log('\nTest Suite 4: Hardware Pin Grounding & Warnings');

async function testHardwarePinGrounding() {
  _resetRateLimit();

  // Test input-only pin D34
  const d34Response = await queryMentor({
    intent: MENTOR_INTENTS.EXPLAIN_PIN_OR_COMPONENT,
    targetPin: 'd34',
  });

  assert(d34Response.success === true, 'Pin query for D34 succeeds');
  assert(d34Response.gpio === 34, 'Correct GPIO 34 identified');
  assert(
    d34Response.message.includes('INPUT-ONLY'),
    'Accurately grounds that D34 is an INPUT-ONLY pin'
  );

  // Test strapping pin D12
  const d12Response = await queryMentor({
    intent: MENTOR_INTENTS.EXPLAIN_PIN_OR_COMPONENT,
    targetPin: 'd12',
  });

  assert(d12Response.gpio === 12, 'Correct GPIO 12 identified');
  assert(
    d12Response.message.includes('strapping'),
    'Accurately grounds that D12 is a strapping pin'
  );

  // Test non-existent pin
  const invalidPinResponse = await queryMentor({
    intent: MENTOR_INTENTS.EXPLAIN_PIN_OR_COMPONENT,
    targetPin: 'd99',
  });

  assert(invalidPinResponse.success === false, 'Non-existent pin returns false');
  assert(
    invalidPinResponse.title === 'Pin Not Found',
    'Returns clear Pin Not Found title without hallucination'
  );
}

// ─── Test Suite 5: Concept Knowledge Base ───
console.log('\nTest Suite 5: Concept Knowledge Base');

async function testConceptKnowledgeBase() {
  _resetRateLimit();

  const voltageConcept = await queryMentor({
    intent: MENTOR_INTENTS.EXPLAIN_CONCEPT,
    query: 'What is voltage and why does it matter?',
  });

  assert(voltageConcept.success === true, 'Concept query for voltage succeeds');
  assert(voltageConcept.title.includes('Voltage'), 'Title identifies Voltage');
  assert(
    voltageConcept.detail.includes('3.3V logic'),
    'Grounded in ESP32 3.3V operating voltage'
  );

  const pullupConcept = await queryMentor({
    intent: MENTOR_INTENTS.EXPLAIN_CONCEPT,
    query: 'Explain pull-up resistors',
  });

  assert(
    pullupConcept.title.includes('Pull-Up'),
    'Title identifies Pull-Up Resistor'
  );
  assert(
    pullupConcept.detail.includes('INPUT_PULLUP'),
    'Explains pinMode(pin, INPUT_PULLUP) connection'
  );
}

// ─── Test Suite 6: Rate Limiting & Boundaries ───
console.log('\nTest Suite 6: Rate Limiting & Input Sanitization');

async function testRateLimitingAndSanitization() {
  _resetRateLimit();

  // Test input sanitization
  const dirty = '<script>alert("hack")</script>Hello & welcome!';
  const clean = sanitizeInput(dirty);
  assert(!clean.includes('<script>') && !clean.includes('</script>'), 'Sanitizer strips angle brackets');

  // Test max length boundary
  const oversized = 'A'.repeat(2000);
  const clamped = sanitizeInput(oversized);
  assert(clamped.length === MENTOR_LIMITS.maxQueryLength, `Clamps string to ${MENTOR_LIMITS.maxQueryLength} chars`);

  // Test rate limiting: simulate 15 requests
  for (let i = 0; i < 15; i++) {
    const ok = checkRateLimit();
    assert(ok === true, `Request #${i + 1} within rate limit`);
  }

  // Request 16 should be blocked
  const blocked = checkRateLimit();
  assert(blocked === false, 'Request #16 blocked by rate limiter');

  const throttledResponse = await queryMentor({
    intent: MENTOR_INTENTS.PROGRESSIVE_HINT,
  });
  assert(throttledResponse.success === false, 'Mentor query returns throttled response');
  assert(throttledResponse.source === 'rate_limit', 'Source is rate_limit');
}

// ─── Test Suite 7: Understanding Check ───
console.log('\nTest Suite 7: Understanding Check Quiz');

async function testUnderstandingCheck() {
  _resetRateLimit();

  const quizResponse = await queryMentor({
    intent: MENTOR_INTENTS.UNDERSTANDING_CHECK,
    experimentId: 'exp-01-blink',
  });

  assert(quizResponse.success === true, 'Quiz query succeeds');
  assert(quizResponse.quiz !== undefined, 'Quiz object present in response');
  assert(typeof quizResponse.quiz.question === 'string', 'Question is non-empty string');
  assert(Array.isArray(quizResponse.quiz.options) && quizResponse.quiz.options.length >= 3, 'Quiz has 3+ options');
  assert(typeof quizResponse.quiz.correctIndex === 'number', 'Correct index is integer');
  assert(typeof quizResponse.quiz.explanation === 'string', 'Explanation is provided');
}

// ─── Test Suite 8: Feedback Recording ───
console.log('\nTest Suite 8: Learner Feedback Recording');

function testFeedbackRecording() {
  const initialCount = _getFeedbackCount();

  const result = recordMentorFeedback({
    query: 'How do I wire an LED?',
    intent: MENTOR_INTENTS.PROGRESSIVE_HINT,
    isHelpful: true,
    comment: 'Very clear explanation!',
  });

  assert(result.recorded === true, 'Feedback recorded successfully');
  assert(typeof result.id === 'string', 'Generated unique feedback ID');
  assert(_getFeedbackCount() === initialCount + 1, 'Feedback store count incremented');
}

// ─── Run All Tests Sequentially ───
async function runAll() {
  await testProgressiveHints();
  await testCircuitDiagnosis();
  await testHardwarePinGrounding();
  await testConceptKnowledgeBase();
  await testRateLimitingAndSanitization();
  await testUnderstandingCheck();
  testFeedbackRecording();

  console.log('\n=============================================');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAll();
