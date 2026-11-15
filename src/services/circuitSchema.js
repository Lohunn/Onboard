/**
 * Circuit Document Schema for Onboard
 * Conforms to Section 5E, Section 10 (Experiment, CircuitSubmission), and Section 16 (Prompt 6)
 * of ONBOARD Product Architecture & MVP Specification.
 *
 * Key Design Principles:
 * - Circuit documents are independent of any canvas rendering library.
 * - Stable instance IDs survive save/load and cross-session comparisons.
 * - Only supported component types are permitted (bounded component palette).
 * - Connections use component instance + terminal identifiers (not pixel positions).
 * - Schema validation is deterministic and synchronous.
 */

export const CIRCUIT_SCHEMA_VERSION = 1;

// ─── Supported Component Types (Bounded Palette) ───

export const SUPPORTED_COMPONENTS = {
  'esp32-devkit-v1': {
    id: 'esp32-devkit-v1',
    label: 'ESP32 DevKit V1',
    category: 'board',
    maxInstances: 1,
    color: '#2A56A3',
    icon: 'Cpu',
    terminals: [
      { id: '3v3', label: '3V3', electricalType: 'power' },
      { id: 'gnd-14', label: 'GND (Pin 14)', electricalType: 'ground' },
      { id: 'gnd-29', label: 'GND (Pin 29)', electricalType: 'ground' },
      { id: 'vin', label: 'VIN (5V)', electricalType: 'power' },
      { id: 'd2', label: 'D2 (GPIO 2)', electricalType: 'gpio', gpioNum: 2 },
      { id: 'd4', label: 'D4 (GPIO 4)', electricalType: 'gpio', gpioNum: 4 },
      { id: 'd5', label: 'D5 (GPIO 5)', electricalType: 'gpio', gpioNum: 5 },
      { id: 'd13', label: 'D13 (GPIO 13)', electricalType: 'gpio', gpioNum: 13 },
      { id: 'd14', label: 'D14 (GPIO 14)', electricalType: 'gpio', gpioNum: 14 },
      { id: 'd18', label: 'D18 (GPIO 18)', electricalType: 'gpio', gpioNum: 18 },
      { id: 'd19', label: 'D19 (GPIO 19)', electricalType: 'gpio', gpioNum: 19 },
      { id: 'd21', label: 'D21 (SDA)', electricalType: 'gpio', gpioNum: 21 },
      { id: 'd22', label: 'D22 (SCL)', electricalType: 'gpio', gpioNum: 22 },
      { id: 'd23', label: 'D23 (GPIO 23)', electricalType: 'gpio', gpioNum: 23 },
      { id: 'd25', label: 'D25 (GPIO 25)', electricalType: 'gpio', gpioNum: 25 },
      { id: 'd26', label: 'D26 (GPIO 26)', electricalType: 'gpio', gpioNum: 26 },
      { id: 'd27', label: 'D27 (GPIO 27)', electricalType: 'gpio', gpioNum: 27 },
      { id: 'd32', label: 'D32 (GPIO 32)', electricalType: 'gpio', gpioNum: 32 },
      { id: 'd33', label: 'D33 (GPIO 33)', electricalType: 'gpio', gpioNum: 33 },
      { id: 'd34', label: 'D34 (ADC, Input Only)', electricalType: 'adc_input', gpioNum: 34 },
      { id: 'd35', label: 'D35 (ADC, Input Only)', electricalType: 'adc_input', gpioNum: 35 },
      { id: 'vp', label: 'VP (GPIO 36)', electricalType: 'adc_input', gpioNum: 36 },
      { id: 'vn', label: 'VN (GPIO 39)', electricalType: 'adc_input', gpioNum: 39 },
    ],
    warnings: ['3.3V logic level only. Connecting 5V to any GPIO pin will destroy the chip.'],
  },
  'breadboard-half': {
    id: 'breadboard-half',
    label: 'Half-Size Breadboard',
    category: 'passive',
    maxInstances: 1,
    color: '#FAF4E9',
    icon: 'Grid',
    terminals: [
      { id: 'pwr-plus', label: 'Power Rail (+)', electricalType: 'power' },
      { id: 'pwr-minus', label: 'Ground Rail (-)', electricalType: 'ground' },
    ],
    rows: 30,
    description: 'Solderless 400-point breadboard. Any components placed in the same row are electrically connected.',
  },
  'led-5mm-red': {
    id: 'led-5mm-red',
    label: 'Red LED (5mm)',
    category: 'output',
    maxInstances: 4,
    color: '#E02424',
    icon: 'Lightbulb',
    terminals: [
      { id: 'anode', label: 'Anode (+)', electricalType: 'signal' },
      { id: 'cathode', label: 'Cathode (−)', electricalType: 'ground' },
    ],
    requiredPartner: 'resistor-220',
    warnings: ['Always use a 220Ω–470Ω current-limiting resistor in series with the anode!'],
    specs: { vForward: '1.8V–2.2V', maxCurrent: '20mA' },
  },
  'led-5mm-green': {
    id: 'led-5mm-green',
    label: 'Green LED (5mm)',
    category: 'output',
    maxInstances: 4,
    color: '#057A55',
    icon: 'Lightbulb',
    terminals: [
      { id: 'anode', label: 'Anode (+)', electricalType: 'signal' },
      { id: 'cathode', label: 'Cathode (−)', electricalType: 'ground' },
    ],
    requiredPartner: 'resistor-220',
    warnings: ['Always use a current-limiting resistor!'],
    specs: { vForward: '2.0V–2.4V', maxCurrent: '20mA' },
  },
  'resistor-220': {
    id: 'resistor-220',
    label: '220Ω Resistor',
    category: 'passive',
    maxInstances: 8,
    color: '#C0652D',
    icon: 'Activity',
    terminals: [
      { id: 'pin1', label: 'Pin 1', electricalType: 'passive' },
      { id: 'pin2', label: 'Pin 2', electricalType: 'passive' },
    ],
    specs: { resistance: '220Ω', power: '0.25W' },
  },
  'resistor-10k': {
    id: 'resistor-10k',
    label: '10kΩ Resistor',
    category: 'passive',
    maxInstances: 4,
    color: '#8B5CF6',
    icon: 'Activity',
    terminals: [
      { id: 'pin1', label: 'Pin 1', electricalType: 'passive' },
      { id: 'pin2', label: 'Pin 2', electricalType: 'passive' },
    ],
    specs: { resistance: '10kΩ', power: '0.25W' },
  },
  'push-button': {
    id: 'push-button',
    label: 'Push Button (Momentary)',
    category: 'input',
    maxInstances: 4,
    color: '#18213D',
    icon: 'Square',
    terminals: [
      { id: 'pin1a', label: 'Pin 1A', electricalType: 'signal' },
      { id: 'pin2a', label: 'Pin 2A', electricalType: 'signal' },
    ],
    specs: { type: 'SPST-NO (Normally Open)', bounce: '5–10ms (debounce in code)' },
  },
  'potentiometer-10k': {
    id: 'potentiometer-10k',
    label: 'Potentiometer (10kΩ)',
    category: 'input',
    maxInstances: 2,
    color: '#0891B2',
    icon: 'Sliders',
    terminals: [
      { id: 'vcc', label: 'VCC Terminal', electricalType: 'power' },
      { id: 'wiper', label: 'Wiper (Signal)', electricalType: 'signal' },
      { id: 'gnd', label: 'GND Terminal', electricalType: 'ground' },
    ],
    specs: { resistance: '10kΩ', taper: 'Linear' },
  },
  'wire': {
    id: 'wire',
    label: 'Jumper Wire',
    category: 'wire',
    maxInstances: 20,
    color: '#18213D',
    icon: 'Minus',
    terminals: [
      { id: 'a', label: 'End A', electricalType: 'wire' },
      { id: 'b', label: 'End B', electricalType: 'wire' },
    ],
  },
};

