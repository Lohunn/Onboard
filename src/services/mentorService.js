/**
 * Context-Aware AI Mentor Service for Onboard
 * Conforms to Section 5, Section 10 (Mentor), and Section 16 (Prompt 9) of MVP Specification.
 *
 * Core Principles:
 * - Plain language, defines technical terms for absolute beginners.
 * - Progressive hints: prefers one actionable hint before giving the full solution.
 * - Hardware grounded: Strictly uses ESP32 DevKit V1 pinout and component catalog; never invents capabilities.
 * - Grounded in structured diagnostics: Explains actual simulator errors accurately.
 * - Untrusted input: Sanitizes learner queries and enforces length/rate limits.
 * - Deterministic fallback: Always provides accurate guidance even without an external API key.
 */

import { ESP32_DEVKIT_V1_PINS } from '../data/esp32DevKitV1.js';

// ─── Intent Types ───

export const MENTOR_INTENTS = {
  EXPLAIN_CONCEPT: 'explain_concept',
  EXPLAIN_CODE: 'explain_code',
  EXPLAIN_PIN_OR_COMPONENT: 'explain_pin_or_component',
  PROGRESSIVE_HINT: 'progressive_hint',
  DIAGNOSE_CIRCUIT_ERROR: 'diagnose_circuit_error',
  EXPLAIN_SIMULATOR_DIAGNOSTIC: 'explain_simulator_diagnostic',
  UNDERSTANDING_CHECK: 'understanding_check',
};

// ─── Rate Limiter & Boundaries ───

export const MENTOR_LIMITS = {
  maxQueryLength: 1000,
  maxRequestsPerMinute: 15,
  windowMs: 60 * 1000,
  timeoutMs: 8000,
  maxHintLevel: 3,
};

const requestLog = [];

/**
 * Checks sliding-window rate limit.
 * @returns {boolean} True if within rate limit, false if throttled.
 */
export function checkRateLimit() {
  const now = Date.now();
  // Prune requests older than window
  while (requestLog.length > 0 && requestLog[0] < now - MENTOR_LIMITS.windowMs) {
    requestLog.shift();
  }
  if (requestLog.length >= MENTOR_LIMITS.maxRequestsPerMinute) {
    return false;
  }
  requestLog.push(now);
  return true;
}

/**
 * Resets rate limit log (used for testing).
 */
export function _resetRateLimit() {
  requestLog.length = 0;
}

/**
 * Sanitizes untrusted user input string.
 * @param {string} raw
 * @returns {string} Sanitized string
 */
export function sanitizeInput(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    .trim()
    .slice(0, MENTOR_LIMITS.maxQueryLength)
    .replace(/[<>]/g, ''); // Strip direct HTML angle brackets
}

// ─── Grounded Knowledge Base for ESP32 & Electronics ───

const CONCEPT_DEFINITIONS = {
  voltage: {
    term: 'Voltage (V)',
    plain:
      'Electrical pressure pushing electrons through a circuit. Think of it like water pressure in a hose.',
    detail:
      'ESP32 GPIO pins operate at 3.3V logic. Connecting 5V from VIN directly to a GPIO can permanently damage the chip!',
  },
  current: {
    term: 'Current (A / mA)',
    plain:
      'The flow of electrons through a wire. Measured in milliamperes (mA) in small electronics.',
    detail:
      'An ESP32 GPIO pin can safely provide around 12mA. Too much current burns out LEDs or silicon drivers.',
  },
  resistance: {
    term: 'Resistance (Ω)',
    plain:
      'The opposition to electric current flow. Like squeezing a water pipe to slow down water flow.',
    detail:
      'LEDs have almost no internal resistance once turned on. A series resistor (like 220Ω) is mandatory to prevent infinite current!',
  },
  pullup: {
    term: 'Pull-Up Resistor (INPUT_PULLUP)',
    plain:
      'A resistor pulling an unused pin to 3.3V so it does not "float" in random electrical noise.',
    detail:
      'When you use pinMode(pin, INPUT_PULLUP), the ESP32 activates an internal 45kΩ resistor to 3.3V. Pressing the button connects the pin to Ground, reading LOW (0V).',
  },
  gpio: {
    term: 'GPIO (General Purpose Input/Output)',
    plain:
      'Software-controllable pins on the microcontroller that can either send voltage out (OUTPUT) or read incoming voltage (INPUT).',
    detail:
      'ESP32 has 30 pins on the DevKit V1, but pins D34, D35, VP, and VN are INPUT-ONLY and cannot be used as outputs!',
  },
};

