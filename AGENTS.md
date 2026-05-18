# Wedding Website — AGENTS.md

## Project overview
A wedding website with 3 standalone landing pages — one per guest type (`weekend`, `dag`, `avond`). Each page uses the same shared components but displays different content sourced from a single CSV file. The site is a polished one-pager per guest type with scroll-driven animations inspired by armenia.travel and oryzo.ai.

## Architecture

### Data flow
```
src/data/wedding-data.csv  →  scripts/csv-to-json.js  →  src/data/wedding-data.json  →  Astro components
```
- The CSV is the single source of truth. All content changes happen in the CSV.
- Run `npm run data` to regenerate the JSON after editing the CSV.
- The JSON structure: `{ weekend: { header, location, program, gift, faq, mc, rsvp }, dag: {...}, avond: {...} }`

### CSV format
- Columns: `section, key, weekend, dag, avond`
- Each row is a content field. The `section` groups fields, the `key` names the field.
- For lists (program items, FAQ), use numbered keys: `day_1_1_time`, `day_1_1_title`, `faq_1_q`, `faq_1_a`
- Empty cells mean the content doesn't apply to that guest type.

### Component architecture
All components live in `src/components/` and are shared across pages:
- `HeroHeader.astro` — Full-screen hero with parallax scroll effect
- `LocationBlock.astro` — Venue, address, Google Maps embed, arrival time badge
- `ProgramTimeline.astro` — Vertical timeline with dots, supports multiple days
- `GiftTip.astro` — Gift suggestion card
- `FAQ.astro` — Accordion with client-side JS toggle
- `CeremonyMaster.astro` — MC introduction with photo placeholder and email
- `RSVPButton.astro` — CTA button linking to Notion form

Each page (`src/pages/weekend.astro`, `dag.astro`, `avond.astro`) imports the JSON and passes the relevant subset to each component: `<HeroHeader {...d.header} />`

### Design tokens
- Colors and fonts are defined in `tailwind.config.mjs` under `theme.extend`
- All color classes use the `wedding-` prefix (e.g. `text-wedding-accent`, `bg-wedding-bg-alt`)
- Font classes: `font-display` (headings) and `font-body` (body text)
- Global CSS with scroll reveal system in `src/styles/global.css`

### Scroll animation system
- Use `data-reveal` attribute on elements that should fade-in-up on scroll
- Use `data-reveal-delay="1"` through `"5"` for stagger timing
- The IntersectionObserver lives in `WeddingLayout.astro`
- Hero section uses parallax: content moves up and fades out on scroll

### Design aesthetic
Refined editorial wedding style. Think modern luxury wedding stationery:
- Generous whitespace, asymmetric layouts
- Alternating background colors between sections (wedding-bg / wedding-bg-alt)
- Subtle dot pattern overlay on hero
- Smooth cubic-bezier easing on all transitions
- Timeline with vertical line and dots
- Cards with subtle shadows, rounded corners
- Accent color badges for arrival times
- Scroll indicator with pulsing animation in hero

## Rules
1. The 3 pages are standalone. They must NOT link to each other. There is NO navigation menu.
2. The site must NOT be indexable: `<meta name="robots" content="noindex, nofollow">` is in the layout.
3. All content comes from the JSON (generated from CSV). Never hardcode content in components.
4. Components receive data via props only. They don't import the JSON directly.
5. Keep the CSV structure flat and Excel/Google Sheets-friendly.
6. Sections alternate backgrounds: odd sections use `wedding-bg`, even sections use `wedding-bg-alt`.

## Tech stack
- Astro 5 with @astrojs/tailwind integration
- Tailwind CSS 3
- No React — pure Astro components with vanilla JS for interactivity (FAQ accordion, scroll reveals)
- csv-parse for the conversion script
- Hosted as static site (Vercel/Netlify)

## Commands
- `npm run data` — Convert CSV to JSON
- `npm run dev` — Start dev server (also runs data conversion first)
- `npm run build` — Production build (also runs data conversion first)
- `npm run preview` — Preview production build

## File structure
```
wedding-site/
├── AGENTS.md
├── package.json
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── scripts/
│   └── csv-to-json.js
├── public/
│   └── favicon.svg
└── src/
    ├── data/
    │   ├── wedding-data.csv      ← EDIT THIS (the CMS)
    │   └── wedding-data.json     ← GENERATED (don't edit)
    ├── layouts/
    │   └── WeddingLayout.astro
    ├── components/
    │   ├── HeroHeader.astro
    │   ├── LocationBlock.astro
    │   ├── ProgramTimeline.astro
    │   ├── GiftTip.astro
    │   ├── FAQ.astro
    │   ├── CeremonyMaster.astro
    │   └── RSVPButton.astro
    ├── styles/
    │   └── global.css
    └── pages/
        ├── weekend.astro
        ├── dag.astro
        └── avond.astro
```