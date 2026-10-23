import { useEffect } from 'react'

import '../styles/pages/vision-mission.css'

import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'

export default function VisionMission() {
  useEffect(() => {
    document.title = 'Vision & Mission | Waltain Energy'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Our vision and mission for making renewable energy accessible and enabling the transition to a sustainable future.',
      )
    }
  }, [])

  return (
    <div className="vision-mission-page">
      <PageHeader
        title="Vision & Mission"
        subtitle="A simple direction: make sustainable energy accessible and implementable for every eligible consumer."
      />

      <Section className="vision-mission-section">
        <div className="vision-mission-grid">
          <article className="vision-mission-card vision-mission-card--vision">
            <p className="vision-mission-card__eyebrow">Vision</p>
            <h3 className="vision-mission-card__title">
              Lead the transition to a sustainable future.
            </h3>
            <p className="vision-mission-card__text">
              To lead the transition to a sustainable future by making renewable
              energy accessible to all, fostering innovation, and driving
              environmental stewardship for generations to come.
            </p>
          </article>

          <article className="vision-mission-card vision-mission-card--mission">
            <p className="vision-mission-card__eyebrow">Mission</p>
            <h3 className="vision-mission-card__title">
              Deliver accessible, practical renewable solutions.
            </h3>
            <p className="vision-mission-card__text">
              To deliver innovative and accessible renewable energy solutions
              that empower communities, enhance energy independence, and
              contribute to a greener, more sustainable planet.
            </p>
          </article>
        </div>
      </Section>

      <Section className="vision-mission-media-section">
        <div className="vision-mission-media-grid">
          <article className="vision-mission-media-card">
            <div className="vision-mission-media-image">
              <img src="/vision.jpg" alt="Renewable energy infrastructure" />
            </div>
            <p className="vision-mission-media-title">Vision In Action</p>
            <p className="vision-mission-media-text">
              Clean energy systems that scale with communities and inspire a
              sustainable future.
            </p>
          </article>

          <article className="vision-mission-media-card">
            <div className="vision-mission-media-image">
              <img src="/mission.jpg" alt="Solar farms for clean power" />
            </div>
            <p className="vision-mission-media-title">Mission Focus</p>
            <p className="vision-mission-media-text">
              Practical installations that deliver reliable, affordable power
              today.
            </p>
          </article>
        </div>
      </Section>
    </div>
  )
}