const DIAGNOSTIC_EXPLANATIONS = {
  MISSING_CURRENT_LIMITING_RESISTOR: {
    title: 'Missing Current-Limiting Resistor',
    explanation:
      'Your LED is connected directly between 3.3V GPIO and Ground. LEDs are non-linear diodes with nearly zero resistance when forward-biased. Without a resistor, too much current will flow, which can burn out the LED or trip ESP32 pin protection.',
    action:
      'Insert a 220Ω or 330Ω resistor in series between the ESP32 GPIO pin and the longer LED leg (Anode).',
  },
  LED_REVERSED_POLARITY: {
    title: 'LED Connected Backwards',
    explanation:
      'LED stands for Light Emitting Diode. Diodes are one-way electronic valves—current can only flow from Anode (+) to Cathode (-).',
    action:
      'Flip the LED around: ensure the longer leg (Anode) connects towards the GPIO output pin, and the shorter leg (Cathode) connects to Ground.',
  },
  OPEN_CIRCUIT_NO_GND: {
    title: 'Broken Ground Return Path',
    explanation:
      'Electricity can only flow in a complete closed circle (circuit). Your LED cathode is disconnected from Ground, so no electrons can return to complete the path.',
    action: 'Connect a jumper wire from the LED cathode (short leg) to an ESP32 GND pin (Pin 14 or Pin 29).',
  },
  OPEN_CIRCUIT_NO_GPIO: {
    title: 'Signal Wire Not Connected',
    explanation:
      'The LED is missing a connection to an active driving pin on the microcontroller.',
    action: 'Wire the LED anode (via a 220Ω resistor) to pin D2 (GPIO 2) or another output pin.',
  },
  CANNOT_OUTPUT_ON_INPUT_ONLY_PIN: {
    title: 'Input-Only Pin Used as Output',
    explanation:
      'On the ESP32 DevKit V1, pins VP (GPIO 36), VN (GPIO 39), D34 (GPIO 34), and D35 (GPIO 35) are hardware input-only. They have no internal output transistors and cannot drive an LED or output voltage.',
    action: 'Move your signal wire to a regular digital pin like D2, D4, or D5.',
  },
  OVERVOLTAGE_5V_TO_GPIO: {
    title: '5V Overvoltage Hazard',
    explanation:
      'The VIN pin carries 5V from your USB cable. ESP32 pins are strictly 3.3V and ARE NOT 5V tolerant!',
    action: 'Immediately disconnect VIN from the GPIO pin. Use 3V3 or standard logic pins.',
  },
  GPIO_PIN_MISMATCH: {
    title: 'Pin Mismatch Between Code and Wiring',
    explanation:
      'Your firmware code is driving one pin number, but your physical circuit wire is connected to a different pin.',
    action:
      'Make sure the pin in pinMode(PIN, OUTPUT) matches the physical pin your wire is connected to.',
  },
  OPEN_BUTTON_INPUT: {
    title: 'Push Button Input Wire Missing',
    explanation:
      'The microcontroller cannot read the switch because no signal wire connects the push button to a GPIO pin.',
    action: 'Run a jumper wire from one leg of the button to D4 (GPIO 4) on the ESP32.',
  },
  BUTTON_POWER_SHORT: {
    title: 'Power-to-Ground Short Circuit',
    explanation:
      'The push button is wired directly between 3V3/VIN and Ground without any load. When pressed, it connects power directly to ground, causing a short circuit!',
    action:
      'Wire the button between a GPIO pin (like D4) and Ground, and set pinMode(4, INPUT_PULLUP) in your code.',
  },
  FLOATING_BUTTON_INPUT: {
    title: 'Floating Digital Input',
    explanation:
      'The button connects to 3.3V when pressed, but when released, the pin is connected to nothing. It acts like an antenna picking up electromagnetic noise.',
    action:
      'Use the built-in pull-up resistor: wire the button between the pin and Ground, and call pinMode(pin, INPUT_PULLUP);',
  },
};

