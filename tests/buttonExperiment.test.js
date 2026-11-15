/**
 * Automated Verification Tests for Onboard Button Experiment & Guided Code Editor
 * Conforms to Section 5E, Section 10, and Section 16 (Prompt 8) of MVP Specification.
 *
 * Verifies:
 * 1. Valid button + pull-up + LED circuit passes topology validation.
 * 2. Known-bad: Disconnected button input wire flags OPEN_BUTTON_INPUT.
 * 3. Known-bad: Dead short across button (3V3 directly to GND) flags BUTTON_POWER_SHORT.
 * 4. Known-bad: Floating button input (wired to 3V3 without pull-down) flags FLOATING_BUTTON_INPUT.
 * 5. Known-bad: Button GPIO configured as OUTPUT flags BUTTON_PIN_CONFIGURED_AS_OUTPUT.
 * 6. Firmware parser extracts digitalRead, INPUT_PULLUP, and active-low conditional checks.
 * 7. Button simulation generates deterministic timeline: press turns LED ON, release turns LED OFF.
 * 8. Challenge evidence token generation and verification for button experiment.
 */

import {
  validateButtonTopology,
  parseFirmware,
  runButtonSimulation,
  runSimulation,
  verifyChallengeEvidence,
} from '../src/services/simulatorAdapter.js';

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

console.log('=== Running Onboard Button Experiment & Code Runner Tests ===\n');

// ─── Helper: Create base valid button + LED circuit document ───
function createBaseButtonCircuit() {
  return {
    schemaVersion: 1,
    boardId: 'esp32-devkit-v1',
    instances: [
      { id: 'inst-esp32', componentTypeId: 'esp32-devkit-v1' },
      { id: 'inst-breadboard', componentTypeId: 'breadboard-half' },
      { id: 'inst-button', componentTypeId: 'push-button' },
      { id: 'inst-resistor', componentTypeId: 'resistor-220' },
      { id: 'inst-led', componentTypeId: 'led-5mm-red' },
    ],
    connections: [
      // Button: ESP32 D4 -> Button Pin 1A
      {
        id: 'conn-btn-1',
        from: { componentInstanceId: 'inst-esp32', terminalId: 'd4' },
        to: { componentInstanceId: 'inst-button', terminalId: 'pin1a' },
      },
      // Button: Button Pin 2A -> ESP32 GND (Active Low INPUT_PULLUP)
      {
        id: 'conn-btn-2',
        from: { componentInstanceId: 'inst-button', terminalId: 'pin2a' },
        to: { componentInstanceId: 'inst-esp32', terminalId: 'gnd-14' },
      },
      // LED: ESP32 D2 -> Resistor Pin 1
      {
        id: 'conn-led-1',
        from: { componentInstanceId: 'inst-esp32', terminalId: 'd2' },
        to: { componentInstanceId: 'inst-resistor', terminalId: 'pin1' },
      },
      // Resistor Pin 2 -> LED Anode
      {
        id: 'conn-led-2',
        from: { componentInstanceId: 'inst-resistor', terminalId: 'pin2' },
        to: { componentInstanceId: 'inst-led', terminalId: 'anode' },
      },
      // LED Cathode -> ESP32 GND
      {
        id: 'conn-led-3',
        from: { componentInstanceId: 'inst-led', terminalId: 'cathode' },
        to: { componentInstanceId: 'inst-esp32', terminalId: 'gnd-29' },
      },
    ],
  };
}

const standardButtonCode = `
const int BUTTON_PIN = 4;
const int LED_PIN = 2;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  if (buttonState == LOW) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}
`;

// ─── Test Suite 1: Valid Button + Pull-Up + LED Circuit ───
console.log('Test Suite 1: Valid Button + Pull-Up + LED Circuit');

const validCircuit = createBaseButtonCircuit();
const topology = validateButtonTopology(validCircuit);

assert(topology.valid === true, 'Valid button circuit passes topology validation');
assert(topology.buttonInputPin === 'd4', 'Button input pin identified as D4');
assert(topology.buttonReturnPin === 'gnd', 'Button return path identified as Ground');
assert(topology.buttonPullMode === 'internal_pullup', 'Identified internal_pullup mode');
assert(topology.ledTopology.valid === true, 'Associated LED topology is valid');

