/**
 * Virtual electronic component definitions for Onboard.
 * Includes pin mappings, physical specs, simulation compatibility,
 * and standard connection guides for ESP32, Arduino Uno, and Raspberry Pi Pico.
 */

export const components = [
  {
    id: 'led-red',
    name: 'Red LED (5mm)',
    shortName: 'Red LED',
    category: 'output',
    icon: 'Lightbulb',
    color: '#E02424',
    description:
      'Standard 5mm diffused red light emitting diode. Converts electrical energy into light when forward biased. Always pair with a current-limiting resistor (e.g. 220Ω - 330Ω) to avoid burning out.',
    specs: {
      forwardVoltage: '1.8V - 2.2V',
      forwardCurrent: '20mA (max 30mA)',
      wavelength: '620 - 625nm',
      polar: true,
    },
    pins: [
      { name: 'Anode (+)', type: 'signal', description: 'Longer leg; connect to positive voltage (via current-limiting resistor)' },
      { name: 'Cathode (-)', type: 'ground', description: 'Shorter leg / flat edge; connect to Ground (0V)' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { anode: 'D2 (via 220Ω)', cathode: 'GND' },
      'arduino-uno-r3': { anode: 'D13 (via 220Ω)', cathode: 'GND' },
      'raspberry-pi-pico': { anode: 'GP15 (via 220Ω)', cathode: 'GND' },
    },
  },
  {
    id: 'led-green',
    name: 'Green LED (5mm)',
    shortName: 'Green LED',
    category: 'output',
    icon: 'Lightbulb',
    color: '#057A55',
    description:
      'Standard 5mm diffused green LED. Forward voltage is slightly higher than red (~2.1V). Commonly used for "ready", "pass", or active status indicators.',
    specs: {
      forwardVoltage: '2.0V - 2.4V',
      forwardCurrent: '20mA',
      wavelength: '520 - 530nm',
      polar: true,
    },
    pins: [
      { name: 'Anode (+)', type: 'signal', description: 'Longer leg; connect to positive voltage / GPIO via resistor' },
      { name: 'Cathode (-)', type: 'ground', description: 'Shorter leg; connect to Ground' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { anode: 'D4 (via 220Ω)', cathode: 'GND' },
      'arduino-uno-r3': { anode: 'D12 (via 220Ω)', cathode: 'GND' },
      'raspberry-pi-pico': { anode: 'GP14 (via 220Ω)', cathode: 'GND' },
    },
  },
  {
    id: 'resistor-220',
    name: '220Ω Resistor',
    shortName: '220Ω Resistor',
    category: 'passive',
    icon: 'Activity',
    color: '#C0652D',
    description:
      'Standard 1/4W carbon film resistor (Red-Red-Brown-Gold). Crucial for protecting LEDs from excessive current when powered by 3.3V or 5V logic lines.',
    specs: {
      resistance: '220 Ω',
      tolerance: '±5%',
      powerRating: '0.25 W (1/4W)',
      polar: false,
    },
    pins: [
      { name: 'Pin 1', type: 'passive', description: 'Terminal 1 (bidirectional)' },
      { name: 'Pin 2', type: 'passive', description: 'Terminal 2 (bidirectional)' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { pin1: 'GPIO Output', pin2: 'LED Anode' },
      'arduino-uno-r3': { pin1: 'GPIO Output', pin2: 'LED Anode' },
      'raspberry-pi-pico': { pin1: 'GPIO Output', pin2: 'LED Anode' },
    },
  },
  {
    id: 'resistor-10k',
    name: '10kΩ Resistor',
    shortName: '10kΩ Resistor',
    category: 'passive',
    icon: 'Activity',
    color: '#8B5CF6',
    description:
      'Standard 10k ohm resistor (Brown-Black-Orange-Gold). Ideal for pull-up and pull-down configurations with push buttons and sensors to prevent floating inputs.',
    specs: {
      resistance: '10 kΩ (10,000 Ω)',
      tolerance: '±5%',
      powerRating: '0.25 W',
      polar: false,
    },
    pins: [
      { name: 'Pin 1', type: 'passive', description: 'Terminal 1' },
      { name: 'Pin 2', type: 'passive', description: 'Terminal 2' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { pin1: 'GPIO (Button line)', pin2: 'GND (Pull-down)' },
      'arduino-uno-r3': { pin1: 'GPIO (Button line)', pin2: '5V (Pull-up)' },
      'raspberry-pi-pico': { pin1: 'GPIO (Button line)', pin2: 'GND (Pull-down)' },
    },
  },
  {
    id: 'push-button',
    name: 'Push Button (Tactile Switch 6mm)',
    shortName: 'Push Button',
    category: 'input',
    icon: 'Square',
    color: '#18213D',
    description:
      'Momentary normally-open tactile pushbutton. Connects its internal pins when pressed and springs open when released. Used for digital input triggers.',
    specs: {
      contactType: 'Normally Open (SPST-NO)',
      contactRating: '50mA @ 12V DC',
      bounceTime: 'Typically 5ms - 10ms (requires debouncing in code)',
      polar: false,
    },
    pins: [
      { name: 'Pin 1A', type: 'signal', description: 'Terminal A1 (internally bridged to 1B)' },
      { name: 'Pin 1B', type: 'signal', description: 'Terminal A2 (internally bridged to 1A)' },
      { name: 'Pin 2A', type: 'ground', description: 'Terminal B1 (connects to 1A when pressed)' },
      { name: 'Pin 2B', type: 'ground', description: 'Terminal B2 (connects to 1B when pressed)' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { 'Pin 1A': 'D4', 'Pin 2A': 'GND (using INPUT_PULLUP)' },
      'arduino-uno-r3': { 'Pin 1A': 'D2', 'Pin 2A': 'GND (using INPUT_PULLUP)' },
      'raspberry-pi-pico': { 'Pin 1A': 'GP16', 'Pin 2A': 'GND (using PULL_UP)' },
    },
  },
  {
    id: 'potentiometer',
    name: 'Rotary Potentiometer (10kΩ)',
    shortName: 'Potentiometer',
    category: 'input',
    icon: 'Sliders',
    color: '#0891B2',
    description:
      'Three-terminal variable resistor with a rotating shaft. Acts as an adjustable voltage divider, yielding an analog voltage output from 0V to VCC proportional to shaft angle.',
    specs: {
      totalResistance: '10 kΩ',
      taper: 'Linear (Type B)',
      rotationAngle: '300 degrees',
      polar: false,
    },
    pins: [
      { name: 'Terminal 1 (VCC)', type: 'power', description: 'Connect to 3.3V or 5V rail' },
      { name: 'Wiper (Signal)', type: 'signal', description: 'Variable output voltage (connect to ADC pin)' },
      { name: 'Terminal 2 (GND)', type: 'ground', description: 'Connect to Ground (0V)' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { 'VCC': '3V3', 'Wiper': 'D34 (ADC1_CH6)', 'GND': 'GND' },
      'arduino-uno-r3': { 'VCC': '5V', 'Wiper': 'A0', 'GND': 'GND' },
      'raspberry-pi-pico': { 'VCC': '3V3(OUT)', 'Wiper': 'GP26_ADC0', 'GND': 'AGND' },
    },
  },
  {
    id: 'hc-sr04',
    name: 'HC-SR04 Ultrasonic Distance Sensor',
    shortName: 'Ultrasonic Sensor',
    category: 'sensor',
    icon: 'Radio',
    color: '#2A56A3',
    description:
      'High-precision non-contact ultrasonic distance measuring module. Emits 40 kHz acoustic burst pulses and measures echo flight time to calculate distances between 2cm and 400cm.',
    specs: {
      workingVoltage: '5V DC',
      workingCurrent: '15mA',
      ultrasonicFrequency: '40 kHz',
      rangingDistance: '2cm - 400cm',
      measuringAngle: '15 degrees',
      triggerPulseWidth: '10µs TTL pulse',
    },
    pins: [
      { name: 'VCC', type: 'power', description: 'Power supply (5.0V DC)' },
      { name: 'Trig', type: 'signal', description: 'Trigger input pulse (10µs HIGH)' },
      { name: 'Echo', type: 'signal', description: 'Echo output pulse width = flight time' },
      { name: 'GND', type: 'ground', description: 'Ground' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { VCC: 'VIN (5V)', Trig: 'D5', Echo: 'D18 (via voltage divider)', GND: 'GND' },
      'arduino-uno-r3': { VCC: '5V', Trig: 'D9', Echo: 'D10', GND: 'GND' },
      'raspberry-pi-pico': { VCC: 'VBUS (5V)', Trig: 'GP3', Echo: 'GP2 (via voltage divider)', GND: 'GND' },
    },
  },
  {
    id: 'ssd1306-oled',
    name: 'SSD1306 OLED Display (128x64 I2C)',
    shortName: 'OLED Display',
    category: 'display',
    icon: 'Monitor',
    color: '#1E293B',
    description:
      '0.96-inch monochrome 128x64 dot-matrix OLED screen. Communicates over I2C requiring only two data wires (SDA & SCL). Self-illuminating without needing a backlight.',
    specs: {
      resolution: '128 x 64 pixels',
      driverIC: 'SSD1306',
      interface: 'I2C (Default Address: 0x3C or 0x3D)',
      supplyVoltage: '3.3V - 5.0V DC',
      viewingAngle: '> 160 degrees',
    },
    pins: [
      { name: 'GND', type: 'ground', description: 'Ground (0V)' },
      { name: 'VCC', type: 'power', description: 'Power input (3.3V or 5V)' },
      { name: 'SCL', type: 'data', description: 'I2C Clock line' },
      { name: 'SDA', type: 'data', description: 'I2C Data line' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { GND: 'GND', VCC: '3V3', SCL: 'D22', SDA: 'D21' },
      'arduino-uno-r3': { GND: 'GND', VCC: '5V', SCL: 'A5 (SCL)', SDA: 'A4 (SDA)' },
      'raspberry-pi-pico': { GND: 'GND', VCC: '3V3', SCL: 'GP5 (I2C0 SCL)', SDA: 'GP4 (I2C0 SDA)' },
    },
  },
  {
    id: 'buzzer-piezo',
    name: 'Piezo Buzzer (Passive)',
    shortName: 'Piezo Buzzer',
    category: 'output',
    icon: 'Volume2',
    color: '#D97706',
    description:
      'A piezoelectric transducer element capable of generating musical tones and alert beeps when driven by PWM frequencies from 200 Hz to 10 kHz.',
    specs: {
      operatingVoltage: '3V - 12V',
      resonantFrequency: '2 kHz - 4 kHz',
      soundPressureLevel: '> 85dB at 10cm',
      polar: true,
    },
    pins: [
      { name: 'Positive (+)', type: 'signal', description: 'Connect to PWM pin' },
      { name: 'Negative (-)', type: 'ground', description: 'Connect to Ground' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { '+': 'D13', '-': 'GND' },
      'arduino-uno-r3': { '+': 'D8', '-': 'GND' },
      'raspberry-pi-pico': { '+': 'GP14', '-': 'GND' },
    },
  },
  {
    id: 'servo-sg90',
    name: 'Micro Servo Motor (SG90)',
    shortName: 'SG90 Servo',
    category: 'output',
    icon: 'RotateCw',
    color: '#2563EB',
    description:
      'Small 9g positional servo motor capable of rotating approximately 180 degrees. Position is commanded using standard 50Hz PWM signals with 1ms to 2ms pulse widths.',
    specs: {
      weight: '9 grams',
      operatingVoltage: '4.8V - 6.0V',
      stallTorque: '1.8 kg/cm (at 4.8V)',
      operatingSpeed: '0.1s / 60 degrees',
      angleRange: '0 to 180 degrees',
    },
    pins: [
      { name: 'GND (Brown)', type: 'ground', description: 'Ground rail' },
      { name: 'VCC (Red)', type: 'power', description: 'Power rail (5.0V recommended)' },
      { name: 'PWM (Orange)', type: 'signal', description: '50Hz PWM command signal' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { GND: 'GND', VCC: 'VIN (5V)', PWM: 'D13' },
      'arduino-uno-r3': { GND: 'GND', VCC: '5V', PWM: 'D9' },
      'raspberry-pi-pico': { GND: 'GND', VCC: 'VBUS (5V)', PWM: 'GP15' },
    },
  },
  {
    id: 'dht11-sensor',
    name: 'DHT11 Temperature & Humidity Sensor',
    shortName: 'DHT11 Sensor',
    category: 'sensor',
    icon: 'Thermometer',
    color: '#0D9488',
    description:
      'Basic digital composite sensor providing calibrated temperature and relative humidity readings over a custom single-wire serial protocol.',
    specs: {
      supplyVoltage: '3.3V - 5.5V',
      temperatureRange: '0°C to 50°C (±2°C)',
      humidityRange: '20% to 90% RH (±5%)',
      samplingRate: '1 Hz (one sample per second)',
    },
    pins: [
      { name: 'VCC', type: 'power', description: '3.3V - 5V power supply' },
      { name: 'DATA', type: 'data', description: 'Single-wire bidirectional data line' },
      { name: 'NC', type: 'passive', description: 'No Connection' },
      { name: 'GND', type: 'ground', description: 'Ground' },
    ],
    simulationSupported: true,
    commonConnections: {
      'esp32-devkit-v1': { VCC: '3V3', DATA: 'D4', GND: 'GND' },
      'arduino-uno-r3': { VCC: '5V', DATA: 'D7', GND: 'GND' },
      'raspberry-pi-pico': { VCC: '3V3', DATA: 'GP16', GND: 'GND' },
    },
  },
  {
    id: 'breadboard-half',
    name: 'Half-Size Breadboard (400 Tie Points)',
    shortName: 'Breadboard',
    category: 'passive',
    icon: 'Grid',
    color: '#FAF4E9',
    description:
      'Solderless prototyping breadboard with 30 terminal rows of 5 interconnected sockets each, flanked by two dual-rail power distribution buses (+ and -).',
    specs: {
      tiePoints: 400,
      pitch: '2.54mm (0.1 inch standard)',
      powerRails: '2 distribution rails (+ / -)',
      maxCurrent: '1.5A per bus',
    },
    pins: [
      { name: 'Power Bus (+)', type: 'power', description: 'Longitudinal positive rail' },
      { name: 'Ground Bus (-)', type: 'ground', description: 'Longitudinal ground rail' },
    ],
    simulationSupported: true,
    commonConnections: {},
  },
]

export default components

