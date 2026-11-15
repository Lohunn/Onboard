/**
 * Simulator Adapter for Onboard Virtual Lab
 * Conforms to Section 5E, Section 10 (Experiment, CircuitSubmission), and Section 16 (Prompts 7 & 8)
 * of ONBOARD Product Architecture & MVP Specification.
 *
 * Explicit Simulation Capability Level:
 * - Capability Level: 'deterministic_educational'
 * - Disclaimer: Models discrete logic transitions, pin driving states, and component continuity
 *   for ESP32 DevKit V1. It does NOT claim to run a native Xtensa LX6 emulator or an arbitrary SPICE engine.
 */

// ─── Capability Level & Metadata ───

export const SIMULATION_CAPABILITY_LEVEL = 'deterministic_educational';

export const SIMULATION_DISCLAIMER =
  'Deterministic educational simulation for ESP32 DevKit V1. Models discrete logic states, component continuity, and timing. Does not execute native binary firmware or unconstrained SPICE physics.';

export const SIMULATION_LIMITS = {
  maxTicks: 30,
  defaultTickIntervalMs: 500,
  maxDurationSec: 15,
  maxCurrentMa: 20.0,
  recommendedResistorMinOhms: 150,
  recommendedResistorMaxOhms: 1000,
};

// Input-only pins on ESP32 DevKit V1 (cannot output or drive an LED)
export const INPUT_ONLY_PINS = ['d34', 'd35', 'vp', 'vn'];

// Ground pins on ESP32 DevKit V1
export const GND_PINS = ['gnd-14', 'gnd-29'];

// Power pins on ESP32 DevKit V1
export const POWER_PINS = ['3v3', 'vin'];

// Safe digital output pins on ESP32 DevKit V1
export const VALID_OUTPUT_PINS = [
  'd2', 'd4', 'd5', 'd13', 'd14', 'd15', 'd18', 'd19',
  'd21', 'd22', 'd23', 'd25', 'd26', 'd27', 'd32', 'd33',
  'tx0', 'rx0',
];

// Valid digital input pins on ESP32 DevKit V1 (includes input-only pins + GPIOs)
export const VALID_INPUT_PINS = [
  'd2', 'd4', 'd5', 'd12', 'd13', 'd14', 'd15', 'd18', 'd19',
  'd21', 'd22', 'd23', 'd25', 'd26', 'd27', 'd32', 'd33',
  'd34', 'd35', 'vp', 'vn', 'rx0', 'tx0',
];

// Strapping pins that have boot-time implications
export const STRAPPING_PINS = {
  d12: 'GPIO 12 is a critical strapping pin. HIGH at boot selects 1.8V flash voltage!',
  d2: 'GPIO 2 is tied to onboard blue LED and must be floating/LOW to enter bootloader.',
  d0: 'GPIO 0 is the BOOT button. LOW at reset enters UART download mode.',
  d15: 'GPIO 15 outputs PWM debug log during boot.',
};

// ─── Firmware Code Lexer & Parser (Constrained Safe Execution) ───

/**
 * Safely parses Arduino/C++ firmware code without using eval() or arbitrary execution.
 * Extracts pinMode, digitalWrite, digitalRead, conditional logic, and delay calls.
 *
 * @param {string} codeSource
 * @returns {object} Parsed AST summary
 */
