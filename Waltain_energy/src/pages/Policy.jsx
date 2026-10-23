import {
  ArrowRight,
  BadgePercent,
  CheckCircle,
  FileText,
  Gavel,
  ListChecks,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import '../styles/pages/policy.css'

import FAQItem from '../components/FAQItem.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'

import sovremennyeImage from '../assets/images/sovremennye-alternativnye-istochniki-ehnergii-1.jpg'
import renewableImage from '../assets/images/renewable.jpg'

// Debug: log image paths
console.log('Policy page images:', { sovremennyeImage, renewableImage })

export default function Policy() {
  const observerRef = useRef(null)

  useEffect(() => {
    document.title = 'Policy & Compliance | Waltain Energy'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Policy overview for open access renewable procurement: eligibility, tenure, banking, transmission & wheeling charges, cross subsidy surcharge, and payment security mechanisms.',
      )
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      },
    )

    const animatableElements = document.querySelectorAll('.animate-on-scroll')
    animatableElements.forEach((el) => observerRef.current.observe(el))

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [])

  const pillars = [
    {
      icon: Gavel,
      title: 'Eligibility & approvals',
      desc: 'Eligibility thresholds, application steps and documentation checks (state-specific).',
    },
    {
      icon: Wallet,
      title: 'Charges & settlement',
      desc: 'Transmission/wheeling, banking, surcharge components and energy accounting.',
    },
    {
      icon: ShieldCheck,
      title: 'Compliance & scheduling',
      desc: 'Scheduling process, reporting cadence and operational safeguards for continuity.',
    },
    {
      icon: FileText,
      title: 'Contracts & payment security',
      desc: 'PPA terms, tenure, and payment security mechanism requirements.',
    },
  ]

  const charges = [
    {
      label: 'Transmission & wheeling',
      detail: 'Network charges for moving electricity through the grid to your premises.',
    },
    {
      label: 'Cross subsidy surcharge (as applicable)',
      detail: 'May apply depending on consumer category and prevailing rules.',
    },
    {
      label: 'Banking & balancing',
      detail: 'Conditions for banking, carry-forward, and settlement vary by state framework.',
    },
    {
      label: 'Other levies',
      detail: 'Additional state/utility levies may apply based on category and regulations.',
    },
  ]

  const checklist = [
    'Contracted demand and consumption profile baseline',
    'Site/location mapping for connectivity and scheduling feasibility',
    'Tariff comparison and savings computation with charges',
    'Draft PPA termsheet, tenure and settlement approach',
    'Payment security mechanism planning',
    'Scheduling, energy accounting and reporting process setup',
  ]

  const faqs = [
    {
      question: 'Are these rules the same in every state?',
      answer:
        'No. Regulations and charges vary by state and consumer profile. This page is a high-level summary; we validate the exact rule set for your location and category.',
    },
    {
      question: 'What usually drives the final savings number?',
      answer:
        'Savings depend on current tariff, consumption profile, PPA tariff, and applicable network charges/levies. We compute a net view so you see real-world economics.',
    },
    {
      question: 'What is payment security and why is it required?',
      answer:
        'Many frameworks require payment security (e.g., BG/LC) to ensure timely settlement. The exact requirement depends on the PPA structure and applicable regulations.',
    },
    {
      question: 'How do you help with compliance?',
      answer:
        'We structure the execution plan, coordinate documentation, and align scheduling/accounting so your operational transition is stable and audit-ready.',
    },
  ]

  return (
    <div className="policy-page">
      <PageHeader
        title="Policy & Compliance"
        subtitle="A high-level summary of key policy considerations for open access renewable energy procurement." 
      />

      <Section>
        <div className="policy-hero animate-on-scroll">
          <div className="policy-hero__grid">
            <div>
              <div className="policy-pill">
                <Gavel width={16} height={16} aria-hidden="true" />
                Policy notes for decision-making
              </div>
              <h2 className="policy-title">Compliance clarity for open access procurement</h2>
              <p className="policy-lead">
                Regulations and charges vary by state and consumer profile. The sections below summarize common
                elements referenced under GERC regulations and similar frameworks, so you can evaluate feasibility
                with a business-ready view.
              </p>
              <div className="policy-actions">
                <Link to="/contact" className="btn btn-primary">
                  Request policy check
                  <ArrowRight width={16} height={16} aria-hidden="true" />
                </Link>
                <Link to="/open-access" className="btn btn-outline">
                  Open access overview
                </Link>
              </div>
            </div>

            <div className="policy-kpis">
              <div className="policy-kpi">
                <div className="policy-kpi__icon">
                  <CheckCircle width={18} height={18} aria-hidden="true" />
                </div>
                <div>
                  <div className="policy-kpi__title">Eligibility</div>
                  <div className="policy-kpi__value">≥ 100 kW (typical)</div>
                  <div className="policy-kpi__desc">Threshold varies by state/circle.</div>
                </div>
              </div>
              <div className="policy-kpi">
                <div className="policy-kpi__icon">
                  <FileText width={18} height={18} aria-hidden="true" />
                </div>
                <div>
                  <div className="policy-kpi__title">Tenure</div>
                  <div className="policy-kpi__value">12–25 years</div>
                  <div className="policy-kpi__desc">As per applicable access framework.</div>
                </div>
              </div>
              <div className="policy-kpi">
                <div className="policy-kpi__icon">
                  <Wallet width={18} height={18} aria-hidden="true" />
                </div>
                <div>
                  <div className="policy-kpi__title">Charges</div>
                  <div className="policy-kpi__value">Network + levies</div>
                  <div className="policy-kpi__desc">Transmission/wheeling + surcharges (as applicable).</div>
                </div>
              </div>
              <div className="policy-kpi">
                <div className="policy-kpi__icon">
                  <ShieldCheck width={18} height={18} aria-hidden="true" />
                </div>
                <div>
                  <div className="policy-kpi__title">Operations</div>
                  <div className="policy-kpi__value">Scheduling & accounting</div>
                  <div className="policy-kpi__desc">Processes designed to keep operations stable.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Regulatory pillars" eyebrow="Framework">
        <div className="policy-grid animate-on-scroll">
          {pillars.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.title} className="policy-card">
                <div className="policy-card__icon">
                  <Icon width={20} height={20} aria-hidden="true" />
                </div>
                <div className="policy-card__title">{p.title}</div>
                <div className="policy-card__desc">{p.desc}</div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="Charges & settlement components" eyebrow="Economics">
        <div className="policy-charges animate-on-scroll">
          <div className="policy-charges__header">
            <div>
              <div className="policy-charges__title">What typically applies</div>
              <div className="policy-charges__subtitle">
                We compute a net view (tariff vs PPA + charges) so you can see a real-world savings range.
              </div>
            </div>
            <div className="policy-charges__badge">
              <BadgePercent width={18} height={18} aria-hidden="true" />
              Savings are profile-dependent
            </div>
          </div>

          <div className="policy-charges__list">
            {charges.map((c) => (
              <div key={c.label} className="policy-charge">
                <div className="policy-charge__icon">
                  <Wallet width={18} height={18} aria-hidden="true" />
                </div>
                <div>
                  <div className="policy-charge__label">{c.label}</div>
                  <div className="policy-charge__detail">{c.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Implementation checklist" eyebrow="Documentation">
        <div className="policy-checklist">
          <div className="policy-panel animate-on-scroll">
            <div className="policy-panel__header">
              <div className="policy-panel__icon">
                <ListChecks width={20} height={20} aria-hidden="true" />
              </div>
              <div>
                <div className="policy-panel__title">What we validate for your case</div>
                <div className="policy-panel__desc">
                  A business-ready documentation pack covering approvals, economics, and compliance steps.
                </div>
              </div>
            </div>

            <div className="policy-items">
              {checklist.map((item) => (
                <div key={item} className="policy-item">
                  <CheckCircle width={18} height={18} aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="policy-panel policy-panel--accent animate-on-scroll">
            <div className="policy-panel__header">
              <div className="policy-panel__icon">
                <ShieldCheck width={20} height={20} aria-hidden="true" />
              </div>
              <div>
                <div className="policy-panel__title">Risk controls</div>
                <div className="policy-panel__desc">
                  Practical steps to keep implementation predictable and audit-ready.
                </div>
              </div>
            </div>

            <div className="policy-items">
              <div className="policy-item">
                <CheckCircle width={18} height={18} aria-hidden="true" />
                Clear roles across consumer, generator and network stakeholders
              </div>
              <div className="policy-item">
                <CheckCircle width={18} height={18} aria-hidden="true" />
                Payment security planning aligned to PPA and settlement
              </div>
              <div className="policy-item">
                <CheckCircle width={18} height={18} aria-hidden="true" />
                Scheduling/accounting cadence and exception handling
              </div>
              <div className="policy-item">
                <CheckCircle width={18} height={18} aria-hidden="true" />
                Reporting inputs for compliance and ESG disclosure
              </div>
            </div>

            <div className="policy-cta">
              <Link to="/contact" className="btn btn-secondary">
                Request compliance walkthrough
                <ArrowRight width={16} height={16} aria-hidden="true" />
              </Link>
              <div className="policy-cta__hint">We’ll map the exact framework for your site & category.</div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Questions" eyebrow="FAQ">
        <div className="grid gap-3 animate-on-scroll">
          {faqs.map((f) => (
            <FAQItem key={f.question} question={f.question} answer={f.answer} />
          ))}
        </div>
      </Section>

      <Section>
        <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>Gallery</h3>
        <div className="policy-gallery animate-on-scroll">
          <div className="policy-gallery__grid">
            <div className="policy-gallery__item">
              <img
                className="policy-gallery__img"
                src={sovremennyeImage}
                alt="Sovremennye"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load sovremennyeImage:', e)
                  e.target.style.display = 'none'
                }}
              />
            </div>
            <div className="policy-gallery__item">
              <img
                className="policy-gallery__img"
                src={renewableImage}
                alt="Renewable"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load renewableImage:', e)
                  e.target.style.display = 'none'
                }}
              />
            </div>
          </div>
        </div>
      </Section>

      <div className="policy-bottom-cta animate-on-scroll">
        <div className="container">
          <div className="policy-bottom-cta__card">
            <div>
              <div className="policy-bottom-cta__title">Need a state-specific policy view?</div>
              <div className="policy-bottom-cta__desc">
                Share your site details and a recent bill. We’ll validate eligibility, net savings, and compliance steps.
              </div>
            </div>
            <div className="policy-bottom-cta__actions">
              <Link to="/contact" className="btn btn-primary">
                Get started
                <ArrowRight width={16} height={16} aria-hidden="true" />
              </Link>
              <Link to="/services" className="btn btn-outline">
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
