import { useState } from 'react'
import { ArrowRight, Newspaper } from 'lucide-react'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'

const NAV_LINKS = [
  { label: 'O nás', id: 'o-nas' },
  { label: 'Aktuality', id: 'aktuality' },
  { label: 'Palírna', id: 'palirna' },
]

// Hero používá scroll-lock (video se nejdřív rozbaluje) — před scrollem na kotvu
// je potřeba rozbalení přeskočit, jinak by stránka zůstala zamčená nahoře.
function scrollToId(id) {
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

function MobileMenu({ open, onNavigate }) {
  return (
    <div
      className={`fixed inset-0 z-40 md:hidden bg-soil/95 backdrop-blur-xl transition-opacity duration-700 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex h-full flex-col items-center justify-center px-6">
        <nav className="flex flex-col items-center">
          {NAV_LINKS.map((link, index) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="w-full border-b border-wheat/10 py-4 text-center font-instrument-serif text-4xl text-wheat transition-all duration-500 hover:pl-4 sm:text-5xl"
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
          className="mt-10 w-full rounded-full bg-grain py-4 font-sans text-sm font-medium text-soil"
        >
          Kontaktujte nás
        </button>
      </div>
    </div>
  )
}

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavigate = (id) => {
    setMenuOpen(false)
    scrollToId(id)
  }

  return (
    <section id="o-nas" className="relative bg-soil">
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <span className="font-sans text-lg font-semibold text-wheat">Statek Vaculovi</span>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToId(link.id)}
              className="font-sans text-sm font-light text-wheat/80 transition-colors hover:text-wheat"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollToId('kontakt')}
            className="rounded-full bg-wheat px-5 py-2 font-sans text-sm text-soil transition-colors hover:bg-grain"
          >
            Kontaktujte nás
          </button>
        </div>

        <Hamburger open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
      </header>

      <MobileMenu open={menuOpen} onNavigate={handleNavigate} />

      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="media/hero.mp4"
        posterSrc="media/hero-poster.jpg"
        bgImageSrc="media/hero-poster.jpg"
        title="Pěstujeme poctivé obilí"
        date="Statek Vaculovi"
        scrollToExpand="Posouváním rozehrajete video"
        scrubOnScroll
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h1 className="font-instrument-serif text-3xl text-wheat md:text-4xl">
            Rodinná farma <em className="italic">na Moravě</em>
          </h1>
          <p className="mt-4 max-w-md font-sans text-sm font-light leading-relaxed text-wheat/70 md:text-base">
            Tři generace na stejné půdě. Pěstujeme obilí poctivě a s úctou ke krajině.
          </p>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
            <button
              onClick={() => scrollToId('kontakt')}
              className="flex items-center gap-2 rounded-full bg-grain px-7 py-3 font-sans text-sm font-medium text-soil"
            >
              Kontaktovat
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollToId('aktuality')}
              className="flex items-center gap-2 rounded-full border border-wheat/40 px-7 py-3 font-sans text-sm text-wheat"
            >
              Naše aktuality
              <Newspaper size={16} />
            </button>
          </div>
        </div>
      </ScrollExpandMedia>
    </section>
  )
}
