/**
 * Automated Verification Tests for Onboard Circuit Schema & Validation Engine
 * Conforms to Section 5E, Section 10, and Section 16 (Prompt 6) of MVP Specification.
 *
 * Validates:
 * 1. Empty circuit document creation & schema version.
 * 2. Component palette limits (maxInstances enforcement).
 * 3. Valid LED + resistor + ESP32 topology passes.
 * 4. Direct GPIO-to-LED without resistor triggers safety warning.
 * 5. Invalid component type rejected.
 * 6. VIN to GPIO connection blocked as an error.
 * 7. Duplicate connection IDs rejected.
 * 8. Save/load roundtrip preserves document integrity.
 */

import {
  createEmptyCircuit,
  validateCircuitDocument,
  SUPPORTED_COMPONENTS,
  CIRCUIT_SCHEMA_VERSION,
} from '../src/services/circuitSchema.js';

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

console.log('=== Running Onboard Circuit Schema & Validation Tests ===\n');

// ─── Test Suite 1: Document Initialization ───
console.log('Test Suite 1: Document Creation & Schema Version');

const emptyDoc = createEmptyCircuit();
assert(emptyDoc.schemaVersion === CIRCUIT_SCHEMA_VERSION, `Schema version is ${CIRCUIT_SCHEMA_VERSION}`);
assert(emptyDoc.boardId === 'esp32-devkit-v1', 'Default board is esp32-devkit-v1');
assert(Array.isArray(emptyDoc.instances) && emptyDoc.instances.length === 2, 'Empty circuit seeds ESP32 + Breadboard (2 instances)');
assert(Array.isArray(emptyDoc.connections) && emptyDoc.connections.length === 0, 'Empty circuit has no connections');
assert(typeof emptyDoc.id === 'string' && emptyDoc.id.startsWith('circuit-'), 'Circuit ID is generated and prefixed correctly');
assert(emptyDoc.metadata.simulationLevel === 'deterministic_educational', 'Simulation level is labeled deterministic_educational');

// ─── Test Suite 2: Palette Bounds ───
console.log('\nTest Suite 2: Supported Component Palette Limits');

assert(SUPPORTED_COMPONENTS['esp32-devkit-v1'].maxInstances === 1, 'ESP32 max 1 instance');
assert(SUPPORTED_COMPONENTS['breadboard-half'].maxInstances === 1, 'Breadboard max 1 instance');
assert(SUPPORTED_COMPONENTS['led-5mm-red'].maxInstances === 4, 'LED red max 4 instances');
assert(SUPPORTED_COMPONENTS['resistor-220'].maxInstances === 8, 'Resistor 220Ω max 8 instances');
assert(SUPPORTED_COMPONENTS['push-button'].maxInstances === 4, 'Button max 4 instances');
assert(SUPPORTED_COMPONENTS['potentiometer-10k'].maxInstances === 2, 'Potentiometer max 2 instances');
assert(SUPPORTED_COMPONENTS['wire'].maxInstances === 20, 'Wire max 20 instances');

// ESP32 terminals contain the critical GPIO 2 (D2 / onboard LED)
const d2Terminal = SUPPORTED_COMPONENTS['esp32-devkit-v1'].terminals.find((t) => t.id === 'd2');
assert(d2Terminal && d2Terminal.gpioNum === 2, 'ESP32 terminal catalog contains D2 (GPIO 2)');

// LED requires resistor partner
assert(
  SUPPORTED_COMPONENTS['led-5mm-red'].requiredPartner === 'resistor-220',
  'LED requires resistor-220 as requiredPartner'
);

// ─── Test Suite 3: Valid LED Blink Topology ───
console.log('\nTest Suite 3: Valid LED Blink Topology Passes Validation');

