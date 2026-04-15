# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm type-check   # TypeScript type checking (tsc)
```

No test suite configured. No linting scripts in package.json (ESLint packages installed but unconfigured).

## Architecture

Single-page Next.js 12 app. All content lives in `pages/index.tsx` — one route, multiple sections (about, portafolio, skills, contact) navigated via smooth-scroll anchors.

### Data Flow

Portfolio content (projects + experiences) comes from a **Google Sheets spreadsheet** fetched client-side via `utils/usePortfolioData.ts`. The sheet uses Google Visualization API (`gviz/tq?tqx=out:json`) and returns a raw JSONP-like string that must be manually parsed. Columns map by index (not name), so any sheet restructuring breaks the parser.

- Projects: columns 1–7 (img, title, descriptionEs, descriptionEn, descriptionKr, link, techStack)
- Experiences: columns 10–14 (company, role, period, type, description)
- `techStack` is a comma-separated string; split at render time

### i18n

`next-i18next` with `locales: ['en', 'es', 'ko']`. Translations in `public/locales/{locale}/common.json`. `getStaticProps` must call `serverSideTranslations` on every page that uses `useTranslation`. Language detection is automatic via browser locale; `LanguageSwitcher` component allows manual override.

Project descriptions are locale-specific fields (`descriptionEs`, `descriptionEn`, `descriptionKr`) — language switching in `Hero.tsx` picks the right field based on `i18n.language`.

### Key Components

- **`components/ui/starfall-portfolio-landing.tsx`** — large self-contained UI component (`PortfolioPage`) that renders the hero section. `Hero.tsx` wraps it, passes `heroOnly: true` and `showNavigation: false` since `Layout` provides the navbar.
- **`components/Layout/Layout.tsx`** — wraps all pages; includes `NavBar` and sets page `<title>`.
- **`components/Hero/Hero.tsx`** — mounts only client-side (`useState(mounted)`), renders `react-tsparticles` background + `PortfolioPage`.

### Styling

Tailwind CSS with custom `space-*` color tokens (`space-dark`, `space-light`, `space-accent`, `space-cyan`, `space-pink`). Shadcn-compatible tokens (`background`, `foreground`, `muted`, `card`, `border`) also defined for the starfall component. Global animations in `styles/global.css`.

### Deployment

Netlify via `@netlify/plugin-nextjs`. Build command: `pnpm install --frozen-lockfile && pnpm run build`. Node 24.x required (set in `netlify.toml`).
