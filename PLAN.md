# Kids Kanban Board — Implementation Plan

## Context

The user wants a kanban board web app for their 6-year-old, usable on a tablet. It needs configurable states/columns, configurable tasks (with small images), configurable colors, Hebrew support (RTL), touch-friendly interaction, multiple boards ("tabs") for different kids, reusable task-set presets ("spaces" like morning/afternoon routines), and a settings-menu-driven configuration flow. The repo (`kids-kanban`) is currently empty, so this is a greenfield build.

## Decisions (defaults chosen to keep this simple and shippable)

- **Stack**: React + TypeScript + Vite. Static output, no server needed, good ecosystem for i18n/RTL and touch DnD.
- **Storage**: Browser-local only — `localStorage` for boards/settings, no backend, no login. Works fully offline once loaded; installable as a PWA so it can sit as a home-screen icon on the tablet.
- **Task images**: A built-in emoji/icon picker (offline, no permissions needed) plus an optional custom image upload (stored as a data URL in localStorage) for parents who want a real photo.
- **Touch interaction**: Tap-based primary interaction — tapping a task card opens a small "move to..." control (or cycles to the next state); drag-and-drop is also supported for larger fingers/parents, using a touch-capable DnD library.
- **Hebrew support**: Full i18n layer (English + Hebrew to start) with automatic `dir="rtl"` switching, not just translated strings — layout mirrors correctly.

## Data Model

```
AppState
├── kids: Kid[]                      // one per tab
│   ├── id, name, color
│   └── boards: Board[]              // usually 1 active board per kid, but supports multiple
│       ├── id, name
│       ├── columns: Column[]        // configurable "states"
│       │   ├── id, name, color, order
│       ├── tasks: Task[]            // placed tasks currently on the board
│       │   ├── id, spaceTaskId (ref), columnId, order
├── spaces: Space[]                  // reusable presets, e.g. "Morning Routine"
│   ├── id, name, color
│   └── tasks: SpaceTask[]
│       ├── id, name, icon (emoji or imageDataUrl), color
├── settings
│   ├── language: 'en' | 'he'
│   └── defaultColumns: Column[]     // used when creating a new board
```

Key relationship: **Spaces** are reusable task templates (e.g. "Morning Routine" = brush teeth, get dressed, eat breakfast). Applying a Space to a Kid's board populates it with fresh task instances in the "not started" column. Editing a Space's task list doesn't retroactively change already-placed tasks — it's a preset for future application.

## Project Structure

```
/src
  /app            App.tsx, routing between kid tabs
  /components
    KidTabs.tsx           // top-level tab bar for switching kids/boards
    Board.tsx             // renders columns for the active board
    Column.tsx            // one state/column, drop target
    TaskCard.tsx           // one task, tap + drag handlers, image/emoji, color
    SettingsMenu.tsx       // gear icon -> opens settings modal/drawer
    settings/
      ColumnsEditor.tsx    // add/edit/remove/reorder states, colors
      SpacesEditor.tsx     // add/edit/remove spaces and their tasks
      KidsEditor.tsx       // add/edit/remove kid tabs, colors
      IconPicker.tsx        // emoji grid + custom image upload
      LanguageToggle.tsx
  /state
    store.ts               // React context + reducer, persisted to localStorage
    useLocalStorage.ts
    defaults.ts             // seed data: default columns, 1-2 starter spaces (in en+he)
  /i18n
    en.json, he.json
    i18n.tsx                // context, dir switching
  /types
    index.ts                // AppState, Kid, Board, Column, Task, Space, SpaceTask
  main.tsx, index.css
/public
  manifest.json, icons/     // PWA installability
```

## Implementation Steps

1. **Scaffold**: `npm create vite@latest` (react-ts template), set up ESLint/Prettier minimal config, base folder structure above.
2. **Data layer**: Define types in `/types`, build `store.ts` with React Context + `useReducer`, actions for all CRUD (columns, tasks, spaces, kids, settings), persisted via a `useLocalStorage` hook (debounced write on change). Seed `defaults.ts` with 3 default columns (Not Started / In Progress / Done) and 2 example spaces (Morning Routine, Afternoon Routine) in both languages.
3. **i18n/RTL**: Simple `i18n.tsx` context with `t(key)` lookup over `en.json`/`he.json`; on language change, set `document.dir = 'rtl' | 'ltr'` and `lang` attribute. Use CSS logical properties (`margin-inline-start`, flexbox with `dir` inheritance) instead of hardcoded left/right so layout mirrors correctly.
4. **Core board UI**: `KidTabs` (tab bar, add-kid "+" tab), `Board` renders `Column`s from the active board in order, each `Column` renders its `TaskCard`s. Colors applied via inline style from column/task/kid color fields.
5. **Touch interaction**:
   - Primary: tapping a `TaskCard` opens a small popover/action-sheet listing the other columns (translated names) to move it to — big touch targets.
   - Secondary: wire up `@dnd-kit/core` (has built-in touch sensor support, actively maintained, better mobile support than react-dnd for this case) for drag-and-drop between columns, layered on top of the same move action.
6. **Settings menu**: Gear icon button (top-right, RTL-aware) opens a modal/drawer with tabs: Kids, States (columns), Spaces, Language. Each editor is a simple form list (add/edit/delete/reorder) writing through store actions.
   - `ColumnsEditor`: per-board or default column set — name, color picker, reorder (up/down buttons, avoid requiring drag for the parent's config UI too, though drag is fine here since it's parent-operated).
   - `SpacesEditor`: create/edit spaces, add tasks to a space with name + `IconPicker` (emoji grid tab + "upload image" tab that reads file as data URL) + color. Includes an "Apply to board" action to push a space's tasks onto a kid's board.
   - `KidsEditor`: add/remove/rename kid tabs, assign a color.
7. **PWA polish**: `manifest.json` + icons so it can be "Added to Home Screen" on the tablet for a fullscreen, app-like experience; basic service worker (via `vite-plugin-pwa`) for offline caching.
8. **Styling**: Large touch targets (min 44px+, bigger for a 6yo — aim 64px+), big rounded cards, playful but simple CSS (no heavy UI framework needed — plain CSS modules or Tailwind, either is fine; Tailwind speeds up consistent spacing/color utility work).

## Verification

- `npm run dev` and manually test in a touch-emulated browser viewport (Chrome DevTools device toolbar, touch simulation):
  - Create a kid tab, apply a Space, move a task through all columns via tap.
  - Test drag-and-drop on a touch-emulated screen.
  - Toggle language to Hebrew and confirm full RTL mirroring (tab order, column order, settings drawer side, text alignment).
  - Add a custom column, a custom space with an uploaded image and an emoji task, confirm colors apply.
  - Reload the page and confirm state persists (localStorage).
- `npm run build` to confirm a clean production build; test the built output via `npm run preview` on a tablet (or phone) over the local network to validate real touch behavior, not just emulation.
- No automated test suite is planned initially given the small scope; if the user wants regression safety later, Vitest + React Testing Library can be added for the store reducer and column-move logic.
