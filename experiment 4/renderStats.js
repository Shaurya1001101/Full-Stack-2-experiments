// Render Optimizer instrumentation (Experiment 1.4.2).
//
// This is intentionally a plain module-level store, NOT React state.
// Recording a render must never itself trigger a React state update
// synchronously inside another component's render phase, so components
// call `recordRender` directly and the panel *polls* `getStats()` on an
// interval instead of subscribing. That keeps the instrumentation from
// interfering with the very render behaviour it's trying to measure.

const counts = {};
const log = [];
const MAX_LOG_ENTRIES = 200;
let seq = 0;

/**
 * Record one render of `key` (e.g. "DayCell:optimal").
 * Called from inside a component's render body, so it only fires when
 * React actually invokes that component's function — a component
 * skipped by React.memo never calls this.
 */
export function recordRender(key) {
  seq += 1;
  counts[key] = (counts[key] || 0) + 1;
  log.push({ key, time: Date.now(), seq });
  if (log.length > MAX_LOG_ENTRIES) log.shift();
}

/** Snapshot of current counts + log, safe to copy into React state. */
export function getStats() {
  return { counts: { ...counts }, log: log.slice() };
}

/** Zero out every counter and clear the log (used by the "Reset" button). */
export function resetStats() {
  Object.keys(counts).forEach((k) => delete counts[k]);
  log.length = 0;
}
