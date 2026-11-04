# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Recruiters and hiring managers** for remote full-stack roles. They skim for one to two minutes to decide whether to interview. Their job: confirm seniority, stack fit and real shipped work, then contact or open the CV.
- **Freelance clients** (founders, small companies) who need a web or mobile product built. Their job: see comparable shipped work and reach out to quote.

Visitors arrive in English, Spanish or Korean (the owner lives in Korea; clients and employers span LatAm, Korea and worldwide remote).

## Product Purpose

Personal portfolio of Jorge Ignacio Garay. It exists to turn a visit into a conversation: an email, WhatsApp message, LinkedIn connection, or CV download. Success = a visitor understands within the first screen who Jorge is, what he builds, and how to reach him.

## Positioning

Full Stack developer (5+ years, React / Next.js / Flutter / Node / TypeScript) whose recent work centers on applied AI: products where LLMs and speech models do real work inside a shipped app (local transcription + summarization, AI-graded speaking exams, automated notification pipelines). Backed by production experience in healthcare, logistics, edtech and finance, plus mentoring 20+ junior developers.

## Operating Context

- Visitors usually come from a job application, LinkedIn, or a shared link, often on mobile.
- The CV PDF (`public/Jorge_Garay_CV.pdf`) is the companion artifact; the site must agree with it.
- Deployed on Netlify from this repo; content edited by the owner via code (with Claude).

## Capabilities and Constraints

- Next.js 12 (pages router), React 17, Tailwind 3, TypeScript. Netlify with `@netlify/plugin-nextjs`, Node 24.
- i18n via next-i18next: `en`, `es`, `ko`. All user-facing copy must exist in all three.
- Content (experience + projects) lives in the repo as typed data, rendered at build time. The previous Google Sheets source is retired.
- Contact channels: email garayjorgeignacio@gmail.com, WhatsApp +82 10 3040 9735, LinkedIn /in/jorgeignaciogaray, GitHub /Viozhu.

## Brand Commitments

- Name: Jorge Ignacio Garay.
- Voice: direct, concrete, first person; claims tied to shipped work.

## Evidence on Hand

- CV (source of truth for experience): Utomata (Full Stack Dev, Sep 2023–present), OpenHelp (Mobile Dev, Sep 2023–present), Numen Academy (Full Stack Dev Mentor, Mar 2022–Dec 2024), Ivoy (Full Stack Dev, Dec 2021–Jun 2023), LiLab (Front-end Dev, Jul–Dec 2021), SOFI (Freelance, Jul 2022). Education: Henry bootcamp 2021, Assoc. Degree Software Dev 2022.
- AI projects with code: MeetingNotes (local macOS meeting recorder, whisper.cpp + diarization + LLM summaries, no public repo), OPIc Simulator (github.com/Viozhu/OPIC-simulation, Whisper + Claude grading), LendLoop (github.com/Viozhu/lendloop, Next.js 16 + Convex + Clerk + n8n).
- Live sites: Forest Crafts (forest-crafts-alpha.vercel.app), Cookies Code (code-cookies.vercel.app), Frog Jump, Click the Monster (vercel.app).
- Project screenshots hosted on imgur / GitHub user-images (existing).
- No testimonials, client logos, metrics beyond the CV. Do not fabricate any.

## Product Principles

1. Shipped work over adjectives: every claim points to a project, role, or repo.
2. The first screen answers who / what / how to reach.
3. Agree with the CV; the site never contradicts it.
4. Equal quality in EN, ES and KO.
5. Fast and readable on a phone.
