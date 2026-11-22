# Kids Kanban Board

A touch-friendly kanban board for kids' daily routines. Supports Hebrew (RTL) and English, configurable states/columns, configurable tasks with emoji or custom-photo icons, per-item colors, multiple kid tabs, and reusable task-set presets ("Spaces" like Morning Routine / Afternoon Routine).

See [PLAN.md](./PLAN.md) for the full design and architecture notes.

## Open on a tablet

Open [kids-kanban.html](./kids-kanban.html) on GitHub and tap **Download raw file**. Open the downloaded file from your device’s Downloads folder in a browser that supports local HTML files. The board and audio work offline.

GitHub Actions builds the standalone HTML for each push to main and pull request. Download the `kids-kanban-html` artifact from the workflow run, or download `kids-kanban.html` directly from the Assets section of a published GitHub release. The HTML checked into the repository is a snapshot.

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
- `npm run build:standalone` — create `dist/kids-kanban.html` for offline use
- `npm run lint` — run oxlint

## How it works

- All data (kids, boards, spaces, settings) lives in the browser's `localStorage` — no backend, no login, works fully offline.
- Tap a task card to move it between states; drag-and-drop between columns also works (touch and pointer).
- The gear icon in the header opens Settings, where kids, states, spaces/tasks, and language are all configurable.
- Installable as a PWA ("Add to Home Screen") for a fullscreen, app-like experience on a tablet.

## Audio credits

- Countdown voice: [ready set go by Alivvie](https://freesound.org/people/Alivvie/sounds/451271/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The recording was retimed and mixed with percussion and piano.
- Celebration applause: [Applause, enthusiastic, short, some cheering by peridactyloptrix](https://freesound.org/people/peridactyloptrix/sounds/196092/), CC0. The recording was trimmed and mixed with a piano fanfare rendered with the TimGM6mb soundfont.
