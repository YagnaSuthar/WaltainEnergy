import { useEffect } from 'react'

import '../styles/pages/savings-case-study.css'

import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'
import savingsHero from '../assets/images/renewable.jpg'

export default function SavingsCaseStudy() {
  const currentRate = 8.27
  const solarRate = 6.82
  const savingsPerUnit = 1.45
  const monthlySaving = '₹5,27,079'

  useEffect(() => {
    document.title = 'Cost Savings & Case Study | Waltain Energy'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'A sample savings case study comparing grid tariff vs open access solar tariff and estimated monthly savings.',
      )
    }
  }, [])

  return (
    <div className="savings-case-study-page">
      <PageHeader
        title="Cost Savings & Case Study"
        subtitle="An illustrative example showing how open access solar can reduce effective energy costs."
      />

      <div className="savings-case-study-hero">
        <div className="container">
          <div className="savings-case-study-hero__grid">
            <div className="savings-case-study-hero__copy">
              <p className="savings-case-study-hero__eyebrow">Open Access Snapshot</p>
              <h2 className="savings-case-study-hero__title">
                A clear view of tariff impact and savings potential.
              </h2>
              <p className="savings-case-study-hero__text">
                Compare current grid rates with open access solar to understand
                savings per unit and projected monthly impact.
              </p>
            </div>
            <div className="savings-case-study-hero__image">
              <img src={savingsHero} alt="Solar energy infrastructure" />
            </div>
          </div>
        </div>
      </div>

      <Section title="Example comparison" eyebrow="Case Study">
        <div className="case-stats">
          <div className="case-stat">
            <p className="case-stat__label">Current grid rate</p>
            <p className="case-stat__value">{currentRate.toFixed(2)} / unit</p>
          </div>
          <div className="case-stat">
            <p className="case-stat__label">Solar open access rate</p>
            <p className="case-stat__value">{solarRate.toFixed(2)} / unit</p>
          </div>
          <div className="case-stat case-stat--highlight">
            <p className="case-stat__label">Savings</p>
            <p className="case-stat__value">{savingsPerUnit.toFixed(2)} / unit</p>
          </div>
          <div className="case-stat case-stat--highlight">
            <p className="case-stat__label">Estimated monthly saving</p>
            <p className="case-stat__value">{monthlySaving}</p>
          </div>
        </div>

        <div className="case-table">
          <table className="table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: 'var(--muted)' }}>Current rate</td>
                <td style={{ fontWeight: 900 }}>{currentRate.toFixed(2)} / unit</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--muted)' }}>Solar rate</td>
                <td style={{ fontWeight: 900 }}>{solarRate.toFixed(2)} / unit</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--muted)' }}>Savings per unit</td>
                <td className="em">{savingsPerUnit.toFixed(2)} / unit</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--muted)' }}>Monthly saving</td>
                <td className="em">{monthlySaving}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="case-disclaimer">
          This is an illustrative example. Actual savings depend on your
          consumption profile, eligibility, connectivity, and applicable
          regulatory charges.
        </p>
      </Section>
    </div>
  )
}
