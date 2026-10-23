import { ArrowRight, Leaf, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'

import { company } from '../data/content.js'

export default function Hero({ backgroundVideoSrc }) {
  return (
    <section className="hero">
      {backgroundVideoSrc && (
        <div className="hero__video" aria-hidden="true">
          <video
            className="hero__video-el"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={backgroundVideoSrc} type="video/mp4" />
          </video>
          <div className="hero__video-overlay" />
        </div>
      )}

      <div className="hero__bg1" aria-hidden="true" />
      <div className="hero__bg2" aria-hidden="true" />

      <div className="container">
        <div className="hero__grid">
          <div>
            <div className="pill">
              <Leaf width={16} height={16} color="var(--primary)" aria-hidden="true" />
              Renewable Energy Solutions
            </div>
            <h1 className="h1">{company.tagline}</h1>
            <p className="lead">
              We help eligible industrial and commercial consumers adopt clean energy through open access solar, EPC execution and advisory. Built for savings, compliance and long-term reliability.
            </p>

            <div className="actions">
              <Link to="/contact" className="btn btn-primary">
                Contact Us
                <ArrowRight width={16} height={16} aria-hidden="true" />
              </Link>
              <Link to="/services" className="btn btn-outline">
                Explore Services
              </Link>
            </div>

            <div style={{ marginTop: 26 }} className="grid-2">
              <div className="kpi">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Sun width={18} height={18} color="var(--secondary)" aria-hidden="true" />
                  <p className="kpi__title">Open Access Solar</p>
                </div>
                <p className="kpi__desc">
                  Structured procurement from solar farms using the grid network, aligned to regulations.
                </p>
              </div>
              <div className="kpi">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Leaf width={18} height={18} color="var(--primary)" aria-hidden="true" />
                  <p className="kpi__title">ESG + Reporting</p>
                </div>
                <p className="kpi__desc">
                  Documentation and disclosure support to communicate sustainability outcomes.
                </p>
              </div>
            </div>
          </div>

          <div className="surface hero-why fade-up">
            <div style={{ fontSize: 13, fontWeight: 900 }}>Why Waltain Energy</div>
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--muted)' }}>
              Practical execution for businesses that want measurable savings and dependable clean power.
            </div>

            <div style={{ marginTop: 18 }} className="stack">
              <div className="kpi">
                <p className="kpi__title">Savings Focus</p>
                <p className="kpi__desc">Transparent economics with regulatory clarity.</p>
              </div>
              <div className="kpi">
                <p className="kpi__title">Compliance Ready</p>
                <p className="kpi__desc">Policy-aligned approach for open access adoption.</p>
              </div>
              <div className="kpi">
                <p className="kpi__title">Delivery Mindset</p>
                <p className="kpi__desc">Governance, timelines and quality across EPC engagements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
