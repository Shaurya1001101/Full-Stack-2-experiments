import React from "react";
import { useRenderCount } from "../hooks/useRenderCount";

/**
 * A single scheduled post rendered inside a day cell.
 *
 * This is the *unmemoized* implementation. `PostEvent.js` wraps it in
 * `React.memo` for the optimal calendar; the non-optimal calendar
 * (`CalendarUnoptimized.js`) renders this component directly, so it
 * re-executes on every parent re-render regardless of whether its own
 * props changed — that difference is exactly what the Render Optimizer
 * panel measures via `mode` ("optimal" | "non-optimal").
 */
function PostEventBase({ post, onClick, onDragStart, mode = "non-optimal" }) {
  const renderToken = useRenderCount(`PostEvent:${mode}`);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", post.id);
    e.dataTransfer.effectAllowed = "move";
    onDragStart(post.id);
  };

  return (
    <div
      className="post-event"
      style={{ backgroundColor: post.color }}
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onClick(post);
      }}
      title={`${post.title} — ${post.time}`}
    >
      <span
        key={renderToken}
        className={`render-flash render-flash--${mode}`}
        aria-hidden="true"
      />
      <span className="post-event-time">{post.time}</span>
      <span className="post-event-title">{post.title}</span>
    </div>
  );
}

export default PostEventBase;
