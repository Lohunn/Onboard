import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Cpu,
  ChevronRight,
  Flame,
  Zap,
  Award,
} from 'lucide-react';
import { useLearnerStore } from '../store/useLearnerStore';
import StatPill from './ui/StatPill';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { xp, streakDays } = useLearnerStore();
  const currentLevel = Math.floor(xp / 100) + 1;

  const navLinks = [
    { label: 'Learn', path: '/learn' },
    { label: 'Virtual Lab', path: '/lab' },
    { label: 'Circuit Builder', path: '/circuit' },
    { label: 'Boards', path: '/boards' },
    { label: 'Projects', path: '/projects' },
    { label: 'Achievements', path: '/achievements' },
    { label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EDDD] text-[#18213D]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#FAF4E9]/95 backdrop-blur-sm border-b border-[#CEC0AD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-[7px] bg-[#18213D] flex items-center justify-center text-[#F6EDDD] shadow-sm group-hover:bg-[#2A56A3] transition-colors">
              <Cpu className="w-5 h-5 text-[#FAF4E9]" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Barlow_Semi_Condensed'] text-xl font-bold tracking-tight text-[#18213D]">
                ONBOARD
              </span>
              <span className="font-['Barlow'] text-[10px] text-[#4B505C] uppercase tracking-wider -mt-1 font-semibold">
                Zero-to-ESP32 Lab
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
                  className={`px-3 py-1.5 rounded-[7px] text-sm font-['Barlow'] font-medium transition-all ${
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

          {/* Gamification Stats Header Pills */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Link to="/achievements">
              <StatPill
                icon={<Flame className="w-3.5 h-3.5 text-[#C0652D] fill-current" />}
                value={streakDays}
                label="Days"
                variant="streak"
                title="Current Streak"
              />
            </Link>

            <Link to="/achievements">
              <StatPill
                icon={<Zap className="w-3.5 h-3.5 text-[#2A56A3] fill-current" />}
                value={xp}
                label="XP"
                variant="xp"
                title="Total XP Earned"
              />
            </Link>

            <Link to="/profile">
              <StatPill
                icon={<Award className="w-3.5 h-3.5 text-[#057A55]" />}
                value={`Lvl ${currentLevel}`}
                variant="level"
                title="Learner Level"
              />
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
          <div className="md:hidden bg-[#FAF4E9] border-b border-[#CEC0AD] px-4 pt-2 pb-6 space-y-3">
            {/* Mobile Stat Pills */}
            <div className="flex items-center gap-2 py-2 border-b border-[#CEC0AD]/40">
              <StatPill
                icon={<Flame className="w-3.5 h-3.5 text-[#C0652D] fill-current" />}
                value={`${streakDays}d Streak`}
                variant="streak"
              />
              <StatPill
                icon={<Zap className="w-3.5 h-3.5 text-[#2A56A3] fill-current" />}
                value={`${xp} XP`}
                variant="xp"
              />
              <StatPill
                icon={<Award className="w-3.5 h-3.5 text-[#057A55]" />}
                value={`Lvl ${currentLevel}`}
                variant="level"
              />
            </div>

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
                Beginner-first virtual electronics lab and physical computing curriculum. Understand before memorising.
              </p>
            </div>

            <div>
              <h4 className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#18213D] mb-3">
                Curriculum Map
              </h4>
              <ul className="space-y-2 text-xs text-[#5C6066]">
                <li><Link to="/learn" className="hover:text-[#2A56A3]">Module 0: Welcome to Building</Link></li>
                <li><Link to="/learn" className="hover:text-[#2A56A3]">Module 1: Electricity Without Fear</Link></li>
                <li><Link to="/learn" className="hover:text-[#2A56A3]">Module 4: First Output: LED Blink</Link></li>
                <li><Link to="/learn" className="hover:text-[#2A56A3]">Module 9: Smart Indicator Mission</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#18213D] mb-3">
                Virtual Lab
              </h4>
              <ul className="space-y-2 text-xs text-[#5C6066]">
                <li><Link to="/lab" className="hover:text-[#2A56A3]">Circuit Workspace</Link></li>
                <li><Link to="/boards" className="hover:text-[#2A56A3]">ESP32 DevKit V1 Pinout</Link></li>
                <li><Link to="/projects" className="hover:text-[#2A56A3]">Project Library</Link></li>
                <li><Link to="/achievements" className="hover:text-[#2A56A3]">XP & Badges</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Barlow_Semi_Condensed'] text-xs font-bold uppercase tracking-wider text-[#18213D] mb-3">
                Learning Rules
              </h4>
              <p className="text-xs text-[#5C6066] leading-relaxed">
                Never misrepresent a visual demo as genuine firmware simulation. Master one complete journey on ESP32 DevKit V1.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#CEC0AD] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5C6066] gap-4">
            <p>© 2026 Onboard. Get onboard. Start building.</p>
            <div className="flex items-center gap-4">
              <span>Warm pale-orange editorial design system</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
