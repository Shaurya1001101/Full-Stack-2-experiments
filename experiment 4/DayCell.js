import React from "react";
import DayCellBase, { areEqual } from "./DayCellBase";
import PostEvent from "./PostEvent";

/**
 * Optimized entry point used by the "optimal" calendar (Calendar.js).
 *
 * React.memo (Experiment 1.4.2) skips re-rendering a day cell whose own
 * posts/props haven't changed, even while other cells update. Compare
 * with `CalendarUnoptimized.js`, which renders `DayCellBase` directly
 * with no memoization at all.
 */
function DayCellOptimal(props) {
  // `mode`/`EventComponent` are forced last so they can't be overridden —
  // the optimal calendar always uses the memoized PostEvent chip.
  return <DayCellBase {...props} mode="optimal" EventComponent={PostEvent} />;
}

export default React.memo(DayCellOptimal, areEqual);
