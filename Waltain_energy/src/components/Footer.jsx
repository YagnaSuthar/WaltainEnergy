import { Link } from 'react-router-dom'

import logo from '../assets/images/logo.png'
import { company, navLinks } from '../data/content.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="brand footer__brand">
              <img className="footer__logo" src={logo} alt={company.brand} />
              <div>
                <div className="brand__text" style={{ color: '#fff' }}>{company.brand}</div>
                <div className="footer__muted">{company.tagline}</div>
              </div>
            </div>

            <div className="footer__muted" style={{ marginTop: 18 }}>
              <div className="footer__emails footer__muted">
                <strong className="footer__label">Email:</strong>
                {company.emails.map(({ address, featured }) => (
                  <a
                    key={address}
                    className={featured ? 'footer__email footer__email--featured' : 'footer__email'}
                    href={`mailto:${address}`}
                  >
                    {address}
                  </a>
                ))}
              </div>
              <div style={{ marginTop: 6 }}>
                <strong className="footer__label">CIN:</strong> {company.cin}
              </div>
              <div style={{ marginTop: 6 }}>
                <strong className="footer__label">GST:</strong> {company.gst}
              </div>
            </div>
          </div>

          <div className="footer__links">
            <div>
              <div style={{ fontSize: 13, fontWeight: 900 }}>Quick Links</div>
              <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                {navLinks.slice(0, 6).map((l) => (
                  <Link key={l.to} to={l.to} className="footer__muted">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900 }}>More</div>
              <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                {navLinks.slice(6).map((l) => (
                  <Link key={l.to} to={l.to} className="footer__muted">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </div>
          <a
            className="footer__social"
            href="https://www.linkedin.com/company/waltain-energy-private-limited/"
            target="_blank"
            rel="noreferrer"
            aria-label="Waltain Energy on LinkedIn"
            title="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0.5 23.5h4V7.98h-4V23.5zM8.5 7.98h3.83v2.12h.05c.53-1 1.84-2.12 3.79-2.12 4.05 0 4.8 2.66 4.8 6.11v9.41h-4v-8.34c0-1.99-.04-4.56-2.78-4.56-2.78 0-3.21 2.17-3.21 4.42v8.48h-4V7.98z" />
            </svg>
          </a>
          <div className="footer__subtext">
            Built for a clean-energy future.
          </div>
        </div>
      </div>
    </footer>
  )
}