// ─── Test Suite 2: Known-Bad — Disconnected Button Input Wire ───
console.log('\nTest Suite 2: Known-Bad — Disconnected Button Input Wire');

const disconnectedButtonCircuit = createBaseButtonCircuit();
// Remove the wire from ESP32 to Button
disconnectedButtonCircuit.connections = disconnectedButtonCircuit.connections.filter(
  (c) => c.id !== 'conn-btn-1'
);

const disconnectedTopology = validateButtonTopology(disconnectedButtonCircuit);
const openInputDiag = disconnectedTopology.diagnostics.find(
  (d) => d.code === 'OPEN_BUTTON_INPUT'
);

assert(disconnectedTopology.valid === false, 'Disconnected button circuit fails validation');
assert(openInputDiag !== undefined, 'Flags OPEN_BUTTON_INPUT diagnostic');
assert(openInputDiag.severity === 'error', 'Missing input wire is fatal error');

// ─── Test Suite 3: Known-Bad — Short Circuit Across Button ───
console.log('\nTest Suite 3: Known-Bad — Dead Short Across Button');

const shortCircuitButton = {
  schemaVersion: 1,
  boardId: 'esp32-devkit-v1',
  instances: [
    { id: 'inst-esp32', componentTypeId: 'esp32-devkit-v1' },
    { id: 'inst-button', componentTypeId: 'push-button' },
    { id: 'inst-resistor', componentTypeId: 'resistor-220' },
    { id: 'inst-led', componentTypeId: 'led-5mm-red' },
  ],
  connections: [
    // Dangerous: Button connects directly between 3V3 and GND!
    {
      id: 'conn-short-1',
      from: { componentInstanceId: 'inst-esp32', terminalId: '3v3' },
      to: { componentInstanceId: 'inst-button', terminalId: 'pin1a' },
    },
    {
      id: 'conn-short-2',
      from: { componentInstanceId: 'inst-button', terminalId: 'pin2a' },
      to: { componentInstanceId: 'inst-esp32', terminalId: 'gnd-14' },
    },
    // LED connections
    {
      id: 'c-led-1',
      from: { componentInstanceId: 'inst-esp32', terminalId: 'd2' },
      to: { componentInstanceId: 'inst-resistor', terminalId: 'pin1' },
    },
    {
      id: 'c-led-2',
      from: { componentInstanceId: 'inst-resistor', terminalId: 'pin2' },
      to: { componentInstanceId: 'inst-led', terminalId: 'anode' },
    },
    {
      id: 'c-led-3',
      from: { componentInstanceId: 'inst-led', terminalId: 'cathode' },
      to: { componentInstanceId: 'inst-esp32', terminalId: 'gnd-29' },
    },
  ],
};

const shortTopology = validateButtonTopology(shortCircuitButton);
const shortDiag = shortTopology.diagnostics.find((d) => d.code === 'BUTTON_POWER_SHORT');

assert(shortDiag !== undefined, 'Flags BUTTON_POWER_SHORT diagnostic');
assert(shortDiag.severity === 'error', 'Power short is fatal error');
assert(shortTopology.valid === false, 'Short circuit fails validation');

// ─── Test Suite 4: Known-Bad — Floating Button Input ───
console.log('\nTest Suite 4: Known-Bad — Floating Button Input');

const floatingButtonCircuit = createBaseButtonCircuit();
// Wire button to 3V3 instead of GND without pull-down resistor
floatingButtonCircuit.connections = floatingButtonCircuit.connections.map((c) => {
  if (c.id === 'conn-btn-2') {
    return {
      ...c,
      to: { componentInstanceId: 'inst-esp32', terminalId: '3v3' },
    };
  }
  return c;
});

const floatingTopology = validateButtonTopology(floatingButtonCircuit);
const floatingDiag = floatingTopology.diagnostics.find(
  (d) => d.code === 'FLOATING_BUTTON_INPUT'
);

