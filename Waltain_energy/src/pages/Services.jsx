// Services.jsx
import { useEffect, useRef } from 'react'
import {
  BadgeDollarSign,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Leaf,
  LineChart,
  Sun,
  Zap,
  CheckCircle,
  ArrowRight,
  FileText,
  Users,
  ShieldCheck,
  Target,
} from 'lucide-react'

import '../styles/pages/services.css'
import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'

import solarImage from '../assets/images/solar.jpg'
import solarFarmsImage from '../assets/images/solar-farms.jpeg'
import renewableImage from '../assets/images/renewable.jpg'
import esgImage from '../assets/images/esg.jpg'
import auditImage from '../assets/images/unnamed.jpg'

const renewableSolarWindImage = '/waltain plant photos/pexels-quang-nguyen-vinh-222549-6876536.jpg'

export default function Services() {
  const observerRef = useRef(null)

  useEffect(() => {
    // SEO Optimization
    document.title = 'Our Services | Waltain Energy - Complete Renewable Energy Solutions'
    
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Comprehensive renewable energy services including Third Party Solar PPA, Captive Solar Farms, Rooftop Solar, Carbon Management, Energy Audits, and ESG Advisory. Save 1.5-2 Rs/Unit with zero investment options.',
      )
    }

    // Add keywords meta tag
    let keywords = document.querySelector('meta[name="keywords"]')
    if (!keywords) {
      keywords = document.createElement('meta')
      keywords.name = 'keywords'
      document.head.appendChild(keywords)
    }
    keywords.content = 'solar PPA, open access solar, captive solar farm, rooftop solar, carbon management, energy audit, ESG advisory, renewable energy services, green energy solutions'

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
    <div className="services-page">
      <PageHeader
        title="Our Services"
        subtitle="A complete set of renewable energy and advisory services built to support savings, compliance and execution."
      />

      {/* Services Overview */}
      <Section>
        <div className="services-intro animate-on-scroll">
          <p className="lead-text">
            We offer end-to-end renewable energy solutions designed to reduce costs, ensure compliance, 
            and accelerate your transition to clean power. From zero-investment solar PPAs to comprehensive 
            carbon management, our services are tailored to meet diverse industrial needs.
          </p>
        </div>
      </Section>

      {/* Main Services Grid */}
      <Section title="Our Solutions">
        <div className="main-services-grid">
          {/* Service 1: Third Party Solar PPA */}
          <div className="service-detail-card animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="service-header">
              <div className="service-icon-large blue-gradient">
                <Sun size={42} />
              </div>
              <div className="service-header-text">
                <h3 className="service-detail-title">Third Party Solar Power (Open Access)</h3>
                <p className="service-tagline">Zero Investment • Maximum Savings</p>
              </div>
            </div>

            <div className="service-body">
              <div className="service-body__content">
                <p className="service-detail-description">
                  Access solar power without any upfront capital investment through our third-party Power Purchase 
                  Agreement (PPA) model. Save 1.5-2 Rs/Unit on your electricity bills with a 12-year commitment 
                  and 100% off-take guarantee.
                </p>

                <div className="service-features-grid">
                  <div className="feature-item">
                    <LineChart size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Cost Savings</h5>
                      <p className="feature-text">1.5-2 Rs/Unit reduction vs current tariff</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <BadgeDollarSign size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Zero Investment</h5>
                      <p className="feature-text">No upfront capital required from buyer</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <CalendarDays size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Long-term PPA</h5>
                      <p className="feature-text">12-year agreement with stable pricing</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <ShieldCheck size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Supply Guarantee</h5>
                      <p className="feature-text">100% electricity off-take assured</p>
                    </div>
                  </div>
                </div>

                <div className="service-specs">
                  <h4 className="specs-title">Key Specifications</h4>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span className="spec-label">PPA Tariff:</span>
                      <span className="spec-value">4.25 Rs/Unit (Ex-bus)</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Connectivity:</span>
                      <span className="spec-value">11KVa & 66KVa</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Eligibility:</span>
                      <span className="spec-value">100+ kW contracted demand</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Payment Security:</span>
                      <span className="spec-value">6 months BG/LC</span>
                    </div>
                  </div>
                </div>

                <div className="service-highlight">
                  <Zap size={20} />
                  <span>Power supply commences within 180 days of mandate signing</span>
                </div>
              </div>

              <div className="service-body__media">
                <img className="service-body__img" src={solarImage} alt="Solar power" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Service 2: Captive/SPV Solar Farms */}
          <div className="service-detail-card animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="service-header">
              <div className="service-icon-large yellow-gradient">
                <Building2 size={42} />
              </div>
              <div className="service-header-text">
                <h3 className="service-detail-title">Captive/SPV Solar Farms</h3>
                <p className="service-tagline">Own Your Energy • Tax Benefits</p>
              </div>
            </div>

            <div className="service-body service-body--reverse">
              <div className="service-body__media">
                <img className="service-body__img" src={solarFarmsImage} alt="Solar farm" loading="lazy" />
              </div>

              <div className="service-body__content">
                <p className="service-detail-description">
                  Invest in captive solar capacity with shared ownership model. Benefit from accelerated 
                  depreciation, attractive ROI of approximately 3 years, and long-term energy security while 
                  building valuable infrastructure assets.
                </p>

                <div className="service-features-grid">
                  <div className="feature-item">
                    <LineChart size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Fast ROI</h5>
                      <p className="feature-text">~3 years payback period</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <FileText size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Tax Benefits</h5>
                      <p className="feature-text">26% accelerated depreciation</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <Leaf size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">ESG Advantage</h5>
                      <p className="feature-text">Free ESG advisory included</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <LineChart size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Bill Reduction</h5>
                      <p className="feature-text">Estimated 3 Rs/Unit savings</p>
                    </div>
                  </div>
                </div>

                <div className="service-specs">
                  <h4 className="specs-title">Investment Model (1MW Base)</h4>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span className="spec-label">Consumer Investment:</span>
                      <span className="spec-value">78 Lacs (26%)</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Total Project Cost:</span>
                      <span className="spec-value">3.01 Cr</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">PPA Rate:</span>
                      <span className="spec-value">4.25 Rs/Unit</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Depreciation:</span>
                      <span className="spec-value">26% Apportionate</span>
                    </div>
                  </div>
                </div>

                <div className="service-highlight highlight-success">
                  <CheckCircle size={20} />
                  <span>Most preferred mode with shared benefits of REC and IREC trading income</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service 3: Industrial Rooftop Solar */}
          <div className="service-detail-card animate-on-scroll" style={{ animationDelay: '0.3s' }}>
            <div className="service-header">
              <div className="service-icon-large blue-gradient">
                <Building2 size={42} />
              </div>
              <div className="service-header-text">
                <h3 className="service-detail-title">Industrial Rooftop Solar</h3>
                <p className="service-tagline">Maximize Space • Reduce Bills</p>
              </div>
            </div>

            <div className="service-body">
              <div className="service-body__content">
                <p className="service-detail-description">
                  Transform your rooftop into a power generation asset. Our industrial rooftop solar solutions 
                  provide immediate bill reduction, utilize unused space productively, and contribute directly 
                  to your sustainability commitments.
                </p>

                <div className="service-features-grid">
                  <div className="feature-item">
                    <Sun size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">On-site Generation</h5>
                      <p className="feature-text">Direct power at point of consumption</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <LineChart size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Bill Reduction</h5>
                      <p className="feature-text">Offset daytime electricity costs</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <ShieldCheck size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Net Metering</h5>
                      <p className="feature-text">Benefit from energy banking</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <Leaf size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Green Credits</h5>
                      <p className="feature-text">Enhance ESG profile</p>
                    </div>
                  </div>
                </div>

                <div className="service-specs">
                  <h4 className="specs-title">System Features</h4>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span className="spec-label">Panel Efficiency:</span>
                      <span className="spec-value">High-efficiency modules</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Installation:</span>
                      <span className="spec-value">Turnkey EPC service</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Warranty:</span>
                      <span className="spec-value">25-year performance guarantee</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Maintenance:</span>
                      <span className="spec-value">O&M support available</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="service-body__media">
                <img className="service-body__img" src={renewableImage} alt="Rooftop solar" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Service 4: Solar Farm EPC */}
          <div className="service-detail-card animate-on-scroll" style={{ animationDelay: '0.4s' }}>
            <div className="service-header">
              <div className="service-icon-large yellow-gradient">
                <Sun size={42} />
              </div>
              <div className="service-header-text">
                <h3 className="service-detail-title">Solar Farm EPC & DisCom Sale</h3>
                <p className="service-tagline">Complete Execution • Quality Assured</p>
              </div>
            </div>

            <div className="service-body service-body--reverse">
              <div className="service-body__media">
                <img className="service-body__img" src={renewableSolarWindImage} alt="Solar farm EPC" loading="lazy" />
              </div>

              <div className="service-body__content">
                <p className="service-detail-description">
                  End-to-end engineering, procurement, and construction services for utility-scale solar projects. 
                  We manage everything from design to commissioning, with optional DisCom sale arrangements for 
                  turnkey revenue generation.
                </p>

                <div className="service-features-grid">
                  <div className="feature-item">
                    <Building2 size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Turnkey Solution</h5>
                      <p className="feature-text">Design, procure, construct, commission</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <CheckCircle size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Quality Assurance</h5>
                      <p className="feature-text">Stringent quality control processes</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <Users size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">DisCom Coordination</h5>
                      <p className="feature-text">Complete regulatory handling</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <ShieldCheck size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Performance Guarantee</h5>
                      <p className="feature-text">Long-term output warranties</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service 5: Carbon Management */}
          <div className="service-detail-card animate-on-scroll" style={{ animationDelay: '0.5s' }}>
            <div className="service-header">
              <div className="service-icon-large blue-gradient">
                <Leaf size={42} />
              </div>
              <div className="service-header-text">
                <h3 className="service-detail-title">Carbon Management & ESG Advisory</h3>
                <p className="service-tagline">Measure • Reduce • Report</p>
              </div>
            </div>

            <div className="service-body">
              <div className="service-body__content">
                <p className="service-detail-description">
                  Comprehensive carbon footprint assessment and management strategies to help you achieve net-zero 
                  goals. We provide ESG disclosure advisory, facilitate REC and IREC trading, and develop 
                  decarbonization roadmaps tailored to your industry.
                </p>

                <div className="service-features-grid">
                  <div className="feature-item">
                    <Target size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Carbon Assessment</h5>
                      <p className="feature-text">Comprehensive footprint analysis</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <LineChart size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Reduction Strategy</h5>
                      <p className="feature-text">Custom decarbonization roadmaps</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <FileText size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">ESG Reporting</h5>
                      <p className="feature-text">Disclosure and compliance support</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <CheckCircle size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">REC/IREC Trading</h5>
                      <p className="feature-text">Renewable certificate facilitation</p>
                    </div>
                  </div>
                </div>

                <div className="service-highlight highlight-green">
                  <Leaf size={20} />
                  <span>Free ESG advisory included with all our solar power solutions</span>
                </div>
              </div>

              <div className="service-body__media">
                <img className="service-body__img" src={esgImage} alt="ESG and sustainability" loading="lazy" />
              </div>
            </div>
          </div>

          {/* Service 6: Energy Audits */}
          <div className="service-detail-card animate-on-scroll" style={{ animationDelay: '0.6s' }}>
            <div className="service-header">
              <div className="service-icon-large yellow-gradient">
                <ClipboardCheck size={42} />
              </div>
              <div className="service-header-text">
                <h3 className="service-detail-title">Energy Audits & Consulting</h3>
                <p className="service-tagline">Analyze • Optimize • Save</p>
              </div>
            </div>

            <div className="service-body service-body--reverse">
              <div className="service-body__media">
                <img className="service-body__img" src={auditImage} alt="Energy audit" loading="lazy" />
              </div>

              <div className="service-body__content">
                <p className="service-detail-description">
                  Expert energy audits to identify inefficiencies and savings opportunities in your operations. 
                  We analyze consumption patterns, evaluate tariff structures, and provide actionable recommendations 
                  for optimizing energy usage and costs.
                </p>

                <div className="service-features-grid">
                  <div className="feature-item">
                    <ClipboardCheck size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Detailed Analysis</h5>
                      <p className="feature-text">Comprehensive energy consumption review</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <LineChart size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Savings ID</h5>
                      <p className="feature-text">Identify cost reduction opportunities</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <FileText size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Implementation Plan</h5>
                      <p className="feature-text">Actionable roadmap for optimization</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <LineChart size={22} className="feature-icon" />
                    <div className="feature-content">
                      <h5 className="feature-title">Ongoing Support</h5>
                      <p className="feature-text">Continuous monitoring and improvement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Our Approach */}
      <Section title="How We Work" eyebrow="Our Approach">
        <div className="approach-container animate-on-scroll">
          <p className="approach-intro">
            Our streamlined process ensures rapid deployment and measurable results, typically 
            delivering solar power within 180 days of engagement.
          </p>
          
          <div className="approach-timeline">
            <div className="timeline-step animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <div className="step-number">01</div>
              <div className="step-content">
                <h4 className="step-title">Assess & Analyze</h4>
                <p className="step-description">
                  Bill analysis for primary data collection. We evaluate eligibility criteria (100+ kW load), 
                  review load profiles, assess location connectivity, and perform detailed tariff comparison 
                  to establish baseline savings potential.
                </p>
                <ul className="step-checklist">
                  <li>Eligibility verification (GERC regulations)</li>
                  <li>Load profile analysis</li>
                  <li>Location and connectivity mapping</li>
                  <li>Tariff structure comparison</li>
                </ul>
              </div>
            </div>

            <div className="timeline-connector">
              <ArrowRight size={24} />
            </div>

            <div className="timeline-step animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="step-number">02</div>
              <div className="step-content">
                <h4 className="step-title">Structure & Design</h4>
                <p className="step-description">
                  Mandate signing and solution design. Define optimal model (PPA/Captive/SPV), calculate 
                  precise savings (1.5-2 Rs/Unit), establish contract tenure (typically 12 years), outline 
                  compliance requirements, and create detailed implementation timeline.
                </p>
                <ul className="step-checklist">
                  <li>Model selection and structuring</li>
                  <li>Financial modeling and savings calculation</li>
                  <li>PPA termsheet preparation</li>
                  <li>Compliance roadmap creation</li>
                </ul>
              </div>
            </div>

            <div className="timeline-connector">
              <ArrowRight size={24} />
            </div>

            <div className="timeline-step animate-on-scroll" style={{ animationDelay: '0.3s' }}>
              <div className="step-number">03</div>
              <div className="step-content">
                <h4 className="step-title">Execute & Deliver</h4>
                <p className="step-description">
                  Solar power supply within 180 days. We coordinate all stakeholders including GETCO, 
                  DisCom, and regulatory authorities, manage approvals, oversee construction/connectivity, 
                  implement execution governance, and provide ongoing reporting support.
                </p>
                <ul className="step-checklist">
                  <li>Stakeholder coordination and approvals</li>
                  <li>SS connectivity and grid integration</li>
                  <li>Commissioning and testing</li>
                  <li>Monthly billing and reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Comparison Table */}
      <Section title="Solution Comparison" eyebrow="Choose Your Model">
        <div className="comparison-table-wrapper animate-on-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th className="highlight-col">Third Party PPA</th>
                <th>Captive/SPV Model</th>
                <th>Rooftop Solar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="row-label">Investment Required</td>
                <td className="highlight-col"><strong>0 Rs (Zero)</strong></td>
                <td>78 Lacs/MW (26%)</td>
                <td>Varies by capacity</td>
              </tr>
              <tr>
                <td className="row-label">Savings Per Unit</td>
                <td className="highlight-col"><strong>1.5-2 Rs/Unit</strong></td>
                <td>~3 Rs/Unit</td>
                <td>2-3 Rs/Unit</td>
              </tr>
              <tr>
                <td className="row-label">Contract Duration</td>
                <td className="highlight-col">12 Years</td>
                <td>Ownership model</td>
                <td>Ownership model</td>
              </tr>
              <tr>
                <td className="row-label">ROI Period</td>
                <td className="highlight-col">Immediate savings</td>
                <td>~3 Years</td>
                <td>4-6 Years</td>
              </tr>
              <tr>
                <td className="row-label">Tax Benefits</td>
                <td className="highlight-col">No</td>
                <td>26% Depreciation</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td className="row-label">Eligibility</td>
                <td className="highlight-col">100+ kW load</td>
                <td>100+ kW load</td>
                <td>Any capacity</td>
              </tr>
              <tr>
                <td className="row-label">ESG Benefits</td>
                <td className="highlight-col">✓ Free advisory</td>
                <td>✓ Free advisory + IREC</td>
                <td>✓ Carbon credits</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* CTA Section */}
      <div className="services-cta animate-on-scroll">
        <div className="cta-content-services">
          <h2 className="cta-title-services">Ready to Start Saving?</h2>
          <p className="cta-description-services">
            Get a free bill analysis and discover how much you can save with solar power. 
            Our experts will evaluate your consumption and recommend the best solution.
          </p>
          <div className="cta-stats-inline">
            <div className="inline-stat">
              <span className="inline-stat-value">180 Days</span>
              <span className="inline-stat-label">To Power Supply</span>
            </div>
            <div className="inline-stat">
              <span className="inline-stat-value">15.5 MW</span>
              <span className="inline-stat-label">Capacity Secured</span>
            </div>
            <div className="inline-stat">
              <span className="inline-stat-value">1.5-2 ₹</span>
              <span className="inline-stat-label">Savings Per Unit</span>
            </div>
          </div>
          <a href="/contact" className="cta-button-services">
            Request Free Consultation
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </div>
  )
}
