import { Link } from 'react-router-dom'

/**
 * Reusable button component with multiple variants and sizes.
 * Can render as a <button> or a react-router <Link> when `asLink` is true.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'accent'|'ghost'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.asLink=false] - Renders as a react-router Link
 * @param {string} [props.to] - Route path when rendered as Link
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  asLink = false,
  to,
  className = '',
  children,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center font-display font-600 rounded-[9px] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2'

  const variants = {
    primary:
      'bg-navy text-white hover:bg-navy/90 active:bg-navy/80',
    secondary:
      'border border-blue text-blue bg-transparent hover:bg-blue/5 active:bg-blue/10',
    accent:
      'bg-orange text-white hover:bg-orange/90 active:bg-orange/80',
    ghost:
      'bg-transparent text-navy hover:bg-navy/5 active:bg-navy/10',
  }

  const sizes = {
    sm: 'text-[13px] px-[16px] py-[5px] gap-[5px]',
    md: 'text-[14px] px-[25px] py-[9px] gap-[8px]',
    lg: 'text-[16px] px-[36px] py-[12px] gap-[10px]',
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (asLink && to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
