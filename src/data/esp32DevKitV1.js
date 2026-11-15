/**
 * Verified Hardware Specification: ESP32 DevKit V1 (30-pin variant)
 * Conforms to Section 5D, Section 10 (BoardVariant, BoardPin), and Section 16 (Prompt 5)
 * of ONBOARD Product Architecture & MVP Specification.
 *
 * Exact Board Identification:
 * - Manufacturer: Espressif / DOIT
 * - Module: ESP-WROOM-32
 * - Revision: 30-Pin DevKit V1 (2x15 headers, 25.4mm / 1.0" pitch width)
 * - Microcontroller: Tensilica Xtensa Dual-Core 32-bit LX6 @ 240 MHz
 * - Operating Voltage: 3.3V Logic (Inputs are NOT 5V tolerant!)
 */

export const ESP32_DEVKIT_V1_SPEC = {
  id: 'esp32-devkit-v1',
  slug: 'esp32-devkit-v1',
  name: 'ESP32 DevKit V1',
  variant: '30-Pin DOIT DevKit V1',
  manufacturer: 'Espressif Systems / DOIT',
  chip: 'ESP-WROOM-32',
  architecture: 'Xtensa Dual-Core 32-bit LX6',
  clockSpeed: '240 MHz',
  flash: '4 MB SPI Flash',
  sram: '520 KB SRAM',
  logicVoltage: '3.3V',
  inputVoltage: '5V via Micro-USB or 5V-12V via VIN',
  totalPins: 30,
  pinsPerSide: 15,
  documentationUrl: 'https://docs.espressif.com/projects/esp-idf/en/latest/esp32/hw-reference/esp32/user-guide-devkitv1.html',
  description:
    'The standard 30-pin breadboard-compatible ESP32 development board. Features integrated Wi-Fi, Bluetooth BLE, dual-core processing, hardware capacitive touch, and 12-bit ADC channels.',
};

/**
 * Verified 30-Pin Pinout Map (Numbered Left 1-15, Right 16-30 facing board with USB at bottom)
 */
