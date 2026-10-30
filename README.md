# Onboard — Virtual Microcontroller Lab & Interactive Electronics Platform

> **Get onboard. Start building.**  
> An interactive learning platform and virtual microcontroller lab designed for beginners and university students.

---

## 🌟 Overview

Onboard bridges the gap between software code and physical hardware. Rather than copying and pasting tutorials, learners understand:
- Why circuits behave the way they do
- What happens at the silicon/register level
- How voltages, currents, and pull-up/pull-down networks work

## 🛠 Key Features

- **Interactive 3D Microcontroller Models:** Built with Three.js featuring 360° orbit rotation, realistic PCB shaders, and dynamic LED lighting for:
  - **ESP32 DevKit V1** (Dual-Core Xtensa LX6, Wi-Fi & BLE)
  - **Arduino Uno R3** (ATmega328P DIP-28, 5V logic)
  - **Raspberry Pi Pico** (RP2040 Dual ARM Cortex-M0+)
- **Virtual Lab:**
  - Node-based circuit canvas powered by `@xyflow/react` and `@wokwi/elements`
  - Integrated Monaco code editor with C++/Arduino syntax highlighting
  - **Explain Mode:** Instant contextual breakdowns of code statements and electrical concepts
  - Live virtual serial monitor (115200 baud)
- **Guided Experiments:**
  1. Project 01 — Blink an LED (Digital Output & Ohm's Law)
  2. Project 02 — Push-button LED (Digital Input & Pull-up Resistors)
  3. Project 03 — Potentiometer Input (Analog ADC & Voltage Dividers)
  4. Project 04 — Ultrasonic Distance Measurement (HC-SR04 Timing & Speed of Sound)
  5. Project 05 — OLED Sensor Display (SSD1306 128x64 & I2C Protocol)
- **Structured Curricula:**
  - Path A: Microcontroller Foundations (6 lessons)
  - Path B: Sensors and Actuators (5 lessons)
  - Path C: Displays and Communication (4 lessons)
  - Path D: IoT Foundations (4 lessons)

## 🎨 Design System

Inspired by tactile engineering workbooks:
- **Background:** Warm pale-orange (`#F6EDDD`)
- **Primary Navy:** `#18213D`
- **Secondary Blue:** `#2A56A3`
- **Tertiary Orange:** `#C0652D`
- **Typography:** Barlow Semi Condensed (Headings), Barlow (Body), JetBrains Mono (Code)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Lohunn/Onboard.git

# Navigate to project directory
cd Onboard

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` to launch the lab.
