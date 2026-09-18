# Post Scheduler Calendar

An interactive drag-and-drop calendar for scheduling social media posts, built with
React and Redux Toolkit — plus a live **Render Optimizer** panel that turns the
performance-optimization theory into something you can actually watch happen.
This single project combines **Experiment 1.4.1** (interactive calendar UI) and
**Experiment 1.4.2** (rendering performance optimization + testing).

## Setup

1. Unzip this folder.
2. Install dependencies:
   ```
   npm install
   ```
3. Run the app:
   ```
   npm start
   ```
   Opens at http://localhost:3000
4. Run the test suite:
   ```
   npm test
   ```

If you're dropping this into an existing React project/activator instead, copy
the contents of `src/` and merge `package.json`'s `dependencies` (you need
`@reduxjs/toolkit` and `react-redux` in addition to `react`/`react-dom`).

## Features (Experiment 1.4.1)

- **Month view calendar** built from scratch (`src/utils/dateUtils.js` +
  `src/components/Calendar.js`) — temporal data modeling that maps dates to a
  7-column week grid, including padding days from adjacent months.
- **Event mapping**: posts (`{ id, title, content, date, time, color }`) are
  stored in a Redux slice (`src/store/postsSlice.js`) and grouped by date to
  render as event chips inside each day cell.
- **Click interactions**: click a day (or its `+` button) to schedule a new
  post; click an existing post chip to view/edit/delete it
  (`src/components/PostModal.js`).
- **Drag-and-drop scheduling**: post chips are `draggable`; dropping one onto
  a different day cell dispatches `movePost` to reschedule it, using the
  native HTML5 Drag and Drop API — no extra library required.
- **State sync**: all reads/writes go through the Redux store, so the UI
  always reflects the single source of truth.

## Performance & Testing (Experiment 1.4.2)

### The optimized calendar

- **`React.memo`** on `PostEvent` and `DayCell` so a day cell (and its
  events) only re-renders when its own props actually change, not on every
  unrelated state update elsewhere in the app.
- **`useMemo`** in `Calendar.js` for two non-trivial computations:
  - `weeks`: the month grid, recomputed only when the visible month changes.
  - `postsByDate`: grouping the flat posts array by date key, recomputed
    only when the posts array changes.
- **`useCallback`** for every handler passed down to memoized children
  (`handleDayClick`, `handleEventClick`, `handleDropPost`, etc.) so those
  children see stable function references across re-renders instead of a
  new closure every time.

### The Render Optimizer panel (right-hand side)

The app now ships with a live instrument panel, not just an optimized
component tree — you can *watch* the optimization work instead of taking it
on faith:

- **Optimal / Non-optimal toggle** swaps the mounted calendar between
  `Calendar.js` (the optimized version above) and `CalendarUnoptimized.js`,
  a deliberately "before" implementation with no `useMemo`, no
  `useCallback`, and unmemoized day cells/post chips. Both share the same
  Redux store, so your posts don't disappear when you switch.
- **Background load simulator** ticks an unrelated counter every second (or
  on demand with "Force one tick") — standing in for something like a live
  clock or a notification badge elsewhere in a real app. It has nothing to
  do with the posts or the visible month, so an optimized tree should barely
  react to it.
- **Live render counts** table shows, per component (`Calendar`, `DayCell`,
  `PostEvent`), how many times its render function has actually executed
  under each mode — polled from `src/utils/renderStats.js`, a tiny
  module-level store that instrumented components write to via the
  `useRenderCount` hook (`src/hooks/useRenderCount.js`).
- **Render flash overlay**: every time an instrumented `DayCell` or
  `PostEvent` actually re-executes its render function, it briefly flashes
  (green for optimal, red for non-optimal) directly in the calendar grid —
  so in non-optimal mode you'll see the *entire* grid flash red on every
  tick, while in optimal mode almost nothing flashes at all.
- **Render log** lists the most recent render events with timestamps, for a
  blow-by-blow view of what just re-rendered and why.

Try it: switch to **Non-optimal**, turn on auto-tick for a few seconds, note
the counts, then switch to **Optimal** and repeat. The `DayCell`/`PostEvent`
columns tell the story.

### Unit tests (Jest + React Testing Library)

- `src/utils/dateUtils.test.js` — month grid generation and date formatting.
- `src/utils/renderStats.test.js` — the render-count store used by the panel.
- `src/store/postsSlice.test.js` — reducer logic: add / update / delete /
  move (drag-and-drop reschedule).
- `src/components/__tests__/PostEvent.test.js` — rendering and click
  interaction on a single event chip.
- `src/components/__tests__/DayCellBase.test.js` — day cell rendering, click
  handling, and render-count instrumentation.
- `src/components/__tests__/Calendar.test.js` / `CalendarUnoptimized.test.js`
  — integration tests with a real Redux store: month navigation, rendering
  scheduled posts, opening the "new post" modal, and (for the non-optimal
  calendar) confirming an unrelated prop change re-renders every day cell.
- `src/components/__tests__/RenderOptimizerPanel.test.js` — mode toggle,
  simulator controls, and the live stats table.

## Project structure

```
src/
  components/
    Calendar.js              Optimal calendar: month grid, toolbar, modal wiring
    CalendarUnoptimized.js    Non-optimal calendar: same UI, no memoization
    DayCellBase.js            Shared, unmemoized day-cell implementation
    DayCell.js                React.memo wrapper around DayCellBase (optimal)
    PostEventBase.js          Shared, unmemoized event-chip implementation
    PostEvent.js               React.memo wrapper around PostEventBase (optimal)
    PostModal.js              Create / edit / delete post form
    RenderOptimizerPanel.js   Right-hand instrument panel
    __tests__/                Component tests
  hooks/
    useRenderCount.js          Render-counting + flash-token hook
  store/
    store.js                  Redux store configuration
    postsSlice.js              Post CRUD + reschedule reducers (Redux Toolkit)
    postsSlice.test.js         Reducer tests
  utils/
    dateUtils.js               Month grid + date formatting helpers
    dateUtils.test.js          Utility tests
    renderStats.js              Module-level render-count/log store
    renderStats.test.js        Store tests
  App.js / App.css             App shell, two-column layout, all styling
  index.js / index.css         Entry point
```

## Notes

- No external calendar library (e.g. FullCalendar) is used — the grid,
  event mapping, and drag-and-drop are implemented from scratch per the
  experiment's theory section (temporal data modeling, event mapping, user
  interaction handling).
- Sample posts are seeded relative to "today" so the calendar has visible
  content as soon as you run it.
- `DayCellBase`/`PostEventBase` hold the actual rendering logic once; the
  "optimal" and "non-optimal" variants differ only in whether that logic is
  wrapped in `React.memo` and which handlers/computations are memoized —
  so the two calendars are guaranteed to look and behave identically apart
  from re-render behavior.
- The render counters live in a plain module-level object
  (`src/utils/renderStats.js`), not React state, and the panel polls it on
  an interval rather than subscribing — recording a render must never itself
  trigger a synchronous state update inside another component's render
  phase.
