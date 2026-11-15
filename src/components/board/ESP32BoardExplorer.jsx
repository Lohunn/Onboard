import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ESP32_DEVKIT_V1_SPEC,
  ESP32_DEVKIT_V1_PINS,
  searchPins,
} from '../../data/esp32DevKitV1';
import {
  Search,
  AlertTriangle,
  Zap,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Cpu,
} from 'lucide-react';

const CATEGORY_COLORS = {
  power: '#C0652D',
  ground: '#4B505C',
  gpio: '#2A56A3',
  input_only: '#D97706',
  control: '#6B7280',
};

export default function ESP32BoardExplorer({ _onSelectPinForLab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPinNumber, setSelectedPinNumber] = useState(27); // Default to D2 (GPIO 2, onboard LED)

  // Filtered pins based on search and category
  const filteredPins = useMemo(() => {
    return searchPins(searchQuery, activeCategory);
  }, [searchQuery, activeCategory]);

  const matchingPinNumbers = useMemo(() => {
    return new Set(filteredPins.map((p) => p.pinNumber));
  }, [filteredPins]);

  const selectedPin = useMemo(() => {
    return (
      ESP32_DEVKIT_V1_PINS.find((p) => p.pinNumber === selectedPinNumber) ||
      ESP32_DEVKIT_V1_PINS[26] // D2
    );
  }, [selectedPinNumber]);

  const leftPins = ESP32_DEVKIT_V1_PINS.filter((p) => p.side === 'left');
  const rightPins = ESP32_DEVKIT_V1_PINS.filter((p) => p.side === 'right');

  const filterOptions = [
    { id: 'all', label: 'All Pins', count: 30 },
    { id: 'power', label: 'Power & GND', count: 4 },
    { id: 'analog', label: 'ADC / DAC', count: 17 },
    { id: 'input_only', label: 'Input Only', count: 4 },
    { id: 'comm', label: 'I2C / SPI / UART', count: 11 },
    { id: 'touch', label: 'Touch Sensors', count: 9 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#2A56A3]/10 text-[#2A56A3] text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider mb-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Verified Hardware Variant: {ESP32_DEVKIT_V1_SPEC.variant}
          </div>
          <h2 className="font-['Barlow_Semi_Condensed'] text-2xl sm:text-3xl font-bold text-[#18213D]">
            ESP32 DevKit V1 Board Explorer
          </h2>
          <p className="font-['Barlow'] text-sm text-[#4B505C] mt-1 max-w-2xl">
            Interactive pinout, electrical safety limits, and hardware capabilities for the standard 30-pin Espressif DOIT DevKit V1. Click any pin or search below.
          </p>
        </div>

        <a
          href={ESP32_DEVKIT_V1_SPEC.documentationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#CEC0AD] bg-[#F9F2E5] text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#18213D] hover:bg-[#E3D8CA] transition-colors shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#2A56A3]" />
          Official Datasheet
        </a>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5C6066] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search pin (e.g. D2, GPIO 4, ADC, Touch, I2C, GND)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF4E9] border border-[#CEC0AD] rounded-[7px] pl-9 pr-4 py-2 text-sm font-['Barlow'] text-[#18213D] placeholder-[#5C6066]/70 focus:outline-hidden focus:border-[#2A56A3]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveCategory(opt.id)}
              className={`px-2.5 py-1.5 rounded-[6px] text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider shrink-0 transition-colors ${
                activeCategory === opt.id
                  ? 'bg-[#18213D] text-[#FAF4E9]'
                  : 'bg-[#FAF4E9] text-[#5C6066] border border-[#CEC0AD] hover:bg-[#E3D8CA]'
              }`}
            >
              {opt.label} ({opt.count})
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Annotated SVG Board Illustration */}
        <div className="lg:col-span-7 rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-4 sm:p-6 shadow-xs flex flex-col items-center">
          <div className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066] mb-3 self-start">
            Pin Diagram (Click pins to inspect)
          </div>

          <div className="w-full max-w-xl relative select-none">
            <svg
              viewBox="0 0 520 620"
              className="w-full h-auto drop-shadow-sm font-['JetBrains_Mono']"
              aria-label="ESP32 DevKit V1 Pinout Diagram"
            >
              <defs>
                {/* Board Metallic Shield gradient */}
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4D7DC" />
                  <stop offset="50%" stopColor="#AEB3BC" />
                  <stop offset="100%" stopColor="#8A909C" />
                </linearGradient>

                {/* PCB Texture / Body */}
                <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1C2333" />
                  <stop offset="100%" stopColor="#111622" />
                </linearGradient>

                {/* Antenna Gold */}
                <pattern id="antennaTrace" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 0 5 L 10 5" stroke="#C0652D" strokeWidth="1.5" />
                </pattern>
              </defs>

              {/* ─── PCB Board Main Body ─── */}
              <rect
                x="140"
                y="20"
                width="240"
                height="560"
                rx="10"
                fill="url(#pcbGrad)"
                stroke="#2A56A3"
                strokeWidth="1.5"
              />

              {/* PCB Corner Mounting Holes */}
              <circle cx="152" cy="32" r="5" fill="#FAF4E9" stroke="#C0652D" strokeWidth="1.5" />
              <circle cx="368" cy="32" r="5" fill="#FAF4E9" stroke="#C0652D" strokeWidth="1.5" />
              <circle cx="152" cy="568" r="5" fill="#FAF4E9" stroke="#C0652D" strokeWidth="1.5" />
              <circle cx="368" cy="568" r="5" fill="#FAF4E9" stroke="#C0652D" strokeWidth="1.5" />

              {/* ─── PCB Antenna (Top area) ─── */}
              <rect x="190" y="30" width="140" height="40" rx="3" fill="#18213D" stroke="#C0652D" strokeWidth="1" />
              <path
                d="M 200 60 L 200 40 L 220 40 L 220 60 L 240 60 L 240 40 L 260 40 L 260 60 L 280 60 L 280 40 L 300 40 L 300 60 L 320 60"
                fill="none"
                stroke="#C0652D"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* ─── Metal Shield Can (ESP-WROOM-32) ─── */}
              <rect
                x="170"
                y="90"
                width="180"
                height="210"
                rx="6"
                fill="url(#shieldGrad)"
                stroke="#707684"
                strokeWidth="1.5"
              />
              {/* Espressif Branding on Can */}
              <text x="260" y="145" textAnchor="middle" fill="#18213D" fontSize="13" fontWeight="bold" fontFamily="Barlow Semi Condensed">
                ESPRESSIF
              </text>
              <text x="260" y="170" textAnchor="middle" fill="#2E3440" fontSize="12" fontWeight="600">
                ESP-WROOM-32
              </text>
              <text x="260" y="195" textAnchor="middle" fill="#4B505C" fontSize="10">
                Wi-Fi & Bluetooth BLE
              </text>
              <text x="260" y="240" textAnchor="middle" fill="#5C6066" fontSize="9">
                FCC ID: 2AC7Z-ESPWROOM32
              </text>

              {/* ─── Micro-USB Port (Bottom center) ─── */}
              <rect x="225" y="555" width="70" height="30" rx="4" fill="#888E9B" stroke="#4B505C" strokeWidth="1" />
              <rect x="235" y="565" width="50" height="16" rx="2" fill="#2E3440" />

              {/* ─── Push Buttons: EN and BOOT ─── */}
              {/* EN Button (Left) */}
              <rect x="165" y="525" width="28" height="24" rx="3" fill="#D4D7DC" stroke="#4B505C" strokeWidth="1" />
              <circle cx="179" cy="537" r="6" fill="#18213D" />
              <text x="179" y="562" textAnchor="middle" fill="#FAF4E9" fontSize="8" fontWeight="bold">EN</text>

              {/* BOOT Button (Right) */}
              <rect x="327" y="525" width="28" height="24" rx="3" fill="#D4D7DC" stroke="#4B505C" strokeWidth="1" />
              <circle cx="341" cy="537" r="6" fill="#18213D" />
              <text x="341" y="562" textAnchor="middle" fill="#FAF4E9" fontSize="8" fontWeight="bold">BOOT</text>

              {/* ─── Status LEDs ─── */}
              {/* Red Power LED */}
              <circle cx="215" cy="537" r="4" fill="#DC2626" />
              <text x="215" y="525" textAnchor="middle" fill="#991B1B" fontSize="7" fontWeight="bold">PWR</text>

              {/* Blue GPIO 2 LED */}
              <circle
                cx="305"
                cy="537"
                r="4"
                fill={selectedPinNumber === 27 ? '#3B82F6' : '#1D4ED8'}
                stroke={selectedPinNumber === 27 ? '#93C5FD' : 'none'}
                strokeWidth={selectedPinNumber === 27 ? 2 : 0}
              />
              <text x="305" y="525" textAnchor="middle" fill="#2563EB" fontSize="7" fontWeight="bold">IO2</text>

              {/* ─── LEFT PINS (1 to 15) ─── */}
              {leftPins.map((pin, i) => {
                const y = 80 + i * 32;
                const isSelected = selectedPinNumber === pin.pinNumber;
                const isMatch = matchingPinNumbers.has(pin.pinNumber);
                const color = CATEGORY_COLORS[pin.category] || '#2A56A3';

                return (
                  <g
                    key={pin.pinNumber}
                    onClick={() => setSelectedPinNumber(pin.pinNumber)}
                    className="cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Pin ${pin.label}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPinNumber(pin.pinNumber);
                      }
                    }}
                  >
                    {/* Connecting trace */}
                    <line
                      x1="120"
                      y1={y}
                      x2="148"
                      y2={y}
                      stroke={isSelected ? color : isMatch ? '#CEC0AD' : '#3E4452'}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />

                    {/* PCB Pad / Header Pin */}
                    <rect
                      x="142"
                      y={y - 8}
                      width="16"
                      height="16"
                      rx="3"
                      fill={isSelected ? color : '#2E3440'}
                      stroke={isSelected ? '#FAF4E9' : '#C0652D'}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    <circle cx="150" cy={y} r="3" fill="#D4AF37" />

                    {/* Pin Label Button on Side */}
                    <rect
                      x="15"
                      y={y - 11}
                      width="100"
                      height="22"
                      rx="4"
                      fill={isSelected ? color : isMatch ? '#FAF4E9' : '#EAE4D9'}
                      stroke={isSelected ? '#18213D' : isMatch ? '#CEC0AD' : '#CEC0AD/50'}
                      strokeWidth={isSelected ? 2 : 1}
                      className="transition-all"
                    />

                    {/* Pin Number Small */}
                    <text
                      x="23"
                      y={y + 4}
                      fontSize="9"
                      fill={isSelected ? '#FAF4E9' : '#5C6066'}
                      fontWeight="bold"
                    >
                      {pin.pinNumber}
                    </text>

                    {/* Pin Label Name */}
                    <text
                      x="105"
                      y={y + 4}
                      textAnchor="end"
                      fontSize="11"
                      fill={isSelected ? '#FAF4E9' : isMatch ? '#18213D' : '#8A909C'}
                      fontWeight={isSelected ? 'bold' : '600'}
                    >
                      {pin.label}
                    </text>
                  </g>
                );
              })}

              {/* ─── RIGHT PINS (16 to 30) ─── */}
              {rightPins.map((pin, i) => {
                const y = 80 + i * 32;
                const isSelected = selectedPinNumber === pin.pinNumber;
                const isMatch = matchingPinNumbers.has(pin.pinNumber);
                const color = CATEGORY_COLORS[pin.category] || '#2A56A3';

                return (
                  <g
                    key={pin.pinNumber}
                    onClick={() => setSelectedPinNumber(pin.pinNumber)}
                    className="cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Pin ${pin.label}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPinNumber(pin.pinNumber);
                      }
                    }}
                  >
                    {/* Connecting trace */}
                    <line
                      x1="372"
                      y1={y}
                      x2="400"
                      y2={y}
                      stroke={isSelected ? color : isMatch ? '#CEC0AD' : '#3E4452'}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />

                    {/* PCB Pad / Header Pin */}
                    <rect
                      x="362"
                      y={y - 8}
                      width="16"
                      height="16"
                      rx="3"
                      fill={isSelected ? color : '#2E3440'}
                      stroke={isSelected ? '#FAF4E9' : '#C0652D'}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    <circle cx="370" cy={y} r="3" fill="#D4AF37" />

                    {/* Pin Label Button on Side */}
                    <rect
                      x="405"
                      y={y - 11}
                      width="100"
                      height="22"
                      rx="4"
                      fill={isSelected ? color : isMatch ? '#FAF4E9' : '#EAE4D9'}
                      stroke={isSelected ? '#18213D' : isMatch ? '#CEC0AD' : '#CEC0AD/50'}
                      strokeWidth={isSelected ? 2 : 1}
                      className="transition-all"
                    />

                    {/* Pin Label Name */}
                    <text
                      x="415"
                      y={y + 4}
                      fontSize="11"
                      fill={isSelected ? '#FAF4E9' : isMatch ? '#18213D' : '#8A909C'}
                      fontWeight={isSelected ? 'bold' : '600'}
                    >
                      {pin.label}
                    </text>

                    {/* Pin Number Small */}
                    <text
                      x="495"
                      y={y + 4}
                      textAnchor="end"
                      fontSize="9"
                      fill={isSelected ? '#FAF4E9' : '#5C6066'}
                      fontWeight="bold"
                    >
                      {pin.pinNumber}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-[#CEC0AD]/40 text-xs font-['Barlow']">
            <span className="flex items-center gap-1.5 text-[#5C6066]">
              <span className="w-3 h-3 rounded-[3px] bg-[#2A56A3]" /> Digital GPIO
            </span>
            <span className="flex items-center gap-1.5 text-[#5C6066]">
              <span className="w-3 h-3 rounded-[3px] bg-[#C0652D]" /> Power (3.3V / VIN)
            </span>
            <span className="flex items-center gap-1.5 text-[#5C6066]">
              <span className="w-3 h-3 rounded-[3px] bg-[#4B505C]" /> GND (0V Ground)
            </span>
            <span className="flex items-center gap-1.5 text-[#5C6066]">
              <span className="w-3 h-3 rounded-[3px] bg-[#D97706]" /> Input Only (No Pull)
            </span>
          </div>
        </div>

        {/* Right: Pin Detail Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-[9px] bg-[#FAF4E9] border border-[#2A56A3]/40 p-5 sm:p-6 shadow-xs">
            {/* Header info */}
            <div className="flex items-start justify-between pb-4 border-b border-[#CEC0AD]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#5C6066] uppercase">
                    Pin #{selectedPin.pinNumber} • {selectedPin.side.toUpperCase()} Header
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-[4px] text-[10px] font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: CATEGORY_COLORS[selectedPin.category] || '#2A56A3' }}
                  >
                    {selectedPin.category}
                  </span>
                </div>
                <h3 className="font-['Barlow_Semi_Condensed'] text-3xl font-bold text-[#18213D]">
                  {selectedPin.label}
                  {selectedPin.gpio !== null && (
                    <span className="text-[#2A56A3] text-xl font-medium ml-2 font-['JetBrains_Mono']">
                      (GPIO {selectedPin.gpio})
                    </span>
                  )}
                </h3>
              </div>
            </div>

            {/* Primary Role & Description */}
            <div className="py-4 border-b border-[#CEC0AD] space-y-2">
              <div className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                Primary Function
              </div>
              <div className="font-['Barlow'] text-base font-semibold text-[#18213D]">
                {selectedPin.primaryRole}
              </div>
              <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed">
                {selectedPin.description}
              </p>
            </div>

            {/* Electrical Limits Card */}
            <div className="py-4 border-b border-[#CEC0AD] space-y-2">
              <div className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#2A56A3] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Electrical Safety & Limits
              </div>
              <div className="rounded-[6px] bg-[#F9F2E5] border border-[#CEC0AD] p-3 text-xs font-['JetBrains_Mono'] text-[#18213D] leading-relaxed">
                {selectedPin.electricalLimits}
              </div>
            </div>

            {/* Capabilities Badges */}
            <div className="py-4 border-b border-[#CEC0AD] space-y-2">
              <div className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066]">
                Supported Hardware Capabilities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedPin.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] bg-[#18213D]/10 text-[#18213D] text-xs font-['Barlow'] font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#057A55]" />
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Warnings & Beginner Caveats */}
            {selectedPin.warnings.length > 0 && (
              <div className="py-4 border-b border-[#CEC0AD] space-y-2">
                <div className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#C0652D] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Beginner Safety Warnings
                </div>
                <div className="space-y-1.5">
                  {selectedPin.warnings.map((w, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-[6px] bg-[#C0652D]/10 border border-[#C0652D]/20 text-xs font-['Barlow'] text-[#7C2D12] leading-relaxed"
                    >
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Curriculum Lessons */}
            <div className="pt-4 space-y-2">
              <div className="text-xs font-['Barlow_Semi_Condensed'] font-bold uppercase tracking-wider text-[#5C6066] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Related Curriculum Lessons
              </div>

              {selectedPin.lessonLinks.length > 0 ? (
                <div className="space-y-2">
                  {selectedPin.lessonLinks.map((link) => (
                    <Link
                      key={link.lessonId}
                      to={`/lessons/${link.lessonId}`}
                      className="block p-3 rounded-[7px] bg-[#F9F2E5] border border-[#CEC0AD] hover:border-[#2A56A3] transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs font-['Barlow_Semi_Condensed'] font-bold text-[#18213D] group-hover:text-[#2A56A3]">
                        <span>{link.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="text-xs font-['Barlow'] text-[#5C6066] mt-0.5">
                        {link.context}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-['Barlow'] text-[#5C6066] italic">
                  This pin is featured in upcoming advanced sensor experiments.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