export const ESP32_DEVKIT_V1_PINS = [
  // ─── LEFT HEADER (Pins 1 to 15, Top to Bottom) ───
  {
    pinNumber: 1,
    side: 'left',
    label: 'EN',
    gpio: null,
    category: 'control',
    types: ['control', 'reset'],
    primaryRole: 'Chip Enable / Hardware Reset',
    description: 'Active-low hardware reset line with internal pull-up. Pulling to GND restarts the ESP32.',
    capabilities: ['Active-Low Hardware Reset', 'Connected to EN tactile button'],
    warnings: ['Do not apply voltages higher than 3.3V.'],
    electricalLimits: '3.3V logic level max. Pulled HIGH to 3.3V internally.',
    lessonLinks: [
      { lessonId: 'lesson-0-welcome', title: 'Welcome to Onboard', context: 'Board reset behavior' },
    ],
  },
  {
    pinNumber: 2,
    side: 'left',
    label: 'VP',
    gpio: 36,
    category: 'input_only',
    types: ['gpio', 'adc', 'input_only'],
    primaryRole: 'GPIO 36 / ADC1_CH0 / Sensor VP',
    description: 'Dedicated low-noise analog input. Connected to the low-noise amplifier of the ESP32.',
    capabilities: ['12-bit ADC Channel (ADC1_CH0)', 'Low-Noise Sensor Input'],
    warnings: [
      'INPUT ONLY! Cannot be configured as digital output.',
      'No internal pull-up or pull-down resistors available.',
      'Safe with Wi-Fi active (uses ADC1, not ADC2).',
    ],
    electricalLimits: '0V to 3.3V max input voltage (ADC input range).',
    lessonLinks: [
      { lessonId: 'lesson-1-voltage-current', title: 'Voltage and Current', context: 'Analog sensor measurements' },
    ],
  },
  {
    pinNumber: 3,
    side: 'left',
    label: 'VN',
    gpio: 39,
    category: 'input_only',
    types: ['gpio', 'adc', 'input_only'],
    primaryRole: 'GPIO 39 / ADC1_CH3 / Sensor VN',
    description: 'Low-noise analog input channel, counterpart to Sensor VP.',
    capabilities: ['12-bit ADC Channel (ADC1_CH3)', 'Low-Noise Sensor Input'],
    warnings: [
      'INPUT ONLY! Cannot be configured as digital output.',
      'No internal pull-up or pull-down resistors.',
      'Safe with Wi-Fi active (uses ADC1).',
    ],
    electricalLimits: '0V to 3.3V max analog input voltage.',
    lessonLinks: [],
  },
  {
    pinNumber: 4,
    side: 'left',
    label: 'D34',
    gpio: 34,
    category: 'input_only',
    types: ['gpio', 'adc', 'input_only'],
    primaryRole: 'GPIO 34 / ADC1_CH6',
    description: 'General purpose analog/digital input pin.',
    capabilities: ['Digital Input', '12-bit ADC Channel (ADC1_CH6)'],
    warnings: [
      'INPUT ONLY! Cannot be used as an output.',
      'No internal software pull-up/pull-down resistor.',
      'Requires external pull resistor for push-button use.',
    ],
    electricalLimits: '3.3V logic max. 0V to 3.3V analog input range.',
    lessonLinks: [],
  },
  {
    pinNumber: 5,
    side: 'left',
    label: 'D35',
    gpio: 35,
    category: 'input_only',
    types: ['gpio', 'adc', 'input_only'],
    primaryRole: 'GPIO 35 / ADC1_CH7',
    description: 'General purpose analog/digital input pin.',
    capabilities: ['Digital Input', '12-bit ADC Channel (ADC1_CH7)'],
    warnings: [
      'INPUT ONLY! Cannot be used as an output.',
      'No internal software pull-up/pull-down resistor.',
    ],
    electricalLimits: '3.3V logic max. 0V to 3.3V analog input range.',
    lessonLinks: [],
  },
  {
    pinNumber: 6,
    side: 'left',
    label: 'D32',
    gpio: 32,
    category: 'gpio',
    types: ['gpio', 'adc', 'touch', 'pwm'],
    primaryRole: 'GPIO 32 / ADC1_CH4 / Touch 9',
    description: 'Fully featured general-purpose digital input/output, touch sensor, and ADC pin.',
    capabilities: ['Digital Input & Output', 'PWM Output', '12-bit ADC (ADC1_CH4)', 'Capacitive Touch 9', 'Internal Pull-up/Pull-down'],
    warnings: ['Safe with Wi-Fi active (uses ADC1). Recommended for sensors.'],
    electricalLimits: '3.3V logic. Max current drive 12mA (recommended), 40mA absolute max.',
    lessonLinks: [],
  },
  {
    pinNumber: 7,
    side: 'left',
    label: 'D33',
    gpio: 33,
    category: 'gpio',
    types: ['gpio', 'adc', 'touch', 'pwm'],
    primaryRole: 'GPIO 33 / ADC1_CH5 / Touch 8',
    description: 'Fully featured general-purpose digital I/O, touch sensor, and ADC pin.',
    capabilities: ['Digital Input & Output', 'PWM Output', '12-bit ADC (ADC1_CH5)', 'Capacitive Touch 8', 'Internal Pull-up/Pull-down'],
    warnings: ['Safe with Wi-Fi active (ADC1).'],
    electricalLimits: '3.3V logic. 12mA recommended drive current.',
    lessonLinks: [],
  },
  {
    pinNumber: 8,
    side: 'left',
    label: 'D25',
    gpio: 25,
    category: 'gpio',
    types: ['gpio', 'dac', 'adc', 'pwm'],
    primaryRole: 'GPIO 25 / DAC1 / ADC2_CH8',
    description: 'True analog output via Digital-to-Analog Converter (DAC Channel 1).',
    capabilities: ['True 8-bit Analog Voltage Output (DAC1)', 'Digital I/O', 'PWM', 'ADC2_CH8'],
    warnings: ['ADC2 cannot be read while Wi-Fi is actively transmitting. DAC output functions independently.'],
    electricalLimits: 'Outputs 0V to 3.3V true analog voltage across 256 steps (0-255).',
    lessonLinks: [],
  },
  {
    pinNumber: 9,
    side: 'left',
    label: 'D26',
    gpio: 26,
    category: 'gpio',
    types: ['gpio', 'dac', 'adc', 'pwm'],
    primaryRole: 'GPIO 26 / DAC2 / ADC2_CH9',
    description: 'True analog output via Digital-to-Analog Converter (DAC Channel 2).',
    capabilities: ['True 8-bit Analog Voltage Output (DAC2)', 'Digital I/O', 'PWM', 'ADC2_CH9'],
    warnings: ['ADC2 channels conflict with Wi-Fi driver. DAC mode is unaffected.'],
    electricalLimits: 'Outputs 0V to 3.3V true analog voltage.',
    lessonLinks: [],
  },
  {
    pinNumber: 10,
    side: 'left',
    label: 'D27',
    gpio: 27,
    category: 'gpio',
    types: ['gpio', 'adc', 'touch', 'pwm'],
    primaryRole: 'GPIO 27 / ADC2_CH7 / Touch 7',
    description: 'Versatile general-purpose I/O pin.',
    capabilities: ['Digital I/O', 'PWM', 'ADC2_CH7', 'Capacitive Touch 7'],
    warnings: ['ADC2 conflicts with Wi-Fi driver.'],
    electricalLimits: '3.3V logic. Max current 12mA.',
    lessonLinks: [],
  },
  {
    pinNumber: 11,
    side: 'left',
    label: 'D14',
    gpio: 14,
    category: 'gpio',
    types: ['gpio', 'adc', 'touch', 'pwm', 'spi'],
    primaryRole: 'GPIO 14 / ADC2_CH6 / Touch 6 / HSPI_CLK',
    description: 'General purpose I/O and HSPI clock pin.',
    capabilities: ['Digital I/O', 'PWM', 'ADC2_CH6', 'Capacitive Touch 6', 'HSPI Clock'],
    warnings: ['Outputs PWM clock signal briefly during boot.'],
    electricalLimits: '3.3V logic level.',
    lessonLinks: [],
  },
  {
    pinNumber: 12,
    side: 'left',
    label: 'D12',
    gpio: 12,
    category: 'gpio',
    types: ['gpio', 'adc', 'touch', 'pwm', 'strapping'],
    primaryRole: 'GPIO 12 / ADC2_CH5 / Strapping Pin',
    description: 'Strapping pin (MTDI) controlling internal flash voltage during boot.',
    capabilities: ['Digital I/O', 'PWM', 'ADC2_CH5', 'Capacitive Touch 5'],
    warnings: [
      'CRITICAL STRAPPING PIN: Must NOT be driven HIGH during power-on or reset!',
      'Driving GPIO 12 HIGH on boot switches flash voltage to 1.8V, preventing boot.',
    ],
    electricalLimits: '3.3V logic. Leave floating or pulled LOW at boot.',
    lessonLinks: [],
  },
  {
    pinNumber: 13,
    side: 'left',
    label: 'D13',
    gpio: 13,
    category: 'gpio',
    types: ['gpio', 'adc', 'touch', 'pwm', 'spi'],
    primaryRole: 'GPIO 13 / ADC2_CH4 / Touch 4 / HSPI_MOSI',
    description: 'General purpose I/O and HSPI data line.',
    capabilities: ['Digital I/O', 'PWM', 'ADC2_CH4', 'Capacitive Touch 4', 'HSPI MOSI'],
    warnings: ['ADC2 unavailable when Wi-Fi is active.'],
    electricalLimits: '3.3V logic.',
    lessonLinks: [],
  },
  {
    pinNumber: 14,
    side: 'left',
    label: 'GND',
    gpio: null,
    category: 'ground',
    types: ['ground'],
    primaryRole: 'Ground (0V Reference)',
    description: 'System ground connection. Connect component negative/cathodes here.',
    capabilities: ['0V System Ground', 'Common reference for power and signals'],
    warnings: ['Always connect circuit grounds together (common ground rule).'],
    electricalLimits: '0V reference potential.',
    lessonLinks: [
      { lessonId: 'lesson-0-circuit-intro', title: 'What is a Circuit?', context: 'Closing the loop to ground' },
    ],
  },
  {
    pinNumber: 15,
    side: 'left',
    label: 'VIN',
    gpio: null,
    category: 'power',
    types: ['power'],
    primaryRole: 'External 5V Power Input / USB 5V Output',
    description: 'Directly connected to the USB 5V rail (via Schottky diode) and voltage regulator input.',
    capabilities: ['External 5V Input', '5V Output when powered via USB'],
    warnings: [
      'DANGER: 5V rail! Connecting 5V directly to any GPIO pin will destroy the ESP32!',
      'Only use to power external 5V modules (e.g. 5V relays, ultrasonic sensors).',
    ],
    electricalLimits: '5V nominal (accepts 5V-9V regulated DC external input).',
    lessonLinks: [
      { lessonId: 'lesson-1-voltage-current', title: 'Voltage and Current', context: 'Power supply vs logic levels' },
    ],
  },

  // ─── RIGHT HEADER (Pins 16 to 30, Top to Bottom) ───
  {
    pinNumber: 16,
    side: 'right',
    label: 'D23',
    gpio: 23,
    category: 'gpio',
    types: ['gpio', 'pwm', 'spi'],
    primaryRole: 'GPIO 23 / VSPI_MOSI',
    description: 'Default Master-Out-Slave-In pin for standard VSPI bus (displays, SD cards).',
    capabilities: ['Digital I/O', 'PWM', 'Default VSPI MOSI'],
    warnings: ['Excellent, safe general-purpose output pin.'],
    electricalLimits: '3.3V logic level.',
    lessonLinks: [],
  },
  {
    pinNumber: 17,
    side: 'right',
    label: 'D22',
    gpio: 22,
    category: 'gpio',
    types: ['gpio', 'i2c', 'pwm'],
    primaryRole: 'GPIO 22 / Default I2C SCL (Clock)',
    description: 'Hardware I2C clock line for sensors, OLED displays, and expanders.',
    capabilities: ['Digital I/O', 'Hardware I2C SCL Clock', 'PWM'],
    warnings: ['Requires I2C pull-up resistors (typically included on breakout boards).'],
    electricalLimits: '3.3V logic.',
    lessonLinks: [],
  },
  {
    pinNumber: 18,
    side: 'right',
    label: 'TX0',
    gpio: 1,
    category: 'gpio',
    types: ['gpio', 'uart'],
    primaryRole: 'GPIO 1 / U0_TXD (Serial Transmit)',
    description: 'Connected directly to on-board USB-to-UART bridge (CP2102/CH340).',
    capabilities: ['Hardware UART0 TX', 'Serial Debug Output (Serial.print)'],
    warnings: [
      'Connected to USB chip! Do not use as general I/O if you need Serial monitor or code upload.',
      'Transmits bootloader logs on startup at 115200 baud.',
    ],
    electricalLimits: '3.3V logic level.',
    lessonLinks: [
      { lessonId: 'lesson-0-welcome', title: 'Welcome to Onboard', context: 'Serial monitoring' },
    ],
  },
  {
    pinNumber: 19,
    side: 'right',
    label: 'RX0',
    gpio: 3,
    category: 'gpio',
    types: ['gpio', 'uart'],
    primaryRole: 'GPIO 3 / U0_RXD (Serial Receive)',
    description: 'Connected directly to on-board USB-to-UART bridge for programming.',
    capabilities: ['Hardware UART0 RX', 'Serial Input Receiver'],
    warnings: ['Connected to USB chip! Using as general I/O blocks firmware flashing.'],
    electricalLimits: '3.3V logic level.',
    lessonLinks: [],
  },
  {
    pinNumber: 20,
    side: 'right',
    label: 'D21',
    gpio: 21,
    category: 'gpio',
    types: ['gpio', 'i2c', 'pwm'],
    primaryRole: 'GPIO 21 / Default I2C SDA (Data)',
    description: 'Hardware I2C serial data line for displays and sensors.',
    capabilities: ['Digital I/O', 'Hardware I2C SDA Data', 'PWM'],
    warnings: ['Requires I2C pull-up resistors on the bus.'],
    electricalLimits: '3.3V logic.',
    lessonLinks: [],
  },
  {
    pinNumber: 21,
    side: 'right',
    label: 'D19',
    gpio: 19,
    category: 'gpio',
    types: ['gpio', 'pwm', 'spi'],
    primaryRole: 'GPIO 19 / VSPI_MISO',
    description: 'Default Master-In-Slave-Out line for VSPI bus.',
    capabilities: ['Digital I/O', 'PWM', 'Default VSPI MISO'],
    warnings: ['Safe, general-purpose pin.'],
    electricalLimits: '3.3V logic.',
    lessonLinks: [],
  },
  {
    pinNumber: 22,
    side: 'right',
    label: 'D18',
    gpio: 18,
    category: 'gpio',
    types: ['gpio', 'pwm', 'spi'],
    primaryRole: 'GPIO 18 / VSPI_SCK',
    description: 'Default Serial Clock line for VSPI bus.',
    capabilities: ['Digital I/O', 'PWM', 'Default VSPI Clock'],
    warnings: ['Safe, general-purpose pin.'],
    electricalLimits: '3.3V logic.',
    lessonLinks: [],
  },
  {
    pinNumber: 23,
    side: 'right',
    label: 'D5',
    gpio: 5,
    category: 'gpio',
    types: ['gpio', 'pwm', 'spi', 'strapping'],
    primaryRole: 'GPIO 5 / VSPI_CS / Strapping Pin',
    description: 'Strapping pin that outputs PWM signal briefly during chip boot.',
    capabilities: ['Digital I/O', 'PWM', 'Default VSPI Chip Select'],
    warnings: [
      'Strapping pin: Must be HIGH during boot (has internal pull-up).',
      'Briefly pulses high during boot; avoid connecting to sensitive relays.',
    ],
    electricalLimits: '3.3V logic.',
    lessonLinks: [],
  },
  {
    pinNumber: 24,
    side: 'right',
    label: 'TX2',
    gpio: 17,
    category: 'gpio',
    types: ['gpio', 'uart', 'pwm'],
    primaryRole: 'GPIO 17 / U2_TXD',
    description: 'Hardware UART2 Transmit pin (free from USB serial interference).',
    capabilities: ['Hardware UART2 TX', 'Digital I/O', 'PWM'],
    warnings: ['Great secondary serial port for GPS, Bluetooth, or modems.'],
    electricalLimits: '3.3V logic.',
    lessonLinks: [],
  },
  {
    pinNumber: 25,
    side: 'right',
    label: 'RX2',
    gpio: 16,
    category: 'gpio',
    types: ['gpio', 'uart', 'pwm'],
    primaryRole: 'GPIO 16 / U2_RXD',
    description: 'Hardware UART2 Receive pin.',
    capabilities: ['Hardware UART2 RX', 'Digital I/O', 'PWM'],
    warnings: ['Safe secondary serial port.'],
    electricalLimits: '3.3V logic.',
    lessonLinks: [],
  },
  {
    pinNumber: 26,
    side: 'right',
    label: 'D4',
    gpio: 4,
    category: 'gpio',
    types: ['gpio', 'adc', 'touch', 'pwm'],
    primaryRole: 'GPIO 4 / ADC2_CH0 / Touch 0',
    description: 'General purpose I/O, touch sensor, and ADC channel.',
    capabilities: ['Digital I/O', 'PWM', 'Capacitive Touch 0', 'ADC2_CH0'],
    warnings: ['ADC2 unavailable with active Wi-Fi.'],
    electricalLimits: '3.3V logic.',
    lessonLinks: [],
  },
  {
    pinNumber: 27,
    side: 'right',
    label: 'D2',
    gpio: 2,
    category: 'gpio',
    types: ['gpio', 'led', 'touch', 'pwm', 'strapping'],
    primaryRole: 'GPIO 2 / On-board Blue LED / Strapping Pin',
    description: 'Connected directly to the onboard Blue LED and acts as a flashing strapping pin.',
    capabilities: [
      'Drives On-Board Blue LED (HIGH = ON)',
      'Digital I/O',
      'PWM',
      'Capacitive Touch 2',
      'ADC2_CH2',
    ],
    warnings: [
      'Connected to onboard blue LED through a series resistor.',
      'Strapping pin: Must be left floating or pulled LOW when entering bootloader flashing mode.',
      'Best pin for your very first "Blink" program!',
    ],
    electricalLimits: '3.3V logic. Max recommended current 12mA.',
    lessonLinks: [
      { lessonId: 'lesson-1-blink', title: 'Module 1: The Blink Experiment', context: 'Primary output pin driving the LED' },
    ],
  },
  {
    pinNumber: 28,
    side: 'right',
    label: 'D15',
    gpio: 15,
    category: 'gpio',
    types: ['gpio', 'pwm', 'touch', 'strapping'],
    primaryRole: 'GPIO 15 / Strapping Pin / Touch 3',
    description: 'Strapping pin controlling debug output during boot.',
    capabilities: ['Digital I/O', 'PWM', 'Capacitive Touch 3', 'ADC2_CH3'],
    warnings: ['Must be pulled HIGH on boot to enable silent boot (pulled high by default).'],
    electricalLimits: '3.3V logic.',
    lessonLinks: [],
  },
  {
    pinNumber: 29,
    side: 'right',
    label: 'GND',
    gpio: null,
    category: 'ground',
    types: ['ground'],
    primaryRole: 'Ground (0V Reference)',
    description: 'Second ground pin on the right header.',
    capabilities: ['0V System Ground', 'Common reference for power and signals'],
    warnings: ['Directly tied internally to Pin 14 GND.'],
    electricalLimits: '0V reference potential.',
    lessonLinks: [],
  },
  {
    pinNumber: 30,
    side: 'right',
    label: '3V3',
    gpio: null,
    category: 'power',
    types: ['power'],
    primaryRole: '3.3V Regulated Output (VREG)',
    description: 'Regulated 3.3V output from onboard low-dropout voltage regulator (AMS1117/ME6211).',
    capabilities: ['3.3V Regulated Power Output (max ~500mA)', 'Power rail for 3.3V breadboard components'],
    warnings: [
      'Do not short to GND or VIN!',
      'Max continuous current draw: 500mA total (including ESP32 chip which consumes ~150-250mA with Wi-Fi).',
    ],
    electricalLimits: '3.3V ± 2% output voltage.',
    lessonLinks: [
      { lessonId: 'lesson-0-circuit-intro', title: 'What is a Circuit?', context: 'Supplying 3.3V power' },
    ],
  },
];

