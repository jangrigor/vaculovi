import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GlowCard } from '@/components/ui/spotlight-card'

// Add new objects here to add cards — no other code changes needed.
// Texty jsou pracovní návrhy — nahraďte skutečnými novinkami.
const newsItems = [
  {
    id: 1,
    image: 'media/aktualita-1.jpg',
    date: '7. 7. 2026',
    title: 'Žně se blíží',
    text: 'Pšenice krásně dozrává — pokud počasí vydrží, začínáme sklízet během pár týdnů.',
  },
  {
    id: 2,
    image: 'media/aktualita-2.jpg',
    date: '[Datum]',
    title: 'Jarní práce na polích',
    text: 'Orba a příprava půdy na letošní sezónu jsou v plném proudu.',
  },
  {
    id: 3,
    image: 'media/aktualita-3.jpg',
    date: '[Datum]',
    title: 'Loňská sklizeň potěšila',
    text: 'Kvalita zrna byla letos nadprůměrná — děkujeme všem, kdo od nás odebírají.',
  },
]

function NewsCard({ item }) {
  const isPlaceholder = item.image.startsWith('[')

  return (
    <GlowCard glowColor="orange" customSize className="w-72 shrink-0 snap-center md:w-80">
      {isPlaceholder ? (
        <div className="flex h-44 w-full items-center justify-center rounded-lg bg-wheat">
          <span className="font-sans text-sm text-soil/40">[Foto]</span>
        </div>
      ) : (
        <img src={item.image} alt={item.title} className="h-44 w-full rounded-lg object-cover" />
      )}
      <div className="pb-1">
        <span className="font-sans text-xs text-soil/50">{item.date}</span>
        <h3 className="mt-1 font-instrument-serif text-lg text-soil">{item.title}</h3>
        <p className="mt-2 font-sans text-sm leading-relaxed text-soil/70">{item.text}</p>
      </div>
    </GlowCard>
  )
}

export default function Aktuality() {
  const scrollerRef = useRef(null)

  const scrollByCard = (direction) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const cardWidth = scroller.firstElementChild?.getBoundingClientRect().width ?? 300
    scroller.scrollBy({ left: direction * (cardWidth + 24), behavior: 'smooth' })
  }

  return (
    <section id="aktuality" className="bg-wheat px-6 py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl items-end justify-between">
        <div>
          <h2 className="mb-2 font-instrument-serif text-3xl text-soil md:text-4xl">
            Aktuality ze statku
          </h2>
          <p className="mb-10 font-sans text-sm text-soil/60">Co se u nás zrovna děje</p>
        </div>

        {newsItems.length > 0 && (
          <div className="hidden gap-2 pb-10 md:flex">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Předchozí"
              className="rounded-full border border-soil/20 p-2 text-soil transition-colors hover:bg-soil hover:text-wheat"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Další"
              className="rounded-full border border-soil/20 p-2 text-soil transition-colors hover:bg-soil hover:text-wheat"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {newsItems.length === 0 ? (
        <p className="py-12 text-center font-sans text-sm text-soil/50">
          Zatím tu nic není — brzy přidáme první novinky ze statku.
        </p>
      ) : (
        <div
          ref={scrollerRef}
          className="no-scrollbar mx-auto flex max-w-6xl snap-x snap-mandatory gap-6 overflow-x-auto"
        >
          {newsItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}
