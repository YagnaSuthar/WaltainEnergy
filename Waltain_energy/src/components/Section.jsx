export default function Section({ title, eyebrow, children, className = '' }) {
  return (
    <section className={`section ${className}`.trim()}>
      <div className="container">
        {(title || eyebrow) && (
          <div className="section__header">
            {eyebrow && (
              <p className="section__eyebrow">{eyebrow}</p>
            )}
            {title && <h2 className="section__title">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
