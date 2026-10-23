import { useEffect } from 'react'

import '../styles/pages/faq.css'

import FAQItem from '../components/FAQItem.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'
import { faq } from '../data/content.js'

export default function FAQ() {
  useEffect(() => {
    document.title = 'FAQ | Waltain Energy'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Frequently asked questions about open access solar power, eligibility, savings, timelines and ESG reporting.',
      )
    }
  }, [])

  return (
    <>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Answers to common questions about open access solar power and renewable energy solutions."
      />

      <Section>
        <div className="faq-list">
          {faq.map((f) => (
            <FAQItem key={f.question} question={f.question} answer={f.answer} />
          ))}
        </div>
      </Section>
    </>
  )
}
