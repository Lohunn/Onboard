import React from 'react';

/**
 * Reusable ProgressBar component for lesson and module completion.
 * Supports different colors, heights, and accessible ARIA attributes.
 *
 * @param {object} props
 * @param {number} props.value - Current progress (0 - 100)
 * @param {number} [props.max=100] - Maximum value
 * @param {'blue'|'orange'|'green'|'navy'} [props.variant='blue']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.showLabel=false]
 * @param {string} [props.className='']
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  variant = 'blue',
  size = 'md',
  showLabel = false,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    blue: 'bg-[#2A56A3]',
    orange: 'bg-[#C0652D]',
    green: 'bg-[#057A55]',
    navy: 'bg-[#18213D]',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-['Barlow_Semi_Condensed'] font-semibold text-[#5C6066] mb-1">
          <span>Progress</span>
          <span className="font-['JetBrains_Mono']">{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={`w-full bg-[#E3D8CA] rounded-full overflow-hidden ${heights[size]}`}
      >
        <div
          className={`${heights[size]} ${variants[variant]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
