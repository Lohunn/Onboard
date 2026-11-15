/**
 * Automated Verification Tests for ESP32 Board Explorer & Pinout Map
 * Conforms to Section 5D, Section 10, and Section 16 (Prompt 5) of MVP Specification.
 *
 * Validates:
 * 1. Exact 30-pin layout for DOIT ESP32 DevKit V1 (15 left, 15 right).
 * 2. Strict electrical safety limits (3.3V logic level, VIN 5V isolation).
 * 3. Verified GPIO mapping and strapping pin caveats.
 * 4. Input-only pin identification and output restriction.
 * 5. Pin search and category filtering accuracy.
 */

import {
  ESP32_DEVKIT_V1_SPEC,
  ESP32_DEVKIT_V1_PINS,
  searchPins,
} from '../src/data/esp32DevKitV1.js';

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

console.log('=== Running ESP32 Board Explorer Verification Tests ===\n');

// ─── Test Suite 1: Board Variant & Pin Layout Integrity ───
console.log('Test Suite 1: Board Specification & Physical Pin Count');

assert(ESP32_DEVKIT_V1_SPEC.id === 'esp32-devkit-v1', 'Board ID matches verified esp32-devkit-v1');
assert(ESP32_DEVKIT_V1_SPEC.totalPins === 30, 'Total pins is strictly 30');
assert(ESP32_DEVKIT_V1_SPEC.logicVoltage === '3.3V', 'Operating logic voltage is verified 3.3V');

assert(ESP32_DEVKIT_V1_PINS.length === 30, 'Pinout dataset contains exactly 30 pins');

const leftPins = ESP32_DEVKIT_V1_PINS.filter((p) => p.side === 'left');
const rightPins = ESP32_DEVKIT_V1_PINS.filter((p) => p.side === 'right');

assert(leftPins.length === 15, 'Left header contains exactly 15 pins (Pins 1-15)');
assert(rightPins.length === 15, 'Right header contains exactly 15 pins (Pins 16-30)');

// Sequential pin number integrity
const pinNumbers = ESP32_DEVKIT_V1_PINS.map((p) => p.pinNumber);
const isSequential = pinNumbers.every((num, idx) => num === idx + 1);
assert(isSequential, 'Pin numbers are strictly contiguous 1 through 30');

// ─── Test Suite 2: Power Rails & Ground Isolation ───
console.log('\nTest Suite 2: Power Rails & Safety Limits');

const vinPin = ESP32_DEVKIT_V1_PINS.find((p) => p.label === 'VIN');
assert(vinPin && vinPin.pinNumber === 15, 'VIN is Pin 15 on bottom-left header');
assert(vinPin.category === 'power', 'VIN is categorized as power');
assert(
  vinPin.warnings.some((w) => w.includes('5V')),
  'VIN prominently documents 5V rail hazard to 3.3V GPIOs'
);

const v33Pin = ESP32_DEVKIT_V1_PINS.find((p) => p.label === '3V3');
assert(v33Pin && v33Pin.pinNumber === 30, '3V3 is Pin 30 on bottom-right header');
assert(v33Pin.category === 'power', '3V3 is categorized as power');

const gndPins = ESP32_DEVKIT_V1_PINS.filter((p) => p.label === 'GND');
assert(gndPins.length === 2, 'Board provides exactly 2 Ground pins');
assert(
  gndPins.some((p) => p.pinNumber === 14) && gndPins.some((p) => p.pinNumber === 29),
  'Ground pins located at Pin 14 (left) and Pin 29 (right)'
);

// ─── Test Suite 3: Critical Verified Peripherals & Strapping Pins ───
console.log('\nTest Suite 3: GPIO Mapping & Strapping Warnings');

// Pin D2 (GPIO 2 - Onboard LED)
const d2Pin = ESP32_DEVKIT_V1_PINS.find((p) => p.label === 'D2');
assert(d2Pin && d2Pin.gpio === 2, 'D2 maps to GPIO 2');
assert(
  d2Pin.capabilities.some((c) => c.toLowerCase().includes('blue led')),
  'D2 identifies on-board blue LED connection'
);
assert(
  d2Pin.warnings.some((w) => w.toLowerCase().includes('strapping')),
  'D2 documents strapping bootloader behavior'
);

