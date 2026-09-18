import { useRef } from "react";
import { recordRender } from "../utils/renderStats";

/**
 * Call once per render inside a component you want to instrument.
 *
 * `statsKey` should already include the mode, e.g. "DayCell:optimal" vs
 * "DayCell:non-optimal", so the Render Optimizer panel can show both
 * numbers side by side even after the person switches modes.
 *
 * Returns a token that changes every render. Use it as the `key` on a
 * tiny overlay <span> (see the `.render-flash` CSS) so mounting a "new"
 * element retriggers the flash animation — a cheap, state-free way to
 * visualize a real render without causing an extra one.
 */
export function useRenderCount(statsKey) {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  recordRender(statsKey);
  return renderCountRef.current;
}