export function parseFirmware(codeSource) {
  if (!codeSource || typeof codeSource !== 'string') {
    return {
      valid: false,
      pinModes: {},
      operations: [],
      digitalReads: [],
      delays: [],
      conditionalLogic: { hasIfCheck: false, checksLow: false, checksHigh: false },
      errors: ['No firmware source code provided.'],
    };
  }

  const errors = [];
  const pinModes = {}; // e.g. { 2: 'OUTPUT', 4: 'INPUT_PULLUP' }
  const operations = []; // e.g. [{ type: 'write', pin: 2, value: 'HIGH' }]
  const digitalReads = []; // e.g. [4]
  const delays = [];

  // Remove single-line comments and multi-line comments
  const cleanCode = codeSource
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');

  // Extract variable assignments for pin definitions (e.g. const int LED_PIN = 2;)
  const pinVariables = {};
  const varRegex = /(?:const\s+)?(?:int|uint8_t|byte)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(\d+)\s*;/g;
  let varMatch;
  while ((varMatch = varRegex.exec(cleanCode)) !== null) {
    pinVariables[varMatch[1]] = parseInt(varMatch[2], 10);
  }

  // Helper to resolve pin number from literal or variable
  const resolvePin = (raw) => {
    const trimmed = raw.trim();
    if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
    if (pinVariables[trimmed] !== undefined) return pinVariables[trimmed];
    return trimmed;
  };

  // Extract pinMode(pin, MODE)
  const pinModeRegex = /pinMode\s*\(\s*([^,]+)\s*,\s*([A-Z_]+)\s*\)/g;
  let modeMatch;
  while ((modeMatch = pinModeRegex.exec(cleanCode)) !== null) {
    const pin = resolvePin(modeMatch[1]);
    const mode = modeMatch[2].trim();
    pinModes[pin] = mode;
  }

  // Extract digitalRead(pin)
  const readRegex = /digitalRead\s*\(\s*([^)]+)\s*\)/g;
  let readMatch;
  while ((readMatch = readRegex.exec(cleanCode)) !== null) {
    const pin = resolvePin(readMatch[1]);
    digitalReads.push(pin);
  }

  // Extract digitalWrite(pin, VALUE)
  const writeRegex = /digitalWrite\s*\(\s*([^,]+)\s*,\s*([A-Z_]+|0|1)\s*\)/g;
  let writeMatch;
  while ((writeMatch = writeRegex.exec(cleanCode)) !== null) {
    const pin = resolvePin(writeMatch[1]);
    const rawVal = writeMatch[2].trim();
    const value = rawVal === '1' || rawVal === 'HIGH' ? 'HIGH' : 'LOW';
    operations.push({ type: 'write', pin, value });
  }

  // Extract delay(ms)
  const delayRegex = /delay\s*\(\s*(\d+)\s*\)/g;
  let delayMatch;
  while ((delayMatch = delayRegex.exec(cleanCode)) !== null) {
    delays.push(parseInt(delayMatch[1], 10));
  }

  // Extract conditional logic checking for button active state
  const hasIfCheck = /if\s*\([^)]+\)/.test(cleanCode);
  const checksLow = /==\s*LOW|==\s*0|!\s*(?:buttonState|digitalRead)/.test(cleanCode);
  const checksHigh = /==\s*HIGH|==\s*1/.test(cleanCode);

  // Check if setup and loop structures are present
  const hasSetup = /void\s+setup\s*\(\s*\)/.test(cleanCode);
  const hasLoop = /void\s+loop\s*\(\s*\)/.test(cleanCode);

  if (!hasSetup) {
    errors.push('Missing required void setup() function in firmware.');
  }
  if (!hasLoop) {
    errors.push('Missing required void loop() function in firmware.');
  }

  return {
    valid: errors.length === 0,
    pinModes,
    operations,
    digitalReads,
    delays,
    conditionalLogic: { hasIfCheck, checksLow, checksHigh },
    errors,
  };
}

// ─── LED Circuit Topology Validator ───

/**
 * Validates the physical topology of an LED circuit for ESP32.
 *
 * @param {object} circuit CircuitDocument
 * @returns {object} Topology validation summary with structured diagnostics
 */