// ─── Circuit Document Structure ───

/**
 * Creates a fresh empty circuit document.
 */
export function createEmptyCircuit(boardId = 'esp32-devkit-v1', name = 'Untitled Circuit') {
  return {
    schemaVersion: CIRCUIT_SCHEMA_VERSION,
    id: `circuit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    boardId,
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    instances: [
      {
        id: 'inst-board-1',
        componentTypeId: 'esp32-devkit-v1',
        label: 'ESP32 DevKit V1',
        position: { x: 50, y: 180 },
      },
      {
        id: 'inst-breadboard-1',
        componentTypeId: 'breadboard-half',
        label: 'Breadboard',
        position: { x: 320, y: 150 },
      },
    ],
    connections: [],
    metadata: {
      simulationLevel: 'deterministic_educational',
      validationStatus: 'unvalidated',
      guidedStep: null,
    },
  };
}

// ─── Stable Instance ID Generator ───

export function generateInstanceId(componentTypeId) {
  return `inst-${componentTypeId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Circuit Schema Validator ───

/**
 * Validates a circuit document against schema version 1.
 * Returns { valid: boolean, errors: string[], warnings: string[] }
 */
export function validateCircuitDocument(doc) {
  const errors = [];
  const warnings = [];

  if (!doc || typeof doc !== 'object') {
    return { valid: false, errors: ['Document must be a non-null object'], warnings };
  }

  // Schema version
  if (doc.schemaVersion !== CIRCUIT_SCHEMA_VERSION) {
    errors.push(`Schema version mismatch: expected ${CIRCUIT_SCHEMA_VERSION}, got ${doc.schemaVersion}`);
  }

  // Board ID
  if (doc.boardId !== 'esp32-devkit-v1') {
    errors.push(`Unsupported board: "${doc.boardId}". Only esp32-devkit-v1 is supported.`);
  }

  // Instances
  if (!Array.isArray(doc.instances)) {
    errors.push('instances must be an array');
  } else {
    const instanceIds = new Set();
    const typeCounts = {};

    for (const inst of doc.instances) {
      if (!inst.id || typeof inst.id !== 'string') {
        errors.push(`Instance missing id: ${JSON.stringify(inst)}`);
        continue;
      }

      if (instanceIds.has(inst.id)) {
        errors.push(`Duplicate instance ID: ${inst.id}`);
      }
      instanceIds.add(inst.id);

      if (!inst.componentTypeId || !SUPPORTED_COMPONENTS[inst.componentTypeId]) {
        errors.push(`Instance ${inst.id} references unsupported component type: "${inst.componentTypeId}"`);
        continue;
      }

      typeCounts[inst.componentTypeId] = (typeCounts[inst.componentTypeId] || 0) + 1;
      const maxInst = SUPPORTED_COMPONENTS[inst.componentTypeId].maxInstances;
      if (typeCounts[inst.componentTypeId] > maxInst) {
        errors.push(`Too many instances of "${inst.componentTypeId}": max ${maxInst}, found ${typeCounts[inst.componentTypeId]}`);
      }

      if (!inst.position || typeof inst.position.x !== 'number' || typeof inst.position.y !== 'number') {
        warnings.push(`Instance ${inst.id} has no valid position (layout only, not electrical)`);
      }
    }
  }

  // Connections
  if (!Array.isArray(doc.connections)) {
    errors.push('connections must be an array');
  } else {
    const instanceIdSet = new Set((doc.instances || []).map((i) => i.id));
    const connIds = new Set();

    for (const conn of doc.connections) {
      if (!conn.id) {
        errors.push(`Connection missing id: ${JSON.stringify(conn)}`);
        continue;
      }

      if (connIds.has(conn.id)) {
        errors.push(`Duplicate connection ID: ${conn.id}`);
      }
      connIds.add(conn.id);

      // Validate from/to endpoints
      for (const side of ['from', 'to']) {
        const ep = conn[side];
        if (!ep || !ep.instanceId || !ep.terminalId) {
          errors.push(`Connection ${conn.id} has incomplete endpoint "${side}"`);
          continue;
        }
        if (!instanceIdSet.has(ep.instanceId)) {
          errors.push(`Connection ${conn.id}.${side} references non-existent instance: ${ep.instanceId}`);
        }
      }
    }
  }

  // Safety Rules for ESP32
  if (Array.isArray(doc.connections)) {
    for (const conn of doc.connections) {
      const fromInst = (doc.instances || []).find((i) => i.id === conn.from?.instanceId);
      const toInst = (doc.instances || []).find((i) => i.id === conn.to?.instanceId);

      // Check for direct GPIO-to-LED without resistor (best-effort topology check)
      if (fromInst?.componentTypeId === 'esp32-devkit-v1' && toInst?.componentTypeId?.startsWith('led-')) {
        const fromTermType = SUPPORTED_COMPONENTS['esp32-devkit-v1'].terminals.find(
          (t) => t.id === conn.from.terminalId
        )?.electricalType;
        if (fromTermType === 'gpio') {
          warnings.push(
            `Connection ${conn.id}: GPIO directly connected to LED without intermediate resistor! Add a 220Ω resistor to prevent LED burnout.`
          );
        }
      }

      // Warn about connecting VIN (5V) directly to GPIO
      if (
        fromInst?.componentTypeId === 'esp32-devkit-v1' &&
        conn.from?.terminalId === 'vin' &&
        toInst?.componentTypeId === 'esp32-devkit-v1' &&
        conn.to?.terminalId?.startsWith('d')
      ) {
        errors.push(
          `Connection ${conn.id}: VIN (5V) must NEVER be connected to a GPIO pin! This will permanently damage the ESP32.`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ─── Guided Build Templates ───

export const GUIDED_BUILDS = {
  'blink-led': {
    id: 'blink-led',
    title: 'Guided Build: Blink an LED',
    description: 'Wire a red LED through a 220Ω current-limiting resistor to GPIO 2 (the on-board LED pin).',
    experimentId: 'exp-01-blink',
    steps: [
      {
        stepIndex: 0,
        title: 'Place the Resistor',
        instruction: 'Drag a 220Ω Resistor from the palette and place it on the breadboard.',
        requiredAction: 'place',
        requiredComponentTypeId: 'resistor-220',
      },
      {
        stepIndex: 1,
        title: 'Place the LED',
        instruction: 'Drag a Red LED from the palette. Place it so its Anode (+, longer leg) is in the same breadboard row as one end of the resistor.',
        requiredAction: 'place',
        requiredComponentTypeId: 'led-5mm-red',
      },
      {
        stepIndex: 2,
        title: 'Connect GPIO 2 → Resistor',
        instruction: 'Draw a wire from D2 (GPIO 2) on the ESP32 to Pin 1 of the 220Ω resistor.',
        requiredAction: 'connect',
        from: { componentTypeId: 'esp32-devkit-v1', terminalId: 'd2' },
        to: { componentTypeId: 'resistor-220', terminalId: 'pin1' },
      },
      {
        stepIndex: 3,
        title: 'Connect Resistor → LED Anode',
        instruction: 'Wire from Pin 2 of the resistor to the LED Anode (+).',
        requiredAction: 'connect',
        from: { componentTypeId: 'resistor-220', terminalId: 'pin2' },
        to: { componentTypeId: 'led-5mm-red', terminalId: 'anode' },
      },
      {
        stepIndex: 4,
        title: 'Connect LED Cathode → GND',
        instruction: 'Wire from the LED Cathode (−, shorter leg) to a GND pin on the ESP32.',
        requiredAction: 'connect',
        from: { componentTypeId: 'led-5mm-red', terminalId: 'cathode' },
        to: { componentTypeId: 'esp32-devkit-v1', terminalId: 'gnd-14' },
      },
      {
        stepIndex: 5,
        title: 'Circuit Complete!',
        instruction: 'Your LED circuit is complete. Click "Run Simulation" to execute the Blink firmware and watch it flash!',
        requiredAction: 'complete',
      },
    ],
  },
  'button-led': {
    id: 'button-led',
    title: 'Guided Build: Button-Controlled LED',
    description: 'Wire a push button with a pull-down resistor to control an LED via GPIO.',
    experimentId: 'exp-02-button',
    steps: [
      {
        stepIndex: 0,
        title: 'Place the Button',
        instruction: 'Add a Push Button to the breadboard.',
        requiredAction: 'place',
        requiredComponentTypeId: 'push-button',
      },
      {
        stepIndex: 1,
        title: 'Place the 10kΩ Pull-down Resistor',
        instruction: 'Add a 10kΩ resistor. This holds the GPIO LOW when the button is not pressed, preventing floating inputs.',
        requiredAction: 'place',
        requiredComponentTypeId: 'resistor-10k',
      },
      {
        stepIndex: 2,
        title: 'Place the LED and 220Ω Resistor',
        instruction: 'Add a Red LED and a 220Ω current-limiting resistor.',
        requiredAction: 'place',
        requiredComponentTypeId: 'led-5mm-red',
      },
      {
        stepIndex: 3,
        title: 'Connect 3.3V to Button',
        instruction: 'Wire 3V3 from ESP32 to Pin 1A of the push button.',
        requiredAction: 'connect',
        from: { componentTypeId: 'esp32-devkit-v1', terminalId: '3v3' },
        to: { componentTypeId: 'push-button', terminalId: 'pin1a' },
      },
      {
        stepIndex: 4,
        title: 'Connect Button to GPIO 4',
        instruction: 'Wire from Pin 2A of the push button to D4 (GPIO 4) on the ESP32.',
        requiredAction: 'connect',
        from: { componentTypeId: 'push-button', terminalId: 'pin2a' },
        to: { componentTypeId: 'esp32-devkit-v1', terminalId: 'd4' },
      },
      {
        stepIndex: 5,
        title: 'Circuit Complete!',
        instruction: 'Full button-LED circuit wired. Run the simulation to test button events!',
        requiredAction: 'complete',
      },
    ],
  },
};
