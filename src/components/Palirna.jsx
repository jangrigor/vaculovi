import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

// Kurzorové „kukátko“: přes základní fotku kotle se maskou (radiální gradient
// kreslený do canvasu) odhaluje druhý obrázek — průřez, co se děje uvnitř.
// Na dotykových zařízeních (bez kurzoru) putuje reflektor po kotli podle scrollu.

// Rozměr zdrojových obrázků a změřené zarovnání průřezu vůči základu
// (průřez je ~2 % větší a posunutý — kompenzuje se transformací za běhu).
const IMG_W = 1672
const IMG_H = 941
const ALIGN = { dx: 56, dy: -4, scale: 0.98 }

function RevealLayer({ image, cursorX, cursorY }) {
  const canvasRef = useRef(null)
  const revealRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const inner = innerRef.current
    if (!canvas || !inner) return
    const resize = () => {
      const parent = canvas.parentElement
      // Maska v polovičním rozlišení — maskSize 100 % ji roztáhne, gradientu to neublíží
      canvas.width = Math.ceil(parent.offsetWidth / 2)
      canvas.height = Math.ceil(parent.offsetHeight / 2)
      // Zarovnání průřezu na základ: posun ve zdrojových px × aktuální cover měřítko
      const coverScale = Math.max(parent.offsetWidth / IMG_W, parent.offsetHeight / IMG_H)
      const tx = ALIGN.dx * coverScale
      const ty = ALIGN.dy * coverScale
      inner.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${ALIGN.scale})`
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const reveal = revealRef.current
    if (!canvas || !reveal || !canvas.width) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Souřadnice a poloměr v polovičním měřítku masky
    const x = cursorX / 2
    const y = cursorY / 2
    const radius = Math.min(130, canvas.width * 0.2)

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    const mask = `url(${canvas.toDataURL()})`
    reveal.style.maskImage = mask
    reveal.style.webkitMaskImage = mask
    reveal.style.maskSize = '100% 100%'
    reveal.style.webkitMaskSize = '100% 100%'
  }, [cursorX, cursorY])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ display: 'none' }}
      />
      <div ref={revealRef} className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <div
          ref={innerRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${image})` }}
        />
      </div>
    </>
  )
}

export default function Palirna() {
  const sectionRef = useRef(null)
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const loopRef = useRef(null)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const isTouch =
      window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window

    const handleMove = (e) => {
      const rect = section.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      if (smooth.current.x < -500) smooth.current = { ...mouse.current }
    }

    // Mobil: reflektor sjíždí po kotli shora dolů podle průchodu sekce viewportem
    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)))
      mouse.current = {
        x: rect.width / 2,
        y: rect.height * (0.08 + progress * 0.84),
      }
      if (smooth.current.x < -500) smooth.current = { ...mouse.current }
    }

    if (isTouch) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('touchmove', handleScroll, { passive: true })
      handleScroll()
    } else {
      section.addEventListener('pointermove', handleMove)
    }

    // setInterval místo requestAnimationFrame — rAF se zastaví v tabu na pozadí
    const loop = () => {
      const dx = mouse.current.x - smooth.current.x
      const dy = mouse.current.y - smooth.current.y
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return
      smooth.current.x += dx * 0.12
      smooth.current.y += dy * 0.12
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
    }
    loopRef.current = setInterval(loop, 1000 / 60)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
      section.removeEventListener('pointermove', handleMove)
      clearInterval(loopRef.current)
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
      style={{ height: '100dvh' }}
    >
      <div
        className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(media/palirna-base.jpg)' }}
      />

      <RevealLayer image="media/palirna-reveal.jpg" cursorX={cursorPos.x} cursorY={cursorPos.y} />

      <div className="pointer-events-none absolute inset-x-0 top-[12%] z-50 flex flex-col items-center px-5 text-center">
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