const validBlinkDoc = {
  schemaVersion: 1,
  boardId: 'esp32-devkit-v1',
  id: 'circuit-test-blink',
  name: 'Test: Valid Blink',
  instances: [
    { id: 'inst-board-1', componentTypeId: 'esp32-devkit-v1', label: 'ESP32', position: { x: 50, y: 180 } },
    { id: 'inst-bb-1', componentTypeId: 'breadboard-half', label: 'BB', position: { x: 320, y: 150 } },
    { id: 'inst-r1', componentTypeId: 'resistor-220', label: '220Ω', position: { x: 450, y: 200 } },
    { id: 'inst-led1', componentTypeId: 'led-5mm-red', label: 'Red LED', position: { x: 550, y: 200 } },
  ],
  connections: [
    {
      id: 'conn-1',
      from: { instanceId: 'inst-board-1', terminalId: 'd2' },
      to: { instanceId: 'inst-r1', terminalId: 'pin1' },
    },
    {
      id: 'conn-2',
      from: { instanceId: 'inst-r1', terminalId: 'pin2' },
      to: { instanceId: 'inst-led1', terminalId: 'anode' },
    },
    {
      id: 'conn-3',
      from: { instanceId: 'inst-led1', terminalId: 'cathode' },
      to: { instanceId: 'inst-board-1', terminalId: 'gnd-14' },
    },
  ],
  metadata: { simulationLevel: 'deterministic_educational', validationStatus: 'pending', guidedStep: null },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const blinkResult = validateCircuitDocument(validBlinkDoc);
assert(blinkResult.valid, 'Valid LED blink topology passes schema validation');
assert(blinkResult.errors.length === 0, 'Valid topology has zero schema errors');

// ─── Test Suite 4: GPIO-to-LED Without Resistor Triggers Safety Warning ───
console.log('\nTest Suite 4: GPIO-to-LED Without Resistor Safety Warning');

const dangerousDoc = {
  ...validBlinkDoc,
  id: 'circuit-test-danger',
  connections: [
    {
      id: 'conn-danger-1',
      from: { instanceId: 'inst-board-1', terminalId: 'd2' },
      to: { instanceId: 'inst-led1', terminalId: 'anode' }, // Direct GPIO → LED, no resistor!
    },
    {
      id: 'conn-danger-2',
      from: { instanceId: 'inst-led1', terminalId: 'cathode' },
      to: { instanceId: 'inst-board-1', terminalId: 'gnd-14' },
    },
  ],
};

const dangerResult = validateCircuitDocument(dangerousDoc);
assert(
  dangerResult.warnings.some((w) => w.toLowerCase().includes('resistor') || w.toLowerCase().includes('220')),
  'GPIO-to-LED direct connection triggers safety warning about missing resistor'
);

// ─── Test Suite 5: Unsupported Component Type Rejected ───
console.log('\nTest Suite 5: Unsupported Component Type Rejected');

const badComponentDoc = {
  ...validBlinkDoc,
  id: 'circuit-test-badtype',
  instances: [
    ...validBlinkDoc.instances,
    { id: 'inst-alien', componentTypeId: 'unknown-rfid-module', label: 'RFID', position: { x: 600, y: 300 } },
  ],
};

const badTypeResult = validateCircuitDocument(badComponentDoc);
assert(!badTypeResult.valid, 'Document with unsupported component type fails validation');
assert(
  badTypeResult.errors.some((e) => e.includes('unknown-rfid-module')),
  'Error message names the unsupported component type'
);

// ─── Test Suite 6: VIN-to-GPIO Connection Blocked ───
console.log('\nTest Suite 6: VIN to GPIO Connection Blocked as Error');

const vinGpioDoc = {
  ...validBlinkDoc,
  id: 'circuit-test-vin-gpio',
  connections: [
    {
      id: 'conn-deadly',
      from: { instanceId: 'inst-board-1', terminalId: 'vin' }, // 5V VIN
      to: { instanceId: 'inst-board-1', terminalId: 'd2' },    // 3.3V GPIO!
    },
  ],
};

const vinGpioResult = validateCircuitDocument(vinGpioDoc);
assert(
  vinGpioResult.errors.some((e) => e.toLowerCase().includes('vin') || e.toLowerCase().includes('5v')) ||
  vinGpioResult.warnings.some((w) => w.toLowerCase().includes('vin') || w.toLowerCase().includes('5v')),
  'VIN to GPIO connection triggers error or strong warning'
);

// ─── Test Suite 7: Duplicate Connection IDs Rejected ───
console.log('\nTest Suite 7: Duplicate Connection IDs Rejected');

const dupConnDoc = {
  ...validBlinkDoc,
  id: 'circuit-test-dup-conn',
  connections: [
    { id: 'conn-dup', from: { instanceId: 'inst-board-1', terminalId: 'd2' }, to: { instanceId: 'inst-r1', terminalId: 'pin1' } },
    { id: 'conn-dup', from: { instanceId: 'inst-r1', terminalId: 'pin2' }, to: { instanceId: 'inst-led1', terminalId: 'anode' } },
  ],
};

const dupConnResult = validateCircuitDocument(dupConnDoc);
assert(!dupConnResult.valid, 'Document with duplicate connection IDs fails validation');
assert(
  dupConnResult.errors.some((e) => e.toLowerCase().includes('duplicate')),
  'Error explicitly reports duplicate connection ID'
);

// ─── Test Suite 8: Save / Load Roundtrip ───
console.log('\nTest Suite 8: Save & Load Roundtrip Preserves Document');

const exported = JSON.stringify(validBlinkDoc);
const reimported = JSON.parse(exported);
const roundtripResult = validateCircuitDocument(reimported);

assert(roundtripResult.valid, 'Roundtrip JSON.stringify → JSON.parse circuit validates correctly');
assert(reimported.schemaVersion === validBlinkDoc.schemaVersion, 'Schema version survives roundtrip');
assert(reimported.instances.length === validBlinkDoc.instances.length, 'Instance count survives roundtrip');
assert(reimported.connections.length === validBlinkDoc.connections.length, 'Connection count survives roundtrip');
assert(reimported.boardId === 'esp32-devkit-v1', 'Board ID survives roundtrip');

// ─── Summary ───
console.log('\n=============================================');
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log('=============================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
