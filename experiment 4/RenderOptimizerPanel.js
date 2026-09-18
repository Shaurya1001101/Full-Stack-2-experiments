import React, { useState, useEffect, useCallback } from "react";
import { getStats, resetStats } from "../utils/renderStats";

const POLL_MS = 250;
const COMPONENTS = ["Calendar", "DayCell", "PostEvent"];

/**
 * Right-hand panel for Experiment 1.4.2: a live instrument panel that
 * makes the effect of React.memo / useMemo / useCallback visible and
 * measurable instead of just described in a README.
 *
 * It doesn't touch Calendar/CalendarUnoptimized's internals — it just
 * (a) owns which one is mounted, (b) drives an "unrelated" tick that
 * forces re-renders the way a live clock or notification count would
 * in a real app, and (c) polls the shared render-count store those
 * calendars write to.
 */
export default function RenderOptimizerPanel({
  mode,
  onModeChange,
  simulate,
  onSimulateChange,
  onForceTick,
  tick,
}) {
  const [stats, setStats] = useState(() => getStats());

  // Poll instead of subscribing: recording a render must never trigger
  // a synchronous setState in a *different* component's render phase.
  useEffect(() => {
    const id = setInterval(() => setStats(getStats()), POLL_MS);
    return () => clearInterval(id);
  }, []);

  const handleReset = useCallback(() => {
    resetStats();
    setStats(getStats());
  }, []);

  const countFor = (component, m) => stats.counts[`${component}:${m}`] || 0;

  const recentLog = stats.log.slice(-14).reverse();

  return (
    <aside className="render-panel">
      <h2 className="render-panel-title">Render Optimizer</h2>
      <p className="render-panel-sub">
        Live comparison of the <strong>optimal</strong> (memoized) and{" "}
        <strong>non-optimal</strong> (unmemoized) calendar implementations —
        same posts, same UI, different re-render behavior.
      </p>

      <section className="render-panel-section">
        <h3>Calendar implementation</h3>
        <div className="render-mode-toggle" role="group" aria-label="Calendar implementation">
          <button
            type="button"
            className={"mode-btn mode-btn--optimal" + (mode === "optimal" ? " mode-btn--active" : "")}
            onClick={() => onModeChange("optimal")}
            aria-pressed={mode === "optimal"}
          >
            Optimal
          </button>
          <button
            type="button"
            className={"mode-btn mode-btn--non-optimal" + (mode === "non-optimal" ? " mode-btn--active" : "")}
            onClick={() => onModeChange("non-optimal")}
            aria-pressed={mode === "non-optimal"}
          >
            Non-optimal
          </button>
        </div>
        <p className="render-panel-hint">
          Currently rendering <code>{mode === "optimal" ? "Calendar.js" : "CalendarUnoptimized.js"}</code>.
          The posts and month you had selected stay in Redux, so switching
          modes doesn't lose your data.
        </p>
      </section>

      <section className="render-panel-section">
        <h3>Background load simulator</h3>
        <p className="render-panel-hint">
          Ticks an unrelated counter every second — a stand-in for something
          like a live clock or a notification badge elsewhere in a real app.
          It has nothing to do with your posts, so an optimized calendar
          should barely react to it.
        </p>
        <div className="render-panel-controls">
          <label className="switch">
            <input
              type="checkbox"
              checked={simulate}
              onChange={(e) => onSimulateChange(e.target.checked)}
            />
            <span>Auto-tick every 1s</span>
          </label>
          <button type="button" className="btn btn-secondary btn-small" onClick={onForceTick}>
            Force one tick
          </button>
        </div>
        <p className="render-panel-tick-count">
          Ticks so far: <strong>{tick}</strong>
        </p>
      </section>

      <section className="render-panel-section">
        <div className="render-panel-row-header">
          <h3>Live render counts</h3>
          <button type="button" className="btn btn-secondary btn-small" onClick={handleReset}>
            Reset stats
          </button>
        </div>
        <table className="render-stats-table">
          <thead>
            <tr>
              <th>Component</th>
              <th className="render-stats-nonoptimal">Non-optimal</th>
              <th className="render-stats-optimal">Optimal</th>
            </tr>
          </thead>
          <tbody>
            {COMPONENTS.map((component) => {
              const nonOptimal = countFor(component, "non-optimal");
              const optimal = countFor(component, "optimal");
              return (
                <tr key={component}>
                  <td>{component}</td>
                  <td className="render-stats-nonoptimal">{nonOptimal}</td>
                  <td className="render-stats-optimal">{optimal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="render-panel-hint">
          Try it: switch to <strong>Non-optimal</strong>, turn on auto-tick for
          a few seconds, then switch to <strong>Optimal</strong> and do the
          same. DayCell/PostEvent counts should climb much faster in the
          non-optimal column for the same number of ticks.
        </p>
      </section>

      <section className="render-panel-section">
        <h3>Why the difference?</h3>
        <ul className="render-panel-explain">
          <li>
            <strong>React.memo</strong> on <code>DayCell</code> and{" "}
            <code>PostEvent</code> skips re-running a child's render function
            entirely when its props are shallow-equal to last time.
          </li>
          <li>
            <strong>useMemo</strong> caches the month grid and the
            date&nbsp;&rarr;&nbsp;posts grouping so they keep the same object
            reference across unrelated re-renders, instead of becoming "new"
            props every time.
          </li>
          <li>
            <strong>useCallback</strong> keeps handlers like{" "}
            <code>onDayClick</code> referentially stable, so memoized
            children don't see a "changed" prop just because the parent
            re-rendered.
          </li>
        </ul>
      </section>

      <section className="render-panel-section">
        <h3>Render log</h3>
        {recentLog.length === 0 ? (
          <p className="render-panel-hint">No renders recorded yet.</p>
        ) : (
          <ul className="render-log">
            {recentLog.map((entry) => (
              <li key={entry.seq} className={`render-log-item render-log-item--${entry.key.split(":")[1]}`}>
                <span className="render-log-key">{entry.key}</span>
                <span className="render-log-time">
                  {new Date(entry.time).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
