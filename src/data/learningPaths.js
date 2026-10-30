/**
 * Structured Learning Paths for Onboard.
 * Follows the 4 defined curricula:
 * - Path A: Microcontroller Foundations (6 lessons)
 * - Path B: Sensors and Actuators (5 lessons)
 * - Path C: Displays and Communication (4 lessons)
 * - Path D: IoT Foundations (4 lessons)
 */

export const learningPaths = [
  {
    id: 'path-foundations',
    slug: 'microcontroller-foundations',
    title: 'Path A — Microcontroller Foundations',
    subtitle: 'From zero to understanding silicon, pins, voltages, and firmware',
    description:
      'Master the essential principles of embedded hardware. Learn how microcontrollers process code, configure GPIO pins, handle analog vs digital signals, and communicate with computers over serial.',
    difficulty: 'Beginner',
    level: 1,
    icon: 'Cpu',
    badge: 'Core Prerequisite',
    color: '#2A56A3',
    estimatedHours: '3.5 hours',
    totalLessons: 6,
    lessons: [
      {
        id: 'lesson-a1-what-is-mcu',
        title: '1. What is a Microcontroller?',
        description:
          'Learn the fundamental differences between a general-purpose CPU (like in a PC or phone), a microprocessor, and a microcontroller (MCU). Explore Flash memory, SRAM, registers, and execution loops.',
        duration: '20 min',
        objectives: [
          'Distinguish between Microprocessors (MPU) and Microcontrollers (MCU)',
          'Understand how Flash (ROM) stores firmware while SRAM holds run-time variables',
          'Learn the role of clocks, oscillators, and power regulation circuits',
        ],
        prerequisites: ['None'],
        experimentId: null,
      },
      {
        id: 'lesson-a2-board-anatomy',
        title: '2. Board Anatomy & Interactive Pinouts',
        description:
          'Tour the physical anatomy of development boards like the ESP32, Arduino Uno, and Raspberry Pi Pico. Learn how voltage regulators, USB bridges, and crystal oscillators support the main chip.',
        duration: '25 min',
        objectives: [
          'Identify power input rails (VIN, 5V, 3.3V, GND)',
          'Locate strapping and boot-mode pins on modern SoCs',
          'Read engineering pinout reference diagrams with confidence',
        ],
        prerequisites: ['1. What is a Microcontroller?'],
        experimentId: null,
      },
      {
        id: 'lesson-a3-digital-io',
        title: '3. Digital Input & Output (GPIO)',
        description:
          'Deep dive into digital binary logic. Learn how microcontrollers switch output states between 0V and 3.3V/5V using push-pull MOSFETs, and how input buffers read external logic levels.',
        duration: '35 min',
        objectives: [
          'Understand high-impedance inputs vs low-impedance outputs',
          'Write code using pinMode(), digitalWrite(), and digitalRead()',
          'Calculate current-limiting resistors using Ohm’s Law',
        ],
        prerequisites: ['2. Board Anatomy & Interactive Pinouts'],
        experimentId: 'exp-01-blink',
      },
      {
        id: 'lesson-a4-analog-adc',
        title: '4. Analog Input & ADC Resolution',
        description:
          'Explore how microcontrollers translate continuous real-world electrical voltages into discrete digital numbers using Successive Approximation Register (SAR) ADCs.',
        duration: '35 min',
        objectives: [
          'Understand ADC resolution (10-bit: 1024 steps vs 12-bit: 4096 steps)',
          'Calculate reference voltages (VREF) and quantization step size',
          'Implement voltage dividers and handle signal noise',
        ],
        prerequisites: ['3. Digital Input & Output (GPIO)'],
        experimentId: 'exp-03-potentiometer',
      },
      {
        id: 'lesson-a5-pwm-basics',
        title: '5. PWM Basics (Pulse Width Modulation)',
        description:
          'Learn how microcontrollers simulate analog output voltages using digital pulsing. Master duty cycles, carrier frequencies, LED dimming, and motor speed control.',
        duration: '30 min',
        objectives: [
          'Define duty cycle and frequency in square-wave generation',
          'Calculate average effective DC voltage from high-frequency pulses',
          'Use hardware timers to generate non-blocking PWM signals',
        ],
        prerequisites: ['3. Digital Input & Output (GPIO)'],
        experimentId: null,
      },
      {
        id: 'lesson-a6-serial-monitor',
        title: '6. Serial Monitor & Debugging',
        description:
          'Master Universal Asynchronous Receiver-Transmitter (UART) communication to stream diagnostic telemetry and variable states from your board directly to your computer screen.',
        duration: '25 min',
        objectives: [
          'Configure baud rates (9600 vs 115200) and understand packet framing',
          'Format debugging logs using Serial.print() and Serial.printf()',
          'Troubleshoot common communication errors and garbage characters',
        ],
        prerequisites: ['3. Digital Input & Output (GPIO)'],
        experimentId: null,
      },
    ],
  },
  {
    id: 'path-sensors',
    slug: 'sensors-and-actuators',
    title: 'Path B — Sensors and Actuators',
    subtitle: 'Interact with the physical world: motion, switches, distance, and temperature',
    description:
      'Learn how to interface real-world sensors and physical mechanical actuators. Wire switches with debounce protection, measure acoustic distance, read atmospheric conditions, and drive servo motors.',
    difficulty: 'Beginner to Intermediate',
    level: 2,
    icon: 'Radio',
    badge: 'Hands-on Labs',
    color: '#057A55',
    estimatedHours: '4.0 hours',
    totalLessons: 5,
    lessons: [
      {
        id: 'lesson-b1-push-buttons',
        title: '1. Push Buttons & Pull-up Resistors',
        description:
          'Learn why inputs require pull-up or pull-down resistors to avoid the dreaded "floating pin" state. Implement software debounce filters to eliminate mechanical contact chatter.',
        duration: '30 min',
        objectives: [
          'Understand floating inputs and electrostatic interference',
          'Configure on-chip internal pull-up resistors (INPUT_PULLUP)',
          'Implement state-change detection and software debouncing',
        ],
        prerequisites: ['Path A: Microcontroller Foundations'],
        experimentId: 'exp-02-button',
      },
      {
        id: 'lesson-b2-potentiometers',
        title: '2. Potentiometers & Analog Controls',
        description:
          'Wire rotary potentiometers as variable voltage dividers. Learn how to map input potentiometer readings to smooth actuator commands and volume controls.',
        duration: '30 min',
        objectives: [
          'Construct voltage dividers with 3-terminal variable resistors',
          'Apply the map() function to scale numbers across ranges',
          'Filter analog sensor jitter using moving-average algorithms',
        ],
        prerequisites: ['Path A: Microcontroller Foundations'],
        experimentId: 'exp-03-potentiometer',
      },
      {
        id: 'lesson-b3-ultrasonic',
        title: '3. Ultrasonic Sensors & Echolocation',
        description:
          'Emit high-frequency 40 kHz acoustic pings to calculate obstacle distance using time-of-flight measurements and microsecond timers.',
        duration: '40 min',
        objectives: [
          'Generate clean 10-microsecond trigger pulses',
          'Measure echo flight time using pulseIn()',
          'Convert sound flight time into metric distance (cm)',
        ],
        prerequisites: ['1. Push Buttons & Pull-up Resistors'],
        experimentId: 'exp-04-ultrasonic',
      },
      {
        id: 'lesson-b4-dht11',
        title: '4. Temperature & Humidity Sensors',
        description:
          'Interface capacitive humidity and thermistor temperature sensors like the DHT11. Decode single-wire proprietary digital communication streams.',
        duration: '35 min',
        objectives: [
          'Understand proprietary 1-wire digital protocols',
          'Sample and verify checksum parity bits for data integrity',
          'Account for sensor thermal inertia and latency limits',
        ],
        prerequisites: ['1. Push Buttons & Pull-up Resistors'],
        experimentId: null,
      },
      {
        id: 'lesson-b5-buzzers-servos',
        title: '5. Buzzers, Motors & Servos',
        description:
          'Control mechanical rotation and acoustic tones. Drive piezo buzzers with tone() frequencies and position RC hobby servos between 0° and 180° with 50Hz PWM pulses.',
        duration: '45 min',
        objectives: [
          'Generate musical frequencies using hardware timer interrupts',
          'Control positional hobby servos using 1ms - 2ms pulse widths',
          'Isolate noisy inductive motor loads from delicate microcontroller logic',
        ],
        prerequisites: ['Path A: PWM Basics'],
        experimentId: null,
      },
    ],
  },
  {
    id: 'path-displays-comm',
    slug: 'displays-and-communication',
    title: 'Path C — Displays and Communication',
    subtitle: 'Visual interfaces and master-to-slave bus protocols (I2C, SPI, UART)',
    description:
      'Elevate your projects with high-density visual displays and multi-chip communication. Understand the electrical and protocol layers of I2C, SPI, and UART buses.',
    difficulty: 'Intermediate',
    level: 3,
    icon: 'Monitor',
    badge: 'Protocol Deep-Dive',
    color: '#D97706',
    estimatedHours: '3.5 hours',
    totalLessons: 4,
    lessons: [
      {
        id: 'lesson-c1-oled-displays',
        title: '1. OLED Displays & Graphic Framebuffers',
        description:
          'Wire an SSD1306 monochrome 128x64 pixel screen. Learn how RAM framebuffers operate, and draw geometric shapes, text strings, and live telemetry dashboards.',
        duration: '45 min',
        objectives: [
          'Allocate and update 1024-byte monochrome framebuffers in RAM',
          'Render text, lines, rectangles, and custom bitmap icons',
          'Optimize screen refresh cycles without blocking the CPU',
        ],
        prerequisites: ['Path A: Microcontroller Foundations'],
        experimentId: 'exp-05-oled',
      },
      {
        id: 'lesson-c2-i2c-fundamentals',
        title: '2. I2C Bus Architecture (Inter-Integrated Circuit)',
        description:
          'Understand how multiple peripheral ICs share just two physical wires (SDA and SCL) using 7-bit device addressing, open-drain drivers, and pull-up resistors.',
        duration: '40 min',
        objectives: [
          'Examine start/stop conditions, ACK/NACK bits, and clock stretching',
          'Run I2C address scanner code to detect connected peripherals',
          'Calculate pull-up resistance values based on bus capacitance and speed',
        ],
        prerequisites: ['1. OLED Displays & Graphic Framebuffers'],
        experimentId: 'exp-05-oled',
      },
      {
        id: 'lesson-c3-spi-fundamentals',
        title: '3. SPI Bus Architecture (Serial Peripheral Interface)',
        description:
          'Learn high-speed synchronous communication using 4 wires: MOSI, MISO, SCK, and dedicated Chip Select (CS) lines for megahertz data throughput.',
        duration: '35 min',
        objectives: [
          'Compare SPI throughput and full-duplex operation against I2C',
          'Manage multiple slave devices with dedicated Chip Select lines',
          'Understand SPI clock polarity (CPOL) and clock phase (CPHA) modes',
        ],
        prerequisites: ['2. I2C Bus Architecture'],
        experimentId: null,
      },
      {
        id: 'lesson-c4-uart-serial',
        title: '4. UART & Hardware Serial',
        description:
          'Master point-to-point asynchronous serial communication between two microcontrollers or between a microcontroller and GPS, Bluetooth, or cellular modems.',
        duration: '30 min',
        objectives: [
          'Understand start bits, stop bits, and baud rate clock synchronization',
          'Use hardware UART FIFO buffers to prevent buffer overrun errors',
          'Parse incoming command strings and delimited data packets',
        ],
        prerequisites: ['Path A: Serial Monitor & Debugging'],
        experimentId: null,
      },
    ],
  },
  {
    id: 'path-iot',
    slug: 'iot-foundations',
    title: 'Path D — IoT Foundations',
    subtitle: 'Connect devices to the cloud: Wi-Fi, HTTP, MQTT, and telemetry dashboards',
    description:
      'Turn standalone circuits into connected IoT nodes using the ESP32. Connect to local Wi-Fi, run lightweight embedded web servers, and transmit telemetry to cloud dashboards.',
    difficulty: 'Advanced',
    level: 4,
    icon: 'Wifi',
    badge: 'Connected Systems',
    color: '#8B5CF6',
    estimatedHours: '4.5 hours',
    totalLessons: 4,
    lessons: [
      {
        id: 'lesson-d1-esp32-wifi',
        title: '1. ESP32 Wi-Fi Architecture & Modes',
        description:
          'Understand the radio hardware inside the ESP32. Learn how station mode (STA), access point mode (AP), and hybrid modes allow microcontrollers to join networks or host their own.',
        duration: '35 min',
        objectives: [
          'Configure Wi-Fi credentials safely and handle connection events',
          'Distinguish between Station (STA) and Access Point (AP) modes',
          'Read IP addresses, MAC addresses, and signal strength (RSSI)',
        ],
        prerequisites: ['Path A: Microcontroller Foundations'],
        experimentId: null,
      },
      {
        id: 'lesson-d2-network-connection',
        title: '2. Embedded HTTP Web Servers',
        description:
          'Host a lightweight interactive web server directly inside the ESP32 Flash and RAM. Serve HTML/CSS pages to any phone or laptop on your local Wi-Fi.',
        duration: '45 min',
        objectives: [
          'Listen on port 80 and parse incoming HTTP GET/POST requests',
          'Serve dynamic HTML with real-time sensor variables injected',
          'Create web buttons to toggle physical GPIO pins over Wi-Fi',
        ],
        prerequisites: ['1. ESP32 Wi-Fi Architecture & Modes'],
        experimentId: null,
      },
      {
        id: 'lesson-d3-sending-sensor-data',
        title: '3. Transmitting Sensor Telemetry (REST APIs)',
        description:
          'Use HTTP client libraries to package local sensor readings into JSON payloads and POST them to cloud APIs, Google Sheets, or webhook endpoints.',
        duration: '40 min',
        objectives: [
          'Format sensor data into lightweight JSON packets',
          'Execute HTTPS POST requests with authorization headers',
          'Handle network timeouts and implement reconnection retry backoffs',
        ],
        prerequisites: ['2. Embedded HTTP Web Servers'],
        experimentId: null,
      },
      {
        id: 'lesson-d4-iot-monitoring',
        title: '4. Real-time IoT Dashboards & MQTT',
        description:
          'Explore publish/subscribe messaging using the lightweight MQTT protocol. Stream high-speed sensor feeds to real-time cloud dashboards without polling overhead.',
        duration: '50 min',
        objectives: [
          'Understand MQTT brokers, topics, publishers, and subscribers',
          'Publish sensor telemetry with Quality of Service (QoS) guarantees',
          'Build cloud dashboard widgets to monitor embedded devices remotely',
        ],
        prerequisites: ['3. Transmitting Sensor Telemetry (REST APIs)'],
        experimentId: null,
      },
    ],
  },
]

export default learningPaths