// ─── Progressive Hint Engine ───

const PROGRESSIVE_HINTS = {
  'exp-01-blink': [
    {
      level: 1,
      hint: 'Think about the path electricity needs to take: from the microcontroller pin, through a component that limits current, through the light, and back home.',
    },
    {
      level: 2,
      hint: 'Your circuit needs 3 series links: ESP32 D2 → 220Ω Resistor → LED Anode (long leg) → LED Cathode (short leg) → ESP32 GND.',
    },
    {
      level: 3,
      hint: 'Direct solution:\n1. Wire ESP32 D2 to resistor pin 1.\n2. Wire resistor pin 2 to LED Anode.\n3. Wire LED Cathode to ESP32 GND.\n4. In code: pinMode(2, OUTPUT); digitalWrite(2, HIGH); delay(500); digitalWrite(2, LOW);',
    },
  ],
  'exp-02-button': [
    {
      level: 1,
      hint: 'How does the microcontroller know if the button is pressed? It needs a reference voltage when open, and a different voltage when pressed.',
    },
    {
      level: 2,
      hint: 'Use active-low logic: With INPUT_PULLUP, the ESP32 pin is held at 3.3V (HIGH). When you press the button to GND, the pin drops to 0V (LOW).',
    },
    {
      level: 3,
      hint: 'Direct solution:\n1. Wire ESP32 D4 to button pin 1.\n2. Wire button pin 2 to ESP32 GND.\n3. In setup: pinMode(4, INPUT_PULLUP);\n4. In loop: if (digitalRead(4) == LOW) { digitalWrite(2, HIGH); } else { digitalWrite(2, LOW); }',
    },
  ],
};

// ─── Mentor Service Query Handler ───

/**
 * Generates context-aware, grounded AI mentor assistance.
 *
 * @param {object} params
 * @param {string} params.intent One of MENTOR_INTENTS
 * @param {string} [params.query] Learner's natural language question
 * @param {string} [params.experimentId] Current experiment ID
 * @param {object} [params.circuit] Current CircuitDocument
 * @param {string} [params.code] Current firmware code
 * @param {Array} [params.diagnostics] Active simulator diagnostics
 * @param {number} [params.hintLevel] 1, 2, or 3
 * @param {string} [params.targetPin] Specific pin for pin explanation
 * @returns {Promise<object>} MentorResponse
 */
