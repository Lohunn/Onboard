/**
 * Reusable section heading with an optional eyebrow label, main title,
 * and description text. Supports left and center alignment.
 *
 * @param {object} props
 * @param {string} [props.eyebrow] - Small uppercase label above the heading
 * @param {string} props.title - Main heading text
 * @param {string} [props.description] - Supporting paragraph text
 * @param {'left'|'center'} [props.align='left']
 * @param {string} [props.className]
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}) {
  const alignment = align === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={`${alignment} ${className}`}>
      {eyebrow && (
        <span className="text-label text-orange mb-[5px] block">
          {eyebrow}
        </span>
      )}
      <h2 className="text-section-heading text-navy">{title}</h2>
      {description && (
        <p className="font-body text-text-secondary mt-[5px] max-w-[560px] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
