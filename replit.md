# Quizzer

A responsive online quiz platform where students can take quizzes from different categories (NASSCOM and future categories). Fully client-side with localStorage persistence.

## Run & Operate

- `pnpm --filter @workspace/quizzer run dev` — run the quiz app (auto-assigned PORT)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS
- Routing: Wouter
- State: Zustand
- Animation: Framer Motion
- Excel parsing: SheetJS (xlsx)
- Persistence: localStorage (no database needed for quiz app)
- API: Express 5 (api-server artifact — not used by quiz app)

## Where things live

- `artifacts/quizzer/src/pages/` — all page components
- `artifacts/quizzer/src/components/` — reusable UI components
- `artifacts/quizzer/src/stores/` — Zustand stores (quizStore, adminStore, categoryStore)
- `artifacts/quizzer/src/services/` — excelParser, questionBank (localStorage)
- `artifacts/quizzer/src/types/index.ts` — all TypeScript types
- `artifacts/quizzer/src/utils/` — shuffle, quizUtils
- `artifacts/quizzer/src/context/ThemeContext.tsx` — dark/light mode
- `artifacts/quizzer/src/data/nasscomData.json` — pre-bundled NASSCOM question data (10 modules, 318 total questions)

## Architecture decisions

- **Embedded question data**: NASSCOM data is pre-parsed from Excel into JSON and bundled in the app. No server needed.
- **Admin panel**: Allows uploading new Excel workbooks via SheetJS. Custom data saved to localStorage and overrides defaults.
- **Question shuffling**: Fisher-Yates shuffle on both question selection and option ordering, with correct answer remapping.
- **Wouter for routing**: Consistent with the monorepo frontend convention (not react-router-dom).
- **Dark mode by default**: ThemeProvider defaults to dark, persisted in localStorage.

## Product

- Home page: category cards (NASSCOM)
- NASSCOM page: 10 module cards + "Entire NASSCOM Quiz" special card
- Quiz setup: student name, question count selection (10/15/20/25/All)
- Quiz engine: randomized questions + shuffled options, immediate answer feedback
- Results page: score, percentage, pass/fail, time taken
- Admin panel: login (admin/admin123), upload Excel, preview modules

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The app is fully client-side. No DATABASE_URL needed for the quiz app.
- The nasscomData.json must stay at `artifacts/quizzer/src/data/nasscomData.json`.
- Admin credentials are stored in localStorage (key: `quizzer_admin_creds`). Default: admin/admin123.
- Custom uploaded question banks are stored in localStorage (key: `quizzer_custom_bank`).
- Run `pnpm run typecheck` before deploying to catch any issues.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
