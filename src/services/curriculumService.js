/**
 * Curriculum Service for "Electronics Zero-to-ESP32"
 * Conforms to Section 6 of the ONBOARD Product Architecture & MVP Specification.
 * Provides modules 0 through 10 with prerequisite-enforced learning map states.
 */

export const ZERO_TO_ESP32_PATH = {
  id: 'path-zero-to-esp32',
  slug: 'electronics-zero-to-esp32',
  title: 'Electronics Zero-to-ESP32',
  tagline: 'From zero knowledge to your first microcontroller project',
  boardVariant: 'esp32-devkit-v1',
  boardName: 'ESP32 DevKit V1',
  estimatedHours: '3.5 - 5.0 hours',
  totalModules: 11,
  modules: [
    {
      id: 'mod-0-welcome',
      number: 0,
      title: '0. Welcome to building',
      description: 'What is electronics? What is a circuit? What is a microcontroller? What will we build together?',
      checkpointTitle: 'Checkpoint: Circuit or Broken Loop?',
      prerequisiteModuleId: null,
      icon: 'Sparkles',
      accentColor: '#2A56A3',
      learningOutcomes: [
        'Distinguish between an electrical conductor, insulator, and circuit',
        'Identify what a microcontroller chip does inside consumer tech',
        'Form the habit of predicting circuit behavior before testing',
      ],
      lessons: [
        {
          id: 'lesson-0-welcome',
          slug: 'welcome-to-onboard',
          title: 'Welcome to Onboard',
          summary: 'Why anyone can learn electronics without prior math or coding experience.',
          durationMinutes: 5,
          xpReward: 20,
          type: 'concept',
          objectives: ['Understand how Onboard teaches', 'Confirm no hardware is needed'],
        },
        {
          id: 'lesson-0-circuit-intro',
          slug: 'what-is-a-circuit',
          title: 'What is an Electrical Circuit?',
          summary: 'Understand the closed loop of electrical current with a real-life water pipe analogy.',
          durationMinutes: 6,
          xpReward: 20,
          type: 'interactive',
          objectives: ['Define an electrical loop', 'Predict if current will flow'],
        },
        {
          id: 'lesson-0-mcu-intro',
          slug: 'what-is-a-microcontroller',
          title: 'What is a Microcontroller?',
          summary: 'The brain of the operation: how microchips run firmware to control circuits.',
          durationMinutes: 7,
          xpReward: 20,
          type: 'concept',
          objectives: ['Compare a computer CPU with an MCU', 'Identify the ESP32 chip'],
        },
      ],
    },
    {
      id: 'mod-1-electricity',
      number: 1,
      title: '1. Electricity without fear',
      description: 'Voltage, current, resistance, open vs closed circuits, and why LEDs always need resistors.',
      checkpointTitle: 'Checkpoint: Choose the Safe LED Circuit',
      prerequisiteModuleId: 'mod-0-welcome',
      icon: 'Zap',
      accentColor: '#C0652D',
      learningOutcomes: [
        'Understand voltage (potential) and current (flow)',
        "Use Ohm's Law intuitively (V = I * R)",
        'Explain why LEDs blow up without current-limiting resistors',
      ],
      lessons: [
        {
          id: 'lesson-1-voltage-current',
          slug: 'voltage-and-current',
          title: 'Voltage & Current Explained',
          summary: 'Electrical potential (Volts) pushing electron flow (Amperes).',
          durationMinutes: 8,
          xpReward: 20,
          type: 'concept',
          objectives: ['Define Volts and Amperes', 'Understand electrical potential difference'],
        },
        {
          id: 'lesson-1-resistance',
          slug: 'resistance-and-protection',
          title: 'Resistance & Protection',
          summary: "Why diodes have no internal brakes and why Ohm's law prevents circuit destruction.",
          durationMinutes: 7,
          xpReward: 20,
          type: 'interactive',
          objectives: ['Calculate resistor values for LEDs', 'Identify forward voltage'],
        },
      ],
    },
    {
      id: 'mod-2-components',
      number: 2,
      title: '2. Meet the components',
      description: 'Breadboard layout, jumper wires, LED polarity, resistors, buttons, and potentiometers.',
      checkpointTitle: 'Checkpoint: Breadboard Continuity Test',
      prerequisiteModuleId: 'mod-1-electricity',
      icon: 'Layers',
      accentColor: '#057A55',
      learningOutcomes: [
        'Navigate the internal tie-strips and rails of a solderless breadboard',
        'Identify anode (+) and cathode (-) legs of a diode',
        'Select tactile switches and resistors with confidence',
      ],
      lessons: [
        {
          id: 'lesson-2-breadboard',
          slug: 'how-breadboards-work',
          title: 'How Breadboards Work',
          summary: 'Inspect the hidden metal spring clips inside terminal rows and power rails.',
          durationMinutes: 6,
          xpReward: 20,
          type: 'hotspot',
          objectives: ['Understand 5-hole terminal rows', 'Trace positive and ground power rails'],
        },
        {
          id: 'lesson-2-led-polarity',
          slug: 'led-polarity-and-pins',
          title: 'LED Polarity & Identification',
          summary: 'Anode (+), cathode (-), flat edges, and longer legs.',
          durationMinutes: 6,
          xpReward: 20,
          type: 'interactive',
          objectives: ['Locate the flat edge on 5mm LEDs', 'Wire the diode in the correct direction'],
        },
      ],
    },
    {
      id: 'mod-3-esp32',
      number: 3,
      title: '3. Meet the ESP32',
      description: 'Microcontroller board anatomy, USB bridge, power rails (3.3V/VIN), GND, GPIO, and safety limits.',
      checkpointTitle: 'Checkpoint: Find the Safe GPIO Pins',
      prerequisiteModuleId: 'mod-2-components',
      icon: 'Cpu',
      accentColor: '#18213D',
      learningOutcomes: [
        'Locate power pins (3V3, VIN, GND) on the ESP32 DevKit V1',
        'Identify general-purpose I/O vs strapping and input-only pins',
        'Safeguard the 3.3V logic level from 5V overvoltage',
      ],
      lessons: [
        {
          id: 'lesson-3-anatomy',
          slug: 'esp32-anatomy',
          title: 'ESP32 Hardware Anatomy',
          summary: 'Tour the Tensilica dual-core SoC, Wi-Fi antenna, voltage regulator, and bootloader.',
          durationMinutes: 8,
          xpReward: 20,
          type: 'hotspot',
          objectives: ['Identify on-board crystal and USB chip', 'Understand power input options'],
        },
        {
          id: 'lesson-3-pins',
          slug: 'esp32-gpio-rules',
          title: 'GPIO Rules & 3.3V Logic',
          summary: 'Which pins are output-safe, which are input-only, and why 5V destroys pins.',
          durationMinutes: 8,
          xpReward: 20,
          type: 'concept',
          objectives: ['Recognize ADC1 vs ADC2 pins', 'Avoid strapping pin boot errors'],
        },
      ],
    },
    {
      id: 'mod-4-led-blink',
      number: 4,
      title: '4. First output: LED blink',
      description: 'Digital output signals, HIGH/LOW logic states, GPIO configuration, and the blink timing loop.',
      checkpointTitle: 'Guided Experiment: First Virtual Blink',
      prerequisiteModuleId: 'mod-3-esp32',
      icon: 'Lightbulb',
      accentColor: '#2A56A3',
      learningOutcomes: [
        'Configure GPIO pins as outputs using pinMode()',
        'Drive pins to 3.3V and 0V with digitalWrite()',
        'Control execution pacing with delay()',
      ],
      lessons: [
        {
          id: 'lesson-4-digital-signals',
          slug: 'digital-signals-high-low',
          title: 'Digital Signals (HIGH / LOW)',
          summary: 'Push-pull MOSFET drivers toggling 3.3V and 0V.',
          durationMinutes: 6,
          xpReward: 20,
          type: 'concept',
          objectives: ['Understand 1 and 0 binary logic', 'Visualize square voltage waves'],
        },
        {
          id: 'lesson-4-blink-build',
          slug: 'build-and-blink-led',
          title: 'Build: Guided LED Circuit',
          summary: 'Wire ESP32 GPIO 2 to a 220Ω resistor and LED on the virtual canvas.',
          durationMinutes: 10,
          xpReward: 30,
          type: 'lab',
          experimentId: 'exp-01-blink',
          objectives: ['Build circuit on virtual breadboard', 'Run simulation and verify LED blinks'],
        },
      ],
    },
    {
      id: 'mod-5-button-input',
      number: 5,
      title: '5. First input: button',
      description: 'Reading inputs, mechanical tactile switches, pull-up vs pull-down resistors, and floating pins.',
      checkpointTitle: 'Guided Experiment: Button-Controlled LED',
      prerequisiteModuleId: 'mod-4-led-blink',
      icon: 'Square',
      accentColor: '#C0652D',
      learningOutcomes: [
        'Read digital states using digitalRead()',
        'Eliminate floating inputs using internal pull-up resistors',
        'Implement active-low switch logic',
      ],
      lessons: [
        {
          id: 'lesson-5-floating-pins',
          slug: 'the-floating-pin-problem',
          title: 'The Floating Pin Mystery',
          summary: 'Why unconnected inputs pick up stray electrostatic noise.',
          durationMinutes: 7,
          xpReward: 20,
          type: 'concept',
          objectives: ['Define high-impedance inputs', 'Explain pull-up resistors'],
        },
        {
          id: 'lesson-5-button-build',
          slug: 'wire-and-read-button',
          title: 'Build: Button-Controlled LED',
          summary: 'Read digital state using internal pull-up and illuminate the LED when pressed.',
          durationMinutes: 10,
          xpReward: 30,
          type: 'lab',
          experimentId: 'exp-02-button',
          objectives: ['Wire switch with ground reference', 'Write conditional if/else code'],
        },
      ],
    },
    {
      id: 'mod-6-analogue-world',
      number: 6,
      title: '6. Read the analogue world',
      description: 'Continuous voltages, Analog-to-Digital Converters (ADC), potentiometers, and voltage dividers.',
      checkpointTitle: 'Guided Experiment: Read Rotary Potentiometer',
      prerequisiteModuleId: 'mod-5-button-input',
      icon: 'Sliders',
      accentColor: '#057A55',
      learningOutcomes: [
        'Understand continuous analog reality vs discrete digital binary',
        'Read 12-bit values (0-4095) with analogRead()',
        'Wire rotary potentiometers as adjustable voltage dividers',
      ],
      lessons: [
        {
          id: 'lesson-6-adc-concepts',
          slug: 'what-is-an-adc',
          title: 'What is an ADC?',
          summary: 'Converting continuous voltages into discrete 12-bit numbers (0 - 4095).',
          durationMinutes: 8,
          xpReward: 20,
          type: 'concept',
          objectives: ['Understand 12-bit quantization', 'Convert ADC counts to Volts'],
        },
        {
          id: 'lesson-6-pot-build',
          slug: 'read-potentiometer-adc',
          title: 'Build: Potentiometer Voltage Divider',
          summary: 'Read changing analog voltage on GPIO 34 and stream it over the serial monitor.',
          durationMinutes: 10,
          xpReward: 30,
          type: 'lab',
          experimentId: 'exp-03-potentiometer',
          objectives: ['Wire 3-terminal potentiometer', 'Map sensor values to delays'],
        },
      ],
    },
    {
      id: 'mod-7-pwm-dimmer',
      number: 7,
      title: '7. Control brightness with PWM',
      description: 'Pulse Width Modulation, duty cycles, LED dimming, and pseudo-analog outputs.',
      checkpointTitle: 'Challenge: Build an LED Dimmer',
      prerequisiteModuleId: 'mod-6-analogue-world',
      icon: 'Activity',
      accentColor: '#2A56A3',
      learningOutcomes: [
        'Simulate analog voltages using high-speed digital pulsing',
        'Calculate duty cycles from 0% (off) to 100% (full brightness)',
      ],
      lessons: [
        {
          id: 'lesson-7-pwm-duty-cycle',
          slug: 'pwm-and-duty-cycle',
          title: 'Duty Cycle & Perceived Brightness',
          summary: 'Flickering faster than human vision to simulate variable voltages.',
          durationMinutes: 7,
          xpReward: 20,
          type: 'interactive',
          objectives: ['Define duty cycle percentage', 'Control LED dimming'],
        },
      ],
    },
    {
      id: 'mod-8-debugging',
      number: 8,
      title: '8. Debugging fundamentals',
      description: 'One change at a time, common wiring blunders, reversed diodes, floating grounds, and syntax errors.',
      checkpointTitle: 'Bug Hunt: Fix 3 Broken Circuits',
      prerequisiteModuleId: 'mod-7-pwm-dimmer',
      icon: 'AlertCircle',
      accentColor: '#C0652D',
      learningOutcomes: [
        'Isolate errors methodically: power -> ground -> signal -> code',
        'Read serial compiler diagnostics without panic',
      ],
      lessons: [
        {
          id: 'lesson-8-troubleshooting-method',
          slug: 'the-troubleshooting-mindset',
          title: 'The Hardware Debugging Method',
          summary: 'Isolate power, ground, signal path, and firmware logic step by step.',
          durationMinutes: 8,
          xpReward: 20,
          type: 'interactive',
          objectives: ['Apply binary search troubleshooting', 'Fix seeded wiring mistakes'],
        },
      ],
    },
    {
      id: 'mod-9-smart-indicator',
      number: 9,
      title: '9. Smart Indicator mission',
      description: 'Final beginner mission: combine button inputs, LED outputs, debounce timing, and serial telemetry.',
      checkpointTitle: 'Final Mission: Smart Indicator',
      prerequisiteModuleId: 'mod-8-debugging',
      icon: 'Award',
      accentColor: '#057A55',
      learningOutcomes: [
        'Build a multi-component interactive embedded project from scratch',
        'Combine digital inputs and outputs with state memory',
      ],
      lessons: [
        {
          id: 'lesson-9-final-mission',
          slug: 'smart-indicator-project',
          title: 'Mission: The Smart Status Indicator',
          summary: 'Design, wire, write firmware for, and troubleshoot a standalone embedded system.',
          durationMinutes: 20,
          xpReward: 75,
          type: 'mission',
          objectives: ['Wire button & LED with resistors', 'Implement state latch in firmware'],
        },
      ],
    },
    {
      id: 'mod-10-physical-bridge',
      number: 10,
      title: '10. Optional real hardware',
      description: 'Exact compatible ESP32 board list, breadboards, jumper wires, safety rules, and physical setup.',
      checkpointTitle: 'Physical Lab Companion Guide',
      prerequisiteModuleId: 'mod-9-smart-indicator',
      icon: 'ShieldCheck',
      accentColor: '#18213D',
      learningOutcomes: [
        'Source exact verified ESP32 DevKit V1 hardware',
        'Avoid USB overcurrent when connecting to a real computer',
      ],
      lessons: [
        {
          id: 'lesson-10-hardware-guide',
          slug: 'step-onto-real-hardware',
          title: 'Stepping onto Real Hardware',
          summary: 'Where to buy safe components and how to repeat your virtual circuits on a real desk.',
          durationMinutes: 10,
          xpReward: 30,
          type: 'hardware',
          objectives: ['Identify physical board markers', 'Safe USB hookup instructions'],
        },
      ],
    },
  ],
};

