export default function Card({ title, description, icon: Icon, children }) {
  return (
    <div className="card">
      <div className="card__row">
        {Icon && (
          <div className="card__icon">
            <Icon width={22} height={22} aria-hidden="true" />
          </div>
        )}
        <div>
          {title && <h3 className="card__title">{title}</h3>}
          {description && <p className="card__desc">{description}</p>}
          {children && <div style={{ marginTop: 14 }}>{children}</div>}
        </div>
      </div>
    </div>
  )
}
