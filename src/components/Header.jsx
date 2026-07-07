import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'O nás', id: 'o-nas' },
  { label: 'Aktuality', id: 'aktuality' },
  { label: 'Palírna', id: 'palirna' },
]

// Pořadí sekcí na stránce — pro určení, která je právě aktivní
const SECTION_IDS = ['o-nas', 'aktuality', 'palirna', 'kontakt']

// Hero používá scroll-lock (video se nejdřív rozbaluje) — před scrollem na kotvu
// je potřeba rozbalení přeskočit, jinak by stránka zůstala zamčená nahoře.
export function scrollToId(id) {
  window.dispatchEvent(new Event('expandHeroMedia'))
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, 100)
}

function Hamburger({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Menu"
      aria-expanded={open}
      className="md:hidden relative z-50 flex h-6 w-6 flex-col items-center justify-center gap-1.5"
    >
      <span
        className="h-[2px] w-6 rounded-full bg-wheat transition-transform duration-500"
        style={{
          transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)',
          transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none',
        }}
      />
      <span
        className="h-[2px] w-4 rounded-full bg-wheat transition-opacity duration-500"
        style={{
          transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)',
          opacity: open ? 0 : 1,
        }}
      />
      <span
        className="h-[2px] w-6 rounded-full bg-wheat transition-transform duration-500"
        style={{
          transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)',
          transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
        }}
      />
    </button>
  )
}

function MobileMenu({ open, active, onNavigate }) {
  return (
    <div
      className={`fixed inset-0 z-[70] md:hidden bg-soil/95 transition-opacity duration-700 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex h-full flex-col items-center justify-center px-6">
        <nav className="flex flex-col items-center">
          {NAV_LINKS.map((link, index) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`w-full border-b border-wheat/10 py-4 text-center font-instrument-serif text-4xl transition-all duration-500 hover:pl-4 sm:text-5xl ${
                active === link.id ? 'text-grain' : 'text-wheat'
              }`}
              style={{
                transitionDelay: open ? `${150 + index * 80}ms` : '0ms',
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(12px)',
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => onNavigate('kontakt')}
          className={`mt-10 w-full rounded-full py-4 font-sans text-sm font-medium text-soil ${
            active === 'kontakt' ? 'bg-wheat' : 'bg-grain'
          }`}
        >
          Kontaktujte nás
        </button>
      </div>
    </div>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('o-nas')

  // Aktivní sekce = poslední, jejíž horní hrana je nad ~40 % výšky okna.
  // Čte se přes rAF, aby scroll listener nedělal layout práci vícekrát za snímek.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setScrolled(window.scrollY > 24)
      let current = SECTION_IDS[0]
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const handleNavigate = (id) => {
    setMenuOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] flex items-center justify-between px-6 py-4 transition-colors duration-500 md:px-10 ${
          scrolled && !menuOpen ? 'bg-soil/90 shadow-[0_1px_0_rgba(245,239,221,0.08)] backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <button
          onClick={() => scrollToId('o-nas')}
          className="font-sans text-lg font-semibold text-wheat"
        >
          Statek Vaculovi
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToId(link.id)}
              className={`relative font-sans text-sm transition-colors ${
                active === link.id
                  ? 'font-normal text-wheat'
                  : 'font-light text-wheat/70 hover:text-wheat'
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-grain transition-all duration-300 ${
                  active === link.id ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </button>
          ))}
          <button
            onClick={() => scrollToId('kontakt')}
            className={`rounded-full px-5 py-2 font-sans text-sm text-soil transition-colors hover:bg-grain ${
              active === 'kontakt' ? 'bg-grain' : 'bg-wheat'
            }`}
          >
            Kontaktujte nás
          </button>
        </div>

        <Hamburger open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
      </header>

      <MobileMenu open={menuOpen} active={active} onNavigate={handleNavigate} />
    </>
  )
}
