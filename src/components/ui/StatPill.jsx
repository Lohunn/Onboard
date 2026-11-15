import React from 'react';

/**
 * StatPill component for XP, streaks, and level displays in the navigation and dashboards.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon
 * @param {string|number} props.value
 * @param {string} [props.label]
 * @param {'xp'|'streak'|'level'|'neutral'} [props.variant='neutral']
 * @param {string} [props.className='']
 * @param {() => void} [props.onClick]
 */
export default function StatPill({
  icon,
  value,
  label,
  variant = 'neutral',
  className = '',
  onClick,
}) {
  const variants = {
    xp: 'bg-[#2A56A3]/10 text-[#2A56A3] border-[#2A56A3]/30',
    streak: 'bg-[#C0652D]/10 text-[#C0652D] border-[#C0652D]/30',
    level: 'bg-[#057A55]/10 text-[#057A55] border-[#057A55]/30',
    neutral: 'bg-[#E3D8CA] text-[#18213D] border-[#CEC0AD]',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] border font-['Barlow_Semi_Condensed'] font-bold text-xs tracking-tight transition-all ${variants[variant]} ${onClick ? 'hover:brightness-95 cursor-pointer' : ''} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="font-['JetBrains_Mono']">{value}</span>
      {label && <span className="text-[11px] font-semibold text-[#5C6066] uppercase">{label}</span>}
    </Component>
  );
}