// Pin D12 (GPIO 12 - MTDI Flash Voltage Strapping Pin)
const d12Pin = ESP32_DEVKIT_V1_PINS.find((p) => p.label === 'D12');
assert(d12Pin && d12Pin.gpio === 12, 'D12 maps to GPIO 12');
assert(
  d12Pin.warnings.some((w) => w.includes('CRITICAL STRAPPING PIN')) &&
    d12Pin.warnings.some((w) => w.includes('1.8V')),
  'D12 provides critical warning regarding flash voltage latching at boot'
);

// I2C Default Pins: D21 (SDA) and D22 (SCL)
const sdaPin = ESP32_DEVKIT_V1_PINS.find((p) => p.label === 'D21');
const sclPin = ESP32_DEVKIT_V1_PINS.find((p) => p.label === 'D22');
assert(sdaPin && sdaPin.gpio === 21 && sdaPin.capabilities.some((c) => c.includes('SDA')), 'D21 is default I2C SDA (GPIO 21)');
assert(sclPin && sclPin.gpio === 22 && sclPin.capabilities.some((c) => c.includes('SCL')), 'D22 is default I2C SCL (GPIO 22)');

// ─── Test Suite 4: Input-Only Pins Strict Enforcment ───
console.log('\nTest Suite 4: Input-Only Pins Enforcement');

const inputOnlyPins = ESP32_DEVKIT_V1_PINS.filter((p) => p.category === 'input_only');
assert(inputOnlyPins.length === 4, 'Exactly 4 pins are categorized as input_only');

const inputOnlyLabels = inputOnlyPins.map((p) => p.label);
assert(
  inputOnlyLabels.includes('VP') &&
    inputOnlyLabels.includes('VN') &&
    inputOnlyLabels.includes('D34') &&
    inputOnlyLabels.includes('D35'),
  'Input-only pins strictly comprise VP (GPIO 36), VN (GPIO 39), D34 (GPIO 34), and D35 (GPIO 35)'
);

for (const p of inputOnlyPins) {
  const hasPwm = p.capabilities.some((c) => c.toLowerCase().includes('pwm'));
  const hasOutput = p.capabilities.some((c) => c.toLowerCase().includes('output'));
  assert(!hasPwm && !hasOutput, `Input-only pin ${p.label} has NO output or PWM capabilities`);
  assert(
    p.warnings.some((w) => w.includes('INPUT ONLY')),
    `Input-only pin ${p.label} contains clear INPUT ONLY warning`
  );
}

// ─── Test Suite 5: Search & Filter Algorithms ───
console.log('\nTest Suite 5: Search & Filter Accuracy');

// Search by label
const searchD2 = searchPins('D2');
assert(searchD2.some((p) => p.label === 'D2'), 'Search "D2" returns pin D2');

// Search by GPIO number
const searchGpio4 = searchPins('4');
assert(searchGpio4.some((p) => p.gpio === 4), 'Search "4" matches GPIO 4 (D4)');

// Search by feature keyword "touch" (9 touch channels broken out on 30-pin header; Touch 1 is internal to BOOT button)
const touchPins = searchPins('touch');
assert(touchPins.length === 9, `Search "touch" finds all 9 header-exposed touch pins (found ${touchPins.length})`);

// Filter by category "input_only"
const filteredInputOnly = searchPins('', 'input_only');
assert(filteredInputOnly.length === 4, 'Category filter "input_only" returns exactly 4 pins');

// Filter by category "power"
const filteredPower = searchPins('', 'power');
assert(filteredPower.length === 4, 'Category filter "power" returns 3V3, VIN, and both GNDs (4 pins)');

// ─── Summary ───
console.log('\n=============================================');
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log('=============================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
