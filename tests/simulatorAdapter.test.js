/**
 * Automated Verification Tests for Onboard Simulator Adapter & LED Experiment
 * Conforms to Section 5E, Section 10, and Section 16 (Prompt 7) of MVP Specification.
 *
 * Verifies:
 * 1. Declared capability level is 'deterministic_educational' with explicit disclaimer.
 * 2. Known-good circuit (ESP32 D2 -> Resistor 220Ω -> LED Anode -> Cathode -> GND) + matching code passes.
 * 3. Known-bad: Missing current-limiting resistor triggers safety warning.
 * 4. Known-bad: Reversed LED polarity (Cathode to GPIO) triggers polarity error.
 * 5. Known-bad: Disconnected GND / open circuit triggers open circuit error.
 * 6. Known-bad: Input-only pin (D34 / VP / VN) triggers CANNOT_OUTPUT_ON_INPUT_ONLY_PIN.
 * 7. Known-bad: Pin mismatch (code controls GPIO 4, circuit on GPIO 2) triggers GPIO_PIN_MISMATCH.
 * 8. Known-bad: 5V VIN connected to GPIO triggers OVERVOLTAGE_5V_TO_GPIO.
 * 9. Deterministic timeline generation (exact intervals, discrete states, calculated current).
 * 10. Server-side challenge evidence token generation, signature validation, and tamper resistance.
 */

