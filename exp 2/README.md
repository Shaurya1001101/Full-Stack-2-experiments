# Vita — Multi-Platform Post Composer & Dispatch Console

A dynamic social media posting web app built with **React** and **Redux Toolkit**, combining:

- **Experiment 1** — Post Composer UI with real-time, per-platform constraint validation
- **Experiment 2** — Centralized Redux Toolkit state management (normalized posts, async publish flow)

## What it does

Compose one draft, target it at any combination of connected channels (X, Instagram, LinkedIn, Facebook), and get **live, per-platform feedback** as you type: a character "signal meter", media-count rules, hashtag warnings, and a required-media check for platforms like Instagram. Publishing simulates an async API call (pending/succeeded/failed) and drops the result into a filterable Feed, grouped by broadcast.

## Tech / architecture

```
src/
  data/platforms.js            static platform rule catalog (limits, media rules)
  utils/validation.js           pure validation functions (unit-testable, no Redux/React deps)
  features/
    platforms/platformsSlice.js  connect/disconnect channels
    composer/composerSlice.js    live draft: text, selected platforms, media
    posts/postsSlice.js          normalized posts (byId/allIds) + publishPost async thunk
  components/                    Sidebar, Composer, PlatformChip, SignalMeter,
                                  PlatformComposerCard, MediaManager, Feed, PostGroupCard
  app/store.js                   configureStore combining all three slices
```

State is normalized (`byId` / `allIds`) rather than a flat array, so lookups, updates, and deletes don't require scanning the whole post list. Async publishing goes through `createAsyncThunk`, so the UI can react to `loading` / `succeeded` / `failed` states instead of assuming every publish succeeds.

## Run it

```bash
npm install
npm run dev
```

## Notes for the report

- **Real-time validation**: `utils/validation.js` re-runs on every keystroke via `useMemo` in `Composer.jsx`, independently per selected platform.
- **Constraint validation is data-driven**: rules live in `data/platforms.js`, not hardcoded per component — adding a new platform means adding one object.
- **Async flow**: `postsSlice.publishPost` simulates network latency and a small random failure rate per platform to demonstrate the full thunk lifecycle.
- **Responsive**: the sidebar collapses to a horizontal bar under 860px; the composer's per-platform cards reflow with `auto-fit` grid.
