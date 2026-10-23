// About.jsx
import { useEffect, useRef } from 'react'
import '../styles/pages/about.css'
import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'

import aboutUsImage from '../assets/images/aboutUs.png'
import mckinseyLogo from '../assets/assosiacte/McKinsey&Company.png'
import adaniLogo from '../assets/assosiacte/Adani logo.png'
import relianceLogo from '../assets/assosiacte/Reliance Industries Logo.png'
import recykalLogo from '../assets/assosiacte/recykaldotcom_logo.jpeg'
import vibhuImage from '../assets/Team/Vibhu_Rakesh.png'
import jalpanImage from '../assets/Team/Jalpan_dave.png'
import praneetImage from '../assets/Team/Praneet Kumar.jpeg'
import pestonjeeImage from '../assets/Team/Advisors/Dr D M PESTONJEE.png'
import badriImage from '../assets/Team/Advisors/Dr badri Narayan.png'

export default function About() {
  const observerRef = useRef(null)

  useEffect(() => {
    // SEO Optimization
    document.title = 'About Us | Waltain Energy - Leading Renewable Energy Solutions Provider'
    
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Waltain Energy Private Limited - Empowering Sustainability, Simplifying Access. We deliver innovative renewable energy solutions including solar power, open access, and carbon management with 30+ years of combined experience.',
      )
    }

    // Add keywords meta tag
    let keywords = document.querySelector('meta[name="keywords"]')
    if (!keywords) {
      keywords = document.createElement('meta')
      keywords.name = 'keywords'
      document.head.appendChild(keywords)
    }
    keywords.content = 'renewable energy, solar power, open access solar, captive solar, carbon management, ESG advisory, green energy, sustainable energy, solar EPC, Waltain Energy'

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Waltain Energy Private Limited",
      "description": "Empowering Sustainability, Simplifying Access",
      "url": window.location.origin,
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "Gujarat"
      }
    }
    
    let scriptTag = document.querySelector('script[type="application/ld+json"]')
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.type = 'application/ld+json'
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(structuredData)

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
    <div className="about-page">
      <PageHeader
        title="About Waltain Energy"
        subtitle="Empowering Sustainability, Simplifying Access"
      />

      {/* Vision & Mission Section */}
      <Section>
        <div className="vision-mission-container animate-on-scroll">
          <div className="vision-mission-card vision-card">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="card-title">Our Vision</h3>
            <p className="card-description">
              To lead the transition to a sustainable future by making renewable energy accessible to all, 
              fostering innovation, and driving environmental stewardship for generations to come.
            </p>
          </div>

          <div className="vision-mission-card mission-card">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="card-title">Our Mission</h3>
            <p className="card-description">
              To deliver innovative and accessible renewable energy solutions that empower communities, 
              enhance energy independence, and contribute to a greener, more sustainable planet.
            </p>
          </div>
        </div>
      </Section>

      {/* Who We Are Section */}
      <Section title="Who We Are">
        <div className="who-we-are animate-on-scroll">
          <div className="who-we-are__top">
            <div className="content-block">
              <p className="lead">
                Waltain Energy Private Limited (CIN: U35105GJ2024PTC152346) is a pioneering renewable energy 
                company committed to accelerating India's transition to clean power. We specialize in making 
                solar energy accessible, affordable, and reliable for eligible consumers across industries.
              </p>
              <p className="lead">
                With a focus on practical implementation, we balance cost savings, regulatory compliance, 
                and operational reliability to deliver tangible value to our clients. Our approach combines 
                strategic insight with on-ground execution excellence.
              </p>
            </div>

            <div className="who-we-are__image">
              <img
                className="who-we-are__img"
                src={aboutUsImage}
                alt="About Waltain Energy"
                loading="lazy"
              />
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-item animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <div className="stat-number">30+</div>
              <div className="stat-label">Years Combined Experience</div>
            </div>
            <div className="stat-item animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="stat-number">15.5 MW</div>
              <div className="stat-label">Total Capacity Secured</div>
            </div>
            <div className="stat-item animate-on-scroll" style={{ animationDelay: '0.3s' }}>
              <div className="stat-number">180 Days</div>
              <div className="stat-label">Solar Supply Timeline</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Our Services Section */}
      <Section title="Our Services">
        <div className="services-intro animate-on-scroll">
          <p className="lead centered">
            We offer comprehensive renewable energy solutions tailored to meet diverse business needs, 
            from power procurement to complete EPC projects and carbon management.
          </p>
        </div>

        <div className="services-grid">
          <div className="service-card animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="service-icon blue-bg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v6m0 6v6M6 12H1m6 0h6m6 0h5" />
              </svg>
            </div>
            <h4 className="service-title">Third Party Power Purchase (Open Access)</h4>
            <p className="service-description">
              Save 1.5-2 Rs/Unit through our 12-year PPA with 100% electricity off-take guarantee. 
              Zero investment required from buyers with transparent pricing at 4.25 Rs/Unit.
            </p>
            <ul className="service-features">
              <li>No upfront investment</li>
              <li>11KVa & 66KVa connectivity</li>
              <li>SS connectivity included</li>
              <li>Monthly billing adjustment</li>
            </ul>
          </div>

          <div className="service-card animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="service-icon yellow-bg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h4 className="service-title">Industrial Rooftop Solar</h4>
            <p className="service-description">
              Maximize your rooftop space with our industrial solar installations. Reduce electricity 
              costs while contributing to your sustainability goals.
            </p>
            <ul className="service-features">
              <li>Customized system design</li>
              <li>High-efficiency panels</li>
              <li>Net metering benefits</li>
              <li>Complete installation support</li>
            </ul>
          </div>

          <div className="service-card animate-on-scroll" style={{ animationDelay: '0.3s' }}>
            <div className="service-icon blue-bg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h4 className="service-title">Solar Farm EPC & Sale to DisCom</h4>
            <p className="service-description">
              End-to-end engineering, procurement, and construction services for utility-scale solar projects 
              with DisCom sale arrangements.
            </p>
            <ul className="service-features">
              <li>Turnkey EPC solutions</li>
              <li>Quality assurance</li>
              <li>DisCom coordination</li>
              <li>Performance guarantees</li>
            </ul>
          </div>

          <div className="service-card animate-on-scroll" style={{ animationDelay: '0.4s' }}>
            <div className="service-icon yellow-bg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h4 className="service-title">Captive/SPV Solar Farms</h4>
            <p className="service-description">
              Invest in captive solar capacity with attractive ROI of ~3 years. Get tax benefits through 
              26% accelerated depreciation and free ESG advisory.
            </p>
            <ul className="service-features">
              <li>26% consumer investment</li>
              <li>3-year ROI approx</li>
              <li>Tax benefits included</li>
              <li>IREC & emission trading</li>
            </ul>
          </div>

          <div className="service-card animate-on-scroll" style={{ animationDelay: '0.5s' }}>
            <div className="service-icon blue-bg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h4 className="service-title">Carbon Management & ESG Advisory</h4>
            <p className="service-description">
              Comprehensive carbon footprint analysis and management strategies. Free ESG disclosure advisory 
              with our solar solutions.
            </p>
            <ul className="service-features">
              <li>Carbon footprint assessment</li>
              <li>Decarbonization roadmaps</li>
              <li>ESG reporting support</li>
              <li>REC & IREC facilitation</li>
            </ul>
          </div>

          <div className="service-card animate-on-scroll" style={{ animationDelay: '0.6s' }}>
            <div className="service-icon yellow-bg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h4 className="service-title">Energy Audits & Consulting</h4>
            <p className="service-description">
              Expert energy audits to identify savings opportunities and optimize energy consumption patterns 
              for maximum efficiency.
            </p>
            <ul className="service-features">
              <li>Detailed energy analysis</li>
              <li>Savings identification</li>
              <li>Implementation roadmaps</li>
              <li>Ongoing optimization</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Leadership Team Section */}
      <Section title="Leadership Team">
        <div className="team-intro animate-on-scroll">
          <p className="lead centered">
            Our proficient team of green energy experts is driven by a shared commitment to sustainable innovation. 
            With a solid track record in developing and implementing effective renewable energy solutions, we combine 
            extensive knowledge with a passion for creating a cleaner and more sustainable future.
          </p>
        </div>

          <div className="leadership-grid">
          <div className="team-member animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="member-avatar">
              <img src={vibhuImage} alt="Vibhu Rakesh" loading="lazy" />
            </div>
            <h4 className="member-name">Vibhu Rakesh</h4>
            <p className="member-role">Co-Founder</p>
            <p className="member-bio">
              Strategic leader with extensive experience in renewable energy project development and 
              business strategy from top-tier consulting background.
            </p>
          </div>

          <div className="team-member animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="member-avatar">
              <img src={jalpanImage} alt="Jalpan Dave" loading="lazy" />
            </div>
            <h4 className="member-name">Jalpan Dave</h4>
            <p className="member-role">Co-Founder</p>
            <p className="member-bio">
              Operations and execution expert with deep industry experience from leading energy 
              infrastructure companies in India.
            </p>
          </div>

          <div className="team-member director-card animate-on-scroll" style={{ animationDelay: '0.3s' }}>
            <div className="member-avatar">
              <img src={praneetImage} alt="Praneet Kumar" loading="lazy" />
            </div>
            <h4 className="member-name">Praneet Kumar</h4>
            <p className="member-role">Director</p>
            <p className="member-bio">
              Provides governance oversight and strategic guidance, supporting execution discipline and long-term stakeholder value.
            </p>
          </div>
        </div>
      </Section>

      {/* Advisory Board Section */}
      <Section title="Advisory Board">
        <div className="advisors-grid advisory-board-grid">
          <div className="advisor-card animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="advisor-header">
              <div className="advisor-avatar">
                <img src={pestonjeeImage} alt="Dr. D M Pestonjee" loading="lazy" />
              </div>
              <div className="advisor-info">
                <h4 className="advisor-name">Dr. D M Pestonjee</h4>
                <p className="advisor-title">Strategic Advisor</p>
              </div>
            </div>
            <p className="advisor-credentials">
              Chair Professor and former Dean (OB) at IIM Ahmedabad. Former Advisor to Tata Group, 
              bringing decades of organizational excellence and strategic guidance.
            </p>
          </div>

          <div className="advisor-card animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="advisor-header">
              <div className="advisor-avatar">
                <img src={badriImage} alt="Dr. Badri Narayan" loading="lazy" />
              </div>
              <div className="advisor-info">
                <h4 className="advisor-name">Dr. Badri Narayan</h4>
                <p className="advisor-title">Policy Advisor</p>
              </div>
            </div>
            <p className="advisor-credentials">
              Economist and Former Joint Secretary at NITI Aayog. Expert in policy framework, 
              economic planning, and sustainable development strategies.
            </p>
          </div>
        </div>
      </Section>

      {/* Heritage Section */}
      <Section title="Our Heritage">
        <div className="heritage-section animate-on-scroll">
          <p className="lead heritage-intro">
            Our team includes alumni from McKinsey & Company, Adani Group, Reliance Group, and Recykal.
          </p>
          
          <div className="company-grid">
            <div className="company-card animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <div className="company-logo">
                <img src={mckinseyLogo} alt="McKinsey & Company logo" loading="lazy" />
              </div>
              <div className="company-card__name">McKinsey & Company</div>
              <div className="company-card__badge">Strategy & Consulting</div>
              <p className="company-description">
                Global management consulting expertise in energy transition and strategic planning.
              </p>
            </div>

            <div className="company-card animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="company-logo">
                <img src={adaniLogo} alt="Adani Group logo" loading="lazy" />
              </div>
              <div className="company-card__name">Adani Group</div>
              <div className="company-card__badge">Energy & Infrastructure</div>
              <p className="company-description">
                Large-scale renewable energy project development and infrastructure execution.
              </p>
            </div>

            <div className="company-card animate-on-scroll" style={{ animationDelay: '0.3s' }}>
              <div className="company-logo">
                <img src={relianceLogo} alt="Reliance Group logo" loading="lazy" />
              </div>
              <div className="company-card__name">Reliance Group</div>
              <div className="company-card__badge">Operations & Scale</div>
              <p className="company-description">
                Operational excellence and scaling capabilities in energy sector operations.
              </p>
            </div>

            <div className="company-card animate-on-scroll" style={{ animationDelay: '0.4s' }}>
              <div className="company-logo">
                <img src={recykalLogo} alt="Recykal logo" loading="lazy" />
              </div>
              <div className="company-card__name">Recykal</div>
              <div className="company-card__badge">Sustainability Tech</div>
              <p className="company-description">
                Innovation in circular economy and sustainable technology solutions.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section title="Why Choose Waltain Energy">
        <div className="why-choose-grid">
          <div className="benefit-card animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="benefit-number">01</div>
            <h4 className="benefit-title">Zero Investment Options</h4>
            <p className="benefit-description">
              Access solar power with no upfront capital through our third-party PPA model, 
              reducing your electricity bills by approximately 20%.
            </p>
          </div>

          <div className="benefit-card animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="benefit-number">02</div>
            <h4 className="benefit-title">Proven Track Record</h4>
            <p className="benefit-description">
              15.5 MW total capacity secured with partnerships established and PPAs & EOIs received 
              from diverse industrial clients.
            </p>
          </div>

          <div className="benefit-card animate-on-scroll" style={{ animationDelay: '0.3s' }}>
            <div className="benefit-number">03</div>
            <h4 className="benefit-title">Comprehensive Support</h4>
            <p className="benefit-description">
              From initial bill analysis to solar power supply in 180 days, we manage the entire 
              process including regulatory approvals and connectivity.
            </p>
          </div>

          <div className="benefit-card animate-on-scroll" style={{ animationDelay: '0.4s' }}>
            <div className="benefit-number">04</div>
            <h4 className="benefit-title">Regulatory Expertise</h4>
            <p className="benefit-description">
              Deep understanding of GERC regulations, open access policies, and compliance requirements 
              ensuring seamless implementation.
            </p>
          </div>

          <div className="benefit-card animate-on-scroll" style={{ animationDelay: '0.5s' }}>
            <div className="benefit-number">05</div>
            <h4 className="benefit-title">ESG Value Addition</h4>
            <p className="benefit-description">
              Free ESG advisory, support with IREC and emission trading, helping you achieve 
              sustainability goals while saving costs.
            </p>
          </div>

          <div className="benefit-card animate-on-scroll" style={{ animationDelay: '0.6s' }}>
            <div className="benefit-number">06</div>
            <h4 className="benefit-title">Flexible Solutions</h4>
            <p className="benefit-description">
              Multiple engagement models including third-party PPA, captive/SPV, and rooftop solar 
              tailored to your specific requirements.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <div className="cta-section animate-on-scroll">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Energy Future?</h2>
          <p className="cta-description">
            Let's discuss how Waltain Energy can help you achieve significant cost savings while 
            advancing your sustainability goals.
          </p>
          <div className="cta-buttons">
            <a href="/contact" className="btn btn-primary">Get Started Today</a>
            <a href="/services" className="btn btn-secondary" style={{ color: '#fff' }}>Explore Our Services</a>
          </div>
        </div>
      </div>
    </div>
  )
}
