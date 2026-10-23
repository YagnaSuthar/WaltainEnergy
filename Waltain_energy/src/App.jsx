import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ChatWidget from './components/ChatWidget.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import VisionMission from './pages/VisionMission.jsx'
import Team from './pages/Team.jsx'
import Services from './pages/Services.jsx'
import OpenAccess from './pages/OpenAccess.jsx'
import Policy from './pages/Policy.jsx'
import SavingsCaseStudy from './pages/SavingsCaseStudy.jsx'
import SolarModels from './pages/SolarModels.jsx'
import FAQ from './pages/FAQ.jsx'
import Contact from './pages/Contact.jsx'
import Partnerships from './pages/Partnerships.jsx'
import BESS from './pages/BESS.jsx'
import { trackEvent } from './utils/api.js'

function ScrollToTopOnRouteChange() {
  const location = useLocation()
  const trackedPath = useRef('')

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    if (trackedPath.current !== location.pathname) {
      trackedPath.current = location.pathname
      trackEvent('page_view', location.pathname)
    }
  }, [location.pathname])

  return null
}

export default function App() {
  return (
    <div className="layout">
      <ScrollToTopOnRouteChange />
      <Navbar />
      <main className="layout__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision-mission" element={<VisionMission />} />
          <Route path="/team" element={<Team />} />
          <Route path="/services" element={<Services />} />
          <Route path="/open-access" element={<OpenAccess />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/savings-case-study" element={<SavingsCaseStudy />} />
          <Route path="/solar-models" element={<SolarModels />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/bess" element={<BESS />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
