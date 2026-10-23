export default function TeamCard({ name, role, description, image, linkedinUrl }) {
  return (
    <div className="card team-card">
      {image && (
        <div className="team-card__avatar">
          <img
            className="team-card__img"
            src={image}
            alt={`${name} photo`}
            loading="lazy"
          />
        </div>
      )}
      <div className="team-card__meta">
        <h3 className="card__title team-card__name">{name}</h3>
        <p className="team-card__role">{role}</p>
        {linkedinUrl && (
          <a
            className="team-card__link"
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        )}
      </div>
      {description && (
        <p className="card__desc team-card__desc">{description}</p>
      )}
    </div>
  )
}