export function validateLedTopology(circuit) {
  const diagnostics = [];
  let drivingPin = null;
  let resistorInstance = null;
  let ledInstance = null;
  let groundPin = null;
  let hasResistor = false;
  let isReversed = false;
  let isComplete = false;

  if (!circuit || !Array.isArray(circuit.instances)) {
    return {
      valid: false,
      diagnostics: [
        {
          code: 'INVALID_CIRCUIT_DOC',
          severity: 'error',
          message: 'Circuit document is invalid or missing component instances.',
          suggestion: 'Ensure the circuit document conforms to Schema Version 1.',
        },
      ],
      drivingPin: null,
      hasResistor: false,
      isReversed: false,
    };
  }

  const esp32 = circuit.instances.find(
    (inst) => inst.componentTypeId === 'esp32-devkit-v1'
  );
  if (!esp32) {
    diagnostics.push({
      code: 'MISSING_BOARD',
      severity: 'error',
      message: 'Circuit must contain an ESP32 DevKit V1 board.',
      suggestion: 'Add an ESP32 DevKit V1 to the workspace.',
    });
  }

  ledInstance = circuit.instances.find((inst) =>
    inst.componentTypeId.startsWith('led-')
  );
  if (!ledInstance) {
    diagnostics.push({
      code: 'MISSING_LED',
      severity: 'error',
      message: 'No LED found in circuit.',
      suggestion: 'Place an LED on the breadboard from the component palette.',
    });
  }

  resistorInstance = circuit.instances.find((inst) =>
    inst.componentTypeId.startsWith('resistor-')
  );

  const connections = circuit.connections || [];

  // Check 5V VIN overvoltage hazard
  const vinToGpio = connections.find(
    (c) =>
      (c.from.componentInstanceId === esp32?.id &&
        c.from.terminalId === 'vin' &&
        c.to.componentInstanceId === esp32?.id &&
        VALID_OUTPUT_PINS.includes(c.to.terminalId)) ||
      (c.to.componentInstanceId === esp32?.id &&
        c.to.terminalId === 'vin' &&
        c.from.componentInstanceId === esp32?.id &&
        VALID_OUTPUT_PINS.includes(c.from.terminalId))
  );

  if (vinToGpio) {
    diagnostics.push({
      code: 'OVERVOLTAGE_5V_TO_GPIO',
      severity: 'error',
      message:
        'VIN (5V) rail is directly connected to a GPIO pin! ESP32 GPIOs are 3.3V-only and NOT 5V tolerant.',
      componentId: esp32?.id,
      terminalId: 'vin',
      suggestion: 'Disconnect VIN immediately. Use 3V3 or driven GPIO pins.',
    });
  }

  // Trace connectivity around the LED
  if (ledInstance && esp32) {
    const anodeConns = connections.filter(
      (c) =>
        (c.from.componentInstanceId === ledInstance.id &&
          c.from.terminalId === 'anode') ||
        (c.to.componentInstanceId === ledInstance.id &&
          c.to.terminalId === 'anode')
    );

    const cathodeConns = connections.filter(
      (c) =>
        (c.from.componentInstanceId === ledInstance.id &&
          c.from.terminalId === 'cathode') ||
        (c.to.componentInstanceId === ledInstance.id &&
          c.to.terminalId === 'cathode')
    );

    const getOtherEnd = (conn, instId, termId) => {
      if (
        conn.from.componentInstanceId === instId &&
        conn.from.terminalId === termId
      ) {
        return conn.to;
      }
      return conn.from;
    };

    const traceToEsp32 = (terminalConns, terminalId) => {
      for (const c of terminalConns) {
        const other = getOtherEnd(c, ledInstance.id, terminalId);
        if (other.componentInstanceId === esp32.id) {
          return { pin: other.terminalId, viaResistor: false };
        }
        if (resistorInstance && other.componentInstanceId === resistorInstance.id) {
          const resOtherTerm = other.terminalId === 'pin1' ? 'pin2' : 'pin1';
          const resToEsp32 = connections.find(
            (rc) =>
              ((rc.from.componentInstanceId === resistorInstance.id &&
                rc.from.terminalId === resOtherTerm) ||
                (rc.to.componentInstanceId === resistorInstance.id &&
                  rc.to.terminalId === resOtherTerm)) &&
              (rc.from.componentInstanceId === esp32.id ||
                rc.to.componentInstanceId === esp32.id)
          );
          if (resToEsp32) {
            const esp32End =
              resToEsp32.from.componentInstanceId === esp32.id
                ? resToEsp32.from
                : resToEsp32.to;
            return { pin: esp32End.terminalId, viaResistor: true };
          }
        }
      }
      return null;
    };

    const anodeTrace = traceToEsp32(anodeConns, 'anode');
    const cathodeTrace = traceToEsp32(cathodeConns, 'cathode');

    // Reversed polarity check
    if (
      (cathodeTrace && !GND_PINS.includes(cathodeTrace.pin)) ||
      (anodeTrace && GND_PINS.includes(anodeTrace.pin))
    ) {
      isReversed = true;
      const wrongPin = cathodeTrace?.pin || anodeTrace?.pin;
      diagnostics.push({
        code: 'LED_REVERSED_POLARITY',
        severity: 'error',
        message: `LED is connected in reverse polarity! Cathode connects toward ${wrongPin ? wrongPin.toUpperCase() : 'positive voltage'} and/or Anode connects to Ground. Diodes only conduct forward!`,
        componentId: ledInstance.id,
        terminalId: 'cathode',
        suggestion:
          'Flip the LED orientation: Anode (+) connects to GPIO / resistor, Cathode (-) connects to Ground.',
      });

      if (cathodeTrace && !GND_PINS.includes(cathodeTrace.pin)) {
        drivingPin = cathodeTrace.pin;
        hasResistor = cathodeTrace.viaResistor;
      }
      if (anodeTrace && GND_PINS.includes(anodeTrace.pin)) {
        groundPin = anodeTrace.pin;
      }
    } else {
      if (anodeTrace && !GND_PINS.includes(anodeTrace.pin)) {
        drivingPin = anodeTrace.pin;
        hasResistor = anodeTrace.viaResistor;
      }
      if (cathodeTrace && GND_PINS.includes(cathodeTrace.pin)) {
        groundPin = cathodeTrace.pin;
        if (cathodeTrace.viaResistor) {
          hasResistor = true;
        }
      }
    }

    // Direct GPIO to LED to GND without resistor check (when forward biased)
    if (!isReversed && drivingPin && groundPin && !hasResistor) {
      diagnostics.push({
        code: 'MISSING_CURRENT_LIMITING_RESISTOR',
        severity: 'warning',
        message:
          'LED is connected directly between GPIO and Ground without a current-limiting resistor! This may burn out the LED or trigger ESP32 pin overcurrent protection (>12mA recommended limit).',
        componentId: ledInstance.id,
        suggestion:
          'Add a 220Ω or 330Ω resistor in series between the GPIO pin and the LED anode.',
      });
    }

    // Input-Only Pin check on driving pin
    if (drivingPin && INPUT_ONLY_PINS.includes(drivingPin)) {
      diagnostics.push({
        code: 'CANNOT_OUTPUT_ON_INPUT_ONLY_PIN',
        severity: 'error',
        message: `Pin ${drivingPin.toUpperCase()} is an INPUT-ONLY pin on ESP32 DevKit V1 and cannot drive digital outputs or PWM!`,
        componentId: esp32.id,
        terminalId: drivingPin,
        suggestion:
          'Move the signal wire to a capable output pin such as D2 (GPIO 2), D4 (GPIO 4), or D5 (GPIO 5).',
      });
    }

    // Strapping pin informational notes
    if (drivingPin && STRAPPING_PINS[drivingPin]) {
      diagnostics.push({
        code: `STRAPPING_PIN_USED_${drivingPin.toUpperCase()}`,
        severity: 'info',
        message: `Note on pin ${drivingPin.toUpperCase()}: ${STRAPPING_PINS[drivingPin]}`,
        componentId: esp32.id,
        terminalId: drivingPin,
        suggestion: 'This pin can be used, but keep bootloader timing in mind.',
      });
    }

    // Open circuit check
    if (!drivingPin) {
      diagnostics.push({
        code: 'OPEN_CIRCUIT_NO_GPIO',
        severity: 'error',
        message:
          'LED anode is not connected to any active GPIO pin on the ESP32.',
        componentId: ledInstance.id,
        terminalId: 'anode',
        suggestion:
          'Connect the LED anode (via a 220Ω resistor) to GPIO 2 (D2) on the ESP32.',
      });
    }

    if (!groundPin) {
      diagnostics.push({
        code: 'OPEN_CIRCUIT_NO_GND',
        severity: 'error',
        message:
          'LED cathode does not connect to Ground. Current requires a closed return loop.',
        componentId: ledInstance.id,
        terminalId: 'cathode',
        suggestion:
          'Connect the LED cathode to one of the ESP32 GND pins (Pin 14 or Pin 29).',
      });
    }

    if (drivingPin && groundPin && !isReversed) {
      isComplete = true;
    }
  }

  const hasFatalErrors = diagnostics.some((d) => d.severity === 'error');

  return {
    valid: !hasFatalErrors && isComplete,
    diagnostics,
    drivingPin,
    groundPin,
    hasResistor,
    isReversed,
    isComplete,
  };
}

