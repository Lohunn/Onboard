/**
 * Reusable card component with surface background, border, and optional hover effect.
 *
 * @param {object} props
 * @param {'default'|'elevated'|'outlined'} [props.variant='default']
 * @param {boolean} [props.hoverable=false] - Adds a hover lift/shadow effect
 * @param {Function} [props.onClick]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export default function Card({
  variant = 'default',
  hoverable = false,
  onClick,
  className = '',
  children,
  ...rest
}) {
  const base = 'rounded-[9px] transition-all duration-150'

  const variants = {
    default: 'bg-surface border border-border',
    elevated: 'bg-surface-low border border-border shadow-sm',
    outlined: 'bg-transparent border border-border-variant',
  }

  const hoverStyles = hoverable
    ? 'hover:-translate-y-[2px] hover:shadow-md hover:border-surface-highest cursor-pointer'
    : ''

  const clickableStyles = onClick ? 'cursor-pointer' : ''

  const classes = `${base} ${variants[variant]} ${hoverStyles} ${clickableStyles} ${className}`

  return (
    <div className={classes} onClick={onClick} {...rest}>
      {children}
    </div>
  )
}
