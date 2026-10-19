# Lakshmipriya | DevOps · SRE · Platform Engineering Portfolio

Terminal-style portfolio for DevOps, SRE, and Platform Engineering work, built
to be scanned quickly by hiring managers, leadership, and HR. Every section is
rendered as a terminal window: a tmux-style tab bar, CI-log pipelines,
`git log` experience, YAML skills, and a CLI contact menu.

Live: https://lakshmipriya0812.github.io/lakshmipriya-portfolio/

## Stack

- Vite + React 19 + TypeScript
- Plain CSS with design tokens (Tailwind v4 is imported only for its preflight reset)
- JetBrains Mono (single monospace family), self-hosted via Fontsource
- Vitest + Testing Library
- GitHub Actions → GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

## Quality gate

```bash
npm run check   # prettier --check, eslint, vitest, tsc + vite build
npm run check:type   # typography guard (see below)
```

## Project layout

```
src/
  App.tsx                 page composition + ⌘K shortcut
  components/             one file per section (Hero, CaseStudies, Skills, …)
    Terminal.tsx          terminal window title bar + shell prompt primitives
    CaseFlow.tsx          auto-playing "How it works" pipeline per case study
    HeroPipeline.tsx      looping, fixed-height VM provisioning demo card
  data/content.ts         ALL copy, metrics, case studies, skills, experience
  lib/motion.ts           reduced-motion + in-view hooks, smooth scrolling
  lib/theme.ts            light / dark theme (initial theme set in index.html)
  styles/typography.css   the type system — every font declaration lives here
  styles/globals.css      terminal skin: tokens, layout, colour (no type rules)
```

## Edit content

Everything visible on the page — headline metrics, case studies (problem,
result, impact, future implementations, pipeline steps, stack), skills,
experience, and education — lives in `src/data/content.ts`.

Skills that also appear in a case study's stack are highlighted automatically.

## Case study flow timing

Each case's pipeline starts when it scrolls into view and advances one step at
a time; it pauses while off-screen or while the reader hovers / focuses it.
Tune the timing in `src/components/CaseFlow.tsx`:

- `START_DELAY_MS` — delay after the flow enters the viewport (default 1000 ms)
- `STEP_MS` — how long each step stays active (default 2500 ms)

## Typography system

`src/styles/typography.css` defines one monospace family and one fluid scale
(`--type-*` tokens) and assigns every text role. `globals.css` contains layout and colour only;
`npm run check:type` fails if a `font-*`, `line-height`, or `letter-spacing`
declaration appears in `globals.css` or inline in a component.

## Deploy

Pushing to `main` builds and deploys via `.github/workflows/deploy.yml`. The
production base path is `/lakshmipriya-portfolio/`.