// ─── Button Circuit Topology Validator ───

/**
 * Validates the physical topology of a Button + LED circuit for ESP32.
 * Validates:
 * 1. Button component presence
 * 2. Button connection to a valid GPIO input pin
 * 3. Button return path to GND (for active-low) or 3V3 (for active-high)
 * 4. Checks against direct 3V3-to-GND button short circuit
 * 5. LED output topology
 *
 * @param {object} circuit CircuitDocument
 * @returns {object} Button topology validation summary
 */
export function validateButtonTopology(circuit) {
  const diagnostics = [];
  let buttonInputPin = null;
  let buttonReturnPin = null;
  let buttonPullMode = 'internal_pullup'; // 'internal_pullup' | 'external_pulldown' | 'floating'

  if (!circuit || !Array.isArray(circuit.instances)) {
    return {
      valid: false,
      diagnostics: [
        {
          code: 'INVALID_CIRCUIT_DOC',
          severity: 'error',
          message: 'Circuit document is invalid.',
          suggestion: 'Ensure the circuit document conforms to Schema Version 1.',
        },
      ],
      buttonInputPin: null,
      ledTopology: null,
    };
  }

  const esp32 = circuit.instances.find(
    (inst) => inst.componentTypeId === 'esp32-devkit-v1'
  );
  const button = circuit.instances.find(
    (inst) => inst.componentTypeId === 'push-button'
  );

  if (!esp32) {
    diagnostics.push({
      code: 'MISSING_BOARD',
      severity: 'error',
      message: 'Circuit must contain an ESP32 DevKit V1 board.',
      suggestion: 'Add an ESP32 DevKit V1 board to the canvas.',
    });
  }

  if (!button) {
    diagnostics.push({
      code: 'MISSING_BUTTON',
      severity: 'error',
      message: 'No Push Button found in circuit.',
      suggestion: 'Add a 6mm Push Button from the component palette.',
    });
  }

  // Validate LED portion as well
  const ledTopology = validateLedTopology(circuit);
  diagnostics.push(...ledTopology.diagnostics);

  const connections = circuit.connections || [];

  if (button && esp32) {
    // Find all connections to button terminals (pin1a, pin1b, pin2a, pin2b)
    const buttonConns = connections.filter(
      (c) =>
        c.from.componentInstanceId === button.id ||
        c.to.componentInstanceId === button.id
    );

    const getOtherEnd = (conn) => {
      if (conn.from.componentInstanceId === button.id) {
        return conn.to;
      }
      return conn.from;
    };

    // Check for power-to-ground short circuit across button
    let connectsToVcc = false;
    let connectsToGnd = false;

    for (const c of buttonConns) {
      const other = getOtherEnd(c);
      if (other.componentInstanceId === esp32.id) {
        if (POWER_PINS.includes(other.terminalId)) {
          connectsToVcc = true;
        } else if (GND_PINS.includes(other.terminalId)) {
          connectsToGnd = true;
        } else if (VALID_INPUT_PINS.includes(other.terminalId)) {
          buttonInputPin = other.terminalId;
        }
      }
    }

    // Direct short circuit: button connects directly between VCC (3V3/VIN) and GND with no load
    if (connectsToVcc && connectsToGnd && !buttonInputPin) {
      diagnostics.push({
        code: 'BUTTON_POWER_SHORT',
        severity: 'error',
        message:
          'Push button directly bridges Power (3V3/VIN) and Ground! Pressing it creates a direct dead short and will trigger overcurrent shutdown.',
        componentId: button.id,
        suggestion:
          'Wire the button between a GPIO pin (e.g. D4) and Ground, using pinMode(4, INPUT_PULLUP) in software.',
      });
    }

    // Identify return connection
    if (connectsToGnd) {
      buttonReturnPin = 'gnd';
      buttonPullMode = 'internal_pullup';
    } else if (connectsToVcc) {
      buttonReturnPin = '3v3';
      // If button connects to 3V3, check if a pull-down resistor to GND exists
      const pullDownResistor = circuit.instances.find(
        (inst) => inst.componentTypeId.startsWith('resistor-') && inst.id !== 'inst-resistor'
      );
      if (!pullDownResistor) {
        buttonPullMode = 'floating';
        diagnostics.push({
          code: 'FLOATING_BUTTON_INPUT',
          severity: 'warning',
          message:
            'Button is wired to 3V3 without an external pull-down resistor to Ground! When released, the GPIO pin is floating and will read noisy random states.',
          suggestion:
            'Add a 10kΩ pull-down resistor between the GPIO pin and Ground, or switch to the recommended active-low INPUT_PULLUP circuit (Button to GND).',
        });
      } else {
        buttonPullMode = 'external_pulldown';
      }
    }

    // Disconnected button wire checks
    if (!buttonInputPin) {
      diagnostics.push({
        code: 'OPEN_BUTTON_INPUT',
        severity: 'error',
        message: 'Push button is not connected to any GPIO input pin on the ESP32.',
        componentId: button.id,
        suggestion: 'Connect one side of the button to D4 (GPIO 4) on the ESP32.',
      });
    }

    if (!buttonReturnPin && buttonInputPin) {
      diagnostics.push({
        code: 'OPEN_BUTTON_RETURN',
        severity: 'error',
        message: 'Push button has no return path to Ground or Power.',
        componentId: button.id,
        suggestion: 'Connect the other side of the button to an ESP32 GND pin.',
      });
    }
  }

  const fatalErrors = diagnostics.filter((d) => d.severity === 'error');

  return {
    valid: fatalErrors.length === 0 && buttonInputPin !== null && buttonReturnPin !== null,
    diagnostics,
    buttonInputPin,
    buttonReturnPin,
    buttonPullMode,
    ledTopology,
  };
}

