import { useEffect, useMemo } from 'react'

import '../styles/pages/team.css'

import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'
import TeamCard from '../components/TeamCard.jsx'
import { team as teamData } from '../data/content.js'

function filenameFromPath(path) {
  const cleaned = path.split('?')[0]
  const parts = cleaned.split('/')
  return parts[parts.length - 1] || ''
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

export default function Team() {
  const coreImages = useMemo(() => {
    const modules = import.meta.glob('../assets/Team/*.{png,jpg,jpeg,webp,avif,svg}', {
      eager: true,
      import: 'default',
    })
    return Object.fromEntries(
      Object.entries(modules).map(([path, src]) => [
        normalizeName(filenameFromPath(path).replace(/\.[^.]+$/, '')),
        src,
      ])
    )
  }, [])

  const advisorImages = useMemo(() => {
    const modules = import.meta.glob('../assets/Team/Advisors/*.{png,jpg,jpeg,webp,avif,svg}', {
      eager: true,
      import: 'default',
    })
    return Object.fromEntries(
      Object.entries(modules).map(([path, src]) => [
        normalizeName(filenameFromPath(path).replace(/\.[^.]+$/, '')),
        src,
      ])
    )
  }, [])

  useEffect(() => {
    document.title = 'Our Team | Waltain Energy'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Meet Waltain Energy team and advisors driving open access solar and renewable energy adoption.',
      )
    }
  }, [])

  return (
    <div className="team-page">
      <PageHeader
        title="Our Team"
        subtitle="A focused team supported by experienced advisors, combining strategy, execution and governance."
      />

      <Section title="Core Team">
        <div className="grid-3">
          {teamData.core.map((p) =>
            p.role === 'Director' ? (
              <div className="director-card" key={p.name}>
                <TeamCard
                  name={p.name}
                  role={p.role}
                  description={p.description}
                  image={coreImages[normalizeName(p.name)]}
                />
              </div>
            ) : (
              <TeamCard
                key={p.name}
                name={p.name}
                role={p.role}
                description={p.description}
                image={coreImages[normalizeName(p.name)]}
                linkedinUrl={
                  p.name === 'Jalpan Dave'
                    ? 'https://www.linkedin.com/in/jalpan-dave?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
                    : p.name === 'Vibhu Rakesh'
                      ? 'https://www.linkedin.com/in/vibhu-rakesh-27705a62?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
                      : undefined
                }
              />
            ),
          )}
        </div>
      </Section>

      <Section title="Advisors">
        <div className="grid-3">
          {teamData.advisors.map((p) => (
            <TeamCard
              key={p.name}
              name={p.name}
              role={p.role}
              description={p.description}
              image={advisorImages[normalizeName(p.name)]}
            />
          ))}
        </div>
      </Section>
    </div>
  )
}
