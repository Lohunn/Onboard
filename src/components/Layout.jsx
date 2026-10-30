import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, ChevronRight, BookOpen, Layers, Terminal, Sparkles } from 'lucide-react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Learn', path: '/learn' },
    { label: 'Boards', path: '/boards' },
    { label: 'Projects', path: '/projects' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EDDD] text-[#18213D]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#FAF4E9]/95 backdrop-blur-sm border-b border-[#CEC0AD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-[7px] bg-[#18213D] flex items-center justify-center text-[#F6EDDD] shadow-sm group-hover:bg-[#2A56A3] transition-colors">
              <Cpu className="w-5 h-5 text-[#FAF4E9]" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Barlow_Semi_Condensed'] text-xl font-bold tracking-tight text-[#18213D]">
                ONBOARD
              </span>
              <span className="font-['Barlow'] text-[10px] text-[#4B505C] uppercase tracking-wider -mt-1 font-semibold">
                Virtual Microcontroller Lab
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-[7px] text-sm font-['Barlow'] font-medium transition-all ${
                    active
                      ? 'bg-[#E3D8CA] text-[#18213D] font-semibold shadow-xs'
                      : 'text-[#4B505C] hover:text-[#18213D] hover:bg-[#F9F2E5]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/lab"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[9px] bg-[#18213D] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-semibold text-sm hover:bg-[#2A56A3] active:bg-[#18213D] transition-all shadow-sm"
            >
              <span>Enter Virtual Lab</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-[7px] text-[#18213D] hover:bg-[#E3D8CA]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF4E9] border-b border-[#CEC0AD] px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-[7px] text-base font-['Barlow'] font-medium ${
                  isActive(link.path)
                    ? 'bg-[#E3D8CA] text-[#18213D] font-semibold'
                    : 'text-[#4B505C] hover:bg-[#F9F2E5]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                to="/lab"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[9px] bg-[#18213D] text-[#FAF4E9] font-['Barlow_Semi_Condensed'] font-semibold text-base"
              >
                <span>Enter Virtual Lab</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Outlet */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-[#FAF4E9] border-t border-[#CEC0AD] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[5px] bg-[#18213D] flex items-center justify-center text-[#F6EDDD]">
                  <Cpu className="w-4 h-4 text-[#FAF4E9]" />
                </div>
                <span className="font-['Barlow_Semi_Condensed'] text-lg font-bold tracking-tight text-[#18213D]">
                  ONBOARD
                </span>
              </div>
              <p className="text-xs text-[#5C6066] leading-relaxed">
                Interactive electronics learning platform and virtual microcontroller lab. Get onboard. Start building.
              </p>
            </div>

            <div>
              <h4 className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#18213D] mb-3">
                Learning Paths
              </h4>
              <ul className="space-y-2 text-xs text-[#5C6066]">
                <li><Link to="/learn" className="hover:text-[#2A56A3]">Microcontroller Foundations</Link></li>
                <li><Link to="/learn" className="hover:text-[#2A56A3]">Sensors & Actuators</Link></li>
                <li><Link to="/learn" className="hover:text-[#2A56A3]">Displays & Protocols</Link></li>
                <li><Link to="/learn" className="hover:text-[#2A56A3]">IoT Foundations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#18213D] mb-3">
                Supported Boards
              </h4>
              <ul className="space-y-2 text-xs text-[#5C6066]">
                <li><Link to="/boards/esp32-devkit-v1" className="hover:text-[#2A56A3]">ESP32 DevKit V1</Link></li>
                <li><Link to="/boards/arduino-uno-r3" className="hover:text-[#2A56A3]">Arduino Uno R3</Link></li>
                <li><Link to="/boards/raspberry-pi-pico" className="hover:text-[#2A56A3]">Raspberry Pi Pico</Link></li>
                <li><Link to="/boards" className="hover:text-[#2A56A3]">Interactive Pinouts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#18213D] mb-3">
                Virtual Lab
              </h4>
              <ul className="space-y-2 text-xs text-[#5C6066]">
                <li><Link to="/lab" className="hover:text-[#2A56A3]">Circuit Workspace</Link></li>
                <li><Link to="/projects" className="hover:text-[#2A56A3]">Beginner Projects</Link></li>
                <li><Link to="/about" className="hover:text-[#2A56A3]">Explain Mode Engine</Link></li>
                <li><Link to="/about" className="hover:text-[#2A56A3]">Design System Spec</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#CEC0AD] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5C6066] gap-4">
            <p>© 2026 Onboard. Don't only show learners how to make a circuit work. Explain why it works.</p>
            <div className="flex items-center gap-4">
              <span>Warm pale-orange editorial design system</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

