import { ChevronDown, Menu, X } from 'lucide-react'

import { useEffect, useMemo, useRef, useState } from 'react'

import { Link, NavLink, useLocation } from 'react-router-dom'



import logo from '../assets/images/logo.png'

import { company, navLinks } from '../data/content.js'



function NavItem({ to, label, onClick, className = '' }) {

  return (

    <NavLink

      to={to}

      onClick={onClick}

      className={({ isActive }) =>

        `nav__link ${className} ${isActive ? 'nav__link--active' : ''}`.trim()

      }

    >

      {label}

    </NavLink>

  )

}



export default function Navbar() {

  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)

  const [moreOpen, setMoreOpen] = useState(false)

  const dropdownRef = useRef(null)

  useEffect(() => {
    setMobileOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!moreOpen) return

    const onPointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoreOpen(false)
      }
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [moreOpen])



  const links = useMemo(() => navLinks, [])



  const primaryLinks = useMemo(

    () =>

      links.filter((l) =>

        [

          '/',

          '/about',

          '/services',

          '/open-access',
          '/bess',

          '/policy',


          '/contact',

        ].includes(l.to),

      ),

    [links],

  )



  const secondaryLinks = useMemo(

    () =>

      links.filter(

        (l) =>

          ![

            '/',

            '/about',

            '/services',

            '/open-access',

            '/bess',


            '/policy',


            '/contact',

          ].includes(l.to),

      ),

    [links],

  )



  return (

    <header className="navbar">

      <div className="container">

        <div className="navbar__inner">

          <Link to="/" className="brand" aria-label={`${company.brand} Home`}>

            <img className="brand__logo-full" src={logo} alt={company.brand} />

            <span className="brand__text">{company.brand}</span>

          </Link>



          <nav className="nav" aria-label="Primary">

            {primaryLinks.map((l) => (

              <NavItem key={l.to} to={l.to} label={l.label} />

            ))}



            {secondaryLinks.length > 0 && (

              <div
                className={`dropdown ${moreOpen ? 'dropdown--open' : ''}`.trim()}
                ref={dropdownRef}
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >

                <button
                  type="button"
                  className="nav__link"
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                  onClick={() => setMoreOpen((v) => !v)}
                >

                  More

                  <ChevronDown

                    width={16}

                    height={16}

                    aria-hidden="true"

                    className="dropdown__chevron"

                  />

                </button>



                <div className="dropdown__menu" role="menu">

                  {secondaryLinks.map((l) => (

                    <NavItem

                      key={l.to}

                      to={l.to}

                      label={l.label}

                      onClick={() => setMoreOpen(false)}

                      className="nav__link--dropdown-item"

                    />

                  ))}

                </div>

              </div>

            )}

          </nav>

          <div className="navbar__actions">
            <button
              type="button"
              className="icon-btn"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-panel" role="region" aria-label="Mobile navigation">
          <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile">
            {primaryLinks.map((l) => (
              <NavItem
                key={l.to}
                to={l.to}
                label={l.label}
                onClick={() => setMobileOpen(false)}
              />
            ))}
            {secondaryLinks.map((l) => (
              <NavItem
                key={l.to}
                to={l.to}
                label={l.label}
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

