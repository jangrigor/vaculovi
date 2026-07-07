import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

// Kurzorové „kukátko“: přes základní fotku kotle se maskou odhaluje druhý
// obrázek — průřez, co se děje uvnitř. Maska je čisté CSS (radial-gradient),
// které prohlížeč skládá na GPU. Dřívější verze kreslila masku do canvasu
// a každý snímek ji převáděla přes toDataURL() na PNG — dekódování nové
// masky každých 16 ms způsobovalo na mobilu sekání a problikávání obrázků.
// Pozice se vyhlazuje v requestAnimationFrame a zapisuje přímo do stylu,
// bez React re-renderu na každý snímek.
// Na dotykových zařízeních (bez kurzoru) putuje reflektor po kotli podle scrollu.

// Výchozí maska: nic neodhaluje (kruh mimo obraz)
const HIDDEN_MASK = 'radial-gradient(circle 1px at -100px -100px, black, transparent)'

export default function Palirna() {
  const sectionRef = useRef(null)
  const frameRef = useRef(null)
  const revealRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const frame = frameRef.current
    const reveal = revealRef.current
    if (!section || !frame || !reveal) return

    const isTouch = window.matchMedia('(hover: none)').matches
    const mouse = { x: -999, y: -999 }
    const smooth = { x: -999, y: -999 }

    // Souřadnice relativně k rámu s obrázkem
    const handleMove = (e) => {
      const rect = frame.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      if (smooth.x < -500) {
        smooth.x = mouse.x
        smooth.y = mouse.y
      }
    }

    // Mobil: reflektor sjíždí po kotli shora dolů podle průchodu sekce viewportem
    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)))
      mouse.x = frame.offsetWidth / 2
      mouse.y = frame.offsetHeight * (0.1 + progress * 0.8)
      if (smooth.x < -500) {
        smooth.x = mouse.x
        smooth.y = mouse.y
      }
    }

    const applyMask = () => {
      // Poloměr úměrný velikosti rámu (na mobilu menší, na desktopu ~260 px)
      const radius = Math.min(260, frame.offsetWidth * 0.32)
      const mask = `radial-gradient(circle ${radius}px at ${smooth.x.toFixed(1)}px ${smooth.y.toFixed(1)}px, rgb(0 0 0) 40%, rgb(0 0 0 / 0.75) 60%, rgb(0 0 0 / 0.4) 75%, rgb(0 0 0 / 0.12) 88%, transparent 100%)`
      reveal.style.maskImage = mask
      reveal.style.webkitMaskImage = mask
    }

    let raf
    const loop = () => {
      const dx = mouse.x - smooth.x
      const dy = mouse.y - smooth.y
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        smooth.x += dx * 0.1
        smooth.y += dy * 0.1
        applyMask()
      }
      raf = requestAnimationFrame(loop)
    }

    if (isTouch) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
      if (smooth.x > -500) applyMask()
    } else {
      section.addEventListener('pointermove', handleMove)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      section.removeEventListener('pointermove', handleMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const scrollToKontakt = () => {
    document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="palirna"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0d0a07]"
      // svh místo dvh — dvh se mění při schovávání adresního řádku na mobilu
      // a sekce by při scrollu měnila výšku (skákání a překreslování obrázků)
      style={{ height: '100svh' }}
    >
      <div
        ref={frameRef}
        className="absolute left-1/2 top-1/2 aspect-square h-full max-w-none -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(media/palirna-base.jpg)' }}
        />
        <div
          ref={revealRef}
          className="pointer-events-none absolute inset-0 z-30 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(media/palirna-reveal.jpg)',
            maskImage: HIDDEN_MASK,
            WebkitMaskImage: HIDDEN_MASK,
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[10%] z-50 flex flex-col items-center px-5 text-center">
        <h2 className="leading-[0.95] text-wheat">
          <span
            className="block font-instrument-serif text-4xl italic sm:text-6xl md:text-7xl"
            style={{ letterSpacing: '-0.03em' }}
          >
            Nahlédněte
          </span>
          <span
            className="-mt-1 block font-instrument-serif text-4xl sm:text-6xl md:text-7xl"
            style={{ letterSpacing: '-0.03em' }}
          >
            do naší palírny
          </span>
        </h2>
      </div>

      <div className="absolute bottom-14 left-10 z-50 hidden max-w-[280px] sm:block md:left-14">
        <p className="font-sans text-sm font-light leading-relaxed text-wheat/80">
          Z vlastního ovoce a obilí pálíme poctivé destiláty postaru — v měděném kotli, pomalu a
          s citem. Posviťte si kurzorem na kotel a uvidíte, co se děje uvnitř.
        </p>
      </div>

      <div className="absolute bottom-10 left-5 right-5 z-50 flex max-w-full flex-col items-start gap-4 sm:bottom-24 sm:left-auto sm:right-10 sm:max-w-[280px] sm:gap-5 md:right-14">
        <p className="font-sans text-xs font-light leading-relaxed text-wheat/80 sm:text-sm">
          Kvas z vlastních švestek a jablek, dvojitá destilace a trpělivé zrání. Domluvte si
          návštěvu nebo ochutnávku.
        </p>
        <button
          onClick={scrollToKontakt}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-grain px-7 py-3 font-sans text-sm font-medium text-soil transition-all hover:scale-[1.03] hover:bg-wheat active:scale-95"
        >
          Domluvit ochutnávku
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}
