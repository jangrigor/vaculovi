import { useState } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { GlowCard } from '@/components/ui/spotlight-card'

const contactInfo = {
  phone: '[TELEFON_PLACEHOLDER]',
  email: '[EMAIL_PLACEHOLDER]',
  address: '[ADRESA_PLACEHOLDER]',
  // Po doplnění skutečné adresy ji nastavte i sem — mapa se vycentruje sama.
  mapQuery: 'Morava, Česko',
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/[FORMSPREE_FORM_ID]'

const inputClasses =
  'w-full rounded-lg border border-wheat/30 bg-transparent px-4 py-3 font-sans text-sm text-wheat placeholder:text-wheat/40 focus:border-grain focus:outline-none'

export default function Kontakt() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    setStatus('submitting')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="kontakt" className="bg-soil px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-2 font-instrument-serif text-3xl text-wheat md:text-4xl">
          Ozvěte se nám
        </h2>
        <p className="mb-10 font-sans text-sm text-wheat/60">
          Napište nám k poptávce, spolupráci nebo jen na pozdrav.
        </p>

        <div className="grid gap-12 md:grid-cols-2">
          <GlowCard glowColor="orange" customSize className="w-full self-start p-6 md:p-8">
            <div className="space-y-4 font-sans text-sm text-wheat md:text-base">
              <div className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-grain" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-grain">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-grain" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-grain">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="shrink-0 text-grain" />
                <span>{contactInfo.address}</span>
              </div>
            </div>

            <iframe
              title="Mapa — kde nás najdete"
              src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.mapQuery)}&output=embed`}
              className="h-64 w-full rounded-lg border-0 md:h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </GlowCard>

          <GlowCard glowColor="orange" customSize className="w-full p-6 md:p-8">
            {status === 'success' ? (
              <p className="font-instrument-serif text-xl text-wheat">
                Děkujeme, ozveme se vám co nejdříve.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="jmeno"
                  placeholder="Jméno"
                  required
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="kontakt"
                  placeholder="E-mail nebo telefon"
                  required
                  className={inputClasses}
                />
                <textarea
                  name="zprava"
                  placeholder="Zpráva"
                  required
                  rows={5}
                  className={inputClasses}
                />

                <label className="flex items-start gap-3 font-sans text-xs text-wheat/70">
                  <input type="checkbox" required className="mt-1 accent-grain" />
                  Souhlasím se zpracováním osobních údajů za účelem vyřízení mé poptávky.
                </label>

                {status === 'error' && (
                  <p className="font-sans text-sm text-red-300">
                    Něco se pokazilo, zkuste to prosím znovu nebo nám napište přímo na{' '}
                    {contactInfo.email}.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-fit rounded-full bg-grain px-7 py-3 font-sans text-sm font-medium text-soil transition-colors hover:bg-wheat disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Odesílám…' : 'Odeslat zprávu'}
                </button>
              </form>
            )}
          </GlowCard>
        </div>
      </div>
    </section>
  )
}
