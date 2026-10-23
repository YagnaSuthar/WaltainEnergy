import { Handshake, Layers3, ShieldCheck, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'

import '../styles/pages/partnerships.css'

import Card from '../components/Card.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'
import { partnerships } from '../data/content.js'

const icons = [Handshake, TrendingUp, Layers3, ShieldCheck]

export default function Partnerships() {
  useEffect(() => {
    document.title = 'Partnerships & Associations | Waltain Energy'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Partnerships and associations supporting Waltain Energy’s delivery: PPAs/EOIs, secured capacity, EPC partner and ESG database partner.',
      )
    }
  }, [])

  return (
    <div className="partnerships-page">
      <PageHeader
        title="Partnerships & Associations"
        subtitle="Capability is built through relationships, delivery partners, secured capacity and ESG support." 
      />

      <Section title="Highlights" eyebrow="Collaborations">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 collaborations-highlights">
          {partnerships.map((p, idx) => {
            const Icon = icons[idx] || Handshake
            return (
              <div key={p.title} className="animate-fade-up">
                <Card title={p.title} description={p.description} icon={Icon} />
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="How it helps customers" eyebrow="Value">
        <div className="grid gap-8 lg:grid-cols-3 value-cards">
          <Card
            title="Faster onboarding"
            description="Secured capacity and defined execution partners reduce project uncertainty."
          />
          <Card
            title="Execution quality"
            description="EPC capability ensures timelines, safety and quality remain central."
          />
          <Card
            title="Better reporting"
            description="ESG support strengthens disclosure and stakeholder communication."
          />
        </div>
      </Section>
    </div>
  )
}
