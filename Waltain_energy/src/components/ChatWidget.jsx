import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import {
  CircleUserRound,
  CircleHelp,
  History,
  MessageCircle,
  Send,
  X,
} from 'lucide-react'

import { apiRequest } from '../utils/api.js'
import { faq } from '../data/content.js'
import assistantPortrait from '../assets/chatbot/assistant-portrait.png'
import whatsappIcon from '../assets/chatbot/whatsapp-icon.png'
import '../styles/chat-widget.css'

const whatsappUrl = 'https://wa.me/919998233956?text=Hello'

const welcomeMessage = {
  role: 'assistant',
  content: "Hi, I'm Waltain's energy assistant. I can help with open access solar, BESS, rooftop solar, EPC and ESG advisory. What are you exploring?",
}

const emptyLeadForm = {
  full_name: '',
  company_name: '',
  email: '',
  mobile_number: '',
  consent_to_contact: false,
}

function extractLeadDetails(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const details = { ...emptyLeadForm }
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  if (emailMatch) details.email = emailMatch[0]

  const phoneLine = lines.find((line) => {
    const digits = line.replace(/\D/g, '')
    return digits.length >= 7 && digits.length <= 15
  })
  if (phoneLine) {
    const phoneMatch = phoneLine.match(/\+?[\d][\d\s().-]{5,}\d/)
    if (phoneMatch) details.mobile_number = phoneMatch[0].trim()
  }

  const remainingLines = lines.filter((line) => (
    (!details.email || !line.includes(details.email))
    && line !== phoneLine
    && !/^(?:e-?mail(?: address)?|phone(?: number)?|mobile(?: number)?)\s*[-:]/i.test(line)
  ))

  for (const line of remainingLines) {
    const nameMatch = line.match(/^(?:full\s+)?name\s*[-:]?\s*(.+)$/i)
    const companyMatch = line.match(/^(?:company|business)(?:\s+name)?\s*[-:]?\s*(.+)$/i)
    if (nameMatch) details.full_name = nameMatch[1].trim()
    else if (companyMatch) details.company_name = companyMatch[1].trim()
  }

  const unlabeledLines = remainingLines.filter((line) => (
    !/^(?:(?:full\s+)?name|company|business)(?:\s+name)?\s*[-:]?\s+/i.test(line)
  ))
  if (!details.full_name && unlabeledLines.length) details.full_name = unlabeledLines[0]
  if (!details.company_name && unlabeledLines.length > 1) details.company_name = unlabeledLines[1]

  return details
}

function isLeadFormRequest(text) {
  const normalized = text.toLocaleLowerCase()
    .replace(/\bcotact\b/g, 'contact')
    .replace(/\bfomr\b/g, 'form')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
  return (
    /\b(?:contact|connect|reach|talk|speak)\b.{0,45}\b(?:sales|business|team|representative|someone|person|staff|waltain)\b/.test(normalized)
    || /\b(?:want|need|would like|can i)\b.{0,24}\b(?:contact|connect|reach|talk|speak)\b/.test(normalized)
    || /\bcontact\s+us\b/.test(normalized)
    || /\b(?:sales|business)\b.{0,35}\b(?:team|contact|connect|call|talk)\b/.test(normalized)
    || /\b(?:give|show|send|open|share)\s+(?:me\s+)?(?:the\s+)?(?:inquiry|enquiry|contact|lead)?\s*form\b/.test(normalized)
    || /\b(?:any|a|the|some)\s+(?:inquiry|enquiry|contact)?\s*form\b/.test(normalized)
    || /\b(?:inquiry|enquiry|contact)(?:\s+us)?\s+form\b/.test(normalized)
    || /\b(?:request|get)\s+(?:a\s+)?(?:call|callback|follow[\s-]?up)\b/.test(normalized)
  )
}

const faqStopWords = new Set(['a', 'an', 'and', 'are', 'can', 'do', 'for', 'how', 'i', 'in', 'is', 'it', 'me', 'of', 'on', 'the', 'to', 'we', 'what', 'when', 'will', 'you'])

function normalizeFaqWords(text) {
  const wordForms = {
    batteries: 'battery',
    loads: 'load',
    save: 'saving',
    savings: 'saving',
    services: 'service',
  }
  return new Set(
    text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)?.map((word) => wordForms[word] ?? word)
      .filter((word) => !faqStopWords.has(word)) ?? [],
  )
}