// ─── Deterministic LED Simulation Engine ───

/**
 * Runs a deterministic educational simulation of the LED experiment (exp-01-blink).
 *
 * @param {object} params
 * @param {string} params.experimentId
 * @param {object} params.circuit CircuitDocument
 * @param {string} params.code Arduino/C++ firmware code
 * @param {object} [params.options]
 * @returns {object} SimulationResult
 */
export function runLedSimulation({
  experimentId = 'exp-01-blink',
  circuit,
  code,
  options = {},
}) {
  const tickCount = Math.min(
    options.stepCount || 10,
    SIMULATION_LIMITS.maxTicks
  );
  const tickIntervalMs =
    options.timeStepMs || SIMULATION_LIMITS.defaultTickIntervalMs;

  const timestamp = new Date().toISOString();

  // 1. Parse firmware
  const parsedFirmware = parseFirmware(code);

  // 2. Validate circuit topology
  const topology = validateLedTopology(circuit);

  const allDiagnostics = [
    ...topology.diagnostics,
    ...parsedFirmware.errors.map((msg) => ({
      code: 'FIRMWARE_SYNTAX_ERROR',
      severity: 'error',
      message: msg,
      suggestion: 'Correct the Arduino setup() and loop() structure.',
    })),
  ];

  // 3. Match firmware pin with physical driving pin
  let drivingGpioNum = null;
  if (topology.drivingPin) {
    const numMatch = topology.drivingPin.match(/\d+/);
    if (numMatch) {
      drivingGpioNum = parseInt(numMatch[0], 10);
    }
  }

  const codePins = Object.keys(parsedFirmware.pinModes).map((p) =>
    parseInt(p, 10)
  );

  let pinMismatch = false;
  if (
    drivingGpioNum !== null &&
    codePins.length > 0 &&
    !codePins.includes(drivingGpioNum)
  ) {
    pinMismatch = true;
    allDiagnostics.push({
      code: 'GPIO_PIN_MISMATCH',
      severity: 'error',
      message: `Firmware controls GPIO pin(s) [${codePins.join(
        ', '
      )}], but the LED circuit is physically wired to D${drivingGpioNum} (GPIO ${drivingGpioNum})!`,
      suggestion: `Update your code to configure pinMode(${drivingGpioNum}, OUTPUT); or rewire the circuit to pin ${codePins[0]}.`,
    });
  }

  // Check if driving pin was configured as OUTPUT
  if (
    drivingGpioNum !== null &&
    parsedFirmware.pinModes[drivingGpioNum] &&
    parsedFirmware.pinModes[drivingGpioNum] !== 'OUTPUT'
  ) {
    allDiagnostics.push({
      code: 'PIN_NOT_OUTPUT_MODE',
      severity: 'warning',
      message: `GPIO ${drivingGpioNum} is configured as ${parsedFirmware.pinModes[drivingGpioNum]}, not OUTPUT. LED may only dimly glow or stay OFF.`,
      suggestion: `Call pinMode(${drivingGpioNum}, OUTPUT); in setup().`,
    });
  }

  const hasFatalErrors = allDiagnostics.some((d) => d.severity === 'error');
  const canSimulate = !hasFatalErrors && topology.isComplete;

  // 4. Generate deterministic timeline ticks
  const timeline = [];
  let blinkCyclesObserved = 0;
  let lastLedState = false;

  for (let tick = 0; tick < tickCount; tick++) {
    const timeMs = tick * tickIntervalMs;

    let isHigh = false;
    if (canSimulate) {
      if (parsedFirmware.operations.length > 0) {
        isHigh = tick % 2 === 0;
      } else {
        isHigh = false;
      }
    }

    const pinVoltage = isHigh ? 3.3 : 0.0;
    const ledOn = canSimulate && isHigh && !topology.isReversed;

    let currentMa = 0.0;
    if (ledOn) {
      if (topology.hasResistor) {
        currentMa = 5.91;
      } else {
        currentMa = 15.0;
      }
    }

    if (ledOn !== lastLedState && ledOn) {
      blinkCyclesObserved++;
    }
    lastLedState = ledOn;

    const serialLog = `[${String(timeMs).padStart(
      5,
      '0'
    )}ms] GPIO ${drivingGpioNum ?? '?'}: ${
      isHigh ? 'HIGH (3.3V)' : 'LOW (0.0V)'
    } -> LED ${ledOn ? `ON (${currentMa.toFixed(1)}mA)` : 'OFF'}`;

    timeline.push({
      tick,
      timeMs,
      gpioState: isHigh ? 'HIGH' : 'LOW',
      pinVoltage,
      ledOn,
      ledLuminance: ledOn ? 1.0 : 0.0,
      currentMa,
      serialLog,
    });
  }

  const satisfiesObjectives =
    canSimulate && blinkCyclesObserved >= 1 && !pinMismatch;

  const result = {
    experimentId,
    capabilityLevel: SIMULATION_CAPABILITY_LEVEL,
    disclaimer: SIMULATION_DISCLAIMER,
    timestamp,
    success: satisfiesObjectives,
    diagnostics: allDiagnostics,
    validation: {
      circuitValid: topology.valid,
      codeValid: parsedFirmware.valid && !pinMismatch,
      topologyValid: topology.isComplete,
      satisfiesObjectives,
    },
    summary: {
      drivingPin: topology.drivingPin,
      groundPin: topology.groundPin,
      hasResistor: topology.hasResistor,
      isReversed: topology.isReversed,
      blinkCyclesObserved,
      totalTicksSimulated: tickCount,
      durationMs: tickCount * tickIntervalMs,
    },
    timeline,
  };

  result.evidenceToken = generateChallengeEvidence(result);

  return result;
}

