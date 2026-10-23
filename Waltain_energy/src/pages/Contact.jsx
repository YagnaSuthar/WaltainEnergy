import { useState, useEffect } from 'react'
import { CheckCircle2, Mail, Phone, Send } from 'lucide-react'

import '../styles/pages/contact.css'

import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'
import { company } from '../data/content.js'
import { apiRequest, trackEvent } from '../utils/api.js'

import houseImage from '../assets/images/house.png'

const initialForm = {
  full_name: '',
  email: '',
  mobile_number: '',
  subject: '',
  message: '',
  consent_to_contact: false,
}

export default function Contact() {
  const phoneNumber = '+91 99982 33956'
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Contact | Waltain Energy'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Contact Waltain Energy for open access solar, EPC, advisory and ESG disclosure support.',
      )
    }
  }, [])

  function updateField(event) {
    const { name, value, checked, type } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function submitContact(event) {
    event.preventDefault()
    setError('')
    setResult(null)
    setIsSubmitting(true)
    try {
      const response = await apiRequest('/api/v1/contact', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          mobile_number: form.mobile_number.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      })
      setResult({ message: response.message, notificationSent: response.notification_sent })
      trackEvent('contact_form_submit')
      setForm(initialForm)
    } catch (requestError) {
      setError(requestError.message || 'Your message could not be sent. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Share your details and we will get back with a feasibility and next-steps discussion."
      />

      <Section title="Talk to our energy team">
        <div className="contact-grid">
          <div className="contact-grid__details">
            <div className="surface">
              <div style={{ fontSize: 13, fontWeight: 900 }}>Direct contact</div>
              <div style={{ marginTop: 14 }} className="stack">
                <div className="kpi">
                  <div className="contact-detail-row">
                    <Mail width={18} height={18} color="var(--primary)" aria-hidden="true" />
                    <div>
                      <div className="kpi__title">Email</div>
                      <div className="contact-email-list">
                        {company.emails.map(({ address, featured }) => (
                          <a
                            key={address}
                            href={`mailto:${address}`}
                            className={`contact-detail-link${featured ? ' contact-detail-link--featured' : ''}`}
                          >
                            {address}
                            {featured && <span className="contact-email-badge">Primary</span>}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="kpi">
                  <div className="contact-detail-row">
                    <Phone width={18} height={18} color="var(--primary)" aria-hidden="true" />
                    <div>
                      <div className="kpi__title">Phone</div>
                      <a href={`tel:${phoneNumber}`} className="contact-detail-link">{phoneNumber}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface">
              <div style={{ fontSize: 13, fontWeight: 900 }}>Company details</div>
              <div className="kpi" style={{ marginTop: 14 }}>
                <div className="kpi__title">Company</div>
                <div className="kpi__desc" style={{ marginTop: 8 }}>{company.name}</div>
              </div>
              <div className="kpi" style={{ marginTop: 14 }}>
                <div className="kpi__title">Registration</div>
                <div className="kpi__desc" style={{ marginTop: 8 }}>CIN: {company.cin}</div>
                <div className="kpi__desc">GST: {company.gst}</div>
              </div>
            </div>

            <div className="contact-media">
              <img className="contact-media__img" src={houseImage} alt="Waltain Energy contact" loading="lazy" />
            </div>
          </div>

          <div className="contact-form-wrap">
            <form className="contact-form" onSubmit={submitContact}>
              <div className="contact-form__heading">
                <span className="contact-form__eyebrow">CONTACT OUR TEAM</span>
                <h2>Tell us what you need</h2>
                <p>Tell us a little about your energy needs. Our team will review your inquiry and get back to you.</p>
              </div>

              <div className="contact-form__fields">
                <label>
                  <span className="contact-form__label">Full name <span className="contact-form__required-mark" aria-hidden="true">*</span></span>
                  <input name="full_name" autoComplete="name" placeholder="Your full name" required minLength={2} maxLength={255} value={form.full_name} onChange={updateField} />
                </label>
                <label>
                  <span className="contact-form__label">Email address <span className="contact-form__required-mark" aria-hidden="true">*</span></span>
                  <input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={255} value={form.email} onChange={updateField} />
                </label>
                <label>
                  <span className="contact-form__label">Mobile number <span className="contact-form__required-mark" aria-hidden="true">*</span></span>
                  <input name="mobile_number" type="tel" autoComplete="tel" placeholder="+91 98765 43210" required minLength={7} maxLength={30} value={form.mobile_number} onChange={updateField} />
                </label>
                <label>
                  <span className="contact-form__label">Subject <span className="contact-form__required-mark" aria-hidden="true">*</span></span>
                  <input name="subject" placeholder="What can we help with?" required minLength={3} maxLength={500} value={form.subject} onChange={updateField} />
                </label>
                <label className="contact-form__message">
                  <span className="contact-form__label">How can we help? <span className="contact-form__required-mark" aria-hidden="true">*</span></span>
                  <textarea name="message" placeholder="Tell us about your project, location, energy requirements, or the service you are interested in." required minLength={10} maxLength={5000} rows={5} value={form.message} onChange={updateField} />
                </label>
              </div>

              <label className="contact-form__consent">
                <input name="consent_to_contact" type="checkbox" required checked={form.consent_to_contact} onChange={updateField} />
                <span>I agree that Waltain Energy may use these details to respond to my inquiry.</span>
              </label>

              {result && (
                <div className={`contact-form__notice${result.notificationSent ? '' : ' contact-form__notice--warning'}`} role="status">
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{result.message}</span>
                </div>
              )}
              {error && <p className="contact-form__error" role="alert">{error}</p>}

              <button className="contact-form__submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send inquiry'}
                <Send size={16} aria-hidden="true" />
              </button>
              <p className="contact-form__required"><span aria-hidden="true">*</span> Required fields</p>
            </form>
          </div>
        </div>
      </Section>
    </>
  )
}