assert(floatingDiag !== undefined, 'Flags FLOATING_BUTTON_INPUT diagnostic');
assert(floatingDiag.severity === 'warning', 'Floating input is a warning');
assert(floatingTopology.buttonPullMode === 'floating', 'Pull mode marked as floating');

// ─── Test Suite 5: Firmware Parser & Safety Checks ───
console.log('\nTest Suite 5: Firmware Parser & Safety Checks');

const parsed = parseFirmware(standardButtonCode);
assert(parsed.valid === true, 'Parsed valid button firmware');
assert(parsed.pinModes[4] === 'INPUT_PULLUP', 'Resolved GPIO 4 as INPUT_PULLUP');
assert(parsed.pinModes[2] === 'OUTPUT', 'Resolved GPIO 2 as OUTPUT');
assert(parsed.digitalReads.includes(4), 'Detected digitalRead on pin 4');
assert(parsed.conditionalLogic.hasIfCheck === true, 'Detected if() statement');
assert(parsed.conditionalLogic.checksLow === true, 'Detected check for LOW state');

// Test bad firmware: button pin configured as OUTPUT!
const dangerousCode = `
void setup() { pinMode(4, OUTPUT); pinMode(2, OUTPUT); }
void loop() { digitalWrite(4, HIGH); }
`;

const dangerousSim = runButtonSimulation({
  circuit: validCircuit,
  code: dangerousCode,
});

const badPinDiag = dangerousSim.diagnostics.find(
  (d) => d.code === 'BUTTON_PIN_CONFIGURED_AS_OUTPUT'
);
assert(badPinDiag !== undefined, 'Flags BUTTON_PIN_CONFIGURED_AS_OUTPUT');
assert(badPinDiag.severity === 'error', 'Configuring button pin as OUTPUT is fatal');
assert(dangerousSim.success === false, 'Dangerous code cannot pass simulation');

// ─── Test Suite 6: Deterministic Button Simulation Timeline ───
console.log('\nTest Suite 6: Deterministic Button Simulation Timeline');

// Button event sequence: Released, Pressed, Pressed, Released, Pressed, Released
const testEvents = [false, true, true, false, true, false];

const simResult = runButtonSimulation({
  experimentId: 'exp-02-button',
  circuit: validCircuit,
  code: standardButtonCode,
  buttonEvents: testEvents,
});

assert(simResult.success === true, 'Button simulation succeeds with valid circuit and code');
assert(simResult.summary.buttonPressesSimulated === 3, 'Simulated 3 button press events');
assert(simResult.summary.ledActivationsObserved === 3, 'Observed 3 LED activations matching presses');
assert(simResult.timeline.length === 6, 'Timeline has 6 ticks matching event array');

// Check tick 0 (released) -> LED OFF
assert(
  simResult.timeline[0].buttonPressed === false && simResult.timeline[0].ledOn === false,
  'Tick 0: Button released -> LED OFF'
);

// Check tick 1 (pressed) -> LED ON
assert(
  simResult.timeline[1].buttonPressed === true &&
    simResult.timeline[1].buttonPinState === 'LOW' &&
    simResult.timeline[1].ledOn === true,
  'Tick 1: Button pressed -> Pin is LOW -> LED ON'
);

// Test unified dispatcher
const unifiedResult = runSimulation({
  experimentId: 'exp-02-button',
  circuit: validCircuit,
  code: standardButtonCode,
  buttonEvents: testEvents,
});
assert(unifiedResult.summary.buttonInputPin === 'd4', 'Unified dispatcher routes to button simulation');

// ─── Test Suite 7: Challenge Evidence Token ───
console.log('\nTest Suite 7: Challenge Evidence Token');

const token = simResult.evidenceToken;
assert(typeof token === 'string' && token.startsWith('OB_EV_'), 'Evidence token format verified');

const verified = verifyChallengeEvidence(token);
assert(verified.valid === true, 'Button evidence token passes cryptographic verification');
assert(verified.isPassingEvidence === true, 'Token confirms experiment passed successfully');
assert(verified.payload.expId === 'exp-02-button', 'Token carries exp-02-button ID');

console.log('\n=============================================');
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log('=============================================');

if (failed > 0) {
  process.exit(1);
}
