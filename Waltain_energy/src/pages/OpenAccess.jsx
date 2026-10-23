import {
  ArrowRight,
  BadgePercent,
  CalendarDays,
  CheckCircle,
  FileText,
  Leaf,
  Route,
  ShieldCheck,
  Sun,
  Users,
  Zap,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import '../styles/pages/open-access.css'

import Card from '../components/Card.jsx'
import FAQItem from '../components/FAQItem.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'

import unnamedImage1 from '../assets/images/unnamed1.jpg'
import unnamedImage from '../assets/images/unnamed.jpg'

const solarImage = '/waltain plant photos/pngtree-solar-power-plant-on-a-background-of-sky-image_15846261.jpg'
const solarFarmsImage = '/waltain plant photos/360_F_1673963044_tIVqd2avXLyFGUPXAe0qcf3CFsngQJFD.jpg'

export default function OpenAccess() {
  const observerRef = useRef(null)

  useEffect(() => {
    document.title = 'Open Access Solar Power | Waltain Energy'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Understand open access solar power: third-party power purchase, GETCO substation flow, 12-year PPA, savings and ESG disclosure support.',
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

  const steps = [
    {
      icon: Users,
      title: 'Assess eligibility',
      desc: 'Confirm contracted demand, location mapping and tariff baseline.',
    },
    {
      icon: Sun,
      title: 'Structure the PPA',
      desc: 'Define savings, tenure, payment security and commercial terms.',
    },
    {
      icon: Route,
      title: 'Network scheduling',
      desc: 'Coordinate grid scheduling and substation connectivity with required applications.',
    },
    {
      icon: Zap,
      title: 'Commission & supply',
      desc: 'Go-live and track monthly settlement, compliance and reporting inputs.',
    },
  ]

  const faqs = [
    {
      question: 'Who can use open access solar?',
      answer:
        'Typically eligible consumers with sufficient contracted demand and required approvals. We help you validate eligibility and execution feasibility based on your load, location and network constraints.',
    },
    {
      question: 'How do savings work?',
      answer:
        'You buy power from the generator under a PPA tariff and pay applicable transmission/distribution charges. Net savings depend on your current tariff, consumption profile and applicable charges.',
    },
    {
      question: 'How long does implementation take?',
      answer:
        'Timelines vary by connectivity and approvals. We structure the execution plan and coordination steps so the transition is predictable and operationally stable.',
    },
    {
      question: 'Does this help with ESG reporting?',
      answer:
        'Yes. We support documentation inputs and a clear reporting narrative for renewable procurement outcomes and disclosures.',
    },
  ]

  return (
    <div className="open-access-page">
      <PageHeader
        title="Open Access Solar Power"
        subtitle="Procure solar power from a third-party generator using the state network, structured for eligible consumers." 
      />

      <Section>
        <div className="oa-hero animate-on-scroll">
          <div className="oa-hero__grid">
            <div>
              <div className="oa-pill">
                <Leaf width={16} height={16} aria-hidden="true" />
                Renewable procurement, structured for execution
              </div>
              <h2 className="oa-title">Lower costs. Cleaner power. Clear execution.</h2>
              <p className="oa-lead">
                Open access enables eligible consumers to purchase electricity from a third-party renewable
                generator. The power flows through the transmission/distribution network with applicable
                charges and compliance steps.
              </p>
              <div className="oa-actions">
                <Link to="/contact" className="btn btn-primary">
                  Discuss your eligibility
                  <ArrowRight width={16} height={16} aria-hidden="true" />
                </Link>
                <a href="#oa-flow" className="btn btn-outline">
                  See how it works
                </a>
              </div>
            </div>

            <div className="oa-hero__image">
              <img className="oa-hero__img" src={solarImage} alt="Solar power" loading="lazy" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="How the flow works" eyebrow="Process">
        <div id="oa-flow" className="oa-flow animate-on-scroll">
          <div className="oa-flow__grid">
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="oa-step" style={{ animationDelay: `${idx * 0.08}s` }}>
                  <div className="oa-step__num">{String(idx + 1).padStart(2, '0')}</div>
                  <div className="oa-step__icon">
                    <Icon width={22} height={22} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="oa-step__title">{step.title}</div>
                    <div className="oa-step__desc">{step.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="oa-note">
            <CheckCircle width={18} height={18} aria-hidden="true" />
            We coordinate approvals and scheduling so business operations remain stable during the transition.
          </div>
        </div>
      </Section>

      <Section title="What you get" eyebrow="Outcomes">
        <div className="grid-2">
          <div className="animate-on-scroll">
            <Card
              title="Third party renewable procurement"
              description="Access solar generation without building your own plant, using a structured PPA." 
              icon={Sun}
            />
          </div>
          <div className="animate-on-scroll">
            <Card
              title="Network flow via connectivity"
              description="Power is scheduled through the grid network with required applications, charges and coordination." 
              icon={Route}
            />
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: 16 }}>
          <div className="animate-on-scroll">
            <Card
              title="Long-term tariff visibility"
              description="A multi-year agreement designed for predictable energy economics and continuity." 
              icon={ShieldCheck}
            />
          </div>
          <div className="animate-on-scroll">
            <Card
              title="ESG & disclosure support"
              description="Documentation inputs and reporting guidance to communicate renewable procurement outcomes." 
              icon={FileText}
            />
          </div>
        </div>
      </Section>

      <Section title="Eligibility & readiness" eyebrow="Checklist">
        <div className="oa-eligibility">
          <div className="oa-panel animate-on-scroll">
            <h3 className="oa-panel__title">Quick checks</h3>
            <div className="oa-list">
              <div className="oa-list__item">
                <CheckCircle width={18} height={18} aria-hidden="true" />
                Contracted demand and consumption profile
              </div>
              <div className="oa-list__item">
                <CheckCircle width={18} height={18} aria-hidden="true" />
                Location mapping for connectivity / substation coordination
              </div>
              <div className="oa-list__item">
                <CheckCircle width={18} height={18} aria-hidden="true" />
                Tariff comparison and savings computation
              </div>
              <div className="oa-list__item">
                <CheckCircle width={18} height={18} aria-hidden="true" />
                Compliance steps & documentation planning
              </div>
            </div>
          </div>

          <div className="oa-panel oa-panel--accent animate-on-scroll">
            <h3 className="oa-panel__title">Typical outcomes</h3>
            <div className="oa-chips">
              <span className="oa-chip">
                <BadgePercent width={16} height={16} aria-hidden="true" />
                1.5–2.0 ₹/unit savings
              </span>
              <span className="oa-chip">
                <CalendarDays width={16} height={16} aria-hidden="true" />
                12-year PPA
              </span>
              <span className="oa-chip">
                <ShieldCheck width={16} height={16} aria-hidden="true" />
                Execution support
              </span>
              <span className="oa-chip">
                <FileText width={16} height={16} aria-hidden="true" />
                Disclosure-ready documentation
              </span>
            </div>

            <div className="oa-cta">
              <Link to="/contact" className="btn btn-secondary">
                Request bill analysis
                <ArrowRight width={16} height={16} aria-hidden="true" />
              </Link>
              <div className="oa-cta__hint">Share a recent bill to evaluate eligibility & savings.</div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="FAQs" eyebrow="Questions">
        <div className="grid gap-3 animate-on-scroll">
          {faqs.map((f) => (
            <FAQItem key={f.question} question={f.question} answer={f.answer} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="oa-gallery animate-on-scroll">
          <div className="oa-gallery__grid">
            <div className="oa-gallery__item">
              <img className="oa-gallery__img" src={unnamedImage1} alt="Energy audit" loading="lazy" />
            </div>
            <div className="oa-gallery__item">
              <img className="oa-gallery__img" src={unnamedImage} alt="Energy audit" loading="lazy" />
            </div>
            <div className="oa-gallery__item">
              <img className="oa-gallery__img" src={solarFarmsImage} alt="Solar farms" loading="lazy" />
            </div>
          </div>
        </div>
      </Section>

      <div className="oa-bottom-cta animate-on-scroll">
        <div className="container">
          <div className="oa-bottom-cta__card">
            <div>
              <div className="oa-bottom-cta__title">Ready to explore open access savings?</div>
              <div className="oa-bottom-cta__desc">
                Get a structured view of eligibility, commercial terms and an execution plan tailored to your site.
              </div>
            </div>
            <div className="oa-bottom-cta__actions">
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