/**
 * Filter / Search helper for board explorer
 */
export function searchPins(query = '', filterCategory = 'all') {
  const q = query.trim().toLowerCase();

  return ESP32_DEVKIT_V1_PINS.filter((pin) => {
    // Category filter
    if (filterCategory !== 'all') {
      if (filterCategory === 'power' && pin.category !== 'power' && pin.category !== 'ground') {
        return false;
      }
      if (filterCategory === 'input_only' && pin.category !== 'input_only') {
        return false;
      }
      if (filterCategory === 'analog' && !pin.types.includes('adc') && !pin.types.includes('dac')) {
        return false;
      }
      if (filterCategory === 'pwm' && !pin.types.includes('pwm')) {
        return false;
      }
      if (filterCategory === 'touch' && !pin.types.includes('touch')) {
        return false;
      }
      if (filterCategory === 'comm' && !pin.types.some((t) => ['i2c', 'spi', 'uart'].includes(t))) {
        return false;
      }
    }

    if (!q) return true;

    // Search query matches: label, gpio number, primaryRole, capabilities, or warnings
    if (pin.label.toLowerCase().includes(q)) return true;
    if (pin.gpio !== null && `gpio ${pin.gpio}`.includes(q)) return true;
    if (pin.gpio !== null && `${pin.gpio}` === q) return true;
    if (pin.primaryRole.toLowerCase().includes(q)) return true;
    if (pin.capabilities.some((c) => c.toLowerCase().includes(q))) return true;
    if (pin.warnings.some((w) => w.toLowerCase().includes(q))) return true;

    return false;
  });
}
