# Post Scheduler Calendar

An interactive drag-and-drop calendar for scheduling social media posts, built with
React and Redux Toolkit. This single project combines **Experiment 1.4.1**
(interactive calendar UI) and **Experiment 1.4.2** (rendering performance
optimization + testing).

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
  a different day cell dispatches `movePost` to reschedule it
  (`src/components/DayCell.js`, `src/components/PostEvent.js`), using the
  native HTML5 Drag and Drop API — no extra library required.
- **State sync**: all reads/writes go through the Redux store, so the UI
  always reflects the single source of truth.

## Performance & Testing (Experiment 1.4.2)

- **`React.memo`** on `PostEvent` and `DayCell` so a day cell (and its
  events) only re-renders when its own props actually change, not on every
  keystroke/state update elsewhere in the app.
- **`useMemo`** in `Calendar.js` for two non-trivial computations:
  - `weeks`: the month grid, recomputed only when the visible month changes.
  - `postsByDate`: grouping the flat posts array by date key, recomputed
    only when the posts array changes.
- **`useCallback`** for every handler passed down to memoized children
  (`handleDayClick`, `handleEventClick`, `handleDropPost`, etc.) so those
  children see stable function references across re-renders instead of a
  new closure every time.
- **Unit tests** (Jest + React Testing Library):
  - `src/utils/dateUtils.test.js` — month grid generation and date formatting.
  - `src/store/postsSlice.test.js` — reducer logic: add / update / delete /
    move (drag-and-drop reschedule).
  - `src/components/__tests__/PostEvent.test.js` — rendering and click
    interaction on a single event chip.
  - `src/components/__tests__/Calendar.test.js` — integration tests with a
    real Redux store: month navigation, rendering scheduled posts, opening
    the "new post" modal.

## Project structure

```
src/
  components/
    Calendar.js       Main calendar view: month grid, toolbar, modal wiring
    DayCell.js         One day cell: date number, events, drop target
    PostEvent.js        Draggable event chip
    PostModal.js       Create / edit / delete post form
    __tests__/         Component tests
  store/
    store.js           Redux store configuration
    postsSlice.js      Post CRUD + reschedule reducers (Redux Toolkit)
    postsSlice.test.js Reducer tests
  utils/
    dateUtils.js       Month grid + date formatting helpers
    dateUtils.test.js  Utility tests
  App.js / App.css      App shell + all styling
  index.js / index.css  Entry point
```

## Notes

- No external calendar library (e.g. FullCalendar) is used — the grid,
  event mapping, and drag-and-drop are implemented from scratch per the
  experiment's theory section (temporal data modeling, event mapping, user
  interaction handling).
- Sample posts are seeded relative to "today" so the calendar has visible
  content as soon as you run it.
