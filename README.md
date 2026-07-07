# Statek Vaculovi — web

Jednostránkový web (React + Tailwind + lucide-react): Hero → Aktuality → Kontakt.

## Spuštění

```bash
cd statek-vaculovi
npm install
npm run dev
```

Otevře se na `http://localhost:5173`.

## Co je potřeba doplnit před spuštěním do provozu

| Kde | Placeholder | Co doplnit |
|---|---|---|
| ~~`src/components/Hero.jsx`~~ | ~~`[VIDEO_URL_PLACEHOLDER]`~~ | ✅ Hotovo — video URL doplněno |
| `public/media/hero-poster.jpg` | (chybí) | Statický obrázek pole jako `poster` pro video (rychlé připojení / mobil) |
| `src/components/Aktuality.jsx` | `newsItems` pole | Reálné fotky, data, titulky a texty novinek — každý nový objekt v poli = nová karta, layout se nemusí upravovat |
| `src/components/Kontakt.jsx` | `contactInfo.phone/email/address` | Telefon, e-mail a adresa statku |
| `src/components/Kontakt.jsx` | `FORMSPREE_ENDPOINT` | Nahradit `[FORMSPREE_FORM_ID]` ID z Formspree účtu napojeného na cílovou schránku |

### Nastavení Formspree

1. Založit účet na [formspree.io](https://formspree.io) (stačí free tier pro malý objem poptávek).
2. Vytvořit formulář a napojit ho na cílový e-mail (např. `jan.grigor04@gmail.com` nebo dedikovanou adresu statku).
3. Zkopírovat ID formuláře a vložit do `FORMSPREE_ENDPOINT` v `src/components/Kontakt.jsx`.

## Struktura

```
statek-vaculovi/
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── public/media/        ← sem patří poster obrázek a případně další statická média
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    └── components/
        ├── Hero.jsx
        ├── Aktuality.jsx
        └── Kontakt.jsx
```