function findFaqAnswer(text) {
  const queryWords = normalizeFaqWords(text)
  if (!queryWords.size) return null

  const matches = faq.map((entry) => {
    const questionWords = normalizeFaqWords(entry.question)
    const overlap = [...queryWords].filter((word) => questionWords.has(word)).length
    const queryCoverage = overlap / queryWords.size
    const questionCoverage = overlap / questionWords.size
    return { entry, overlap, queryCoverage, questionCoverage }
  }).sort((first, second) => (
    second.queryCoverage - first.queryCoverage
    || second.questionCoverage - first.questionCoverage
  ))

  const bestMatch = matches[0]
  return bestMatch && bestMatch.overlap >= 2 && bestMatch.queryCoverage >= 0.65 && bestMatch.questionCoverage >= 0.5
    ? bestMatch.entry
    : null
}

function renderAssistantContent(content) {
  return content.split('\n').map((line, lineIndex) => {
    const headingMatch = line.match(/^\s{0,3}#{1,6}\s+(.*)$/)
    const isHeading = Boolean(headingMatch)
    let formattedLine = headingMatch ? headingMatch[1] : line
    formattedLine = formattedLine.replace(/!\[[^\]]*]\((?:https?:\/\/|\/)[^)]+\)/g, '')
    formattedLine = formattedLine.replace(/^\s*>\s?/, '')
    formattedLine = formattedLine.replace(/^(\s*)[-*+]\s+/, '$1• ')

    const parts = formattedLine.split(/(\*\*.+?\*\*|__.+?__|https?:\/\/[^\s<>"']+)/g)
    return (
      <span className="chat-message__line" key={lineIndex}>
        {parts.map((part, partIndex) => {
          const urlMatch = part.match(/^(https?:\/\/[^\s<>"']+?)([.,!?;:)\]}]*)$/)
          if (urlMatch) {
            let isSafeUrl = false
            try {
              const url = new URL(urlMatch[1])
              isSafeUrl = url.protocol === 'http:' || url.protocol === 'https:'
            } catch {
              isSafeUrl = false
            }
            if (isSafeUrl) {
              return (
                <span key={partIndex}>
                  <a href={urlMatch[1]} target="_blank" rel="noopener noreferrer">{urlMatch[1]}</a>
                  {urlMatch[2]}
                </span>
              )
            }
          }
          const boldMatch = part.match(/^(?:\*\*(.+)\*\*|__(.+)__)$/)
          const text = boldMatch ? boldMatch[1] ?? boldMatch[2] : part
          if (!text) return null
          if (boldMatch || isHeading) return <strong key={partIndex}>{text}</strong>
          return <span key={partIndex}>{text}</span>
        })}
      </span>
    )
  })
}

function ChatPrompt() {
  const [text, setText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const message = 'Hi! How can I assist you?'
    let characterCount = 0
    let isDeleting = false
    let timeoutId

    function animateText() {
      if (!isDeleting) {
        characterCount += 1
        setText(message.slice(0, characterCount))
        if (characterCount === message.length) {
          isDeleting = true
          timeoutId = window.setTimeout(animateText, 1000)
          return
        }
        timeoutId = window.setTimeout(animateText, 60)
        return
      }

      characterCount -= 1
      setText(message.slice(0, characterCount))
      if (characterCount > 0) {
        timeoutId = window.setTimeout(animateText, 35)
      } else {
        setIsComplete(true)
      }
    }

    timeoutId = window.setTimeout(animateText, 300)
    return () => window.clearTimeout(timeoutId)
  }, [])

  if (isComplete) return null

  return (
    <div className="chat-launcher__prompt" role="status" aria-live="polite">
      <span>{text}</span>
    </div>
  )
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showChatPrompt, setShowChatPrompt] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState([welcomeMessage])
  const [sessionId, setSessionId] = useState('')
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadForm, setLeadForm] = useState(emptyLeadForm)
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)
  const chatMessagesRef = useRef(null)
  const latestAssistantMessageRef = useRef(null)
  const alignLatestReplyToStartRef = useRef(false)
  const leadFormDismissedRef = useRef(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) return undefined

    const initialPromptTimeout = window.setTimeout(() => setShowChatPrompt(true), 1200)
    const promptInterval = window.setInterval(() => setShowChatPrompt(true), 15000)
    return () => {
      window.clearTimeout(initialPromptTimeout)
      window.clearInterval(promptInterval)
    }
  }, [isOpen])

  useEffect(() => {
    if (!showChatPrompt || isOpen) return undefined
    const promptTimeout = window.setTimeout(() => setShowChatPrompt(false), 5400)
    return () => window.clearTimeout(promptTimeout)
  }, [showChatPrompt, isOpen])

  useEffect(() => {
    if (!isOpen || sessionId) return
    apiRequest('/api/v1/chat/sessions', { method: 'POST', body: JSON.stringify({}) })
      .then((session) => {
        setSessionId(session.session_id)
        if (session.welcome_message) {
          setMessages([{ role: 'assistant', content: session.welcome_message }])
        }
      })
      .catch(() => setError('Chat is temporarily unavailable. Please try again later.'))
  }, [isOpen, sessionId])

  useLayoutEffect(() => {
    if (activeTab !== 'chat') return
    const messagesContainer = chatMessagesRef.current
    if (!messagesContainer) return
    if (showLeadForm && latestAssistantMessageRef.current) {
      const replyTop = latestAssistantMessageRef.current.getBoundingClientRect().top
        - messagesContainer.getBoundingClientRect().top
        + messagesContainer.scrollTop
      messagesContainer.scrollTo({ top: replyTop, behavior: 'smooth' })
      alignLatestReplyToStartRef.current = false
      return
    }
    if (alignLatestReplyToStartRef.current && latestAssistantMessageRef.current) {
      const replyTop = latestAssistantMessageRef.current.getBoundingClientRect().top
        - messagesContainer.getBoundingClientRect().top
        + messagesContainer.scrollTop
      messagesContainer.scrollTo({ top: replyTop, behavior: 'smooth' })
      alignLatestReplyToStartRef.current = false
      return
    }
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isSending, activeTab, showLeadForm])

  useEffect(() => {
    if (isOpen && activeTab === 'chat') inputRef.current?.focus()
  }, [isOpen, activeTab])

  async function sendMessage(message = draft, trustedFaqAnswer = null) {
    const text = message.trim()
    if (!text || isSending) return

    const visitorMessageCount = messages.filter((item) => item.role === 'user').length + 1
    const shouldOfferLeadForm = isLeadFormRequest(text)
    if (shouldOfferLeadForm) leadFormDismissedRef.current = false
    const submittedLeadDetails = extractLeadDetails(text)
    if (submittedLeadDetails.email || submittedLeadDetails.mobile_number) {
      setError('')
      setDraft('')
      alignLatestReplyToStartRef.current = true
      setLeadForm((current) => ({
        ...current,
        ...Object.fromEntries(
          Object.entries(submittedLeadDetails).filter(([key, value]) => key !== 'consent_to_contact' && value),
        ),
      }))
      setMessages((current) => [
        ...current,
        { role: 'user', content: text },
        { role: 'assistant', content: 'I’ve filled in the details below. Please review them and send the form to request a follow-up.' },
      ])
      leadFormDismissedRef.current = false
      setShowLeadForm(true)
      return
    }

    const faqAnswer = shouldOfferLeadForm ? null : trustedFaqAnswer ?? findFaqAnswer(text)?.answer
    if (faqAnswer) {
      setError('')
      setDraft('')
      if ((visitorMessageCount === 3 || shouldOfferLeadForm) && !leadFormDismissedRef.current) {
        alignLatestReplyToStartRef.current = true
      }
      setMessages((current) => [
        ...current,
        { role: 'user', content: text },
        { role: 'assistant', content: faqAnswer },
      ])
      if ((visitorMessageCount === 3 || shouldOfferLeadForm) && !leadFormDismissedRef.current) {
        setShowLeadForm(true)
      }
      return
    }
    if (!sessionId) return

    setError('')
    setDraft('')
    if (shouldOfferLeadForm) {
      leadFormDismissedRef.current = false
      alignLatestReplyToStartRef.current = true
      setMessages((current) => [
        ...current,
        { role: 'user', content: text },
        {
          role: 'assistant',
          content: 'Please fill out the inquiry form below. After you submit it, our team will reach out to you soon. You can also use our Contact Us page: https://waltainenergy.com/contact.',
        },
      ])
      setShowLeadForm(true)
      return
    }

    setMessages((current) => [...current, { role: 'user', content: text }])
    setIsSending(true)
    try {
      const result = await apiRequest('/api/v1/chat/messages', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, message: text }),
      })
      const shouldShowLeadForm = (
        !leadFormDismissedRef.current
        && (result.show_lead_form || result.assistant_failed || visitorMessageCount === 3 || shouldOfferLeadForm)
      )
      if (shouldShowLeadForm) alignLatestReplyToStartRef.current = true
      setMessages((current) => [...current, { role: 'assistant', content: result.reply }])
      if (shouldShowLeadForm) {
        setShowLeadForm(true)
      }
    } catch (requestError) {
      setError(requestError.message || 'Message could not be sent. Please try again.')
      alignLatestReplyToStartRef.current = true
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: "I'm sorry, I couldn't get a response just now. Please leave your details and Waltain Energy will follow up.",
        },
      ])
      if (!leadFormDismissedRef.current) setShowLeadForm(true)
    } finally {
      setIsSending(false)
    }
  }

  function startNewConversation() {
    setMessages([welcomeMessage])
    setSessionId('')
    setError('')
    setShowLeadForm(false)
    setLeadForm(emptyLeadForm)
    leadFormDismissedRef.current = false
    setActiveTab('chat')
  }

  function updateLeadField(event) {
    const { name, value, checked, type } = event.target
    setLeadForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function submitLead(event) {
    event.preventDefault()
    if (!sessionId || isSubmittingLead) return
    setError('')
    setIsSubmittingLead(true)
    try {
      const result = await apiRequest('/api/v1/chat/lead-submissions', {
        method: 'POST',
        body: JSON.stringify({
          ...leadForm,
          session_id: sessionId,
          transcript: messages.slice(-40),
        }),
      })
      setShowLeadForm(false)
      setLeadForm(emptyLeadForm)
      setMessages((current) => [...current, { role: 'assistant', content: result.message }])
    } catch (requestError) {
      setError(requestError.message || 'Your details were not sent. Please try again.')
    } finally {
      setIsSubmittingLead(false)
    }
  }

  function handleComposerKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
    if (event.key === 'Escape') setIsOpen(false)
  }

  function answerFaq(entry) {
    setError('')
    setActiveTab('chat')
    sendMessage(entry.question, entry.answer)
  }

  function toggleChat() {
    setShowChatPrompt(false)
    setIsOpen((current) => !current)
  }

  const latestAssistantMessageIndex = messages.reduce(
    (lastIndex, message, index) => message.role === 'assistant' ? index : lastIndex,
    -1,
  )

  return createPortal((
    <div className="chat-widget-root">
      <section
        className={`chat-panel${isOpen ? ' chat-panel--open' : ''}`}
        role="dialog"
        aria-modal="false"
        aria-labelledby="chat-title"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
          <header className="chat-panel__header">
            <div className="chat-panel__identity">
              <img className="chat-panel__avatar" src={assistantPortrait} alt="" />
              <div>
                <h2 id="chat-title">Waltain <span>AI</span></h2>
                <p>Energy solutions assistant</p>
              </div>
            </div>
            <button className="chat-panel__close" type="button" aria-label="Close chat" onClick={() => setIsOpen(false)}>
              <X size={23} />
            </button>
          </header>

          <div className="chat-panel__body">
            {activeTab === 'chat' ? (
              <>
                <div className="chat-panel__intro">
                  <p>Practical guidance for your energy transition.</p>
                  <div className="chat-panel__quick-links">
                    <Link to="/about" onClick={() => setIsOpen(false)}>Learn more</Link>
                    <Link to="/services" onClick={() => setIsOpen(false)}>Explore solar solutions</Link>
                  </div>
                </div>
                <div ref={chatMessagesRef} className="chat-messages" aria-live="polite" aria-label="Conversation">
                  {messages.map((message, index) => (
                    <div
                      ref={index === latestAssistantMessageIndex ? latestAssistantMessageRef : null}
                      className={`chat-message chat-message--${message.role}`}
                      key={`${index}-${message.role}`}
                    >
                      {message.role === 'assistant' && <img className="chat-message__icon" src={assistantPortrait} alt="" />}
                      <p>{message.role === 'assistant' ? renderAssistantContent(message.content) : message.content}</p>
                    </div>
                  ))}
                  {showLeadForm && (
                    <form className="chat-lead-form" onSubmit={submitLead}>
                      <div className="chat-lead-form__heading">
                        <strong>Would you like a follow-up?</strong>
                        <span>Optional. Or skip this and keep chatting.</span>
                      </div>
                      <label>
                        Your name
                        <input name="full_name" autoComplete="name" required minLength={2} maxLength={255} value={leadForm.full_name} onChange={updateLeadField} />
                      </label>
                      <label>
                        Business name
                        <input name="company_name" autoComplete="organization" required minLength={2} maxLength={255} value={leadForm.company_name} onChange={updateLeadField} />
                      </label>
                      <label>
                        Email
                        <input name="email" type="email" autoComplete="email" required maxLength={255} value={leadForm.email} onChange={updateLeadField} />
                      </label>
                      <label>
                        Phone
                        <input name="mobile_number" type="tel" autoComplete="tel" required minLength={7} maxLength={30} value={leadForm.mobile_number} onChange={updateLeadField} />
                      </label>
                      <label className="chat-lead-form__consent">
                        <input name="consent_to_contact" type="checkbox" required checked={leadForm.consent_to_contact} onChange={updateLeadField} />
                        <span>Waltain Energy may contact me about this inquiry.</span>
                      </label>
                      <div className="chat-lead-form__actions">
                        <button
                          type="button"
                          className="chat-lead-form__skip"
                          onClick={() => {
                            leadFormDismissedRef.current = true
                            setShowLeadForm(false)
                          }}
                        >
                          Not now
                        </button>
                        <button type="submit" disabled={isSubmittingLead}>{isSubmittingLead ? 'Sending...' : 'Send details'}</button>
                      </div>
                    </form>
                  )}
                  {isSending && <div className="chat-message chat-message--assistant chat-message--typing"><span /><span /><span /></div>}
                </div>
              </>
            ) : activeTab === 'faq' ? (
              <div className="chat-faq-view">
                <h3>Frequently asked questions</h3>
                <p>Choose a question for an instant answer, or ask it in chat.</p>
                <div className="chat-faq-view__items">
                  {faq.map((entry) => (
                    <button type="button" key={entry.question} onClick={() => answerFaq(entry)}>
                      {entry.question}
                    </button>
                  ))}
                </div>
              </div>
            ) : activeTab === 'history' ? (
              <div className="chat-history-view">
                <h3>Conversation history</h3>
                <p>Your messages stay in this browser session and are not saved here permanently.</p>
                <button type="button" onClick={startNewConversation}>Start a new conversation</button>
                <div className="chat-history-view__items">
                  {messages.filter((item) => item.role === 'user').length === 0 ? (
                    <span>No messages yet.</span>
                  ) : messages.filter((item) => item.role === 'user').map((item, index) => (
                    <button type="button" key={`${index}-${item.content}`} onClick={() => setActiveTab('chat')}>
                      {item.content}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {activeTab === 'chat' && (
            <>
              <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
                <textarea
                  ref={inputRef}
                  aria-label="Type a message"
                  placeholder="Ask about energy solutions..."
                  rows={1}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  maxLength={4000}
                />
                <button className="chat-composer__send" type="submit" aria-label="Send message" disabled={!draft.trim() || isSending || (!sessionId && !findFaqAnswer(draft))}>
                  <Send size={17} />
                </button>
              </form>
              {error && <p className="chat-panel__error" role="status">{error}</p>}
            </>
          )}

          <nav className="chat-panel__tabs" aria-label="Chat sections">
            <button type="button" className={activeTab === 'chat' ? 'is-active' : ''} onClick={() => setActiveTab('chat')}>
              <MessageCircle size={19} /><span>Chat</span>
            </button>
            <button type="button" className={activeTab === 'faq' ? 'is-active' : ''} onClick={() => setActiveTab('faq')}>
              <CircleHelp size={19} /><span>FAQs</span>
            </button>
            <button type="button" className={activeTab === 'history' ? 'is-active' : ''} onClick={() => setActiveTab('history')}>
              <History size={19} /><span>History</span>
            </button>
          </nav>
          <div className="chat-panel__footer">WALTAIN ENERGY <CircleUserRound size={12} aria-hidden="true" /> Renewable energy support</div>
      </section>

      <div className="chat-widget-controls">
        <a
          className="chat-whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Waltain Energy on WhatsApp"
        >
          <img src={whatsappIcon} alt="" />
        </a>
        <div className="chat-launcher-wrap">
          {showChatPrompt && !isOpen && (
            <ChatPrompt />
          )}
          <button
            type="button"
            className={`chat-launcher${isOpen ? ' chat-launcher--open' : ''}`}
            aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
            aria-expanded={isOpen}
            onClick={toggleChat}
          >
            {isOpen ? <X size={25} /> : <img className="chat-launcher__avatar" src={assistantPortrait} alt="" />}
            {!isOpen && <span className="chat-launcher__pulse" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  ), document.body)
}