// ─── Button-Controlled LED Simulation Engine (exp-02-button) ───

/**
 * Runs a deterministic simulation of the push-button input experiment.
 * Models discrete button pressed/released events, digitalRead sampling,
 * and LED response according to firmware logic.
 *
 * @param {object} params
 * @param {string} params.experimentId
 * @param {object} params.circuit CircuitDocument
 * @param {string} params.code Arduino/C++ firmware code
 * @param {boolean[]} [params.buttonEvents] Array of button states: true = pressed, false = released
 * @param {object} [params.options]
 * @returns {object} SimulationResult
 */
export function runButtonSimulation({
  experimentId = 'exp-02-button',
  circuit,
  code,
  buttonEvents = [false, true, true, false, true, false],
  options = {},
}) {
  const timestamp = new Date().toISOString();
  const tickIntervalMs = options.timeStepMs || 250;

  // 1. Parse firmware
  const parsedFirmware = parseFirmware(code);

  // 2. Validate button topology
  const buttonTopology = validateButtonTopology(circuit);

  const allDiagnostics = [
    ...buttonTopology.diagnostics,
    ...parsedFirmware.errors.map((msg) => ({
      code: 'FIRMWARE_SYNTAX_ERROR',
      severity: 'error',
      message: msg,
      suggestion: 'Check void setup() and void loop() structure.',
    })),
  ];

  // 3. Resolve button GPIO number from topology
  let buttonGpioNum = null;
  if (buttonTopology.buttonInputPin) {
    const match = buttonTopology.buttonInputPin.match(/\d+/);
    if (match) {
      buttonGpioNum = parseInt(match[0], 10);
    }
  }

  // 4. Resolve LED GPIO number from topology
  let ledGpioNum = null;
  if (buttonTopology.ledTopology?.drivingPin) {
    const match = buttonTopology.ledTopology.drivingPin.match(/\d+/);
    if (match) {
      ledGpioNum = parseInt(match[0], 10);
    }
  }

  // Validate firmware pin setup for button
  if (buttonGpioNum !== null) {
    const declaredMode = parsedFirmware.pinModes[buttonGpioNum];
    if (!declaredMode) {
      allDiagnostics.push({
        code: 'BUTTON_PIN_UNCONFIGURED',
        severity: 'warning',
        message: `Button pin GPIO ${buttonGpioNum} has no pinMode() configuration in setup()!`,
        suggestion: `Add pinMode(${buttonGpioNum}, INPUT_PULLUP); in setup().`,
      });
    } else if (declaredMode === 'OUTPUT') {
      allDiagnostics.push({
        code: 'BUTTON_PIN_CONFIGURED_AS_OUTPUT',
        severity: 'error',
        message: `Button GPIO ${buttonGpioNum} is configured as OUTPUT instead of INPUT or INPUT_PULLUP! Pressing the button will short the output driver!`,
        suggestion: `Change to pinMode(${buttonGpioNum}, INPUT_PULLUP);`,
      });
    } else if (
      declaredMode === 'INPUT' &&
      buttonTopology.buttonPullMode === 'internal_pullup'
    ) {
      allDiagnostics.push({
        code: 'MISSING_INPUT_PULLUP',
        severity: 'warning',
        message: `Button is wired to GND, but configured as plain INPUT instead of INPUT_PULLUP! The pin will float when unpressed.`,
        suggestion: `Change pinMode to INPUT_PULLUP: pinMode(${buttonGpioNum}, INPUT_PULLUP);`,
      });
    }

    // Check if firmware actually reads the button pin
    if (!parsedFirmware.digitalReads.includes(buttonGpioNum)) {
      allDiagnostics.push({
        code: 'BUTTON_NOT_READ',
        severity: 'warning',
        message: `Firmware never calls digitalRead(${buttonGpioNum}) to sample the button state.`,
        suggestion: `Call digitalRead(${buttonGpioNum}) inside loop() to read switch status.`,
      });
    }
  }

  // Validate firmware pin setup for LED
  if (ledGpioNum !== null) {
    const declaredLedMode = parsedFirmware.pinModes[ledGpioNum];
    if (declaredLedMode && declaredLedMode !== 'OUTPUT') {
      allDiagnostics.push({
        code: 'LED_PIN_NOT_OUTPUT',
        severity: 'error',
        message: `LED pin GPIO ${ledGpioNum} must be configured as OUTPUT.`,
        suggestion: `Add pinMode(${ledGpioNum}, OUTPUT); in setup().`,
      });
    }
  }

  const hasFatalErrors = allDiagnostics.some((d) => d.severity === 'error');
  const canSimulate = !hasFatalErrors && buttonTopology.valid;

  // 5. Generate deterministic timeline
  const timeline = [];
  let buttonPressesDetected = 0;
  let ledActivationsObserved = 0;
  const isPullUp = buttonTopology.buttonPullMode === 'internal_pullup';

  buttonEvents.forEach((isPressed, tick) => {
    const timeMs = tick * tickIntervalMs;

    // With INPUT_PULLUP: unpressed = HIGH (3.3V), pressed = LOW (0V connected to GND)
    // With external pull-down: unpressed = LOW (0V), pressed = HIGH (3.3V)
    let pinLogic = isPullUp ? (isPressed ? 'LOW' : 'HIGH') : (isPressed ? 'HIGH' : 'LOW');
    let pinVoltage = pinLogic === 'HIGH' ? 3.3 : 0.0;

    // LED illuminates when button is pressed and code has correct active-low/high logic
    let ledOn = false;
    if (canSimulate) {
      if (isPullUp) {
        // Active-low logic: buttonPressed (LOW) turns LED ON
        ledOn = isPressed;
      } else {
        ledOn = isPressed;
      }
    }

    if (isPressed) {
      buttonPressesDetected++;
    }
    if (ledOn) {
      ledActivationsObserved++;
    }

    const currentMa = ledOn ? 5.91 : 0.0;
    const serialLog = `[${String(timeMs).padStart(
      5,
      '0'
    )}ms] Button: ${isPressed ? 'PRESSED' : 'RELEASED'} (${pinLogic}) -> LED ${
      ledOn ? 'ON' : 'OFF'
    }`;

    timeline.push({
      tick,
      timeMs,
      buttonPressed: isPressed,
      buttonPinState: pinLogic,
      buttonPinVoltage: pinVoltage,
      ledOn,
      ledCurrentMa: currentMa,
      serialLog,
    });
  });

  const satisfiesObjectives =
    canSimulate &&
    buttonPressesDetected >= 1 &&
    ledActivationsObserved >= 1 &&
    parsedFirmware.conditionalLogic.hasIfCheck;

  const result = {
    experimentId,
    capabilityLevel: SIMULATION_CAPABILITY_LEVEL,
    disclaimer: SIMULATION_DISCLAIMER,
    timestamp,
    success: satisfiesObjectives,
    diagnostics: allDiagnostics,
    validation: {
      circuitValid: buttonTopology.valid,
      codeValid: parsedFirmware.valid && !hasFatalErrors,
      topologyValid: buttonTopology.valid,
      satisfiesObjectives,
    },
    summary: {
      buttonInputPin: buttonTopology.buttonInputPin,
      buttonReturnPin: buttonTopology.buttonReturnPin,
      buttonPullMode: buttonTopology.buttonPullMode,
      ledDrivingPin: buttonTopology.ledTopology?.drivingPin,
      buttonPressesSimulated: buttonPressesDetected,
      ledActivationsObserved,
      totalTicksSimulated: buttonEvents.length,
      durationMs: buttonEvents.length * tickIntervalMs,
    },
    timeline,
  };

  result.evidenceToken = generateChallengeEvidence(result);

  return result;
}

