/**
 * Small badge / label component for tags, difficulty levels, and categories.
 * Uses the text-label style (Barlow Semi Condensed, 13px, 700, uppercase).
 *
 * @param {object} props
 * @param {'default'|'blue'|'orange'|'green'|'navy'} [props.variant='default']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export default function Badge({ variant = 'default', className = '', children }) {
  const base =
    'inline-flex items-center font-display text-[13px] font-700 uppercase tracking-[0.05em] px-[8px] py-[2px] rounded-[5px]'

  const variants = {
    default: 'bg-surface-high text-navy',
    blue: 'bg-blue/10 text-blue',
    orange: 'bg-orange/10 text-orange',
    green: 'bg-green-700/10 text-green-700',
    navy: 'bg-navy/10 text-navy',
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
