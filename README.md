# Kids Kanban Board

A touch-friendly kanban board for kids' daily routines. Supports Hebrew (RTL) and English, configurable states/columns, configurable tasks with emoji or custom-photo icons, per-item colors, multiple kid tabs, and reusable task-set presets ("Spaces" like Morning Routine / Afternoon Routine).

See [PLAN.md](./PLAN.md) for the full design and architecture notes.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL on a tablet (or in a touch-emulated browser) to try it.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

## How it works

- All data (kids, boards, spaces, settings) lives in the browser's `localStorage` — no backend, no login, works fully offline.
- Tap a task card to move it between states; drag-and-drop between columns also works (touch and pointer).
- The gear icon in the header opens Settings, where kids, states, spaces/tasks, and language are all configurable.
- Installable as a PWA ("Add to Home Screen") for a fullscreen, app-like experience on a tablet.
