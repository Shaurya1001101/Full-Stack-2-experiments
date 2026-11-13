# Post Composer — Multi-Platform Constraint Validation (Plain React)

A dynamic post-composer UI built with **React only** (no Redux, no external state library), matching Experiment 1.1's brief: a single draft targeted at multiple social platforms, each enforcing its own real-time validation.

This is a deliberately different interface from the Redux Toolkit version (Experiment 1.2/2) — same underlying rules, different interaction model and visuals, so the two stand on their own as distinct submissions.

## What it does

- Pick one or more platforms (X, Instagram, LinkedIn, Facebook) as checkbox-style chips.
- Write the post once in a shared textarea, optionally attach media (image URLs).
- Each selected platform becomes its own **tab**. Tabs show a live radial character gauge and flag `!` if that platform currently has an error.
- Opening a tab reveals that platform's full live feedback: char count / remaining, a mini preview, and the specific errors/warnings for its rules (character limit, required media, max media count, hashtag soft-limit).
- Publish is disabled until every selected platform passes validation. Publishing simulates a short async delay, clears the draft, and appends an entry to an in-session "Sent" log.

## Architecture (all plain React)

```
src/
  data/platforms.js          static platform rule catalog (limits, media rules)
  utils/validation.js        pure validation functions — no React/state-lib dependency
  hooks/usePostComposer.js   all state (useState/useMemo/useCallback) + handlers
  components/
    PlatformPicker.jsx        multi-select platform chips
    PlatformTabs.jsx           per-platform tab bar with ring-gauge + error flag
    PlatformDetail.jsx         expanded live feedback for the active tab
    MediaAttachments.jsx       add/remove media URLs
    RingGauge.jsx               signature radial character gauge
    SentLog.jsx                 session log of published drafts
  App.jsx                     composes everything via the usePostComposer hook
```

No global store: `usePostComposer` is a single custom hook that owns all composer state and is the only thing components need to import to work — deliberately modular and reusable without pulling in Redux.

## Run it

```bash
npm install
npm run dev
```

## Notes for the report

- **Real-time validation**: `validateForPlatforms` re-runs via `useMemo` on every keystroke, independently per selected platform — same validation engine design as the Redux version, proving the rules are state-management-agnostic.
- **State management**: everything lives in one custom hook using core React state primitives, demonstrating that multi-platform composer logic doesn't strictly require Redux for a page of this scope — useful contrast for the report against Experiment 1.2/2's centralized store.
- **Responsive**: platform tabs scroll horizontally on narrow screens; the detail header stacks vertically under 560px.
