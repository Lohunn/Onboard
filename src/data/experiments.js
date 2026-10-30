/**
 * Core Guided Experiments for the Onboard Platform.
 * Fully compliant with the 5 beginner project specifications:
 * 1. Project 01 — Blink an LED (Digital Output)
 * 2. Project 02 — Push-button LED (Digital Input & Pull-ups)
 * 3. Project 03 — Potentiometer input (Analog Input & ADC)
 * 4. Project 04 — Ultrasonic distance measurement (Sensor Timing)
 * 5. Project 05 — OLED sensor display (I2C Protocol & Displays)
 */

export const experiments = [
  {
    id: 'exp-01-blink',
    slug: 'blink-an-led',
    title: 'Project 01 — Blink an LED',
    tagline: 'The "Hello World" of physical computing',
    difficulty: 'Beginner (1/5)',
    category: 'Digital Output',
    boardId: 'esp32-devkit-v1',
    compatibleBoards: ['esp32-devkit-v1', 'arduino-uno-r3', 'raspberry-pi-pico'],
    estimatedMinutes: 10,
    simulationMode: 'simulated',
    description:
      'Learn how to write firmware to control a physical output pin. Configure a GPIO pin as a digital output, alternate its voltage state between HIGH and LOW, and understand why current-limiting resistors are mandatory.',
    learningObjectives: [
      'Understand what a GPIO (General Purpose Input/Output) pin does',
      'Learn how pinMode() configures pin direction at the silicon level',
      'Understand digitalWrite() voltage states (3.3V / 0V or 5V / 0V)',
      'Calculate current-limiting resistance using Ohm’s Law (V = I × R)',
      'Observe timing loops using delay()',
    ],
    componentsNeeded: [
      { id: 'esp32-devkit-v1', name: 'ESP32 DevKit V1', quantity: 1 },
      { id: 'led-red', name: 'Red LED 5mm', quantity: 1 },
      { id: 'resistor-220', name: '220Ω Resistor', quantity: 1 },
      { id: 'breadboard-half', name: 'Half-size Breadboard', quantity: 1 },
    ],
    wiring: [
      { from: 'ESP32 GPIO 2 (D2)', to: 'Resistor (Pin 1)', color: '#2A56A3', label: 'Signal Output' },
      { from: 'Resistor (Pin 2)', to: 'LED Anode (Long Leg)', color: '#C0652D', label: 'Current Limited' },
      { from: 'LED Cathode (Short Leg)', to: 'ESP32 GND', color: '#18213D', label: 'Ground Return' },
    ],
    starterCode: `// Project 01: Blink an LED
// Onboard Embedded Systems Lab

const int LED_PIN = 2; // ESP32 onboard LED & GPIO 2

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(115200);
  Serial.println("Onboard Lab: Starting LED Blink experiment...");

  // Configure GPIO 2 as a push-pull digital output
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Drive pin HIGH (3.3V): current flows, LED turns ON
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED State: HIGH (ON)");
  delay(1000); // Wait 1000 milliseconds (1 second)

  // Drive pin LOW (0V): current stops, LED turns OFF
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED State: LOW (OFF)");
  delay(1000); // Wait 1 second
}
`,
    expectedResult:
      'The red LED should turn on for exactly 1 second, turn off for 1 second, and repeat indefinitely. The serial monitor will print alternating "LED State: HIGH (ON)" and "LED State: LOW (OFF)" lines.',
    commonMistakes: [
      'Connecting the LED backwards: LEDs are diodes and only conduct electricity from Anode (+) to Cathode (-).',
      'Forgetting the resistor: Connecting an LED directly to 3.3V or 5V causes an overcurrent condition that can destroy the LED and damage the GPIO pin.',
      'Selecting the wrong pin in code: Make sure the pin number in pinMode() matches your physical wiring pin.',
    ],
    explainMap: {
      'pinMode(LED_PIN, OUTPUT)': {
        concept: 'GPIO Configuration',
        text: 'Configures internal MOSFET transistors to actively drive the pin high (3.3V) or low (0V). In INPUT mode, these drivers are high-impedance.',
      },
      'digitalWrite(LED_PIN, HIGH)': {
        concept: 'Digital Output HIGH',
        text: 'Connects the pin internally to the 3.3V power rail. Voltage appears across the resistor and LED, allowing ~15mA of current to illuminate the diode.',
      },
      'digitalWrite(LED_PIN, LOW)': {
        concept: 'Digital Output LOW',
        text: 'Connects the pin internally to GND (0V). With both sides of the circuit at 0V, no potential difference exists, no current flows, and the LED turns off.',
      },
      'delay(1000)': {
        concept: 'Blocking Delay',
        text: 'Pauses program execution for 1000ms by running a CPU busy-wait loop. During this time, the output state remains frozen.',
      },
    },
    challenge: {
      title: 'Double Blink Challenge',
      description:
        'Modify the code to create an attention-grabbing heartbeat double-blink: blink twice rapidly (150ms on/off each), then pause for 1 second before repeating.',
      hint: 'You will need two short digitalWrite HIGH/LOW cycles with delay(150), followed by a longer delay(1000).',
    },
    quiz: [
      {
        question: 'Why do we place a 220Ω resistor in series with an LED?',
        options: [
          'To increase the brightness of the LED',
          'To limit current flow and protect the LED and microcontroller from burning out',
          'To convert AC current to DC current',
          'To prevent electromagnetic interference',
        ],
        correctIndex: 1,
        explanation:
          'LEDs have very little internal resistance once forward biased. Without a series resistor, excessive current would flow through the LED and fry it or blow the GPIO driver.',
      },
      {
        question: 'What is the voltage at GPIO 2 on an ESP32 when digitalWrite(2, HIGH) is executed?',
        options: ['1.8V', '3.3V', '5.0V', '12.0V'],
        correctIndex: 1,
        explanation: 'ESP32 is a 3.3V logic microcontroller. HIGH corresponds to 3.3V, whereas Arduino Uno outputs 5.0V.',
      },
    ],
  },
  {
    id: 'exp-02-button',
    slug: 'push-button-led',
    title: 'Project 02 — Push-button LED',
    tagline: 'Read user inputs and master pull-up resistors',
    difficulty: 'Beginner (2/5)',
    category: 'Digital Input',
    boardId: 'esp32-devkit-v1',
    compatibleBoards: ['esp32-devkit-v1', 'arduino-uno-r3', 'raspberry-pi-pico'],
    estimatedMinutes: 15,
    simulationMode: 'simulated',
    description:
      'Learn how to read an external mechanical switch into firmware. Explore the problem of "floating inputs", understand pull-up and pull-down configurations, and write logic to toggle an LED based on button presses.',
    learningObjectives: [
      'Learn how digitalRead() samples voltages into binary 1 or 0',
      'Understand the "floating pin" problem and why resistors are required',
      'Learn how internal pull-up resistors (INPUT_PULLUP) simplify circuit design',
      'Implement active-low switch logic in C/C++',
      'Understand mechanical switch contact bouncing',
    ],
    componentsNeeded: [
      { id: 'esp32-devkit-v1', name: 'ESP32 DevKit V1', quantity: 1 },
      { id: 'push-button', name: '6mm Push Button', quantity: 1 },
      { id: 'led-red', name: 'Red LED 5mm', quantity: 1 },
      { id: 'resistor-220', name: '220Ω Resistor', quantity: 1 },
      { id: 'breadboard-half', name: 'Half-size Breadboard', quantity: 1 },
    ],
    wiring: [
      { from: 'Button Pin 1A', to: 'ESP32 GPIO 4', color: '#057A55', label: 'Input Sense' },
      { from: 'Button Pin 2A', to: 'ESP32 GND', color: '#18213D', label: 'Ground (Active Low)' },
      { from: 'ESP32 GPIO 2', to: 'Resistor (Pin 1)', color: '#2A56A3', label: 'LED Drive' },
      { from: 'Resistor (Pin 2)', to: 'LED Anode', color: '#C0652D', label: 'Current Limited' },
      { from: 'LED Cathode', to: 'ESP32 GND', color: '#18213D', label: 'Ground Return' },
    ],
    starterCode: `// Project 02: Push-Button LED
// Onboard Embedded Systems Lab

const int BUTTON_PIN = 4; // Push button connected to GPIO 4
const int LED_PIN = 2;    // Output LED on GPIO 2

void setup() {
  Serial.begin(115200);
  
  // Use INPUT_PULLUP: internal resistor pulls pin to 3.3V when open
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  
  Serial.println("System ready. Press the button to light the LED.");
}

void loop() {
  // Read button state: LOW when pressed (connected to GND), HIGH when released
  int buttonState = digitalRead(BUTTON_PIN);

  if (buttonState == LOW) {
    // Button is actively pressed
    digitalWrite(LED_PIN, HIGH);
    Serial.println("Button: PRESSED -> LED ON");
  } else {
    // Button is released
    digitalWrite(LED_PIN, LOW);
  }

  delay(50); // Small debounce filter delay
}
`,
    expectedResult:
      'When the push button is held down, the LED turns on. When released, the LED turns off. The serial terminal logs "Button: PRESSED -> LED ON" while the switch is closed.',
    commonMistakes: [
      'Configuring as plain INPUT without an external pull-up or pull-down resistor, causing erratic flickers due to ambient electromagnetic noise.',
      'Wiring to the wrong pair of button pins: diagonally opposite pins are guaranteed to switch correctly.',
      'Inverting logic: With INPUT_PULLUP, pressing the button connects to GND, so pressed is LOW, not HIGH.',
    ],
    explainMap: {
      'pinMode(BUTTON_PIN, INPUT_PULLUP)': {
        concept: 'Internal Pull-Up',
        text: 'Activates an internal ~45kΩ silicon resistor connecting the pin to 3.3V. This guarantees a stable HIGH state whenever the external circuit is open.',
      },
      'int buttonState = digitalRead(BUTTON_PIN)': {
        concept: 'Digital Input Sampling',
        text: 'Samples the Schmitt trigger on GPIO 4. If voltage > 2.0V, it returns HIGH (1). If voltage < 0.8V, it returns LOW (0).',
      },
    },
    challenge: {
      title: 'Push-to-Toggle Latch',
      description:
        'Instead of holding the button down, write code so that each click toggles the LED on or off like a light switch, remembering its previous state.',
      hint: 'Store the current LED state in a boolean variable, and only toggle when buttonState transitions from HIGH to LOW.',
    },
    quiz: [
      {
        question: 'What happens to a microcontroller digital input pin if it is left "floating" without a resistor?',
        options: [
          'It stays strictly at 0V',
          'It stays strictly at 3.3V',
          'It picks up stray electrostatic noise and fluctuates randomly between HIGH and LOW',
          'It draws excessive current and destroys the chip',
        ],
        correctIndex: 2,
        explanation:
          'High-impedance inputs act like tiny antennas. Without a pull-up or pull-down resistor anchoring the voltage, electrostatic fields cause unpredictable rapid switching.',
      },
    ],
  },
  {
    id: 'exp-03-potentiometer',
    slug: 'potentiometer-input',
    title: 'Project 03 — Potentiometer input',
    tagline: 'Read continuous real-world signals with ADC',
    difficulty: 'Intermediate (3/5)',
    category: 'Analog Input & ADC',
    boardId: 'esp32-devkit-v1',
    compatibleBoards: ['esp32-devkit-v1', 'arduino-uno-r3', 'raspberry-pi-pico'],
    estimatedMinutes: 20,
    simulationMode: 'simulated',
    description:
      'Discover how digital computers interact with continuous analog reality. Connect a 10k potentiometer as a voltage divider, read the changing voltage using the 12-bit Analog-to-Digital Converter (ADC), and map values to control an LED.',
    learningObjectives: [
      'Understand how voltage dividers work (Vout = Vin × R2 / [R1 + R2])',
      'Learn what an ADC (Analog-to-Digital Converter) does and its resolution',
      'Compare 10-bit (0-1023) vs 12-bit (0-4095) ADC ranges',
      'Use the map() function to rescale numeric ranges',
      'Plot real-time sensor streams on the Serial Plotter',
    ],
    componentsNeeded: [
      { id: 'esp32-devkit-v1', name: 'ESP32 DevKit V1', quantity: 1 },
      { id: 'potentiometer', name: '10kΩ Potentiometer', quantity: 1 },
      { id: 'led-red', name: 'Red LED 5mm', quantity: 1 },
      { id: 'resistor-220', name: '220Ω Resistor', quantity: 1 },
      { id: 'breadboard-half', name: 'Half-size Breadboard', quantity: 1 },
    ],
    wiring: [
      { from: 'Potentiometer VCC (Pin 1)', to: 'ESP32 3V3', color: '#DC2626', label: '3.3V Reference Rail' },
      { from: 'Potentiometer Wiper (Pin 2)', to: 'ESP32 GPIO 34 (ADC1_CH6)', color: '#D97706', label: 'Analog Signal' },
      { from: 'Potentiometer GND (Pin 3)', to: 'ESP32 GND', color: '#18213D', label: 'Ground' },
      { from: 'ESP32 GPIO 2', to: 'Resistor 220Ω -> LED', color: '#2A56A3', label: 'PWM Output' },
    ],
    starterCode: `// Project 03: Potentiometer Input & ADC
// Onboard Embedded Systems Lab

const int POT_PIN = 34; // Analog input pin (ADC1 Channel 6)
const int LED_PIN = 2;  // Built-in LED pin

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("ADC Experiment initialized. Turn the potentiometer knob.");
}

void loop() {
  // Read the 12-bit ADC value (range 0 - 4095)
  int rawValue = analogRead(POT_PIN);

  // Convert digital number to actual voltage (3.3V reference)
  float voltage = (rawValue / 4095.0) * 3.3;

  // Map 12-bit ADC reading (0-4095) to blink interval (50ms - 1000ms)
  int blinkSpeed = map(rawValue, 0, 4095, 50, 1000);

  Serial.print("Raw ADC: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 2);
  Serial.print("V | Blink Delay: ");
  Serial.print(blinkSpeed);
  Serial.println(" ms");

  // Blink LED proportional to potentiometer knob position
  digitalWrite(LED_PIN, HIGH);
  delay(blinkSpeed);
  digitalWrite(LED_PIN, LOW);
  delay(blinkSpeed);
}
`,
    expectedResult:
      'Rotating the potentiometer knob smoothly adjusts the serial monitor values between 0 (0.00V) and 4095 (3.30V). The LED blink rate dynamically speeds up or slows down depending on the knob angle.',
    commonMistakes: [
      'Powering the potentiometer from 5V while reading into a 3.3V ESP32 GPIO: This over-voltage will damage the ESP32 ADC pin! Always use 3V3 rail.',
      'Connecting the wiper to power or ground instead of the middle pin, preventing proper voltage division.',
      'Using ADC2 pins while Wi-Fi is enabled on ESP32: Wi-Fi uses ADC2 internally. Always prefer ADC1 pins (GPIO 32 - 39).',
    ],
    explainMap: {
      'int rawValue = analogRead(POT_PIN)': {
        concept: 'Analog-to-Digital Conversion',
        text: 'The ESP32 successive approximation register (SAR) ADC quantizes the analog input voltage into a 12-bit integer between 0 (0V) and 4095 (3.3V).',
      },
      'float voltage = (rawValue / 4095.0) * 3.3': {
        concept: 'Voltage Calculation',
        text: 'Scales the discrete ADC count back to its physical electrical potential using the 3.3V full-scale reference voltage.',
      },
    },
    challenge: {
      title: 'Analog Threshold Alarm',
      description:
        'Write code that sounds an alert or blinks rapidly only when the voltage crosses 2.50V (simulating an overheating threshold sensor).',
      hint: 'Use an if (voltage > 2.50) conditional check inside loop().',
    },
    quiz: [
      {
        question: 'What is the maximum integer returned by a 12-bit ADC like the ESP32?',
        options: ['255', '1023', '4095', '65535'],
        correctIndex: 2,
        explanation: 'A 12-bit number can represent 2^12 = 4096 distinct values, from 0 to 4095.',
      },
    ],
  },
  {
    id: 'exp-04-ultrasonic',
    slug: 'ultrasonic-distance',
    title: 'Project 04 — Ultrasonic distance measurement',
    tagline: 'Precision acoustic sensing and microsecond timing',
    difficulty: 'Intermediate (3/5)',
    category: 'Sensors & Timing',
    boardId: 'esp32-devkit-v1',
    compatibleBoards: ['esp32-devkit-v1', 'arduino-uno-r3', 'raspberry-pi-pico'],
    estimatedMinutes: 25,
    simulationMode: 'simulated',
    description:
      'Measure physical distances in centimeters without touching objects. Emit an ultrasonic 40 kHz burst, measure the echo flight duration with microsecond accuracy using pulseIn(), and calculate distance using the speed of sound in air.',
    learningObjectives: [
      'Understand the physics of echolocation and time-of-flight sensing',
      'Generate microsecond trigger pulses using delayMicroseconds()',
      'Use pulseIn() to measure incoming pulse duration with high accuracy',
      'Calculate distance from time using speed of sound (343 m/s)',
      'Recognize acoustic reflection limitations and sensor blind zones (2cm - 400cm)',
    ],
    componentsNeeded: [
      { id: 'esp32-devkit-v1', name: 'ESP32 DevKit V1', quantity: 1 },
      { id: 'hc-sr04', name: 'HC-SR04 Ultrasonic Sensor', quantity: 1 },
      { id: 'resistor-10k', name: '10kΩ Resistor (for Echo divider)', quantity: 1 },
      { id: 'breadboard-half', name: 'Half-size Breadboard', quantity: 1 },
    ],
    wiring: [
      { from: 'HC-SR04 VCC', to: 'ESP32 VIN (5V)', color: '#DC2626', label: '5V Power' },
      { from: 'HC-SR04 GND', to: 'ESP32 GND', color: '#18213D', label: 'Ground' },
      { from: 'HC-SR04 Trig', to: 'ESP32 GPIO 5', color: '#2A56A3', label: 'Trigger Output' },
      { from: 'HC-SR04 Echo', to: 'ESP32 GPIO 18 (via 3.3V divider)', color: '#057A55', label: 'Echo Input' },
    ],
    starterCode: `// Project 04: Ultrasonic Distance Sensor (HC-SR04)
// Onboard Embedded Systems Lab

const int TRIG_PIN = 5;  // Ultrasonic Trigger pin
const int ECHO_PIN = 18; // Ultrasonic Echo pin

// Speed of sound in air is ~343 m/s = 0.0343 cm/microsecond
const float SPEED_OF_SOUND = 0.0343;

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  Serial.println("Ultrasonic Distance Sensor Initialized.");
}

void loop() {
  // Clear the trigger pin
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  // Send a 10 microsecond HIGH pulse to trigger ultrasonic burst
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Read Echo pulse width (in microseconds)
  // pulseIn waits for pin to go HIGH, times how long it stays HIGH, then returns
  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout

  if (duration == 0) {
    Serial.println("Out of range or timeout");
  } else {
    // Calculate distance: Distance = (Time * Speed) / 2 (round-trip)
    float distanceCm = (duration * SPEED_OF_SOUND) / 2.0;

    Serial.print("Echo Duration: ");
    Serial.print(duration);
    Serial.print(" µs | Distance: ");
    Serial.print(distanceCm, 1);
    Serial.println(" cm");
  }

  delay(200); // Wait 200ms before taking next reading
}
`,
    expectedResult:
      'The serial monitor displays distance in centimeters updated 5 times per second. Moving an object in front of the sensor produces instantaneous distance updates between 2cm and 400cm.',
    commonMistakes: [
      'Forgetting to divide by 2: Sound travels from the sensor to the obstacle AND back to the receiver, so total flight time is double the single-way distance.',
      'Connecting 5V Echo directly to a 3.3V ESP32 pin without a resistor voltage divider.',
      'Target angle too steep: If a smooth surface is angled greater than 15°, acoustic waves reflect away and miss the receiver.',
    ],
    explainMap: {
      'pulseIn(ECHO_PIN, HIGH, 30000)': {
        concept: 'Pulse Timing Measurement',
        text: 'A hardware-calibrated timer function that waits for the Echo pin to transition HIGH, measures the elapsed microseconds until it transitions LOW, and handles timeouts.',
      },
      'float distanceCm = (duration * SPEED_OF_SOUND) / 2.0': {
        concept: 'Echolocation Formula',
        text: 'Multiplies acoustic duration by 0.0343 cm/µs and divides by 2 because the acoustic wave travels to the obstacle and returns.',
      },
    },
    challenge: {
      title: 'Parking Sensor Alarm',
      description:
        'Add a piezo buzzer or LED that beeps faster as an obstacle gets closer, just like a car parking proximity sensor.',
      hint: 'Map the measured distance (5cm - 100cm) to a delay between beeps (50ms - 800ms).',
    },
    quiz: [
      {
        question: 'Why is the round-trip echo duration divided by 2 when computing distance?',
        options: [
          'Because sound moves twice as fast when reflecting',
          'Because the sound wave travels out to the target and back again',
          'Because the sensor has two transducer cylinders',
          'Because of the 50% duty cycle of PWM',
        ],
        correctIndex: 1,
        explanation:
          'The pulse duration represents the total time for sound to reach the object plus return to the sensor. The distance to the object is half this total path length.',
      },
    ],
  },
  {
    id: 'exp-05-oled',
    slug: 'oled-sensor-display',
    title: 'Project 05 — OLED sensor display',
    tagline: 'Master the I2C bus and graphical user interfaces',
    difficulty: 'Intermediate (4/5)',
    category: 'Displays & Communication',
    boardId: 'esp32-devkit-v1',
    compatibleBoards: ['esp32-devkit-v1', 'arduino-uno-r3'],
    estimatedMinutes: 30,
    simulationMode: 'simulated',
    description:
      'Graduate from the serial monitor to an on-device graphical screen. Wire an SSD1306 128x64 pixel OLED display using the 2-wire I2C communication protocol, understand master/slave addressing, and draw live telemetry screens.',
    learningObjectives: [
      'Understand how the I2C synchronous serial bus works (SDA and SCL lines)',
      'Learn device addressing (default 0x3C for SSD1306)',
      'Manage framebuffers in RAM before sending to the display via display()',
      'Format and render custom text, borders, and progress bars',
      'Create responsive embedded UI layouts',
    ],
    componentsNeeded: [
      { id: 'esp32-devkit-v1', name: 'ESP32 DevKit V1', quantity: 1 },
      { id: 'ssd1306-oled', name: 'SSD1306 128x64 OLED Display', quantity: 1 },
      { id: 'potentiometer', name: '10kΩ Potentiometer (for live telemetry)', quantity: 1 },
      { id: 'breadboard-half', name: 'Half-size Breadboard', quantity: 1 },
    ],
    wiring: [
      { from: 'OLED GND', to: 'ESP32 GND', color: '#18213D', label: 'Ground' },
      { from: 'OLED VCC', to: 'ESP32 3V3', color: '#DC2626', label: '3.3V Power' },
      { from: 'OLED SCL', to: 'ESP32 GPIO 22 (I2C Clock)', color: '#2A56A3', label: 'I2C Clock Line' },
      { from: 'OLED SDA', to: 'ESP32 GPIO 21 (I2C Data)', color: '#057A55', label: 'I2C Data Line' },
      { from: 'Potentiometer Wiper', to: 'ESP32 GPIO 34', color: '#D97706', label: 'Sensor Input' },
    ],
    starterCode: `// Project 05: OLED Sensor Display (SSD1306 128x64 I2C)
// Onboard Embedded Systems Lab

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1 // Reset pin shared or not used
#define SCREEN_ADDRESS 0x3C // Standard I2C address for SSD1306

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

const int SENSOR_PIN = 34;

void setup() {
  Serial.begin(115200);

  // Initialize I2C communication on ESP32 default pins (SDA=21, SCL=22)
  Wire.begin(21, 22);

  // Initialize display with 3.3V internal charge pump
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println("SSD1306 initialization failed! Check wiring & address.");
    for (;;); // Halt
  }

  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(18, 25);
  display.println("ONBOARD LAB V1");
  display.display();
  delay(1500);
}

void loop() {
  int sensorVal = analogRead(SENSOR_PIN);
  float voltage = (sensorVal / 4095.0) * 3.3;
  int barWidth = map(sensorVal, 0, 4095, 0, 120);

  display.clearDisplay();

  // Header Title Bar
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("TELEMETRY: SENSOR 1");
  display.drawLine(0, 10, 127, 10, SSD1306_WHITE);

  // Numerical Readings
  display.setCursor(0, 16);
  display.print("ADC:  ");
  display.print(sensorVal);

  display.setCursor(0, 28);
  display.print("VOLT: ");
  display.print(voltage, 2);
  display.print(" V");

  // Visual Gauge Bar
  display.drawRect(0, 44, 124, 12, SSD1306_WHITE);
  display.fillRect(2, 46, barWidth, 8, SSD1306_WHITE);

  // Flush buffer to physical screen
  display.display();

  delay(100);
}
`,
    expectedResult:
      'The OLED display lights up with the Onboard splash logo, then renders a live real-time dashboard showing the sensor ADC count, calculated voltage, and a smoothly expanding graphic progress bar reflecting potentiometer changes.',
    commonMistakes: [
      'Swapping SDA and SCL: If clock and data lines are reversed, the I2C bus will hang or fail to acknowledge.',
      'Forgetting display.display(): Adafruit_GFX draws into a memory buffer in RAM. Nothing appears on the screen until display.display() transmits the buffer over I2C.',
      'Incorrect I2C address: Some modules default to 0x3D instead of 0x3C depending on a solder jumper on the back.',
    ],
    explainMap: {
      'Wire.begin(21, 22)': {
        concept: 'I2C Bus Initialization',
        text: 'Configures GPIO 21 as Serial Data (SDA) and GPIO 22 as Serial Clock (SCL) with open-drain outputs and pull-up resistors.',
      },
      'display.display()': {
        concept: 'Framebuffer Transmission',
        text: 'Sends all 1024 bytes (128x64 / 8 bits) of pixel buffer data over the I2C bus at 400kHz to refresh the OLED panel.',
      },
    },
    challenge: {
      title: 'Real-time Waveform Oscilloscope',
      description:
        'Instead of a horizontal progress bar, plot the historical sensor readings as continuous connected line segments from left to right across the bottom of the screen.',
      hint: 'Maintain an array of 64 past readings and use display.drawLine(x, prevY, x+1, newY, SSD1306_WHITE).',
    },
    quiz: [
      {
        question: 'How many data wires are required to control an I2C device like the SSD1306 OLED display?',
        options: ['1 wire (Signal)', '2 wires (SDA and SCL)', '4 wires (MOSI, MISO, SCK, CS)', '8 parallel wires'],
        correctIndex: 1,
        explanation:
          'I2C is a 2-wire serial bus: SDA carries bidirectional serial data, and SCL provides the synchronizing clock signal.',
      },
    ],
  },
]

export default experiments
