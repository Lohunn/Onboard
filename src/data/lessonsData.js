/**
 * Structured Lesson Content Data
 * Schema Version: 1
 * Conforms to Section 5C & Section 12 of ONBOARD Product Architecture & MVP Specification.
 * Each lesson consists of an array of validated structured blocks:
 * - heading, paragraph, diagram, callout, hotspot, code_example, knowledge_check, interactive_step
 */

export const LESSONS_DATA = {
  // ─── Module 0: Lesson 1 ───
  'lesson-0-welcome': {
    id: 'lesson-0-welcome',
    moduleId: 'mod-0-welcome',
    slug: 'welcome-to-onboard',
    title: 'Welcome to Onboard',
    subtitle: 'Electronics without fear, memorization, or burned fingers',
    estimatedMinutes: 5,
    xpReward: 20,
    schemaVersion: 1,
    blocks: [
      {
        type: 'heading',
        text: 'The Secret About Electronics',
      },
      {
        type: 'paragraph',
        text: 'Most people think electronics requires years of advanced calculus, expensive hardware, and a room full of soldering irons. The truth is much simpler: modern electronics is about understanding invisible flows of energy and directing them to do useful work.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Zero Physical Hardware Required',
        text: 'Everything in Onboard runs directly inside your web browser. You can build circuits, inspect voltages, and execute code safely without buying components or worrying about short circuits.',
      },
      {
        type: 'diagram',
        diagramType: 'loop_analogy',
        caption: 'A closed loop: the power source supplies energy, the wire carries it, and the component does useful work.',
      },
      {
        type: 'heading',
        text: 'Our Core Principle',
      },
      {
        type: 'paragraph',
        text: 'In many electronics tutorials, you are given a snippet of code and told where to plug in a wire. When an LED turns on, you still do not know why it worked or what to do when something breaks. Onboard does not just show you how to make a circuit work—it explains why it works.',
      },
      {
        type: 'knowledge_check',
        id: 'kc-0-1',
        prompt: 'Do you need to own physical wires or microcontrollers to complete the Onboard beginner path?',
        options: [
          {
            id: 'opt-a',
            text: 'Yes, you must buy an electronics starter kit first.',
            explanation: 'Incorrect. The entire core curriculum is 100% in-browser with interactive virtual breadboards and simulation.',
          },
          {
            id: 'opt-b',
            text: 'No, everything is simulated and interactive in your browser.',
            explanation: 'Correct! Physical hardware is completely optional. You can master all foundations virtually first.',
          },
        ],
        correctOptionId: 'opt-b',
        hint: 'Onboard is virtual-first so you can experiment safely without any equipment.',
      },
    ],
  },

  // ─── Module 0: Lesson 2 ───
  'lesson-0-circuit-intro': {
    id: 'lesson-0-circuit-intro',
    moduleId: 'mod-0-welcome',
    slug: 'what-is-a-circuit',
    title: 'What is an Electrical Circuit?',
    subtitle: 'The continuous loop of electron flow',
    estimatedMinutes: 6,
    xpReward: 20,
    schemaVersion: 1,
    blocks: [
      {
        type: 'heading',
        text: 'The Word "Circuit" Means a Circle',
      },
      {
        type: 'paragraph',
        text: 'Electricity cannot travel down a dead end. For electrons to flow and do work (such as lighting an LED or spinning a motor), they must have an unbroken, continuous loop from a positive power source back to ground.',
      },
      {
        type: 'callout',
        tone: 'concept',
        title: 'The Closed vs Open Rule',
        text: 'A "closed circuit" is a complete path where electricity flows. An "open circuit" has a break or disconnection, which instantly halts all current flow.',
      },
      {
        type: 'hotspot',
        title: 'Inspect a Simple Circuit',
        description: 'Click each part of the loop to understand its role:',
        items: [
          {
            label: 'Battery / Power Source',
            role: 'Provides electrical pressure (voltage) that pushes electrons forward.',
          },
          {
            label: 'Jumper Wire',
            role: 'A copper conductor that gives electrons a low-resistance path to travel.',
          },
          {
            label: 'LED (Light Emitting Diode)',
            role: 'Converts electrical energy into light as electrons cross its silicon junction.',
          },
          {
            label: 'Ground (0V Reference)',
            role: 'The return terminal where electrons finish their journey.',
          },
        ],
      },
      {
        type: 'knowledge_check',
        id: 'kc-0-2',
        prompt: 'What happens to an LED if you cut one wire in the circuit?',
        options: [
          {
            id: 'opt-a',
            text: 'The LED stays on because power is still connected to one side.',
            explanation: 'Incorrect. Electricity cannot flow into a dead end; it requires a complete loop back to ground.',
          },
          {
            id: 'opt-b',
            text: 'The LED turns off immediately because the circuit is broken (open).',
            explanation: 'Correct! When the loop is broken, current drops to zero instantly everywhere in the path.',
          },
          {
            id: 'opt-c',
            text: 'The LED gets brighter because current has nowhere to escape.',
            explanation: 'Incorrect. No current can flow through an open circuit.',
          },
        ],
        correctOptionId: 'opt-b',
        hint: 'Think about a water loop: if you cap a closed pipe, does water continue to circulate?',
      },
    ],
  },

  // ─── Module 0: Lesson 3 ───
  'lesson-0-mcu-intro': {
    id: 'lesson-0-mcu-intro',
    moduleId: 'mod-0-welcome',
    slug: 'what-is-a-microcontroller',
    title: 'What is a Microcontroller?',
    subtitle: 'The programmable brain of physical computing',
    estimatedMinutes: 7,
    xpReward: 20,
    schemaVersion: 1,
    blocks: [
      {
        type: 'heading',
        text: 'Computers Hidden Inside Every Device',
      },
      {
        type: 'paragraph',
        text: 'Your microwave, washing machine, television remote, and car key fob all contain small computer chips called microcontrollers (MCUs). Unlike a desktop computer designed for spreadsheets and web browsing, an MCU is designed for one specific task: reading sensors and controlling outputs in real time.',
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'MCU vs MPU (Microprocessor)',
        text: 'A desktop CPU (MPU) requires external RAM, storage, and graphics cards to function. A microcontroller (MCU) integrates the processor, flash memory, and I/O pins all onto a single piece of silicon.',
      },
      {
        type: 'hotspot',
        title: 'Anatomy of an ESP32 Microcontroller',
        description: 'Explore the key components integrated onto the chip:',
        items: [
          {
            label: 'CPU Core',
            role: 'Executes your instructions line by line at millions of cycles per second.',
          },
          {
            label: 'Flash Memory (ROM)',
            role: 'Stores your firmware program permanently, even when the power is unplugged.',
          },
          {
            label: 'SRAM (RAM)',
            role: 'Fast temporary scratchpad memory holding active variables while running.',
          },
          {
            label: 'GPIO Pins',
            role: 'General Purpose Input/Output pins that physically connect to LEDs, sensors, and displays.',
          },
        ],
      },
      {
        type: 'knowledge_check',
        id: 'kc-0-3',
        prompt: 'Why are microcontrollers ideal for embedded systems like smart thermostats and microwave ovens?',
        options: [
          {
            id: 'opt-a',
            text: 'Because they are all-in-one low-power chips that directly interact with physical switches and sensors.',
            explanation: 'Correct! They consume fractions of a watt, boot instantly, and have dedicated hardware pins to read and drive physical electronics.',
          },
          {
            id: 'opt-b',
            text: 'Because they can run full desktop operating systems like Windows 11.',
            explanation: 'Incorrect. MCUs run lightweight firmware, not heavy desktop OSs.',
          },
        ],
        correctOptionId: 'opt-a',
        hint: 'Consider how quickly a microwave turns on compared to a desktop PC.',
      },
    ],
  },

  // ─── Module 1: Lesson 1 ───
  'lesson-1-voltage-current': {
    id: 'lesson-1-voltage-current',
    moduleId: 'mod-1-electricity',
    slug: 'voltage-and-current',
    title: 'Voltage & Current Explained',
    subtitle: 'Understanding electrical pressure and flow',
    estimatedMinutes: 8,
    xpReward: 20,
    schemaVersion: 1,
    blocks: [
      {
        type: 'heading',
        text: 'The Water Tank Analogy',
      },
      {
        type: 'paragraph',
        text: 'Because electrons are invisible, engineers use the hydraulic (water) analogy to build intuition: imagine a water tank on a tower connected to a pipe.',
      },
      {
        type: 'callout',
        tone: 'concept',
        title: 'The Big Two Units',
        text: 'Voltage (measured in Volts, V) is electrical pressure. Current (measured in Amperes, A or mA) is the actual flow rate of electrons passing a point each second.',
      },
      {
        type: 'hotspot',
        title: 'Compare Pressure and Flow',
        description: 'Click each electrical dimension:',
        items: [
          {
            label: 'Voltage (Volts - V)',
            role: 'Height of the water tank. Higher voltage pushes electrons harder.',
          },
          {
            label: 'Current (Amperes - A or mA)',
            role: 'Liters per second flowing through the pipe. 1 Ampere = 1000 milliamps (mA).',
          },
          {
            label: 'Resistance (Ohms - Ω)',
            role: 'A pinch or valve in the pipe that limits how fast water can flow through.',
          },
        ],
      },
      {
        type: 'knowledge_check',
        id: 'kc-1-1',
        prompt: 'On our ESP32 board, digital pins output 3.3 Volts. What does this 3.3V represent?',
        options: [
          {
            id: 'opt-a',
            text: 'The electrical pressure provided between the GPIO pin and Ground.',
            explanation: 'Correct! 3.3 Volts is the electrical potential difference that can drive current through components.',
          },
          {
            id: 'opt-b',
            text: 'The physical speed of electrons in kilometers per hour.',
            explanation: 'Incorrect. Voltage is potential energy per unit charge, not physical velocity.',
          },
          {
            id: 'opt-c',
            text: 'The total number of electrons stored inside the chip.',
            explanation: 'Incorrect. That would be electrical charge measured in Coulombs.',
          },
        ],
        correctOptionId: 'opt-a',
        hint: 'Remember: Voltage is electrical pressure or potential difference.',
      },
    ],
  },

  // ─── Module 1: Lesson 2 ───
  'lesson-1-resistance': {
    id: 'lesson-1-resistance',
    moduleId: 'mod-1-electricity',
    slug: 'resistance-and-protection',
    title: 'Resistance & Protection',
    subtitle: "Why LEDs always need resistors and how Ohm's Law protects components",
    estimatedMinutes: 7,
    xpReward: 20,
    schemaVersion: 1,
    blocks: [
      {
        type: 'heading',
        text: 'The Problem with Diodes',
      },
      {
        type: 'paragraph',
        text: 'An LED is not like an old-fashioned filament light bulb. Once forward voltage (~2.0V) is reached, an LED has almost zero internal resistance. If you connect an LED directly to a 3.3V or 5V source without a resistor, it draws unlimited current, instantly burning out the LED and damaging the microcontroller pin!',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: "Ohm's Law: V = I × R",
        text: 'Voltage equals Current times Resistance. By adding a 220Ω resistor in series with the LED, we limit current to a safe ~15 milliamps.',
      },
      {
        type: 'code_example',
        title: 'Formula for Safe Resistor Selection',
        code: `// Target safe current for 5mm LED: 15mA = 0.015A
// Supply Voltage (ESP32): 3.3V
// Red LED Forward Voltage: 2.0V
// Voltage drop across resistor: 3.3V - 2.0V = 1.3V

Resistor = Voltage / Current
Resistor = 1.3V / 0.015A = 86.6 Ohms (Minimum)

// We use standard 220 Ohm resistor for safety & longevity!`,
      },
      {
        type: 'knowledge_check',
        id: 'kc-1-2',
        prompt: 'Why must you place a resistor in series with an LED?',
        options: [
          {
            id: 'opt-a',
            text: 'To limit current so the LED and microcontroller do not overheat and burn out.',
            explanation: 'Correct! The resistor acts as an electrical current brake.',
          },
          {
            id: 'opt-b',
            text: 'To make the LED shine twice as bright.',
            explanation: 'Incorrect. Adding resistance reduces current, which actually limits brightness to safe levels.',
          },
          {
            id: 'opt-c',
            text: 'To convert alternating current (AC) into direct current (DC).',
            explanation: 'Incorrect. That is the job of a rectifier circuit.',
          },
        ],
        correctOptionId: 'opt-a',
        hint: 'What happens to a car going downhill if it has no brakes?',
      },
    ],
  },
};
