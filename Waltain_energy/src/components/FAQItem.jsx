import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  const contentId = useId()

  return (
    <div className={`card faq-item ${open ? 'faq-item--open' : ''}`}>
      <button
        type="button"
        className="faq-item__button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
      >
        <span className="faq-item__question">{question}</span>
        <ChevronDown
          className={`faq-item__icon ${open ? 'faq-item__icon--open' : ''}`}
          width={20}
          height={20}
          aria-hidden="true"
        />
      </button>
      <div
        id={contentId}
        className={`faq-item__answer ${open ? 'faq-item__answer--open' : ''}`}
      >
        <div className="faq-item__answer-content">
          {answer}
        </div>
      </div>
    </div>
  )
}
