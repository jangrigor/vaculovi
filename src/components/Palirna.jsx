import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

const SPOTLIGHT_R = 260

// Kurzorové „kukátko“: přes základní fotku kotle se maskou (radiální gradient
// kreslený do canvasu) odhaluje druhý obrázek — průřez, co se děje uvnitř.
function RevealLayer({ image, cursorX, cursorY }) {
  const canvasRef = useRef(null)
  const revealRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const reveal = revealRef.current
    if (!canvas || !reveal) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
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
      <div
        ref={revealRef}
        className="pointer-events-none absolute inset-0 z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  )
}

export default function Palirna() {
  const sectionRef = useRef(null)
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef(null)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Souřadnice relativně k sekci (není to celostránkové hero)
    const handleMove = (e) => {
      const rect = section.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      if (smooth.current.x < -500) smooth.current = { ...mouse.current }
    }
    section.addEventListener('pointermove', handleMove)

    // setInterval místo requestAnimationFrame — rAF se zastaví v tabu na pozadí
    const loop = () => {
      const dx = mouse.current.x - smooth.current.x
      const dy = mouse.current.y - smooth.current.y
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return
      smooth.current.x += dx * 0.1
      smooth.current.y += dy * 0.1
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
    }
    rafRef.current = setInterval(loop, 1000 / 60)

    return () => {
      section.removeEventListener('pointermove', handleMove)
      clearInterval(rafRef.current)
    }
  }, [])

  const scrollToKontakt = () => {
    document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="palirna"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
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
          className="flex items-center gap-2 rounded-full bg-grain px-7 py-3 font-sans text-sm font-medium text-soil transition-all hover:scale-[1.03] hover:bg-wheat active:scale-95"
        >
          Domluvit ochutnávku
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}
