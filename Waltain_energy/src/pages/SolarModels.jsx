// solar-models.jsx
import { useEffect, useRef } from 'react'
import {
  Building2,
  BadgePercent,
  HandCoins,
  Leaf,
  TrendingDown,
  Shield,
  Clock,
  CheckCircle,
  Zap,
  FileText,
  Users,
  Target,
  ArrowRight,
  Banknote,
  CalendarDays,
  BarChart3,
  Award,
  XCircle,
} from 'lucide-react'

import '../styles/pages/solar-models.css'
import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'

import solarModelOne from '../assets/images/solar-model-1.jpg'
import solarModelTwo from '../assets/images/solar-model-2.jpg'

export default function SolarModels() {
  const observerRef = useRef(null)

  useEffect(() => {
    // SEO Optimization
    document.title = 'Solar Models | Waltain Energy - Third Party PPA vs Captive Solar'
    
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Compare solar procurement models: Third Party PPA with 0 investment and 1.5-2 Rs/Unit savings vs Captive/SPV model with 26% equity, tax benefits, and 3-year ROI. Choose the best model for your business.',
      )
    }

    // Add keywords meta tag
    let keywords = document.querySelector('meta[name="keywords"]')
    if (!keywords) {
      keywords = document.createElement('meta')
      keywords.name = 'keywords'
      document.head.appendChild(keywords)
    }
    keywords.content = 'solar PPA model, captive solar, SPV solar, open access solar, solar investment models, solar procurement, renewable energy models, solar financing'

    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.animate-on-scroll')
    animatableElements.forEach((el) => observerRef.current.observe(el))

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <div className="solar-models-page">
      <PageHeader
        title="Solar Procurement Models"
        subtitle="Choose a model that fits your business priorities, capex preference, tenure, governance and ESG goals."
      />

      {/* Intro Section */}
      <Section>
        <div className="models-intro animate-on-scroll">
          <p className="intro-text">
            We offer two proven solar procurement models, each designed for different business needs. 
            Whether you prioritize zero upfront investment or asset ownership with tax benefits, 
            we have a solution that delivers measurable savings and sustainability impact.
          </p>
        </div>
      </Section>

      {/* Model Comparison Cards */}
      <div className="models-comparison-wrapper">
        {/* Model 1: Third Party PPA */}
        <Section title="Third Party Power Purchase Agreement" eyebrow="Model 1 • Zero Investment">
          <div className="model-hero-card blue-theme animate-on-scroll">
            <div className="model-hero-header">
              <div className="hero-icon-wrapper">
                <Zap size={48} />
              </div>
              <div className="hero-text">
                <h3 className="hero-title">Most Popular Model</h3>
                <p className="hero-subtitle">
                  Adopt solar power with zero capital investment and start saving immediately
                </p>
              </div>
            </div>

            <div className="model-highlights">
              <div className="highlight-badge">
                <HandCoins size={24} />
                <span>0 Rs Investment</span>
              </div>
              <div className="highlight-badge">
                <TrendingDown size={24} />
                <span>1.5-2 Rs/Unit Savings</span>
              </div>
              <div className="highlight-badge">
                <CalendarDays size={24} />
                <span>12 Year PPA</span>
              </div>
              <div className="highlight-badge">
                <Clock size={24} />
                <span>180 Days to Supply</span>
              </div>
            </div>

            <div className="model-body">
              <div className="model-body__content">
                <div className="model-description-box">
                  <p className="model-description-text">
                    Our Third Party PPA model allows you to access solar power through open access without 
                    any upfront capital expenditure. We own and operate the solar farm, and you simply purchase 
                    the power at a discounted rate compared to your current grid tariff.
                  </p>
                </div>
              </div>

              <div className="model-body__media">
                <img className="model-body__img" src={solarModelOne} alt="Solar power" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="features-grid features-grid--blue animate-on-scroll">
            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon blue-bg">
                  <HandCoins size={28} />
                </div>
                <h4 className="feature-title">Zero Investment Required</h4>
              </div>
              <p className="feature-description">
                No upfront capital expenditure from your side. We invest in the solar farm infrastructure, 
                and you benefit from clean power without the financial burden of asset ownership.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>100% capex handled by Waltain Energy</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon blue-bg">
                  <TrendingDown size={28} />
                </div>
                <h4 className="feature-title">Immediate Cost Savings</h4>
              </div>
              <p className="feature-description">
                Reduce your electricity bill by approximately 20% with savings of 1.5-2 Rs per unit 
                compared to current grid tariffs. Start saving from day one of power supply.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>Estimated 20% bill reduction</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon blue-bg">
                  <BadgePercent size={28} />
                </div>
                <h4 className="feature-title">Competitive Discount Tariff</h4>
              </div>
              <p className="feature-description">
                Transparent pricing at 4.25 Rs/Unit (ex-bus) with additional transmission charges. 
                Mutually agreed discounting rate ensures predictable energy costs for 12 years.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>Fixed tariff structure for planning certainty</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon blue-bg">
                  <CalendarDays size={28} />
                </div>
                <h4 className="feature-title">Long-term Supply Security</h4>
              </div>
              <p className="feature-description">
                12-year Power Purchase Agreement provides long-term tariff visibility and energy supply 
                continuity. 100% electricity off-take guarantee ensures reliable power availability.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>Guaranteed supply for 12+ years</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon blue-bg">
                  <Building2 size={28} />
                </div>
                <h4 className="feature-title">Managed Execution</h4>
              </div>
              <p className="feature-description">
                Complete support for GERC approvals, GETCO/DisCom coordination, SS connectivity, 
                scheduling, and ongoing compliance. We handle all the complexity.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>End-to-end project management</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon blue-bg">
                  <Leaf size={28} />
                </div>
                <h4 className="feature-title">ESG & Sustainability</h4>
              </div>
              <p className="feature-description">
                Free ESG disclosure advisory included. Achieve renewable energy targets, reduce carbon 
                footprint, and improve corporate sustainability reporting without additional costs.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>Complimentary ESG advisory services</span>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="specifications-section animate-on-scroll">
            <h3 className="specs-section-title">Model Specifications</h3>
            <div className="specs-table">
              <div className="spec-row">
                <div className="spec-label">
                  <Banknote size={20} />
                  <span>Buyer Investment</span>
                </div>
                <div className="spec-value highlighted">0 Rs (Zero Investment)</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <BadgePercent size={20} />
                  <span>PPA Tariff</span>
                </div>
                <div className="spec-value">4.25 Rs/Unit (Ex-bus)</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <CalendarDays size={20} />
                  <span>Contract Duration</span>
                </div>
                <div className="spec-value">12 Years</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <TrendingDown size={20} />
                  <span>Expected Savings</span>
                </div>
                <div className="spec-value highlighted">1.5-2 Rs/Unit</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <Zap size={20} />
                  <span>Connectivity</span>
                </div>
                <div className="spec-value">11KVa & 66KVa with SS</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <Shield size={20} />
                  <span>Supply Guarantee</span>
                </div>
                <div className="spec-value">100% Off-take</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <FileText size={20} />
                  <span>Payment Security</span>
                </div>
                <div className="spec-value">6 Months BG/LC</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <Clock size={20} />
                  <span>Timeline to Supply</span>
                </div>
                <div className="spec-value highlighted">180 Days</div>
              </div>
            </div>
          </div>

          {/* Ideal For Section */}
          <div className="ideal-for-section ideal-for-section--blue animate-on-scroll">
            <h4 className="ideal-title">
              <Target size={24} />
              Ideal For
            </h4>
            <ul className="ideal-list">
              <li>Businesses seeking immediate cost reduction without capital deployment</li>
              <li>Companies with 100+ kW contracted demand (GERC eligibility)</li>
              <li>Organizations prioritizing cash flow over asset ownership</li>
              <li>Enterprises wanting predictable energy costs for long-term planning</li>
              <li>Businesses requiring minimal involvement in project execution</li>
            </ul>
          </div>
        </Section>

        {/* Model 2: Captive/SPV */}
        <Section title="Captive/SPV Solar Farm" eyebrow="Model 2 • Asset Ownership">
          <div className="model-hero-card yellow-theme animate-on-scroll">
            <div className="model-hero-header">
              <div className="hero-icon-wrapper">
                <Building2 size={48} />
              </div>
              <div className="hero-text">
                <h3 className="hero-title">Most Preferred & Advised Model</h3>
                <p className="hero-subtitle">
                  Own solar assets with tax benefits, accelerated depreciation, and attractive ROI
                </p>
              </div>
            </div>

            <div className="model-highlights">
              <div className="highlight-badge">
                <BadgePercent size={24} />
                <span>26% Investment</span>
              </div>
              <div className="highlight-badge">
                <BarChart3 size={24} />
                <span>~3 Year ROI</span>
              </div>
              <div className="highlight-badge">
                <Award size={24} />
                <span>26% Depreciation</span>
              </div>
              <div className="highlight-badge">
                <Leaf size={24} />
                <span>REC & IREC Benefits</span>
              </div>
            </div>

            <div className="model-body model-body--reverse">
              <div className="model-body__content">
                <div className="model-description-box">
                  <p className="model-description-text">
                    The Captive/SPV model allows you to own a stake in the solar farm through a Special Purpose 
                    Vehicle (SPV). With 26% equity participation, you unlock significant tax benefits, accelerated 
                    depreciation, and share in renewable energy certificate trading income.
                  </p>
                </div>
              </div>

              <div className="model-body__media">
                <img className="model-body__img" src={solarModelTwo} alt="Solar farm" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="features-grid features-grid--yellow animate-on-scroll">
            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon yellow-bg">
                  <Banknote size={28} />
                </div>
                <h4 className="feature-title">26% Equity Investment</h4>
              </div>
              <p className="feature-description">
                Captive structures require minimum 26% equity participation in the SPV as per GERC regulations. 
                For a 1MW project, consumer investment is approximately 78 Lacs out of 3.01 Cr total cost.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>Shared ownership model with developer</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon yellow-bg">
                  <BarChart3 size={28} />
                </div>
                <h4 className="feature-title">Fast Return on Investment</h4>
              </div>
              <p className="feature-description">
                Attractive ROI of approximately 3 years based on energy savings, tax benefits, and depreciation 
                advantages. Strong financial case compared to traditional grid power consumption.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>Payback in ~3 years with ongoing benefits</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon yellow-bg">
                  <Award size={28} />
                </div>
                <h4 className="feature-title">Accelerated Depreciation</h4>
              </div>
              <p className="feature-description">
                26% apportionate depreciation benefit as per Income Tax Act provisions. Significant tax 
                shield in the initial years of asset ownership, improving overall project economics.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>Substantial tax savings from depreciation</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon yellow-bg">
                  <FileText size={28} />
                </div>
                <h4 className="feature-title">Tax Benefits</h4>
              </div>
              <p className="feature-description">
                Multiple tax advantages including depreciation benefits, potential corporate tax reductions, 
                and investment-linked tax incentives depending on your corporate structure and tax position.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>Optimize tax efficiency with solar ownership</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon yellow-bg">
                  <Leaf size={28} />
                </div>
                <h4 className="feature-title">ESG & REC Trading Benefits</h4>
              </div>
              <p className="feature-description">
                Free ESG advisory plus shared benefits from Renewable Energy Certificate (REC) and 
                International REC (IREC) trading income. Monetize your green energy generation beyond 
                just consumption savings.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>Additional revenue from certificate trading</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-header">
                <div className="feature-icon yellow-bg">
                  <TrendingDown size={28} />
                </div>
                <h4 className="feature-title">Superior Cost Savings</h4>
              </div>
              <p className="feature-description">
                Estimated savings of approximately 3 Rs/Unit compared to grid tariff. Higher savings 
                than PPA model due to asset ownership and no developer margin in energy costs.
              </p>
              <div className="feature-detail">
                <CheckCircle size={16} />
                <span>Maximum long-term cost reduction</span>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="specifications-section animate-on-scroll">
            <h3 className="specs-section-title">Model Specifications (1MW Base)</h3>
            <div className="specs-table">
              <div className="spec-row">
                <div className="spec-label">
                  <Banknote size={20} />
                  <span>Consumer Investment</span>
                </div>
                <div className="spec-value highlighted">78 Lacs (26%)</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <Building2 size={20} />
                  <span>Total Project Cost</span>
                </div>
                <div className="spec-value">3.01 Cr (Consumer) / 3.50 Cr (Developer)</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <BadgePercent size={20} />
                  <span>PPA Rate</span>
                </div>
                <div className="spec-value">4.25 Rs/Unit (Ex-bus)</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <BarChart3 size={20} />
                  <span>Expected ROI Period</span>
                </div>
                <div className="spec-value highlighted">~3 Years</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <TrendingDown size={20} />
                  <span>Estimated Savings</span>
                </div>
                <div className="spec-value highlighted">~3 Rs/Unit</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <Award size={20} />
                  <span>Depreciation Benefit</span>
                </div>
                <div className="spec-value">26% Apportionate</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <Leaf size={20} />
                  <span>Green Certificates</span>
                </div>
                <div className="spec-value">IREC & Emission Trading</div>
              </div>
              <div className="spec-row">
                <div className="spec-label">
                  <FileText size={20} />
                  <span>ESG Advisory</span>
                </div>
                <div className="spec-value highlighted">Free Included</div>
              </div>
            </div>
          </div>

          {/* Ideal For Section */}
          <div className="ideal-for-section ideal-for-section--yellow animate-on-scroll">
            <h4 className="ideal-title">
              <Target size={24} />
              Ideal For
            </h4>
            <ul className="ideal-list">
              <li>Companies with available capital seeking superior long-term ROI</li>
              <li>Businesses wanting to own energy infrastructure assets</li>
              <li>Organizations seeking maximum tax efficiency and depreciation benefits</li>
              <li>Enterprises with strong ESG commitments and reporting requirements</li>
              <li>Companies interested in REC/IREC trading revenue opportunities</li>
              <li>Businesses prioritizing energy independence and asset value creation</li>
            </ul>
          </div>
        </Section>
      </div>

      {/* Side-by-Side Comparison */}
      <Section title="Quick Comparison" eyebrow="Model Overview">
        <div className="comparison-grid animate-on-scroll">
          <div className="comparison-card">
            <div className="comparison-header blue-header">
              <Zap size={32} />
              <h3>Third Party PPA</h3>
            </div>
            <div className="comparison-body">
              <div className="comparison-row pro">
                <CheckCircle size={18} />
                <span>Zero investment required</span>
              </div>
              <div className="comparison-row pro">
                <CheckCircle size={18} />
                <span>Immediate savings (1.5-2 Rs/Unit)</span>
              </div>
              <div className="comparison-row pro">
                <CheckCircle size={18} />
                <span>No operational responsibility</span>
              </div>
              <div className="comparison-row pro">
                <CheckCircle size={18} />
                <span>12-year supply security</span>
              </div>
              <div className="comparison-row pro">
                <CheckCircle size={18} />
                <span>Free ESG advisory</span>
              </div>
              <div className="comparison-row con">
                <XCircle size={18} />
                <span>No asset ownership</span>
              </div>
              <div className="comparison-row con">
                <XCircle size={18} />
                <span>No tax/depreciation benefits</span>
              </div>
            </div>
          </div>

          <div className="comparison-card">
            <div className="comparison-header yellow-header">
              <Building2 size={32} />
              <h3>Captive/SPV Model</h3>
            </div>
            <div className="comparison-body">
              <div className="comparison-row pro">
                <CheckCircle size={18} />
                <span>Asset ownership (26% stake)</span>
              </div>
              <div className="comparison-row pro">
                <CheckCircle size={18} />
                <span>Higher savings (~3 Rs/Unit)</span>
              </div>
              <div className="comparison-row pro">
                <CheckCircle size={18} />
                <span>Fast ROI (~3 years)</span>
              </div>
              <div className="comparison-row pro">
                <CheckCircle size={18} />
                <span>26% depreciation benefits</span>
              </div>
              <div className="comparison-row pro">
                <CheckCircle size={18} />
                <span>REC/IREC trading income</span>
              </div>
              <div className="comparison-row con">
                <XCircle size={18} />
                <span>78 Lacs/MW investment required</span>
              </div>
              <div className="comparison-row con">
                <XCircle size={18} />
                <span>SPV governance involvement</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <div className="models-cta animate-on-scroll">
        <div className="cta-models-content">
          <h2 className="cta-models-title">Not Sure Which Model is Right for You?</h2>
          <p className="cta-models-description">
            Our team will analyze your consumption profile, financial objectives, and ESG goals 
            to recommend the optimal solar procurement model for your business.
          </p>
          <a href="/contact" className="cta-models-button">
            Schedule a Consultation
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </div>
  )
}
