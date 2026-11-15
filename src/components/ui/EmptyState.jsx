import React from 'react';
import Button from './Button';

/**
 * Reusable EmptyState component for empty lists, search misses, or inactive tabs.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.actionLabel]
 * @param {() => void} [props.onAction]
 * @param {string} [props.actionTo]
 * @param {string} [props.className='']
 */
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionTo,
  className = '',
}) {
  return (
    <div
      className={`rounded-[9px] bg-[#FAF4E9] border border-[#CEC0AD] p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-[7px] bg-[#E3D8CA] text-[#18213D] flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-['Barlow_Semi_Condensed'] text-xl font-bold text-[#18213D] mb-2">
        {title}
      </h3>
      <p className="font-['Barlow'] text-sm text-[#4B505C] leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && (
        <Button
          variant="primary"
          size="sm"
          asLink={Boolean(actionTo)}
          to={actionTo}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