/**
 * Computes the state of a single module.
 * State: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered'
 */
export function getModuleState(module, completedLessonIds, unlockedModuleIds) {
  // If not unlocked by prerequisites, it's locked
  if (module.prerequisiteModuleId && !unlockedModuleIds.includes(module.id)) {
    return 'locked';
  }

  const lessonIds = module.lessons.map((l) => l.id);
  const completedCount = lessonIds.filter((id) => completedLessonIds.includes(id)).length;

  if (completedCount === lessonIds.length) {
    return 'completed';
  }

  if (completedCount > 0) {
    return 'in_progress';
  }

  return 'available';
}

/**
 * Validates prerequisites and returns array of unlocked module IDs.
 */
export function calculateUnlockedModules(completedLessonIds) {
  const unlocked = ['mod-0-welcome'];

  for (let i = 0; i < ZERO_TO_ESP32_PATH.modules.length; i++) {
    const mod = ZERO_TO_ESP32_PATH.modules[i];
    const prevMod = i > 0 ? ZERO_TO_ESP32_PATH.modules[i - 1] : null;

    if (prevMod) {
      const prevCompleted = prevMod.lessons.every((l) => completedLessonIds.includes(l.id));
      if (prevCompleted && !unlocked.includes(mod.id)) {
        unlocked.push(mod.id);
      }
    }
  }

  return unlocked;
}

/**
 * Finds the learner's next active lesson.
 */
export function findNextActiveLesson(completedLessonIds) {
  for (const mod of ZERO_TO_ESP32_PATH.modules) {
    for (const lesson of mod.lessons) {
      if (!completedLessonIds.includes(lesson.id)) {
        return { lesson, module: mod };
      }
    }
  }
  // All completed
  const lastMod = ZERO_TO_ESP32_PATH.modules[ZERO_TO_ESP32_PATH.modules.length - 1];
  return { lesson: lastMod.lessons[lastMod.lessons.length - 1], module: lastMod };
}
