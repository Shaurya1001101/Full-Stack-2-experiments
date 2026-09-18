import React from "react";
import PostEventBase from "./PostEventBase";

/**
 * Optimized entry point used by the "optimal" calendar (Calendar.js).
 *
 * Wrapped in React.memo (Experiment 1.4.2): this component only
 * re-renders when its own `post` object or callbacks change, not on
 * every calendar re-render caused by unrelated state updates. Compare
 * with `CalendarUnoptimized.js`, which renders `PostEventBase` directly
 * with no memoization at all.
 */
function PostEventOptimal(props) {
  // `mode="optimal"` is forced last so it can't be overridden by a
  // stray prop — the render count needs to be attributed correctly.
  return <PostEventBase {...props} mode="optimal" />;
}

export default React.memo(PostEventOptimal);