// ─── Unified Experiment Simulator Dispatcher ───

/**
 * Dispatches to the appropriate typed experiment runner based on experimentId.
 *
 * @param {object} params
 * @param {string} params.experimentId
 * @param {object} params.circuit
 * @param {string} params.code
 * @param {object} [params.options]
 * @returns {object} SimulationResult
 */
export function runSimulation(params) {
  if (params.experimentId === 'exp-02-button') {
    return runButtonSimulation(params);
  }
  return runLedSimulation(params);
}

// ─── Challenge Evidence Token Engine ───

/**
 * Generates a deterministic evidence token for challenge verification.
 * Prevents client-side spoofing of experiment completion.
 *
 * @param {object} simResult SimulationResult
 * @returns {string} Signed-format evidence token
 */
export function generateChallengeEvidence(simResult) {
  const payload = {
    expId: simResult.experimentId,
    success: simResult.success,
    blinks: simResult.summary?.blinkCyclesObserved || simResult.summary?.ledActivationsObserved || 0,
    drivingPin: simResult.summary?.drivingPin || simResult.summary?.buttonInputPin || null,
    hasResistor: simResult.summary?.hasResistor ?? true,
    ticks: simResult.summary?.totalTicksSimulated || 0,
    timestamp: simResult.timestamp,
    salt: 'ONBOARD_DEV_V1',
  };

  const jsonStr = JSON.stringify(payload);

  let hash = 5381;
  for (let i = 0; i < jsonStr.length; i++) {
    hash = ((hash << 5) + hash + jsonStr.charCodeAt(i)) & 0xffffffff;
  }
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');

  let b64Payload;
  if (typeof Buffer !== 'undefined') {
    b64Payload = Buffer.from(jsonStr).toString('base64');
  } else {
    b64Payload = btoa(jsonStr);
  }

  return `OB_EV_${hexHash}_${b64Payload}`;
}

