import { useEffect } from 'react'
import { BriefcaseBusiness, HandCoins, Leaf, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import '../styles/pages/home.css'

import heroVideo from '../assets/videos/Video Project 5.mp4'

import Hero from '../components/Hero.jsx'
import ImageScroller from '../components/ImageScroller.jsx'
import AssociateScroller from '../components/AssociateScroller.jsx'
import Section from '../components/Section.jsx'
import Card from '../components/Card.jsx'
import { company, homeHighlights } from '../data/content.js'

const highlightIcons = [HandCoins, Leaf, ShieldCheck, BriefcaseBusiness]

export default function Home() {
  useEffect(() => {
    document.title = 'Waltain Energy | Renewable Energy Solutions'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Waltain Energy Private Limited helps eligible businesses adopt renewable energy through open access solar, EPC, advisory and ESG disclosure support.',
      )
    }
  }, [])

  return (
    <div className="home-page">
      <Hero backgroundVideoSrc={heroVideo} />

      <Section
        eyebrow="About"
        title="Renewable energy solutions for practical outcomes"
      >
        <div className="grid-2">
          <div>
            <p className="lead" style={{ marginTop: 0 }}>
              {company.name} works with industrial and commercial consumers to
              simplify renewable energy adoption. Our focus is clear: predictable
              savings, robust compliance, and dependable execution.
            </p>
            <p className="lead">
              From open access solar power procurement to EPC support and ESG
              advisory, we help you move from intent to implementation with
              confidence.
            </p>
            <div className="actions">
              <Link
                to="/services"
                className="btn btn-outline"
              >
                View Services
              </Link>
              <Link
                to="/open-access"
                className="btn btn-secondary"
              >
                Understand Open Access
              </Link>
            </div>
          </div>

          <div>
            <div className="surface home-key-promise">
              <div style={{ fontSize: 13, fontWeight: 900 }}>Key promise</div>
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--muted)' }}>
                A structured renewable transition that respects regulatory
                realities and your business continuity.
              </div>
              <div style={{ marginTop: 18 }} className="stack">
                <div className="kpi">
                  <p className="kpi__title">
                    Clear commercial framing
                  </p>
                  <p className="kpi__desc">
                    Savings and charges explained upfront.
                  </p>
                </div>
                <div className="kpi">
                  <p className="kpi__title">
                    Compliance-first execution
                  </p>
                  <p className="kpi__desc">
                    Policy & process guidance throughout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Highlights" title="What you can expect" className="home-expect">
        <div className="grid-4">
          {homeHighlights.map((h, idx) => {
            const Icon = highlightIcons[idx] || Leaf
            return (
              <div key={h.title} className="fade-up">
                <Card title={h.title} description={h.description} icon={Icon} />
              </div>
            )
          })}
        </div>
      </Section>

      <Section
        eyebrow="Next step"
        title="Talk to us about your consumption profile"
      >
        <div className="banner">
          <div className="banner__grid">
            <div>
              <p className="banner__eyebrow">
                Start with a quick assessment
              </p>
              <h3 className="banner__title">
                Get a savings and feasibility view for open access solar
              </h3>
              <p className="banner__text">
                Share your connected load, location and recent bill details. We
                will outline eligibility, indicative savings and the execution
                path.
              </p>
            </div>
            <div>
              <Link
                to="/contact"
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--color-secondary)' }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <ImageScroller />
      <AssociateScroller />
    </div>
  )
}
