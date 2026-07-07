import { ArrowRight, Newspaper } from 'lucide-react'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import { scrollToId } from './Header'

// Navigace (ukotvené menu + mobilní overlay) žije v components/Header.jsx.
export default function Hero() {
  return (
    <section id="o-nas" className="relative bg-soil">
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
