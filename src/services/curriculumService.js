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
  estimatedHours: '3.5 - 5.0 hours',
  modules: [
    {
      id: 'mod-0-welcome',
      number: 0,
      title: '0. Welcome to building',
      description: 'What is electronics? What is a circuit? What is a microcontroller? What will we build together?',
      checkpointTitle: 'Checkpoint: Circuit or Broken Loop?',
      lessons: [
        {
          id: 'lesson-0-welcome',
          slug: 'welcome-to-onboard',
          title: 'Welcome to Onboard',
          summary: 'Why anyone can learn electronics without prior math or coding experience.',
          durationMinutes: 5,
          xpReward: 20,
          type: 'concept',
        },
        {
          id: 'lesson-0-circuit-intro',
          slug: 'what-is-a-circuit',
          title: 'What is an Electrical Circuit?',
          summary: 'Understand the closed loop of electrical current with a real-life water pipe analogy.',
          durationMinutes: 6,
          xpReward: 20,
          type: 'interactive',
        },
        {
          id: 'lesson-0-mcu-intro',
          slug: 'what-is-a-microcontroller',
          title: 'What is a Microcontroller?',
          summary: 'The brain of the operation: how microchips run firmware to control circuits.',
          durationMinutes: 7,
          xpReward: 20,
          type: 'concept',
        },
      ],
    },
    {
      id: 'mod-1-electricity',
      number: 1,
      title: '1. Electricity without fear',
      description: 'Voltage, current, resistance, open vs closed circuits, and why LEDs always need resistors.',
      checkpointTitle: 'Checkpoint: Choose the Safe LED Circuit',
      lessons: [
        {
          id: 'lesson-1-voltage-current',
          slug: 'voltage-and-current',
          title: 'Voltage & Current Explained',
          summary: 'Electrical potential (Volts) pushing electron flow (Amperes).',
          durationMinutes: 8,
          xpReward: 20,
          type: 'concept',
        },
        {
          id: 'lesson-1-resistance',
          slug: 'resistance-and-protection',
          title: 'Resistance & Protection',
          summary: "Why diodes have no internal brakes and why Ohm's law prevents circuit destruction.",
          durationMinutes: 7,
          xpReward: 20,
          type: 'interactive',
        },
      ],
    },
    {
      id: 'mod-2-components',
      number: 2,
      title: '2. Meet the components',
      description: 'Breadboard layout, jumper wires, LED polarity, resistors, buttons, and potentiometers.',
      checkpointTitle: 'Checkpoint: Breadboard Continuity Test',
      lessons: [
        {
          id: 'lesson-2-breadboard',
          slug: 'how-breadboards-work',
          title: 'How Breadboards Work',
          summary: 'Inspect the hidden metal spring clips inside terminal rows and power rails.',
          durationMinutes: 6,
          xpReward: 20,
          type: 'hotspot',
        },
        {
          id: 'lesson-2-led-polarity',
          slug: 'led-polarity-and-pins',
          title: 'LED Polarity & Identification',
          summary: 'Anode (+), cathode (-), flat edges, and longer legs.',
          durationMinutes: 6,
          xpReward: 20,
          type: 'interactive',
        },
      ],
    },
    {
      id: 'mod-3-esp32',
      number: 3,
      title: '3. Meet the ESP32',
      description: 'Microcontroller board anatomy, USB bridge, power rails (3.3V/VIN), GND, GPIO, and safety limits.',
      checkpointTitle: 'Checkpoint: Find the Safe GPIO Pins',
      lessons: [
        {
          id: 'lesson-3-anatomy',
          slug: 'esp32-anatomy',
          title: 'ESP32 Hardware Anatomy',
          summary: 'Tour the Tensilica dual-core SoC, Wi-Fi antenna, voltage regulator, and bootloader.',
          durationMinutes: 8,
          xpReward: 20,
          type: 'hotspot',
        },
        {
          id: 'lesson-3-pins',
          slug: 'esp32-gpio-rules',
          title: 'GPIO Rules & 3.3V Logic',
          summary: 'Which pins are output-safe, which are input-only, and why 5V destroys pins.',
          durationMinutes: 8,
          xpReward: 20,
          type: 'concept',
        },
      ],
    },
    {
      id: 'mod-4-led-blink',
      number: 4,
      title: '4. First output: LED blink',
      description: 'Digital output signals, HIGH/LOW logic states, GPIO configuration, and the blink timing loop.',
      checkpointTitle: 'Guided Experiment: First Virtual Blink',
      lessons: [
        {
          id: 'lesson-4-digital-signals',
          slug: 'digital-signals-high-low',
          title: 'Digital Signals (HIGH / LOW)',
          summary: 'Push-pull MOSFET drivers toggling 3.3V and 0V.',
          durationMinutes: 6,
          xpReward: 20,
          type: 'concept',
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
        },
      ],
    },
    {
      id: 'mod-5-button-input',
      number: 5,
      title: '5. First input: button',
      description: 'Reading inputs, mechanical tactile switches, pull-up vs pull-down resistors, and floating pins.',
      checkpointTitle: 'Guided Experiment: Button-Controlled LED',
      lessons: [
        {
          id: 'lesson-5-floating-pins',
          slug: 'the-floating-pin-problem',
          title: 'The Floating Pin Mystery',
          summary: 'Why unconnected inputs pick up stray electrostatic noise.',
          durationMinutes: 7,
          xpReward: 20,
          type: 'concept',
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
        },
      ],
    },
    {
      id: 'mod-6-analogue-world',
      number: 6,
      title: '6. Read the analogue world',
      description: 'Continuous voltages, Analog-to-Digital Converters (ADC), potentiometers, and voltage dividers.',
      checkpointTitle: 'Guided Experiment: Read Rotary Potentiometer',
      lessons: [
        {
          id: 'lesson-6-adc-concepts',
          slug: 'what-is-an-adc',
          title: 'What is an ADC?',
          summary: 'Converting continuous voltages into discrete 12-bit numbers (0 - 4095).',
          durationMinutes: 8,
          xpReward: 20,
          type: 'concept',
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
        },
      ],
    },
    {
      id: 'mod-7-pwm-dimmer',
      number: 7,
      title: '7. Control brightness with PWM',
      description: 'Pulse Width Modulation, duty cycles, LED dimming, and pseudo-analog outputs.',
      checkpointTitle: 'Challenge: Build an LED Dimmer',
      lessons: [
        {
          id: 'lesson-7-pwm-duty-cycle',
          slug: 'pwm-and-duty-cycle',
          title: 'Duty Cycle & Perceived Brightness',
          summary: 'Flickering faster than human vision to simulate variable voltages.',
          durationMinutes: 7,
          xpReward: 20,
          type: 'interactive',
        },
      ],
    },
    {
      id: 'mod-8-debugging',
      number: 8,
      title: '8. Debugging fundamentals',
      description: 'One change at a time, common wiring blunders, reversed diodes, floating grounds, and syntax errors.',
      checkpointTitle: 'Bug Hunt: Fix 3 Broken Circuits',
      lessons: [
        {
          id: 'lesson-8-troubleshooting-method',
          slug: 'the-troubleshooting-mindset',
          title: 'The Hardware Debugging Method',
          summary: 'Isolate power, ground, signal path, and firmware logic step by step.',
          durationMinutes: 8,
          xpReward: 20,
          type: 'interactive',
        },
      ],
    },
    {
      id: 'mod-9-smart-indicator',
      number: 9,
      title: '9. Smart Indicator mission',
      description: 'Final beginner mission: combine button inputs, LED outputs, debounce timing, and serial telemetry.',
      checkpointTitle: 'Final Mission: Smart Indicator',
      lessons: [
        {
          id: 'lesson-9-final-mission',
          slug: 'smart-indicator-project',
          title: 'Mission: The Smart Status Indicator',
          summary: 'Design, wire, write firmware for, and troubleshoot a standalone embedded system.',
          durationMinutes: 20,
          xpReward: 75,
          type: 'mission',
        },
      ],
    },
    {
      id: 'mod-10-physical-bridge',
      number: 10,
      title: '10. Optional real hardware',
      description: 'Exact compatible ESP32 board list, breadboards, jumper wires, safety rules, and physical setup.',
      checkpointTitle: 'Physical Lab Companion Guide',
      lessons: [
        {
          id: 'lesson-10-hardware-guide',
          slug: 'step-onto-real-hardware',
          title: 'Stepping onto Real Hardware',
          summary: 'Where to buy safe components and how to repeat your virtual circuits on a real desk.',
          durationMinutes: 10,
          xpReward: 30,
          type: 'hardware',
        },
      ],
    },
  ],
};

/**
 * Calculates learning map node status based on completed lesson IDs.
 * Status: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered'
 */
export function getModuleState(module, completedLessonIds, unlockedModuleIds) {
  const isUnlocked = unlockedModuleIds.includes(module.id);
  if (!isUnlocked) return 'locked';

  const totalLessons = module.lessons.length;
  const completedCount = module.lessons.filter((l) => completedLessonIds.includes(l.id)).length;

  if (completedCount === totalLessons) return 'completed';
  if (completedCount > 0) return 'in_progress';
  return 'available';
}