import {
  SIMULATION_CAPABILITY_LEVEL,
  SIMULATION_DISCLAIMER,
  parseFirmware,
  runLedSimulation,
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

console.log('=== Running Onboard Simulator Adapter & LED Experiment Tests ===\n');

// ─── Test Suite 1: Capability Level Declaration ───
console.log('Test Suite 1: Capability Level Declaration');
assert(
  SIMULATION_CAPABILITY_LEVEL === 'deterministic_educational',
  'Capability level is explicitly "deterministic_educational"'
);
assert(
  typeof SIMULATION_DISCLAIMER === 'string' &&
    SIMULATION_DISCLAIMER.includes('Deterministic educational simulation') &&
    SIMULATION_DISCLAIMER.includes('ESP32 DevKit V1'),
  'Simulation disclaimer explicitly mentions ESP32 DevKit V1 and educational scope'
);

// Helper to create base valid circuit document
function createBaseCircuit() {
  return {
    schemaVersion: 1,
    boardId: 'esp32-devkit-v1',
    instances: [
      { id: 'inst-esp32', componentTypeId: 'esp32-devkit-v1' },
      { id: 'inst-breadboard', componentTypeId: 'breadboard-half' },
      { id: 'inst-resistor', componentTypeId: 'resistor-220' },
      { id: 'inst-led', componentTypeId: 'led-5mm-red' },
    ],
    connections: [
      // ESP32 D2 -> Resistor pin1
      {
        id: 'conn-1',
        from: { componentInstanceId: 'inst-esp32', terminalId: 'd2' },
        to: { componentInstanceId: 'inst-resistor', terminalId: 'pin1' },
      },
      // Resistor pin2 -> LED Anode
      {
        id: 'conn-2',
        from: { componentInstanceId: 'inst-resistor', terminalId: 'pin2' },
        to: { componentInstanceId: 'inst-led', terminalId: 'anode' },
      },
      // LED Cathode -> ESP32 GND
      {
        id: 'conn-3',
        from: { componentInstanceId: 'inst-led', terminalId: 'cathode' },
        to: { componentInstanceId: 'inst-esp32', terminalId: 'gnd-14' },
      },
    ],
  };
}

const standardBlinkCode = `
const int LED_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}
`;

// ─── Test Suite 2: Known-Good LED Blink Circuit ───
console.log('\nTest Suite 2: Known-Good LED Blink Circuit');

const goodCircuit = createBaseCircuit();
const goodSimResult = runLedSimulation({
  experimentId: 'exp-01-blink',
  circuit: goodCircuit,
  code: standardBlinkCode,
  options: { stepCount: 6, timeStepMs: 500 },
});

assert(goodSimResult.success === true, 'Known-good circuit + code simulation succeeds');
assert(goodSimResult.validation.circuitValid === true, 'Circuit topology is marked valid');
assert(goodSimResult.validation.codeValid === true, 'Firmware code is marked valid');
assert(goodSimResult.summary.drivingPin === 'd2', 'Driving pin identified as d2 (GPIO 2)');
assert(goodSimResult.summary.hasResistor === true, 'Presence of series resistor verified');
assert(goodSimResult.summary.blinkCyclesObserved >= 1, 'Observed at least 1 full blink cycle');
assert(goodSimResult.timeline.length === 6, 'Timeline contains exactly 6 requested steps');
assert(
  goodSimResult.timeline[0].ledOn === true && goodSimResult.timeline[1].ledOn === false,
  'Timeline correctly alternates LED state between ON and OFF'
);
assert(
  Math.abs(goodSimResult.timeline[0].currentMa - 5.91) < 0.1,
  'Calculated forward current is ~5.91mA with 220Ω resistor'
);

// ─── Test Suite 3: Known-Bad — Missing Resistor ───
console.log('\nTest Suite 3: Known-Bad — Missing Current Limiting Resistor');

const noResistorCircuit = {
  schemaVersion: 1,
  boardId: 'esp32-devkit-v1',
  instances: [
    { id: 'inst-esp32', componentTypeId: 'esp32-devkit-v1' },
    { id: 'inst-led', componentTypeId: 'led-5mm-red' },
  ],
  connections: [
    // Direct ESP32 D2 -> LED Anode (NO RESISTOR!)
    {
      id: 'conn-1',
      from: { componentInstanceId: 'inst-esp32', terminalId: 'd2' },
      to: { componentInstanceId: 'inst-led', terminalId: 'anode' },
    },
    // LED Cathode -> ESP32 GND
    {
      id: 'conn-2',
      from: { componentInstanceId: 'inst-led', terminalId: 'cathode' },
      to: { componentInstanceId: 'inst-esp32', terminalId: 'gnd-14' },
    },
  ],
};

const noResistorSim = runLedSimulation({
  circuit: noResistorCircuit,
  code: standardBlinkCode,
});

const missingResistorDiag = noResistorSim.diagnostics.find(
  (d) => d.code === 'MISSING_CURRENT_LIMITING_RESISTOR'
);
assert(missingResistorDiag !== undefined, 'Flags MISSING_CURRENT_LIMITING_RESISTOR diagnostic');
assert(missingResistorDiag.severity === 'warning', 'Missing resistor severity is warning');
assert(noResistorSim.summary.hasResistor === false, 'Summary confirms hasResistor is false');

// ─── Test Suite 4: Known-Bad — Reversed LED Polarity ───
console.log('\nTest Suite 4: Known-Bad — Reversed LED Polarity');

const reversedLedCircuit = {
  schemaVersion: 1,
  boardId: 'esp32-devkit-v1',
  instances: [
    { id: 'inst-esp32', componentTypeId: 'esp32-devkit-v1' },
    { id: 'inst-resistor', componentTypeId: 'resistor-220' },
    { id: 'inst-led', componentTypeId: 'led-5mm-red' },
  ],
  connections: [
    // ESP32 D2 -> Resistor -> Cathode (REVERSED!)
    {
      id: 'conn-1',
      from: { componentInstanceId: 'inst-esp32', terminalId: 'd2' },
      to: { componentInstanceId: 'inst-resistor', terminalId: 'pin1' },
    },
    {
      id: 'conn-2',
      from: { componentInstanceId: 'inst-resistor', terminalId: 'pin2' },
      to: { componentInstanceId: 'inst-led', terminalId: 'cathode' }, // WRONG!
    },
    {
      id: 'conn-3',
      from: { componentInstanceId: 'inst-led', terminalId: 'anode' },
      to: { componentInstanceId: 'inst-esp32', terminalId: 'gnd-14' },
    },
  ],
};

const reversedSim = runLedSimulation({
  circuit: reversedLedCircuit,
  code: standardBlinkCode,
});

const reversedDiag = reversedSim.diagnostics.find((d) => d.code === 'LED_REVERSED_POLARITY');
assert(reversedDiag !== undefined, 'Flags LED_REVERSED_POLARITY diagnostic');
assert(reversedSim.summary.isReversed === true, 'Summary confirms isReversed is true');
assert(reversedSim.success === false, 'Reversed LED cannot pass simulation');

// ─── Test Suite 5: Known-Bad — Open Circuit / Disconnected GND ───
console.log('\nTest Suite 5: Known-Bad — Open Circuit / Disconnected GND');

const openCircuit = {
  schemaVersion: 1,
  boardId: 'esp32-devkit-v1',
  instances: [
    { id: 'inst-esp32', componentTypeId: 'esp32-devkit-v1' },
    { id: 'inst-resistor', componentTypeId: 'resistor-220' },
    { id: 'inst-led', componentTypeId: 'led-5mm-red' },
  ],
  connections: [
    // Resistor connected to GPIO, but LED Cathode has NO ground return wire!
    {
      id: 'conn-1',
      from: { componentInstanceId: 'inst-esp32', terminalId: 'd2' },
      to: { componentInstanceId: 'inst-resistor', terminalId: 'pin1' },
    },
    {
      id: 'conn-2',
      from: { componentInstanceId: 'inst-resistor', terminalId: 'pin2' },
      to: { componentInstanceId: 'inst-led', terminalId: 'anode' },
    },
  ],
};

const openSim = runLedSimulation({
  circuit: openCircuit,
  code: standardBlinkCode,
});

const openGndDiag = openSim.diagnostics.find((d) => d.code === 'OPEN_CIRCUIT_NO_GND');
assert(openGndDiag !== undefined, 'Flags OPEN_CIRCUIT_NO_GND diagnostic');
assert(openSim.validation.circuitValid === false, 'Circuit is not valid without closed loop');
assert(openSim.success === false, 'Open circuit simulation fails');

// ─── Test Suite 6: Known-Bad — Input-Only Pin (D34/VP/VN) ───
console.log('\nTest Suite 6: Known-Bad — Input-Only Pin');

const inputOnlyCircuit = {
  schemaVersion: 1,
  boardId: 'esp32-devkit-v1',
  instances: [
    { id: 'inst-esp32', componentTypeId: 'esp32-devkit-v1' },
    { id: 'inst-resistor', componentTypeId: 'resistor-220' },
    { id: 'inst-led', componentTypeId: 'led-5mm-red' },
  ],
  connections: [
    // Connected to D34 (GPIO 34 is INPUT ONLY!)
    {
      id: 'conn-1',
      from: { componentInstanceId: 'inst-esp32', terminalId: 'd34' },
      to: { componentInstanceId: 'inst-resistor', terminalId: 'pin1' },
    },
    {
      id: 'conn-2',
      from: { componentInstanceId: 'inst-resistor', terminalId: 'pin2' },
      to: { componentInstanceId: 'inst-led', terminalId: 'anode' },
    },
    {
      id: 'conn-3',
      from: { componentInstanceId: 'inst-led', terminalId: 'cathode' },
      to: { componentInstanceId: 'inst-esp32', terminalId: 'gnd-14' },
    },
  ],
};

const inputOnlySim = runLedSimulation({
  circuit: inputOnlyCircuit,
  code: `
void setup() { pinMode(34, OUTPUT); }
void loop() { digitalWrite(34, HIGH); delay(500); digitalWrite(34, LOW); delay(500); }
`,
});

const inputOnlyDiag = inputOnlySim.diagnostics.find(
  (d) => d.code === 'CANNOT_OUTPUT_ON_INPUT_ONLY_PIN'
);
assert(inputOnlyDiag !== undefined, 'Flags CANNOT_OUTPUT_ON_INPUT_ONLY_PIN diagnostic');
assert(inputOnlyDiag.severity === 'error', 'Input-only pin output error is fatal');
assert(inputOnlySim.success === false, 'Simulation fails when using input-only pin as output');

// ─── Test Suite 7: Known-Bad — Firmware Pin Mismatch ───
console.log('\nTest Suite 7: Known-Bad — Firmware Pin Mismatch');

// Circuit is on D2, but code configures and drives pin 4!
const mismatchCode = `
void setup() { pinMode(4, OUTPUT); }
void loop() { digitalWrite(4, HIGH); delay(500); digitalWrite(4, LOW); delay(500); }
`;

const mismatchSim = runLedSimulation({
  circuit: goodCircuit, // Wired to D2
  code: mismatchCode,   // Drives Pin 4
});

const mismatchDiag = mismatchSim.diagnostics.find((d) => d.code === 'GPIO_PIN_MISMATCH');
assert(mismatchDiag !== undefined, 'Flags GPIO_PIN_MISMATCH diagnostic');
assert(mismatchDiag.severity === 'error', 'Pin mismatch is an error');
assert(mismatchSim.success === false, 'Simulation fails due to pin mismatch');

// ─── Test Suite 8: Known-Bad — VIN (5V) Overvoltage Hazard ───
console.log('\nTest Suite 8: Known-Bad — VIN (5V) Overvoltage Hazard');

const overvoltageCircuit = {
  schemaVersion: 1,
  boardId: 'esp32-devkit-v1',
  instances: [
    { id: 'inst-esp32', componentTypeId: 'esp32-devkit-v1' },
    { id: 'inst-resistor', componentTypeId: 'resistor-220' },
    { id: 'inst-led', componentTypeId: 'led-5mm-red' },
  ],
  connections: [
    // Dangerous connection: VIN directly to GPIO 2!
    {
      id: 'conn-danger',
      from: { componentInstanceId: 'inst-esp32', terminalId: 'vin' },
      to: { componentInstanceId: 'inst-esp32', terminalId: 'd2' },
    },
    {
      id: 'conn-1',
      from: { componentInstanceId: 'inst-esp32', terminalId: 'd2' },
      to: { componentInstanceId: 'inst-resistor', terminalId: 'pin1' },
    },
    {
      id: 'conn-2',
      from: { componentInstanceId: 'inst-resistor', terminalId: 'pin2' },
      to: { componentInstanceId: 'inst-led', terminalId: 'anode' },
    },
    {
      id: 'conn-3',
      from: { componentInstanceId: 'inst-led', terminalId: 'cathode' },
      to: { componentInstanceId: 'inst-esp32', terminalId: 'gnd-14' },
    },
  ],
};

const overvoltageSim = runLedSimulation({
  circuit: overvoltageCircuit,
  code: standardBlinkCode,
});

const overvoltageDiag = overvoltageSim.diagnostics.find(
  (d) => d.code === 'OVERVOLTAGE_5V_TO_GPIO'
);
assert(overvoltageDiag !== undefined, 'Flags OVERVOLTAGE_5V_TO_GPIO diagnostic');
assert(overvoltageDiag.severity === 'error', 'Overvoltage is a fatal error');

// ─── Test Suite 9: Firmware Parsing Integrity ───
console.log('\nTest Suite 9: Safe Firmware Parser');

const complexCode = `
// LED blink test
const int MY_LED = 2;
const byte UNUSED = 14;

void setup() {
  Serial.begin(115200);
  pinMode(MY_LED, OUTPUT);
}

void loop() {
  digitalWrite(MY_LED, HIGH);
  delay(1000);
  digitalWrite(MY_LED, LOW);
  delay(500);
}
`;

const parsed = parseFirmware(complexCode);
assert(parsed.valid === true, 'Parsed valid firmware successfully');
assert(parsed.pinModes[2] === 'OUTPUT', 'Resolved variable MY_LED to pin 2 as OUTPUT');
assert(parsed.operations.length === 2, 'Found 2 digitalWrite operations');
assert(parsed.delays[0] === 1000 && parsed.delays[1] === 500, 'Parsed exact delay values');

// ─── Test Suite 10: Server-Side Challenge Evidence Token ───
console.log('\nTest Suite 10: Server-Side Challenge Evidence Token');

const token = goodSimResult.evidenceToken;
assert(typeof token === 'string' && token.startsWith('OB_EV_'), 'Evidence token format is OB_EV_<hash>_<b64>');

const verification = verifyChallengeEvidence(token);
assert(verification.valid === true, 'Evidence token passes signature verification');
assert(verification.isPassingEvidence === true, 'Token confirms experiment objectives achieved');
assert(verification.payload.expId === 'exp-01-blink', 'Token carries correct experimentId');
assert(verification.payload.drivingPin === 'd2', 'Token carries drivingPin metadata');

// Test tamper detection
const tamperedToken = token.slice(0, -4) + 'AAAA';
const tamperedVerification = verifyChallengeEvidence(tamperedToken);
assert(
  tamperedVerification.valid === false,
  'Tampered token fails signature verification'
);

console.log('\n=============================================');
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log('=============================================');

if (failed > 0) {
  process.exit(1);
}
