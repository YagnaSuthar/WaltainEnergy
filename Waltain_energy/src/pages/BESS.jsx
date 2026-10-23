// BESS.jsx — Battery Energy Storage Systems page
import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { BatteryCharging, Cpu, Layers, ArrowRight, Wind, Zap, TrendingUp, AlertCircle, Thermometer } from 'lucide-react'

import '../styles/pages/bess.css'
import Section from '../components/Section.jsx'

import solarBackgroundImage from '../assets/images/solar.jpg'

export default function BESS() {
  const observerRef = useRef(null)
  const circuitWrapRef = useRef(null)
  const tooltipRef = useRef(null)

  const countUpRef = useCallback((node) => {
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const els = node.querySelectorAll('[data-count]')
            els.forEach((el) => {
              const text = el.getAttribute('data-count')
              el.textContent = text
            })
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.3 },
    )
    io.observe(node)
  }, [])

  // Circuit tooltip handler
  const handleCircuitTip = useCallback((evt) => {
    const el = evt.currentTarget
    const msg = el.getAttribute('data-tip')
    if (!msg || !circuitWrapRef.current || !tooltipRef.current) return
    const wrap = circuitWrapRef.current
    const tip = tooltipRef.current
    const rect = wrap.getBoundingClientRect()
    let x = evt.clientX - rect.left + 12
    let y = evt.clientY - rect.top + 12
    if (x + 230 > wrap.offsetWidth) x = wrap.offsetWidth - 240
    if (y + 80 > wrap.offsetHeight) y = y - 80
    tip.style.left = x + 'px'
    tip.style.top = y + 'px'
    tip.textContent = msg
    tip.classList.add('visible')
    clearTimeout(tip._hideTimer)
    tip._hideTimer = setTimeout(() => {
      tip.classList.remove('visible')
    }, 3200)
  }, [])

  useEffect(() => {
    document.title = 'BESS Solutions | Waltain Energy'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        "Waltain Energy's BESS solutions integrate Lithium Iron Phosphate (LFP) battery systems behind-the-meter.",
      )
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            observerRef.current.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const animatableElements = document.querySelectorAll('.animate-on-scroll')
    animatableElements.forEach((el) => observerRef.current.observe(el))

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [])

  return (
    <div className="bess-page">
      {/* ─── 1. HERO SECTION ─── */}
      <div
        className="bess-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${solarBackgroundImage})`,
        }}
      >
        <div className="container">
          <div className="bess-hero__inner">
            <div className="animate-on-scroll">
              <span className="bess-hero__eyebrow">End-to-End Battery Storage Solutions</span>
              <h1 className="bess-hero__h1">
                Store <span className="hl-teal">Smart.</span><br />
                Dispatch Faster.<br />
                Save <span className="hl-amber">More.</span>
              </h1>
              <p className="bess-hero__sub">
                Waltain Energy's BESS solutions integrate Lithium Iron Phosphate (LFP) battery systems behind-the-meter — intelligently storing solar surplus and grid power to eliminate peak demand charges, replace diesel generators, and deliver round-the-clock energy resilience.
              </p>
            </div>

            <div className="bess-hero-panel animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="bess-hero-panel__title">Typical C&I Outcomes</div>
              <div className="bess-hero-panel__item">
                <span className="bess-hero-panel__label">Solar Energy Cost</span>
                <span className="bess-hero-panel__value">₹4–4.5 /kWh</span>
              </div>
              <div className="bess-hero-panel__item">
                <span className="bess-hero-panel__label">vs Grid Tariff</span>
                <span className="bess-hero-panel__value">₹7–10 /kWh</span>
              </div>
              <div className="bess-hero-panel__item">
                <span className="bess-hero-panel__label">Bill Reduction</span>
                <span className="bess-hero-panel__value">40–70%</span>
              </div>
              <div className="bess-hero-panel__item">
                <span className="bess-hero-panel__label">Payback Period</span>
                <span className="bess-hero-panel__value">4–6 yrs</span>
              </div>
              <div className="bess-hero-panel__item" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <span className="bess-hero-panel__label">Project Status</span>
                <span className="bess-hero-panel__value" style={{ color: '#fff' }}>
                  <span className="bess-hero-panel__tag" style={{ margin: 0, background: 'rgba(255,255,255,0.08)', color: '#DFF7EA' }}>Operational &amp; New</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* ─── 3. WHAT WE DELIVER ─── */}
      <Section title="What We Deliver" eyebrow="Core Capabilities" className="bg-soft">
        <div className="bess-deliver-list animate-on-scroll">
          {[
            { dot: 'yellow', title: 'Behind-the-Meter Solar PV', desc: 'Rooftop / ground mount · Zero wheeling charges' },
            { dot: 'blue', title: 'Battery Energy Storage (BESS)', desc: 'Peak demand shaving · DG replacement · backup' },
            { dot: 'yellow', title: 'SPV Formation & Legal Structuring', desc: '0% OPEX/PPA or 26% SPV equity · captive compliance' },
            { dot: 'blue', title: 'Turnkey EPC Execution', desc: 'Engineering · procurement · construction' },
            { dot: 'dark', title: 'O&M + ESG & REC Reporting', desc: '25-yr asset mgmt · Scope 2 carbon data' },
          ].map((item, index) => (
            <div className="bess-deliver-row" key={index}>
              <div className={`bess-deliver-dot dot-${item.dot}`} />
              <div>
                <h4 className="bess-deliver-title">{item.title}</h4>
                <p className="bess-deliver-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── 4. INDUSTRIES WE SERVE ─── */}
      <Section title="Industries We Serve">
        <div className="bess-industries-grid animate-on-scroll">
          {[
            { industry: 'Textiles & Apparel', badge: 'High Load' },
            { industry: 'Manufacturing & Auto', badge: 'Multi-Shift' },
            { industry: 'Pharma & Chemicals', badge: '24×7 Critical' },
            { industry: 'IT Parks & Data Centres', badge: 'Cooling Load' },
            { industry: 'Warehousing & Cold Chain', badge: 'Large Rooftop' },
            { industry: 'Hospitals & Healthcare', badge: 'Resilience' },
            { industry: 'Retail, Malls & Hotels', badge: 'HVAC Load' },
            { industry: 'Agro-Processing & Food', badge: 'Seasonal' },
          ].map((item, index) => (
            <div className="bess-industry-card" key={index}>
              <span className="bess-industry-name">{item.industry}</span>
              <span className="bess-industry-badge">{item.badge}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── 5. TECHNOLOGY CARDS ─── */}
      <Section title="Built on LFP Chemistry — The Safest, Longest-Life BESS" eyebrow="Technology" className="bg-soft">
        <div className="bess-tech-grid" style={{ marginTop: '2rem' }}>

          <div className="tech-card-modern animate-on-scroll">
            <div className="tech-card-icon-wrapper">
              <BatteryCharging size={28} />
            </div>
            <h3 className="tech-card-title">LFP Battery Modules</h3>
            <p className="tech-card-desc">
              Lithium Iron Phosphate — the benchmark for safety, thermal stability, and longevity in C&I applications.
            </p>
            <ul className="tech-features-list">
              <li>No thermal runaway risk — inherently stable chemistry</li>
              <li>6,000+ charge-discharge cycles at 80% DoD</li>
              <li>Operating temp: −20°C to +60°C</li>
              <li>UL / IEC 62619 certified modules</li>
              <li>10-year warranty standard, 15-year optional</li>
            </ul>
          </div>

          <div className="tech-card-modern animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="tech-card-icon-wrapper">
              <Cpu size={28} />
            </div>
            <h3 className="tech-card-title">Smart BMS & EMS Integration</h3>
            <p className="tech-card-desc">
              Every BESS ships with an integrated Battery Management System connected to our cloud Energy Management System for autonomous operation.
            </p>
            <ul className="tech-features-list">
              <li>Cell-level voltage, temperature & SOC monitoring</li>
              <li>Autonomous charge/dispatch scheduling</li>
              <li>Grid signal response in &lt;20ms</li>
              <li>AI-driven load forecasting & BESS pre-conditioning</li>
              <li>SCADA integration with existing plant DCS</li>
            </ul>
          </div>

          <div className="tech-card-modern animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="tech-card-icon-wrapper">
              <Layers size={28} />
            </div>
            <h3 className="tech-card-title">Modular & Scalable Design</h3>
            <p className="tech-card-desc">
              BESS capacity designed to grow with your load — add rack modules without system downtime. Right-sized from 100 kWh to 50 MWh+.
            </p>
            <ul className="tech-features-list">
              <li>Containerized BESS skids (20ft / 40ft options)</li>
              <li>Rack-level modularity — add capacity online</li>
              <li>DC-coupled or AC-coupled configurations</li>
              <li>IP54 weatherproof enclosures with fire suppression</li>
              <li>Compatible with all major solar inverter brands</li>
            </ul>
          </div>

        </div>
      </Section>

      {/* ─── 5.5 HOW BESS WORKS — CIRCUIT DIAGRAM ─── */}
      <section className="circuit-section">
        <div className="section-inner container">
          <div className="section-label" style={{ color: 'var(--color-tertiary)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>System Architecture</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.15 }}>How BESS <span style={{ color: 'var(--color-tertiary)' }}>Connects</span> — Live Circuit</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '700px', lineHeight: 1.7 }}>
            Every Waltain BESS deployment follows this behind-the-meter architecture —
            solar generation, intelligent storage, and grid as backup, all orchestrated
            by a single EMS/BMS control bus. Click any node to learn more.
          </p>
          <div className="circuit-wrap" ref={circuitWrapRef} onMouseLeave={() => tooltipRef.current?.classList.remove('visible')}>
            <div ref={tooltipRef} className="circuit-tooltip" />
            <svg
              width="100%"
              viewBox="0 0 680 640"
              xmlns="http://www.w3.org/2000/svg"
              id="bess-circuit"
              style={{ display: 'block' }}
            >
              {/* DEFS — Arrow markers */}
              <defs>
                <marker id="arr-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#C8821A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
                <marker id="arr-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#0D8A5A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
                <marker id="arr-teal-lt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#1DB87D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
                <marker id="arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="#1A6FC4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>

              {/* SOLAR HALO */}
              <ellipse className="solar-halo" cx="340" cy="72" rx="76" ry="30" fill="#F5A623" />

              {/* NODE 1 — Solar PV Array */}
              <g className="circuit-node" data-tip="Rooftop or ground-mounted solar PV. Generates DC power during daylight hours. Wired directly behind the meter — zero wheeling charges." onClick={handleCircuitTip}>
                <rect x="246" y="36" width="188" height="66" rx="10" fill="#FFF4DF" stroke="#F5A623" strokeWidth="1.5" />
                <text x="340" y="62" fontFamily="'Barlow Condensed', sans-serif" fontSize="15" fontWeight="700" fill="#C8821A" textAnchor="middle" dominantBaseline="central">Solar PV Array</text>
                <text x="340" y="80" fontFamily="'Barlow', sans-serif" fontSize="11" fontWeight="400" fill="#C8821A" textAnchor="middle" dominantBaseline="central">Rooftop / ground mount · BTM</text>
              </g>

              {/* WIRE 1 — Solar PV → Hybrid Inverter */}
              <line className="flow-amber" x1="340" y1="102" x2="340" y2="158" stroke="#F5A623" strokeWidth="2.5" fill="none" markerEnd="url(#arr-amber)" />
              <text x="352" y="132" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#C8821A" dominantBaseline="central">DC</text>

              {/* NODE 2 — Hybrid Inverter / PCS */}
              <g className="circuit-node node-inverter-pulse" data-tip="Power Conversion System — converts DC from solar to AC for the building, manages BESS charge/discharge, and responds to grid signals in under 20ms." onClick={handleCircuitTip}>
                <rect x="210" y="160" width="260" height="68" rx="10" fill="#E8EFF5" stroke="#6B7E94" strokeWidth="1.5" />
                <text x="340" y="184" fontFamily="'Barlow Condensed', sans-serif" fontSize="15" fontWeight="700" fill="#1E2B38" textAnchor="middle" dominantBaseline="central">Hybrid Inverter / PCS</text>
                <text x="340" y="202" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#344658" textAnchor="middle" dominantBaseline="central">{'DC↔AC · BMS interface · <20ms response'}</text>
              </g>

              {/* WIRE 2 — Inverter → BESS (charge) */}
              <path className="flow-teal" d="M 282,228 L 282,296 L 190,296 L 190,340" stroke="#1DB87D" strokeWidth="2.5" fill="none" markerEnd="url(#arr-teal)" />
              <text x="227" y="282" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#0D8A5A" textAnchor="middle" dominantBaseline="central">charge</text>

              {/* WIRE 3 — Inverter → Factory Load */}
              <path className="flow-amber" d="M 398,228 L 398,296 L 490,296 L 490,340" stroke="#F5A623" strokeWidth="2.5" fill="none" markerEnd="url(#arr-amber)" />
              <text x="442" y="282" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#C8821A" textAnchor="middle" dominantBaseline="central">AC out</text>

              {/* NODE 3 — BESS */}
              <g className="circuit-node" data-tip="LFP Battery Energy Storage System. Stores solar surplus during the day and dispatches during evening peak hours. 6,000+ cycles, 92–95% round-trip efficiency, BMS-managed." onClick={handleCircuitTip}>
                <rect x="100" y="340" width="180" height="84" rx="10" fill="#E2F7ED" stroke="#1DB87D" strokeWidth="1.5" />
                <text x="190" y="358" fontFamily="'Barlow Condensed', sans-serif" fontSize="16" fontWeight="700" fill="#0D8A5A" textAnchor="middle" dominantBaseline="central">BESS</text>
                <text x="190" y="377" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#0D8A5A" textAnchor="middle" dominantBaseline="central">LFP · 6,000+ cycles</text>
                <text x="190" y="394" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#0D8A5A" textAnchor="middle" dominantBaseline="central">100 kWh – 50 MWh+</text>
                <text x="190" y="411" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#0D8A5A" textAnchor="middle" dominantBaseline="central">92–95% round-trip eff.</text>
              </g>

              {/* NODE 4 — Factory / Industrial Load */}
              <g className="circuit-node" data-tip="C&amp;I consumer — factories, hospitals, data centres, warehouses. Receives AC power from the inverter. BESS clamps demand spikes to cut Maximum Demand charges." onClick={handleCircuitTip}>
                <rect x="400" y="340" width="180" height="84" rx="10" fill="#FFF4DF" stroke="#F5A623" strokeWidth="1.5" />
                <text x="490" y="358" fontFamily="'Barlow Condensed', sans-serif" fontSize="16" fontWeight="700" fill="#C8821A" textAnchor="middle" dominantBaseline="central">Factory Load</text>
                <text x="490" y="377" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#C8821A" textAnchor="middle" dominantBaseline="central">{'C&I consumer · BTM'}</text>
                <text x="490" y="394" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#C8821A" textAnchor="middle" dominantBaseline="central">24×7 · peak shaving</text>
                <text x="490" y="411" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#C8821A" textAnchor="middle" dominantBaseline="central">MD charge reduction</text>
              </g>

              {/* WIRE 4 — BESS dispatch → Inverter (return) */}
              <path className="flow-teal-return" d="M 158,340 L 158,272 L 310,272 L 310,228" stroke="#1DB87D" strokeWidth="2" strokeDasharray="6 5" fill="none" markerEnd="url(#arr-teal-lt)" />
              <text x="162" y="260" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#0D8A5A" dominantBaseline="central">dispatch</text>

              {/* NODE 5 — Grid Connection */}
              <g className="circuit-node" data-tip="Utility grid connection at the metering point. Acts as backup when solar+BESS is insufficient. BESS minimises grid draw during peak tariff windows (6–10 PM)." onClick={handleCircuitTip}>
                <rect x="246" y="530" width="188" height="66" rx="10" fill="#E9F1FB" stroke="#1A6FC4" strokeWidth="1.5" />
                <text x="340" y="553" fontFamily="'Barlow Condensed', sans-serif" fontSize="15" fontWeight="700" fill="#1A6FC4" textAnchor="middle" dominantBaseline="central">Grid Connection</text>
                <text x="340" y="572" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#1A6FC4" textAnchor="middle" dominantBaseline="central">Utility · metering point · backup</text>
              </g>

              {/* WIRE 5A — Grid → Inverter */}
               <path className="flow-blue" d="M 310,530 L 310,480 L 320,480 L 320,228" stroke="#1A6FC4" strokeWidth="2" fill="none" markerEnd="url(#arr-blue)" />
              {/* WIRE 5B — Grid → Factory */}
              <path className="flow-blue-2" d="M 370,530 L 370,480 L 490,480 L 490,424" stroke="#1A6FC4" strokeWidth="2" fill="none" markerEnd="url(#arr-blue)" />
              <text x="314" y="468" textAnchor="end" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#1A6FC4" dominantBaseline="central">grid backup</text>

              {/* EMS / BMS CONTROL BUS */}
              <line className="flow-bus" x1="100" y1="460" x2="580" y2="460" stroke="#6B7E94" strokeWidth="1.5" fill="none" />
              <text x="340" y="448" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#6B7E94" textAnchor="middle" dominantBaseline="central">EMS / BMS control bus · SCADA · autonomous dispatch</text>
              {/* Vertical taps */}
              <line x1="190" y1="424" x2="190" y2="460" stroke="#6B7E94" strokeWidth="1" strokeDasharray="4 3" fill="none" />
              <line x1="490" y1="424" x2="490" y2="460" stroke="#6B7E94" strokeWidth="1" strokeDasharray="4 3" fill="none" />
              <line x1="340" y1="228" x2="340" y2="460" stroke="#6B7E94" strokeWidth="1" strokeDasharray="4 3" fill="none" />
              <line x1="340" y1="460" x2="340" y2="530" stroke="#6B7E94" strokeWidth="1" strokeDasharray="4 3" fill="none" />

              {/* LEGEND */}
              <g transform="translate(60, 600)">
                <line x1="0" y1="10" x2="28" y2="10" stroke="#F5A623" strokeWidth="2.5" strokeDasharray="9 5" />
                <text x="34" y="10" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#C8821A" dominantBaseline="central">Solar generation / AC load</text>
                <line x1="180" y1="10" x2="208" y2="10" stroke="#1DB87D" strokeWidth="2.5" strokeDasharray="9 5" />
                <text x="214" y="10" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#0D8A5A" dominantBaseline="central">BESS charge / dispatch</text>
                <line x1="350" y1="10" x2="378" y2="10" stroke="#1A6FC4" strokeWidth="2" strokeDasharray="9 5" />
                <text x="384" y="10" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#1A6FC4" dominantBaseline="central">Grid backup feed</text>
                <line x1="490" y1="10" x2="518" y2="10" stroke="#6B7E94" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.6" />
                <text x="524" y="10" fontFamily="'Barlow', sans-serif" fontSize="11" fill="#6B7E94" dominantBaseline="central">EMS control</text>
              </g>

            </svg>
          </div>
        </div>
      </section>

      {/* ─── 6. USE CASES ─── */}
      <Section title="Three Ways BESS Pays for Itself" eyebrow="Application Scenarios">
        <div className="bess-usecases-grid">

          <div className="usecase-card animate-on-scroll">
            <div className="usecase-card__header">
              <h3 className="usecase-card__title">Peak Demand Shaving</h3>
              <p className="usecase-card__scenario">
                A textile mill hitting 1.8 MW peaks incurs ₹45,000/month in MD charges.
              </p>
            </div>
            <div className="usecase-card__body">
              <p className="usecase-card__action">
                <strong>BESS Action:</strong> 500 kWh BESS pre-charges from solar, discharges during peak window to cap demand at 1.4 MW.
              </p>
              <div className="usecase-card__saving">₹38,000–42,000/month MD charge reduction</div>
              <div className="usecase-card__roi">4.2-year <span>payback</span></div>
            </div>
          </div>

          <div className="usecase-card animate-on-scroll" style={{ animationDelay: '0.1s' }}>
            <div className="usecase-card__header">
              <h3 className="usecase-card__title">Solar + BESS Pairing</h3>
              <p className="usecase-card__scenario">
                A pharma plant has 1 MWp rooftop solar but only 40% self-consumption due to midday load dip.
              </p>
            </div>
            <div className="usecase-card__body">
              <p className="usecase-card__action">
                <strong>BESS Action:</strong> 800 kWh BESS stores midday surplus, dispatches during 6–10 PM peak tariff window.
              </p>
              <div className="usecase-card__saving">Solar utilization 40% → 85%; ₹28–35 lakh/year additional savings</div>
              <div className="usecase-card__roi">5.5-year <span>combined payback</span></div>
            </div>
          </div>

          <div className="usecase-card animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <div className="usecase-card__header">
              <h3 className="usecase-card__title">DG Replacement</h3>
              <p className="usecase-card__scenario">
                A cold chain warehouse runs DG for 4–6 hrs/day at ₹22/kWh effective cost.
              </p>
            </div>
            <div className="usecase-card__body">
              <p className="usecase-card__action">
                <strong>BESS Action:</strong> 1 MWh BESS provides seamless backup with &lt;20ms switchover, zero fuel cost.
              </p>
              <div className="usecase-card__saving">₹55–70 lakh/year DG fuel + maintenance eliminated</div>
              <div className="usecase-card__roi">3.8-year <span>payback</span></div>
            </div>
          </div>

        </div>
      </Section>

      {/* ─── 7. SPV + BESS CALLOUT BANNER ─── */}
      <div className="container">
        <div className="bess-spv-banner animate-on-scroll">
          <h3>BESS is strongest inside an SPV Captive structure — giving you the full stack of savings: zero wheeling, zero MD charges, zero capex.</h3>
          <Link to="/services" className="btn-spv-link">
            See how the SPV Captive Model works <ArrowRight strokeWidth={2.5} size={18} />
          </Link>
        </div>
      </div>

      {/* ─── 8. INDIA-SPECIFIC BESS PERFORMANCE VALIDATION (Advanced R&D Services) ─── */}
      <Section 
        title="India-First BESS Performance Validation & Simulation" 
        eyebrow="Advanced R&D Services" 
        className="bg-soft india-bess-section"
      >
        {/* Concise Problem Statement */}
        <div className="india-bess-intro animate-on-scroll">
          <p className="india-bess-intro-lead">
            Engineering Battery Energy Storage Systems for Real Indian Conditions — Not Just Laboratory Conditions.
          </p>
          <p className="india-bess-intro-desc">
            Most BESS are tested in controlled laboratory environments that do not reflect the thermal, pollution, humidity, and environmental challenges of actual Indian deployment sites. This creates a critical performance gap — systems that pass lab tests fail prematurely in the field.
          </p>
          <p className="india-bess-intro-desc">
            Waltain Energy's dedicated India-focused R&D initiative bridges this gap using advanced computational modelling, electrochemical simulations, thermal analysis, and pollution impact assessment to ensure your BESS is optimized for real Indian operating conditions across all climate zones.
          </p>
        </div>

        {/* The Challenge: Real Indian Conditions */}
        <div className="india-bess-subsection animate-on-scroll">
          <h3 className="india-bess-subtitle">The Challenge: Real Indian Operating Conditions</h3>
          <div className="india-bess-challenges-grid">
            {[
              { challenge: 'Thermal Stress', detail: 'Sustained high-temperature operation in tropical and desert zones' },
              { challenge: 'Pollution Exposure', detail: 'PM2.5, SO₂, NOₓ causing corrosion and accelerated degradation' },
              { challenge: 'Monsoon Impact', detail: 'High humidity and moisture ingress leading to electrical faults' },
              { challenge: 'Urban Smog', detail: 'Air pollution reducing cooling efficiency and heat dissipation' },
              { challenge: 'Cooling Inefficiency', detail: 'Design assumptions fail under real ambient temperature profiles' },
              { challenge: 'Lab-to-Field Gap', detail: 'Performance deviation of 15–30% between test and deployment' },
            ].map((item, idx) => (
              <div className="challenge-text-row" key={idx}>
                <div className="challenge-icon-indicator">
                  <AlertCircle size={18} />
                </div>
                <div className="challenge-text-content">
                  <div className="challenge-text-title">{item.challenge}</div>
                  <div className="challenge-text-detail">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Integrated R&D Services */}
        <div className="india-bess-subsection animate-on-scroll">
          <h3 className="india-bess-subtitle">Our Integrated R&D Services</h3>
          <p className="india-bess-subdesc">
            Four advanced engineering capabilities tailored to India-specific environmental conditions:
          </p>
          <div className="india-bess-services-list">
            {[
              {
                icon: Wind,
                title: 'Thermal & CFD Simulation',
                deliverables: [
                  '3D thermal modeling of battery enclosures',
                  'Airflow and cooling channel optimization',
                  'Heat dissipation analysis under Indian climates'
                ],
              },
              {
                icon: Zap,
                title: 'Electrochemical Ageing Analysis',
                deliverables: [
                  'DFN-based battery performance modeling',
                  'Degradation forecasting with India-specific profiles',
                  'Cycle life projection under real duty cycles'
                ],
              },
              {
                icon: TrendingUp,
                title: 'Reliability & Lifetime Assessment',
                deliverables: [
                  'Arrhenius & Weibull reliability modeling',
                  'Field failure prediction calibrated to India data',
                  'Component lifecycle costing analysis'
                ],
              },
              {
                icon: Thermometer,
                title: 'Pollution Impact Modelling',
                deliverables: [
                  'PM2.5 and PM10 deposition analysis',
                  'Corrosion rate prediction for contacts & busbars',
                  'Performance degradation quantification'
                ],
              },
            ].map((service, idx) => {
              const IconComponent = service.icon
              return (
                <div className="service-column" key={idx}>
                  <div className="service-column-header">
                    <div className="service-column-icon">
                      <IconComponent size={24} strokeWidth={2} />
                    </div>
                    <h4 className="service-column-title">{service.title}</h4>
                  </div>
                  <ul className="service-column-deliverables">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="service-deliverable-item">{item}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* Proprietary India Database — Competitive Edge */}
        <div className="india-bess-database-flat animate-on-scroll">
          <div className="database-flat-text">
            <h4 className="database-flat-title">Our Competitive Edge: Proprietary India Environmental Database</h4>
            <p className="database-flat-desc">
              Unlike generic simulation tools, our modeling is calibrated to real Indian environmental data covering 12+ cities across 6 climate zones, including temperature profiles, air pollution levels, humidity patterns, and solar irradiance — enabling accurate prediction of BESS performance before deployment.
            </p>
          </div>
          <div className="database-flat-grid">
            {[
              { label: '12+ Major Indian Cities', icon: '🏙️' },
              { label: '6 Distinct Climate Zones', icon: '🌍' },
              { label: 'Real Temperature Profiles', icon: '🌡️' },
              { label: 'Air Quality & Pollution Data', icon: '💨' },
              { label: 'Humidity & Moisture Patterns', icon: '💧' },
              { label: 'Solar Irradiance Records', icon: '☀️' },
            ].map((item, idx) => (
              <div key={idx} className="database-grid-item">
                <span className="database-grid-icon">{item.icon}</span>
                <span className="database-grid-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Who Benefits */}
        <div className="india-bess-subsection animate-on-scroll">
          <h3 className="india-bess-subtitle">Who Benefits From Our Services?</h3>
          <div className="benefits-minimal-table">
            {[
              { role: 'Battery Manufacturers', outcome: 'Reduce warranty claims from field failures; optimize product design for Indian conditions' },
              { role: 'BESS System Integrators', outcome: 'Improve system reliability; gain technical credibility in customer pitches' },
              { role: 'Project Developers', outcome: 'Reduce OpEx; maximize revenue through higher system lifespan' },
              { role: 'Financial Institutions', outcome: 'Reduce asset risk in project financing; support ESG validation' },
            ].map((item, idx) => (
              <div key={idx} className="benefits-table-row">
                <div className="benefits-table-role">{item.role}</div>
                <div className="benefits-table-outcome">{item.outcome}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="india-bess-cta-flat animate-on-scroll">
          <h3 className="cta-flat-title">Validate Your BESS for Indian Conditions</h3>
          <p className="cta-flat-desc">
            If your Battery Energy Storage System is intended for deployment in India, connect with Waltain Energy's R&D team for India-specific performance validation, thermal simulation, and reliability assessment.
          </p>
          <div className="cta-flat-buttons">
            <Link to="/contact" className="btn-india-bess-primary">
              Request R&D Assessment <ArrowRight strokeWidth={2.5} size={18} />
            </Link>
            <Link to="/contact" className="btn-india-bess-secondary">
              Connect with Our Team <ArrowRight strokeWidth={2.5} size={18} />
            </Link>
          </div>
        </div>
      </Section>

      {/* ─── 9. CTA SECTION ─── */}
      <div className="container" style={{ marginBottom: '4rem' }}>
        <div className="bess-cta-section animate-on-scroll">
          <h2>Ready to Add Storage to Your Energy Stack?</h2>
          <p>Get a BESS sizing study and financial model from Waltain — delivered in 5 working days.</p>
          <div className="bess-cta-actions">
            <Link to="/contact" className="btn-cta-primary">
              Request BESS Assessment <ArrowRight strokeWidth={2.5} size={18} />
            </Link>
            {/* <a href="https://www.waltainenergy.com" className="btn-cta-outline" target="_blank" rel="noreferrer">
              Download BESS Datasheet
            </a> */}
          </div>
        </div>
      </div>

    </div>
  )
}