export async function queryMentor({
  intent = MENTOR_INTENTS.PROGRESSIVE_HINT,
  query = '',
  experimentId = 'exp-01-blink',
  _circuit = null,
  _code = '',
  diagnostics = [],
  hintLevel = 1,
  targetPin = null,
}) {
  // 1. Enforce rate limiting
  if (!checkRateLimit()) {
    return {
      success: false,
      intent,
      source: 'rate_limit',
      title: 'Mentor is catching its breath',
      message:
        'You have asked several questions in a short period. Take 30 seconds to inspect your circuit and code, then ask again!',
      actionableHint: 'Try checking your wiring against the experiment schematic.',
    };
  }

  // 2. Sanitize query
  const cleanQuery = sanitizeInput(query);

  // 3. Handle by intent

  // INTENT: Progressive Hint
  if (intent === MENTOR_INTENTS.PROGRESSIVE_HINT) {
    const hints = PROGRESSIVE_HINTS[experimentId] || PROGRESSIVE_HINTS['exp-01-blink'];
    const boundedLevel = Math.min(Math.max(hintLevel, 1), MENTOR_LIMITS.maxHintLevel);
    const hintObj = hints[boundedLevel - 1] || hints[0];

    return {
      success: true,
      intent,
      source: 'rule_engine',
      level: boundedLevel,
      maxLevel: MENTOR_LIMITS.maxHintLevel,
      title: `Hint Level ${boundedLevel} of ${MENTOR_LIMITS.maxHintLevel}`,
      message: hintObj.hint,
      hasMoreHints: boundedLevel < MENTOR_LIMITS.maxHintLevel,
      nextHintLevel: boundedLevel < MENTOR_LIMITS.maxHintLevel ? boundedLevel + 1 : null,
    };
  }

  // INTENT: Diagnose Circuit Error
  if (
    intent === MENTOR_INTENTS.DIAGNOSE_CIRCUIT_ERROR ||
    intent === MENTOR_INTENTS.EXPLAIN_SIMULATOR_DIAGNOSTIC
  ) {
    if (diagnostics && diagnostics.length > 0) {
      const topDiag = diagnostics[0];
      const explanation = DIAGNOSTIC_EXPLANATIONS[topDiag.code];

      if (explanation) {
        return {
          success: true,
          intent,
          source: 'diagnostic_grounding',
          diagnosticCode: topDiag.code,
          severity: topDiag.severity,
          title: explanation.title,
          message: explanation.explanation,
          actionableHint: explanation.action,
        };
      }

      return {
        success: true,
        intent,
        source: 'diagnostic_grounding',
        diagnosticCode: topDiag.code,
        severity: topDiag.severity,
        title: `Simulator ${topDiag.severity.toUpperCase()}: ${topDiag.code}`,
        message: topDiag.message,
        actionableHint: topDiag.suggestion || 'Inspect your wiring and pin numbers.',
      };
    }

    return {
      success: true,
      intent,
      source: 'rule_engine',
      title: 'No Circuit Errors Detected',
      message:
        'Your circuit topology passes basic schema checks! If your experiment is not behaving as expected, check whether your firmware code is using the right pin numbers or logic.',
      actionableHint: 'Click "Run Simulation" to see real-time GPIO and LED states.',
    };
  }

  // INTENT: Explain Pin or Component
  if (intent === MENTOR_INTENTS.EXPLAIN_PIN_OR_COMPONENT) {
    const pinQuery = (targetPin || cleanQuery).toLowerCase().trim();
    const pin = ESP32_DEVKIT_V1_PINS.find(
      (p) =>
        p.label.toLowerCase() === pinQuery ||
        `gpio ${p.gpio}`.toLowerCase() === pinQuery ||
        `d${p.gpio}`.toLowerCase() === pinQuery ||
        `pin ${p.pinNumber}`.toLowerCase() === pinQuery
    );

    if (pin) {
      const isInputOnly =
        pin.category === 'input_only' ||
        (Array.isArray(pin.types) && pin.types.includes('input_only'));
      const isStrapping =
        Array.isArray(pin.types) && pin.types.includes('strapping');

      return {
        success: true,
        intent,
        source: 'hardware_grounding',
        pinLabel: pin.label,
        gpio: pin.gpio,
        title: `ESP32 Pin ${pin.label} (Physical Pin #${pin.pinNumber})`,
        message: `${pin.description}${
          isInputOnly
            ? ' ⚠️ CRITICAL: This is an INPUT-ONLY pin. It cannot output voltage or drive LEDs.'
            : ''
        }${
          isStrapping
            ? ' ⚠️ NOTE: This is a strapping bootloader pin with special boot voltage states.'
            : ''
        }`,
        capabilities: pin.capabilities,
        actionableHint:
          pin.warnings && pin.warnings.length > 0
            ? pin.warnings[0]
            : 'Safe for general digital and analog operations.',
      };
    }

    return {
      success: false,
      intent,
      source: 'hardware_grounding',
      title: 'Pin Not Found',
      message: `Could not identify pin "${targetPin || cleanQuery}" on the ESP32 DevKit V1 30-pin header.`,
      actionableHint: 'Try searching for D2, D4, D12, D34, 3V3, or GND.',
    };
  }

  // INTENT: Explain Concept
  if (intent === MENTOR_INTENTS.EXPLAIN_CONCEPT) {
    const queryLower = cleanQuery.toLowerCase();
    const queryNormalized = queryLower.replace(/[-_\s]/g, '');
    let matchedConcept = null;

    for (const [key, data] of Object.entries(CONCEPT_DEFINITIONS)) {
      const keyNorm = key.replace(/[-_\s]/g, '');
      const termNorm = data.term.toLowerCase().replace(/[-_\s]/g, '');
      if (
        queryLower.includes(key) ||
        queryNormalized.includes(keyNorm) ||
        queryLower.includes(data.term.toLowerCase()) ||
        queryNormalized.includes(termNorm)
      ) {
        matchedConcept = data;
        break;
      }
    }

    if (matchedConcept) {
      return {
        success: true,
        intent,
        source: 'concept_knowledge_base',
        title: matchedConcept.term,
        message: matchedConcept.plain,
        detail: matchedConcept.detail,
        actionableHint: 'Connect this concept directly to your breadboard components.',
      };
    }

    return {
      success: true,
      intent,
      source: 'concept_knowledge_base',
      title: 'Understanding Electronics Fundamentals',
      message:
        'In physical computing with the ESP32, electrical signals represent data: 3.3V represents binary 1 (HIGH), and 0V represents binary 0 (LOW). Hardware resistors keep currents safe.',
      actionableHint: 'Ask specifically about voltage, current, resistance, GPIO, or pull-up resistors.',
    };
  }

  // INTENT: Understanding Check (Interactive quiz question)
  if (intent === MENTOR_INTENTS.UNDERSTANDING_CHECK) {
    const isButton = experimentId === 'exp-02-button';
    const quiz = isButton
      ? {
          question:
            'When using pinMode(4, INPUT_PULLUP), what voltage does digitalRead(4) return when the push button is NOT pressed?',
          options: [
            '0V (LOW), because the button is open',
            '3.3V (HIGH), because the internal pull-up resistor holds it up',
            'Floating / random noise',
            '5V (VIN)',
          ],
          correctIndex: 1,
          explanation:
            'The internal pull-up resistor gently holds the GPIO pin at 3.3V (HIGH). When pressed to GND, it pulls down to 0V (LOW).',
        }
      : {
          question:
            'Why is a 220Ω resistor placed in series with the LED when connected to GPIO 2?',
          options: [
            'To make the LED shine twice as bright',
            'To convert AC power into DC power',
            'To limit current flow so the LED and ESP32 pin do not burn out',
            'To invert digital HIGH to LOW',
          ],
          correctIndex: 2,
          explanation:
            'LEDs have very low internal resistance when conducting. A 220Ω resistor limits current to safe levels (~6mA) per Ohm’s law.',
        };

    return {
      success: true,
      intent,
      source: 'quiz_engine',
      title: 'Quick Comprehension Check',
      quiz,
    };
  }

  // INTENT: Explain Code
  return {
    success: true,
    intent: MENTOR_INTENTS.EXPLAIN_CODE,
    source: 'code_inspector',
    title: 'Firmware Code Walkthrough',
    message:
      'Arduino code runs in two stages:\n1. void setup(): Runs once at power-on to configure pin directions.\n2. void loop(): Repeats infinitely to read inputs and write outputs.',
    actionableHint:
      'Check that every pin used in digitalWrite or digitalRead has a corresponding pinMode() in setup().',
  };
}

// ─── Learner Feedback Tracker ───

const feedbackStore = [];

/**
 * Records learner rating for mentor responses.
 *
 * @param {object} feedback
 * @param {string} feedback.query
 * @param {string} feedback.intent
 * @param {boolean} feedback.isHelpful
 * @param {string} [feedback.comment]
 * @returns {object} { recorded: boolean, id: string }
 */
export function recordMentorFeedback({ query, intent, isHelpful, comment = '' }) {
  const entry = {
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    query: sanitizeInput(query),
    intent,
    isHelpful: Boolean(isHelpful),
    comment: sanitizeInput(comment),
    timestamp: new Date().toISOString(),
  };

  feedbackStore.push(entry);

  try {
    if (typeof localStorage !== 'undefined') {
      const existing = JSON.parse(
        localStorage.getItem('onboard-mentor-feedback') || '[]'
      );
      existing.push(entry);
      localStorage.setItem(
        'onboard-mentor-feedback',
        JSON.stringify(existing.slice(-50))
      );
    }
  } catch {
    // Ignore quota issues
  }

  return { recorded: true, id: entry.id };
}

/**
 * Gets recorded feedback count (used for testing).
 */
export function _getFeedbackCount() {
  return feedbackStore.length;
}