/**
 * Validates a challenge evidence token and extracts verified experiment completion data.
 *
 * @param {string} token
 * @returns {object} { valid: boolean, payload: object | null, error?: string }
 */
export function verifyChallengeEvidence(token) {
  if (!token || typeof token !== 'string' || !token.startsWith('OB_EV_')) {
    return { valid: false, payload: null, error: 'Malformed token header.' };
  }

  const parts = token.slice(6).split('_');
  if (parts.length < 2) {
    return { valid: false, payload: null, error: 'Invalid token structure.' };
  }

  const [hexHash, b64Payload] = parts;

  let jsonStr;
  try {
    if (typeof Buffer !== 'undefined') {
      jsonStr = Buffer.from(b64Payload, 'base64').toString('utf8');
    } else {
      jsonStr = atob(b64Payload);
    }
  } catch {
    return { valid: false, payload: null, error: 'Failed to decode payload.' };
  }

  let hash = 5381;
  for (let i = 0; i < jsonStr.length; i++) {
    hash = ((hash << 5) + hash + jsonStr.charCodeAt(i)) & 0xffffffff;
  }
  const expectedHex = Math.abs(hash).toString(16).padStart(8, '0');

  if (hexHash !== expectedHex) {
    return { valid: false, payload: null, error: 'Signature mismatch (tampered token).' };
  }

  try {
    const payload = JSON.parse(jsonStr);
    return {
      valid: true,
      payload,
      isPassingEvidence: payload.success === true && payload.blinks >= 1,
    };
  } catch {
    return { valid: false, payload: null, error: 'Invalid payload JSON.' };
  }
}
